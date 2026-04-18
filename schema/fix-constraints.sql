-- RMS Database Optimizations & Fixes

-- 1. Enforce Data Integrity on Attendance to prevent duplicate clocking
ALTER TABLE attendance
ADD CONSTRAINT unique_attendance_per_day UNIQUE (userid, date);

-- 2. Modify columns for accurate storage rather than varchars
-- Convert date and time to native MySQL types
-- First ensure existing strings can cast properly (assuming YYYY-MM-DD and HH:MM:SS format based on audit)
ALTER TABLE attendance 
MODIFY COLUMN date DATE;

ALTER TABLE attendance 
MODIFY COLUMN time TIME;

-- 3. Add critical indexes for dashboard queries that currently do full-table scans
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_chef_id ON orders(chef_id);
CREATE INDEX idx_orders_waiter_id ON orders(waiter_id);
CREATE INDEX idx_orders_times ON orders(start_time, end_time);

CREATE INDEX idx_invoices_generated_at_status ON invoices(generated_at, payment_status);
CREATE INDEX idx_invoices_orderid ON invoices(orderid);

CREATE INDEX idx_customer_mobile ON customer(mobile);
CREATE INDEX idx_customer_order_id ON customer(order_id);

CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_userid ON attendance(userid);

-- 4. Inventory data type fixes
ALTER TABLE inventory 
MODIFY COLUMN current_stock INT NOT NULL DEFAULT 0,
MODIFY COLUMN low_limit INT NOT NULL DEFAULT 0;

-- 5. Foreign keys (Optional to enforce slowly over time once data is fully clean)
-- This enforces that an invoice belongs to a valid order.
-- Assuming 'orders.id' is INT and 'invoices.orderid' is also INT (wait, invoices.orderid is currently varchar(50))
-- ALTER TABLE invoices MODIFY COLUMN orderid INT(11) NOT NULL;
-- ALTER TABLE invoices ADD CONSTRAINT fk_invoice_order FOREIGN KEY (orderid) REFERENCES orders(id) ON DELETE CASCADE;
