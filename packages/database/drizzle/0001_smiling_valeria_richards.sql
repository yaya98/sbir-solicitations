CREATE TABLE "solicitation" (
	"id" serial PRIMARY KEY NOT NULL,
	"solicitation_title" text,
	"solicitation_number" text,
	"program" text,
	"phase" text,
	"agency" text,
	"branch" text,
	"solicitation_year" integer,
	"release_date" date,
	"open_date" date,
	"close_date" date,
	"application_due_date" date[],
	"occurrence_number" integer,
	"solicitation_agency_url" text,
	"current_status" text,
	"solicitation_topics" jsonb[]
);
