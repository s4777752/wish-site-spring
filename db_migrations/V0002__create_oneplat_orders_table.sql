CREATE TABLE IF NOT EXISTS oneplat_orders (
    id SERIAL PRIMARY KEY,
    merchant_order_id VARCHAR(64) UNIQUE NOT NULL,
    payment_id VARCHAR(64),
    guid VARCHAR(64),
    wish TEXT,
    wish_intensity INTEGER,
    full_name VARCHAR(255),
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(8) NOT NULL DEFAULT 'RUB',
    method VARCHAR(32) NOT NULL,
    status INTEGER NOT NULL DEFAULT -1,
    pan VARCHAR(64),
    bank VARCHAR(128),
    fio VARCHAR(128),
    phone VARCHAR(32),
    qr_link TEXT,
    qr_img TEXT,
    payment_url TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_oneplat_orders_merchant_order_id ON oneplat_orders(merchant_order_id);
CREATE INDEX IF NOT EXISTS idx_oneplat_orders_payment_id ON oneplat_orders(payment_id);
