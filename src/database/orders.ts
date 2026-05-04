import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import dbConnect from './connection';
import { Order, Invoice, DbResponse } from '../types';

export async function getTableOrders(page: number = 1, limit: number = 10, status: string = '', search: string = ''): Promise<DbResponse<{ orders: any[], total: number }>> {
    const connection = await dbConnect();
    const offset = (page - 1) * limit;
    try {
        let sql = `SELECT 
                o.id, o.table_id, o.waiter_id, u1.name AS waiter_name, 
                o.chef_id, u2.name AS chef_name, 
                o.start_time, o.end_time, o.status,
                o.order_items as legacy_items,
                i.subtotal as invoice_subtotal, i.gst as invoice_gst,
                i.total_amount as invoice_total_amount, i.payment_status as invoice_payment_status
             FROM orders o
             LEFT JOIN user u1 ON o.waiter_id = u1.userid
             LEFT JOIN user u2 ON o.chef_id = u2.userid
             LEFT JOIN invoices i ON o.id = i.orderid
             WHERE 1=1 `;
        
        const params: any[] = [];
        if (status) {
            sql += ` AND o.status = ? `;
            params.push(status);
        }
        if (search) {
            sql += ` AND (o.id LIKE ? OR o.table_id LIKE ? OR u1.name LIKE ? OR u2.name LIKE ?) `;
            params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
        }

        sql += ` ORDER BY o.id DESC LIMIT ? OFFSET ? `;
        params.push(limit, offset);

        const [orderRows]: any = await connection.query(sql, params);
        
        if (orderRows.length > 0) {
            const orderIds = orderRows.map((o: any) => o.id);
            const [allItems]: any = await connection.query(
                "SELECT id, order_id, item_id, item_name, quantity, price FROM order_items WHERE order_id IN (?) AND status != 'voided'",
                [orderIds]
            );

            const itemsByOrder = allItems.reduce((acc: any, item: any) => {
                if (!acc[item.order_id]) acc[item.order_id] = [];
                acc[item.order_id].push(item);
                return acc;
            }, {});

            for (const order of orderRows) {
                const items = itemsByOrder[order.id] || [];
                
                if (items.length > 0) {
                    order.order_items = items;
                } else if (order.legacy_items) {
                    // Fallback to legacy JSON column for historical orders
                    try {
                        order.order_items = typeof order.legacy_items === 'string' 
                            ? JSON.parse(order.legacy_items) 
                            : order.legacy_items;
                    } catch (e) {
                        order.order_items = [];
                    }
                } else {
                    order.order_items = [];
                }
                delete order.legacy_items;
            }
        }
        
        let countSql = `SELECT COUNT(*) as total FROM orders o LEFT JOIN user u1 ON o.waiter_id = u1.userid LEFT JOIN user u2 ON o.chef_id = u2.userid WHERE 1=1 `;
        const countParams: any[] = [];
        if (status) {
            countSql += ` AND o.status = ? `;
            countParams.push(status);
        }
        if (search) {
            countSql += ` AND (o.id LIKE ? OR o.table_id LIKE ? OR u1.name LIKE ? OR u2.name LIKE ?) `;
            countParams.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
        }

        const [totalRows] = await connection.query<RowDataPacket[]>(countSql, countParams);

        return { success: true, data: { orders: orderRows, total: totalRows[0].total } };
    } catch (error) {
        console.error('Error fetching table orders:', error);
        return { success: false, message: 'Failed to fetch table orders' };
    } finally {
        await connection.release();
    }
}

export async function getMenu(page: number = 1, limit: number = 12, search: string = '', category: string = 'all'): Promise<DbResponse<{ menu: any[], total: number }>> {
    const connection = await dbConnect();
    const offset = (page - 1) * limit;
    try {
        let whereClause = 'WHERE item_name LIKE ?';
        let params: any[] = [`%${search}%`];

        if (category !== 'all') {
            whereClause += ' AND item_type = ?';
            params.push(category);
        }

        const [totalRows] = await connection.query<RowDataPacket[]>(
            `SELECT COUNT(*) as count FROM menu ${whereClause}`,
            params
        );
        const total = totalRows[0].count;

        const [menuRows] = await connection.query<RowDataPacket[]>(
            `SELECT item_id,item_description,item_name,item_foodtype,making_cost,item_price,item_thumbnail,item_type 
             FROM menu 
             ${whereClause}
             LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );
        return { success: true, data: { menu: menuRows, total } };
    } catch (error) {
        console.error('Error fetching menu:', error);
        return { success: false, message: 'Failed to fetch menu' };
    } finally {
        await connection.release();
    }
}

export async function getKitchenOrders(): Promise<DbResponse<any[]>> {
    const connection = await dbConnect();
    try {
        const [kitchenRows] = await connection.query<RowDataPacket[]>(
            'SELECT order_id,item_name,time,date,remarks,quantity,status,unit FROM kitchen_order WHERE status = "pending"'
        );
        return { success: true, data: kitchenRows };
    } catch (error) {
        console.error('Error fetching kitchen orders:', error);
        return { success: false, message: 'Failed to fetch kitchen orders' };
    } finally {
        await connection.release();
    }
}

export async function getStaffOrders(role?: string, userid?: string, page: number = 1, limit: number = 10, status: string = '', search: string = ''): Promise<DbResponse<{ orders: any[], total: number }>> {
    const connection = await dbConnect();
    const offset = (page - 1) * limit;
    try {
        let sql = `
            SELECT 
                o.id, o.table_id, o.waiter_id, u1.name AS waiter_name, 
                o.chef_id, u2.name AS chef_name, 
                o.start_time, o.end_time, o.status,
                o.order_items as legacy_items
            FROM orders o
            LEFT JOIN user u1 ON o.waiter_id = u1.userid
            LEFT JOIN user u2 ON o.chef_id = u2.userid
            WHERE 1=1
        `;
        
        const params: any[] = [];
        if (role === 'waiter') {
            sql += ` AND o.waiter_id = ? `;
            params.push(userid || '');
        } else if (role === 'chef') {
            sql += ` AND o.chef_id = ? `;
            params.push(userid || '');
        }

        if (status) {
            sql += ` AND o.status = ? `;
            params.push(status);
        }
        if (search) {
            sql += ` AND (o.id LIKE ? OR o.table_id LIKE ? OR u1.name LIKE ? OR u2.name LIKE ?) `;
            params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
        }
        
        sql += ` ORDER BY o.start_time DESC LIMIT ? OFFSET ? `;
        params.push(limit, offset);
        
        const [rows]: any = await connection.query(sql, params);
        
        if (rows.length > 0) {
            const orderIds = rows.map((o: any) => o.id);
            const [allItems]: any = await connection.query(
                "SELECT id, order_id, item_id, item_name, quantity, price FROM order_items WHERE order_id IN (?) AND status != 'voided'",
                [orderIds]
            );

            const itemsByOrder = allItems.reduce((acc: any, item: any) => {
                if (!acc[item.order_id]) acc[item.order_id] = [];
                acc[item.order_id].push(item);
                return acc;
            }, {});

            for (const order of rows) {
                const items = itemsByOrder[order.id] || [];
                
                if (items.length > 0) {
                    order.order_items = items;
                } else if (order.legacy_items) {
                    try {
                        order.order_items = typeof order.legacy_items === 'string' 
                            ? JSON.parse(order.legacy_items) 
                            : order.legacy_items;
                    } catch (e) {
                        order.order_items = [];
                    }
                } else {
                    order.order_items = [];
                }
                delete order.legacy_items;
            }
        }

        let countSql = `SELECT COUNT(*) as total FROM orders o LEFT JOIN user u1 ON o.waiter_id = u1.userid LEFT JOIN user u2 ON o.chef_id = u2.userid WHERE 1=1 `;
        const countParams: any[] = [];
        if (role === 'waiter') {
            countSql += ` AND o.waiter_id = ? `;
            countParams.push(userid || '');
        } else if (role === 'chef') {
            countSql += ` AND o.chef_id = ? `;
            countParams.push(userid || '');
        }

        if (status) {
            countSql += ` AND o.status = ? `;
            countParams.push(status);
        }
        if (search) {
            countSql += ` AND (o.id LIKE ? OR o.table_id LIKE ? OR u1.name LIKE ? OR u2.name LIKE ?) `;
            countParams.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
        }

        const [totalRows] = await connection.query<RowDataPacket[]>(countSql, countParams);

        return { success: true, data: { orders: rows, total: totalRows[0].total } };
    } catch (error) {
        console.error('Error fetching staff orders:', error);
        return { success: false, message: 'Failed to fetch orders' };
    } finally {
        await connection.release();
    }
}

export async function getInvoice(page: number = 1, limit: number = 20, orderId?: number): Promise<DbResponse<{ invoices: any[], total: number }>> {
    const connection = await dbConnect();
    const offset = (page - 1) * limit;
    try {
        let query = 'SELECT id,orderid,table_id,subtotal,gst,total_amount,discount,payment_method,payment_status,generated_at FROM invoices';
        const params: any[] = [];
        if (orderId) {
            query += ' WHERE orderid = ?';
            params.push(orderId);
        }
        
        const [totalRows] = await connection.query<RowDataPacket[]>(
            `SELECT COUNT(*) as count FROM (${query}) as t`,
            params
        );
        const total = totalRows[0].count;

        query += ' ORDER BY generated_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const [invoiceRows]: any = await connection.query(query, params);
        
        if (invoiceRows.length > 0) {
            const orderIds = invoiceRows.map((i: any) => i.orderid);
            const [allItems]: any = await connection.query(
                "SELECT id, order_id, item_id, item_name, quantity, price FROM order_items WHERE order_id IN (?) AND status != 'voided'",
                [orderIds]
            );

            const itemsByOrder = allItems.reduce((acc: any, item: any) => {
                if (!acc[item.order_id]) acc[item.order_id] = [];
                acc[item.order_id].push(item);
                return acc;
            }, {});

            for (const invoice of invoiceRows) {
                invoice.items = itemsByOrder[invoice.orderid] || [];
            }
        }

        return { success: true, data: { invoices: invoiceRows, total } };
    } catch (error) {
        console.error('Error fetching invoices:', error);
        return { success: false, message: 'Failed to fetch invoices' };
    } finally {
        await connection.release();
    }
}

export async function getTables(): Promise<DbResponse<any[]>> {
    const connection = await dbConnect();
    try {
        let rows;
        try {
            // Try fetching with assigned_waiter_id if the column exists
            const [result] = await connection.query<RowDataPacket[]>('SELECT id, tablenumber, availability, assigned_waiter_id FROM tables');
            rows = result;
        } catch (e) {
            // Fallback if column doesn't exist yet
            const [result] = await connection.query<RowDataPacket[]>('SELECT id, tablenumber, availability FROM tables');
            rows = result;
        }
        return { success: true, data: rows };
    } catch (error) {
        console.error('Error fetching tables:', error);
        return { success: false, message: 'Failed to fetch tables' };
    } finally {
        await connection.release();
    }
}

export async function getRecentPayments(page: number = 1, limit: number = 10): Promise<DbResponse<{ payments: any[], total: number }>> {
    const connection = await dbConnect();
    const offset = (page - 1) * limit;
    try {
        const [totalRows] = await connection.query<RowDataPacket[]>(
            `SELECT COUNT(*) as count FROM invoices WHERE payment_status = 'paid'`
        );
        const total = totalRows[0].count;

        const [rows] = await connection.query<RowDataPacket[]>(
            `SELECT i.*, o.table_id, u.name as waiter_name, c.name as customer_name, c.mobile as customer_mobile
             FROM invoices i
             JOIN orders o ON i.orderid = o.id
             LEFT JOIN user u ON o.waiter_id = u.userid
             LEFT JOIN (
                SELECT order_id, name, mobile 
                FROM customer 
                GROUP BY order_id
             ) c ON i.orderid = c.order_id
             WHERE i.payment_status = 'paid'
             ORDER BY i.generated_at DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        );
        return { success: true, data: { payments: rows, total } };
    } catch (error) {
        console.error('Error fetching recent payments:', error);
        return { success: false, message: 'Failed to fetch recent payments' };
    } finally {
        await connection.release();
    }
}

export async function getRecentOrders(): Promise<DbResponse<any[]>> {
    const connection = await dbConnect();
    try {
        const [rows]: any = await connection.query(
            `SELECT o.*, o.order_items as legacy_items, u.name as waiter_name 
             FROM orders o
             LEFT JOIN user u ON o.waiter_id = u.userid
             ORDER BY o.start_time DESC LIMIT 10`
        );

        if (rows.length > 0) {
            const orderIds = rows.map((o: any) => o.id);
            const [allItems]: any = await connection.query(
                "SELECT id, order_id, item_id, item_name, quantity, price FROM order_items WHERE order_id IN (?) AND status != 'voided'",
                [orderIds]
            );

            const itemsByOrder = allItems.reduce((acc: any, item: any) => {
                if (!acc[item.order_id]) acc[item.order_id] = [];
                acc[item.order_id].push(item);
                return acc;
            }, {});

            for (const order of rows) {
                const items = itemsByOrder[order.id] || [];
                
                if (items.length > 0) {
                    order.order_items = items;
                } else if (order.legacy_items) {
                    try {
                        order.order_items = typeof order.legacy_items === 'string' 
                            ? JSON.parse(order.legacy_items) 
                            : order.legacy_items;
                    } catch (e) {
                        order.order_items = [];
                    }
                } else {
                    order.order_items = [];
                }
                delete order.legacy_items;
            }
        }

        return { success: true, data: rows };
    } catch (error) {
        console.error('Error fetching recent orders:', error);
        return { success: false, message: 'Failed to fetch' };
    } finally {
        await connection.release();
    }
}

export async function updateRecentOrders(data: { id: number, status: string }): Promise<DbResponse<void>> {
    const connection = await dbConnect();
    try {
        await connection.query('UPDATE orders SET status = ? WHERE id = ?', [data.status, data.id]);
        return { success: true, message: 'Order updated' };
    } catch (error) {
        console.error('Error updating order:', error);
        return { success: false, message: 'Failed' };
    } finally {
        await connection.release();
    }
}

export async function updateKitchenOrders(data: { order_id: string, status: string }): Promise<DbResponse<void>> {
    const connection = await dbConnect();
    try {
        await connection.query('UPDATE kitchen_order SET status = ? WHERE order_id = ?', [data.status, data.order_id]);
        return { success: true, message: 'Kitchen order updated' };
    } catch (error) {
        console.error('Error updating kitchen order:', error);
        return { success: false, message: 'Failed' };
    } finally {
        await connection.release();
    }
}

export async function getMenuById(itemID: string): Promise<any | null> {
    const connection = await dbConnect();
    try {
        const [rows] = await connection.execute<RowDataPacket[]>('SELECT * FROM menu WHERE item_id = ?', [itemID]);
        return rows.length > 0 ? rows[0] : null;
    } finally {
        await connection.release();
    }
}

export async function updateMenu(data: any): Promise<DbResponse<void>> {
    const connection = await dbConnect();
    const { item_id, item_name, item_description, item_price, making_cost, item_foodtype, item_type, item_thumbnail } = data;
    try {
        await connection.query(
            `UPDATE menu SET item_name = ?, item_description = ?, item_price = ?, making_cost = ?, item_foodtype = ?, item_type = ?, item_thumbnail = ? WHERE item_id = ?`,
            [item_name, item_description, item_price, making_cost, item_foodtype, item_type, item_thumbnail, item_id]
        );
        return { success: true, message: 'Menu updated' };
    } catch (error) {
        console.error('Error updating menu:', error);
        return { success: false, message: 'Failed' };
    } finally {
        await connection.release();
    }
}
