import "dotenv/config";
import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

import { router } from "./router";
import { createContext } from "./trpc";
import { SolicitationApiService } from "./services/solicitation";
import { DatabaseService } from "./services/db";
import { SchedulerService } from "./services/scheduler";

const PORT = process.env.PORT || 8080;

async function launch() {
  // begin server launch
  console.log("launching server...");
  const app = express();

  // Initialize services
  const solicitationApiService = new SolicitationApiService(
    process.env.SBIR_API_URL ||
      "https://api.www.sbir.gov/public/api/solicitations"
  );
  const dbService = new DatabaseService();
  const scheduler = new SchedulerService(
    solicitationApiService,
    dbService,
    Number(process.env.SCHEDULER_INTERVAL_MINUTES) || 60
  );

  // Start the scheduler
  await scheduler.start();

  // configure express
  app.use(cors({ origin: "http://localhost:3000" }));

  // GET all solicitations
  // GET solicitations?keyword=sbir
  // GET solicitations?agency=HHS
  // GET solicitations?keyword=sbir&agency=HHS
  app.get("/solicitations", async (req, res) => {
    try {
      const { keyword, agency } = req.query;
      const solicitations = await dbService.getAllSolicitations({
        keyword: keyword as string,
        agency: agency as string,
      });
      res.json(solicitations);
    } catch (error) {
      console.error("Error fetching solicitations:", error);
      res.status(500).json({ error: "Failed to fetch solicitations" });
    }
  });

  // health and test endpoints that don't require authentication
  app.get("/health", (_, res) => {
    res.status(200).send("healthy");
  });

  // request logger
  app.use((req, _res, next) => {
    console.log("[API-REQUEST]", req.method, req.path);
    next();
  });

  app.use(express.json());
  app.use(express.urlencoded());

  // mount trpc router
  app.use("/trpc", (req, res, next) => {
    try {
      createExpressMiddleware({
        router,
        createContext,
        onError: ({ error }) => {
          // check for streaming disconnection in the nested error structure

          if (
            isControllerClosedError(error) ||
            isStreamingDisconnectError(error)
          ) {
            // client likely disconnected during streaming, this is normal
            console.log("Client disconnected during streaming");
            return;
          } else {
            // if you're seeing this error, check to see if "Error Occured in TRPC" is also being logged.
            // if it is then the error is most likely coming from a user defined TRPC endpoint
            // see deployments/apps/api-server/src/trpc.ts - errorHandler for more details
            console.log("TRPC_EXPRESS_MIDDLEWARE_ERROR", error);
          }
        },
      })(req, res, next);
    } catch (e) {
      console.log("TRPC_EXPRESS_OUTSIDE_MIDDLEWARE_ERROR", e);
    }
  });

  // liftoff
  const server = app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
  });

  // process-level error handling
  process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
  });
  process.on("unhandledRejection", (reason, promise) => {
    // check if this is a streaming disconnection error
    if (isControllerClosedError(reason)) {
      return;
    }
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
  });

  // graceful shutdown
  process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down gracefully...");
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });

    // force close after 30 seconds
    setTimeout(() => {
      console.error(
        "Could not close connections in time, forcefully shutting down"
      );
      process.exit(1);
    }, 30 * 1000);
  });
}

launch();

const isControllerClosedError = (error: any) => {
  if (
    error instanceof Error &&
    error.message?.includes("Controller is already closed")
  ) {
    return true;
  }
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string" &&
    error.message.includes("Controller is already closed")
  ) {
    return true;
  }
  return false;
};

const isStreamingDisconnectError = (error: Error) =>
  error.cause instanceof Error &&
  "error" in error.cause &&
  error.cause.error instanceof Error &&
  error.cause.error.message?.includes("Controller is already closed");
