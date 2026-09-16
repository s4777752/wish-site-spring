CREATE TABLE IF NOT EXISTS crocopay_orders (
    id SERIAL PRIMARY KEY,
    order_uuid VARCHAR(64) UNIQUE NOT NULL,
    invoice_id VARCHAR(64),
    wish TEXT,
    wish_intensity INTEGER,
    full_name VARCHAR(255),
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(8) NOT NULL DEFAULT 'RUB',
    payment_option VARCHAR(32) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'Pending',
    card VARCHAR(64),
    bank_receiver VARCHAR(128),
    card_owner VARCHAR(128),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_crocopay_orders_order_uuid ON crocopay_orders(order_uuid);
CREATE INDEX IF NOT EXISTS idx_crocopay_orders_invoice_id ON crocopay_orders(invoice_id);
