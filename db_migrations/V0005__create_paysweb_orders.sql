CREATE TABLE IF NOT EXISTS t_p46634317_wish_site_spring.paysweb_orders (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL UNIQUE,
    amount INTEGER NOT NULL,
    wish TEXT,
    wish_intensity INTEGER,
    full_name VARCHAR(255),
    status VARCHAR(32) NOT NULL DEFAULT 'pending',
    transaction_id VARCHAR(128),
    amount_without_comission NUMERIC(12,2),
    paid_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_paysweb_orders_status ON t_p46634317_wish_site_spring.paysweb_orders (status);