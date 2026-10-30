-- Additive, idempotent migration. Review and apply to the target database with
-- a privileged migration role before deploying the new application version.
-- It does not delete products, reviews, inquiries, or prices. It adds a
-- publication flag to products while preserving legacy visibility.
BEGIN;
-- Previously every product row was public. Preserve that behavior for
-- existing rows only; all subsequently inserted rows default to unpublished.
-- The owner must review existing records before opening the site to crawlers.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_attribute
    WHERE attrelid = 'products'::regclass AND attname = 'published' AND NOT attisdropped
  ) THEN
    ALTER TABLE products ADD COLUMN published boolean NOT NULL DEFAULT true;
    ALTER TABLE products ALTER COLUMN published SET DEFAULT false;
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS products_published_idx ON products (published);
CREATE TABLE IF NOT EXISTS rate_limit_buckets (
  key text PRIMARY KEY,
  count integer NOT NULL,
  reset_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS rate_limit_buckets_reset_at_idx ON rate_limit_buckets (reset_at);
CREATE TABLE IF NOT EXISTS inquiry_submission_keys (
  key text PRIMARY KEY,
  payload_hash text NOT NULL,
  inquiry_id text NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS product_translations (
  product_id integer NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  locale text NOT NULL,
  name text,
  tagline text,
  description text,
  details text,
  origin text,
  weight text,
  unit text,
  badge text,
  highlights jsonb,
  PRIMARY KEY (product_id, locale)
);
COMMIT;
