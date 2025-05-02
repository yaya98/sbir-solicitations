import { table } from "console";
import {
  date,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

/**
Fields returned from the API: 
solicitation_title, 
solicitation_number, 
program, phase, agency, 
branch, 
solicitation_year, 
release_date, 
open_date, 
close_date, 
application_due_date(multiple values), 
occurrence_number, 
solicitation_agency_url, 
current_status, 
solicitation_topics(multiple values)
 
Fields included in solicitation_topics field: 
topic_title, branch, 
topic_number, 
topic_description, 
sbir_topic_link, 
subtopics(multiple values)

Fields included in subtopics field: 
subtopic_title, 
branch, 
subtopic_number, 
subtopic_description
*/

export const solicitation = pgTable(
  "solicitation",
  {
    id: serial("id").primaryKey(),
    solicitationTitle: text("solicitation_title"),
    solicitationNumber: text("solicitation_number").unique(),
    program: text("program"),
    phase: text("phase"),
    agency: text("agency"),
    branch: text("branch"),
    solicitationYear: integer("solicitation_year"),
    releaseDate: date("release_date", { mode: "date" }),
    openDate: date("open_date", { mode: "date" }),
    closeDate: date("close_date", { mode: "date" }),
    applicationDueDate: date("application_due_date", { mode: "date" }).array(),
    occurrenceNumber: integer("occurrence_number"),
    solicitationAgencyUrl: text("solicitation_agency_url"),
    currentStatus: text("current_status"),
    solicitationTopics: jsonb("solicitation_topics").array(),
  },
  (table) => [
    index("solicitation_number_index").on(table.solicitationNumber),
    index("solicitation_title_index").on(table.solicitationTitle),
    index("agency_index").on(table.agency),
  ]
);

export type SolicitationSelect = typeof solicitation.$inferSelect;
export type SolicitationInsert = typeof solicitation.$inferInsert;
export const SolicitationSelect = createSelectSchema(solicitation);
export const SolicitationInsert = createInsertSchema(solicitation);
