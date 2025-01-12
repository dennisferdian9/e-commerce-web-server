CREATE TABLE products (
    id SERIAL PRIMARY KEY,         
    title VARCHAR(255) NOT NULL,   
    sku VARCHAR(100) NOT NULL UNIQUE, 
    image TEXT,                    
    price NUMERIC(10, 2) NOT NULL, 
    stock INT NOT NULL,            
    description TEXT
);

-- Create `transactions` table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,         
    sku VARCHAR(100) NOT NULL,    
    qty INT NOT NULL,             
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (sku) REFERENCES products (sku) ON DELETE CASCADE
);

-- Create indexes for performance optimization
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_transactions_sku ON transactions(sku);
