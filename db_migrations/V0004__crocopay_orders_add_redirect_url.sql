ALTER TABLE crocopay_orders
    ADD COLUMN IF NOT EXISTS redirect_url TEXT,
    ALTER COLUMN payment_option SET DEFAULT 'REDIRECT';

ALTER TABLE crocopay_orders
    ALTER COLUMN payment_option SET NOT NULL;
