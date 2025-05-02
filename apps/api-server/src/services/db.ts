import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  solicitation,
  type SolicitationInsert,
} from "@repo/database/src/schema/solicitation";
import { eq, or, ilike, and } from "drizzle-orm";

export class DatabaseService {
  private db;

  constructor() {
    const pool = new Pool({
      host: process.env.DATABASE_URL,
      port: Number(process.env.DATABASE_PORT),
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    });
    this.db = drizzle(pool, {
      schema: {
        solicitation,
      },
    });
  }

  async insertSolicitations(
    solicitations: SolicitationInsert[]
  ): Promise<void> {
    try {
      await this.db.transaction(async (tx) => {
        for (const item of solicitations) {
          await tx
            .insert(solicitation)
            .values(item)
            .onConflictDoUpdate({
              target: [solicitation.solicitationNumber],
              set: item,
            });
        }
      });
      console.log(
        `Successfully inserted ${solicitations.length} solicitations`
      );
    } catch (error) {
      console.error("Error inserting solicitations:", error);
      throw error;
    }
  }

  async getAllSolicitations({
    keyword,
    agency,
  }: {
    keyword?: string;
    agency?: string;
  }): Promise<SolicitationInsert[]> {
    try {
      const result: SolicitationInsert[] =
        await this.db.query.solicitation.findMany({
          where: (solicitation, { or, ilike, and }) => {
            let options = [];

            if (keyword) {
              options.push(
                or(
                  ilike(solicitation.solicitationTitle, `%${keyword}%`),
                  ilike(solicitation.solicitationNumber, `%${keyword}%`)
                )
              );
            }

            if (agency) {
              options.push(ilike(solicitation.agency, `%${agency}%`));
            }

            return options.length > 0 ? and(...options) : undefined;
          },
        });
      return result;
    } catch (error) {
      console.error("Error fetching solicitations:", error);
      throw error;
    }
  }
}
