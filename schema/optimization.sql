-- Database Optimization Script for RMS
-- Focus on indexing columns used in JOINs, WHERE clauses, and ORDER BY.

-- 1. Orders Table
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_start_time ON orders(start_time);
CREATE INDEX idx_orders_waiter_id ON orders(waiter_id);
CREATE INDEX idx_orders_chef_id ON orders(chef_id);
CREATE INDEX idx_orders_table_id ON orders(table_id);

-- 2. Invoices Table
CREATE INDEX idx_invoices_orderid ON invoices(orderid);
CREATE INDEX idx_invoices_generated_at ON invoices(generated_at);
CREATE INDEX idx_invoices_payment_method ON invoices(payment_method);

-- 3. Expenses Table
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_frequency ON expenses(frequency);

-- 4. Payout Table (Salary)
CREATE INDEX idx_payout_date ON payout(date);
CREATE INDEX idx_payout_userid ON payout(userid);

-- 5. Foreign Keys / Join Columns
CREATE INDEX idx_user_address_userid ON user_address(userid);
CREATE INDEX idx_payout_details_userid ON payout_details(userid);
CREATE INDEX idx_customer_order_id ON customer(order_id);

-- 6. Recent Inventory Order
CREATE INDEX idx_recent_inv_date ON recent_inventory_order(date);
CREATE INDEX idx_recent_inv_order_id ON recent_inventory_order(order_id);
