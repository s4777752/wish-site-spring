CREATE TABLE IF NOT EXISTS crocopay_orders (
    order_ref UUID PRIMARY KEY,
    invoice_id TEXT,
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'RUB',
    payment_option TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending',
    wish TEXT,
    wish_intensity INTEGER,
    full_name TEXT,
    requisite TEXT,
    bank_receiver TEXT,
    card_owner TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_crocopay_orders_invoice_id ON crocopay_orders(invoice_id);
