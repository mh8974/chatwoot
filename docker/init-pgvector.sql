-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Verification query
SELECT * FROM pg_extension WHERE extname = 'vector';
