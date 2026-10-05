CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    invoice_id VARCHAR(64) NOT NULL UNIQUE,
    order_id VARCHAR(100),
    transaction_id BIGINT,
    amount NUMERIC(12,2),
    currency VARCHAR(20),
    payment_method VARCHAR(50),
    description TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'paid',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
