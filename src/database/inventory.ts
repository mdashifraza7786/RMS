import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import dbConnect from './connection';
import { InventoryItem, DbResponse } from '../types';

export async function getInventory(page: number = 1, limit: number = 10): Promise<DbResponse<{ inventory: InventoryItem[], total: number }>> {
    const connection = await dbConnect();
    const offset = (page - 1) * limit;
    try {
        const [inventoryRows] = await connection.query<RowDataPacket[]>(
            'SELECT item_id,item_name,current_stock,low_limit,unit FROM inventory LIMIT ? OFFSET ?',
            [limit, offset]
        );

        const [[{ total }]] = await connection.query<RowDataPacket[]>(
            'SELECT COUNT(*) as total FROM inventory'
        );

        return { success: true, data: { inventory: inventoryRows as InventoryItem[], total: total as number } };
    } catch (error) {
        console.error('Error fetching inventory:', error);
        return { success: false, message: 'Failed to fetch inventory' };
    } finally {
        await connection.release();
    }
}

export async function getInventoryById(itemID: string): Promise<InventoryItem | null> {
    const connection = await dbConnect();
    try {
        const [rows] = await connection.execute<RowDataPacket[]>('SELECT * FROM inventory WHERE item_id = ?', [itemID]);
        return rows.length > 0 ? (rows[0] as InventoryItem) : null;
    } finally {
        await connection.release();
    }
}

export async function updateInventory(data: InventoryItem): Promise<DbResponse<void>> {
    const connection = await dbConnect();
    const { item_id, item_name, current_stock, low_limit, unit } = data;
    try {
        await connection.query(
            `UPDATE inventory SET item_name = ?, current_stock = ?, low_limit = ?, unit = ? WHERE item_id = ?`,
            [item_name, current_stock, low_limit, unit, item_id]
        );
        return { success: true, message: 'Inventory updated successfully' };
    } catch (error) {
        console.error('Error updating inventory:', error);
        return { success: false, message: 'Error updating inventory' };
    } finally {
        await connection.release();
    }
}

export async function getInventoryOrderById(orderID: string): Promise<any | null> {
    const connection = await dbConnect();
    try {
        const [rows] = await connection.execute<RowDataPacket[]>('SELECT * FROM recent_inventory_order WHERE order_id = ?', [orderID]);
        return rows.length > 0 ? rows[0] : null;
    } finally {
        await connection.release();
    }
}

export async function getRecentInventoryOrders(page: number = 1, limit: number = 10): Promise<DbResponse<any[]>> {
    const connection = await dbConnect();
    const offset = (page - 1) * limit;
    try {
        const [rows] = await connection.query<RowDataPacket[]>(
            'SELECT order_id, item_id, order_name, price, quantity, date, total_amount, unit, remarks FROM recent_inventory_order ORDER BY date DESC LIMIT ? OFFSET ?',
            [limit, offset]
        );
        return { success: true, data: rows };
    } catch (error) {
        console.error('Error fetching recent inventory orders:', error);
        return { success: false, message: 'Failed to fetch' };
    } finally {
        await connection.release();
    }
}

export async function updateRecentInventoryOrder(data: any): Promise<DbResponse<void>> {
    const connection = await dbConnect();
    const { order_id, price, quantity, total_amount } = data;
    try {
        await connection.query(
            'UPDATE recent_inventory_order SET price = ?, quantity = ?, total_amount = ? WHERE order_id = ?',
            [price, quantity, total_amount, order_id]
        );
        return { success: true, message: 'Recent inventory order updated' };
    } catch (error) {
        console.error('Error updating recent inventory order:', error);
        return { success: false, message: 'Failed' };
    } finally {
        await connection.release();
    }
}

export async function createBulkInventoryOrders(orders: any[]): Promise<DbResponse<void>> {
    const connection = await dbConnect();
    try {
        await connection.beginTransaction();
        for (const order of orders) {
            const { order_id, item_id, order_name, price, quantity, date, unit, remarks } = order;
            await connection.query(
                `INSERT INTO recent_inventory_order (order_id, item_id, order_name, price, quantity, date, total_amount, unit, remarks) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                [order_id, item_id, order_name, price || 0, quantity, date, (price || 0) * quantity, unit, remarks]
            );
        }
        await connection.commit();
        return { success: true, message: 'Bulk orders created' };
    } catch (error) {
        await connection.rollback();
        console.error('Error in bulk inventory orders:', error);
        return { success: false, message: 'Batch failed' };
    } finally {
        await connection.release();
    }
}
