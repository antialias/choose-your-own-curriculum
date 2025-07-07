CREATE TABLE "tag" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL UNIQUE
);
--> statement-breakpoint
CREATE VIRTUAL TABLE tag_index USING vec0(
  tag_id TEXT PRIMARY KEY,
  vector FLOAT[1536]
);
