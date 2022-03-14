CREATE EXTENSION IF NOT EXISTS btree_gin;

CREATE INDEX gear_name_index ON "Gear" USING GIN (to_tsvector('english', name));
CREATE INDEX gear_notes_index ON "Gear" USING GIN (to_tsvector('english', notes));
