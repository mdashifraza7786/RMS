import mysql, { RowDataPacket } from 'mysql2/promise';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

// Next.js automatically loads environment variables from .env
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'rms',
};

export async function dbConnect() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        return connection;
    } catch (error) {
        console.error('Error connecting to the MySQL database:', error);
        throw error;
    }
}

export async function getUserByUserid(userID: string) {
    const connection = await dbConnect();
    try {
        const [rows] = await connection.execute<RowDataPacket[]>('SELECT userid,name,password,role,mobile,email,photo,aadhaar,pancard FROM user WHERE userid = ?', [userID]);

        if (rows.length > 0) {
            return rows[0];
        } else {
            return false;
        }


    } catch (error: any) {
        throw error;
    } finally {
        await connection.end();
    }
}

export async function getMenuById(foodID: string) {
    const connection = await dbConnect();
    try {
        const [rows] = await connection.execute<RowDataPacket[]>('SELECT * FROM menu WHERE item_id = ?', [foodID]);

        if (rows.length > 0) {
            return rows[0];
        } else {
            return false;
        }


    } catch (error: any) {
        throw error;
    } finally {
        await connection.end();
    }
}

export async function getInventoryById(itemID: string) {
    const connection = await dbConnect();
    try {
        const [rows] = await connection.execute<RowDataPacket[]>('SELECT * FROM inventory WHERE item_id = ?', [itemID]);

        if (rows.length > 0) {
            return rows[0];
        } else {
            return false;
        }


    } catch (error: any) {
        throw error;
    } finally {
        await connection.end();
    }
}

export async function getInventoryOrderById(orderID: string) {
    const connection = await dbConnect();
    try {
        const [rows] = await connection.execute<RowDataPacket[]>('SELECT * FROM recent_inventory_order WHERE item_id = ?', [orderID]);

        if (rows.length > 0) {
            return rows[0];
        } else {
            return false;
        }


    } catch (error: any) {
        throw error;
    } finally {
        await connection.end();
    }
}


export async function getMembers() {
    const connection = await dbConnect();
    try {
        // Fetch data from the 'user' table
        const [userRows] = await connection.query<RowDataPacket[]>(
            'SELECT userid, name, role, mobile, email, photo, aadhaar, pancard FROM user'
        );

        // Fetch data from the 'payout_details' table
        const [payoutRows] = await connection.query<RowDataPacket[]>(
            'SELECT account_name, account_number, ifsc_code, branch_name, upiid FROM payout_details'
        );

        //fetch data from the 'user_address' table
        const [addressRows] = await connection.query<RowDataPacket[]>(
            'SELECT street_or_house_no,landmark,address_one,address_two,city,state,pin FROM user_address'
        );

        if (userRows.length > 0 || payoutRows.length > 0 || addressRows.length > 0) {
            return {
                users: userRows,
                payouts: payoutRows,
                addresses: addressRows
            };
        } else {
            return false;
        }

    } catch (error: any) {
        throw error;
    } finally {
        await connection.end();
    }
}

export async function getMenu() {
    const connection = await dbConnect();
    try {
        // Fetch data from the 'menu' table
        const [userRows] = await connection.query<RowDataPacket[]>(
            'SELECT item_id,item_description,item_name,item_foodtype,making_cost,item_price,item_thumbnail,item_type FROM menu'
        );

        if (userRows.length > 0) {
            return {
                menu: userRows,
            };
        } else {
            return false;
        }

    } catch (error: any) {
        throw error;
    } finally {
        await connection.end();
    }
}

export async function getExpenses() {
    const connection = await dbConnect();
    try {
        // Fetch data from the 'expenses' table
        const [userRows] = await connection.query<RowDataPacket[]>(
            'SELECT id,expenses_for,frequency,cost,date FROM expenses'
        );

        if (userRows.length > 0) {
            return {
                expenses: userRows,
            };
        } else {
            return false;
        }

    } catch (error: any) {
        throw error;
    } finally {
        await connection.end();
    }
}

export async function getTableOrders() {
    const connection = await dbConnect();
    try {
        // Fetch data from the 'orders' table
        const [userRows] = await connection.query<RowDataPacket[]>(
            `SELECT 
                o.id, 
                o.table_id, 
                o.waiter_id, 
                u1.name AS waiter_name, 
                o.chef_id, 
                u2.name AS chef_name, 
                o.order_items, 
                o.start_time, 
                o.end_time, 
                o.status,
                i.subtotal as invoice_subtotal,
                i.gst as invoice_gst,
                i.total_amount as invoice_total_amount,
                i.payment_status as invoice_payment_status
             FROM orders o
             LEFT JOIN user u1 ON o.waiter_id = u1.userid
             LEFT JOIN user u2 ON o.chef_id = u2.userid
             LEFT JOIN invoices i ON o.id = i.orderid
             ORDER BY o.id DESC`
        );


        if (userRows.length > 0) {
            return {
                tableOrders: userRows,
            };
        } else {
            return false;
        }

    } catch (error: any) {
        throw error;
    } finally {
        await connection.end();
    }
}

export async function getRecentPayments() {
    const connection = await dbConnect();

    try {
        // Fetch data from 'invoices', 'orders', 'users', and 'customers' tables
        const [userRows] = await connection.query<RowDataPacket[]>(`
            SELECT 
                i.id,
                i.orderid,
                i.table_id,
                i.subtotal,
                i.gst,
                i.total_amount,
                i.payment_status,
                i.payment_method,
                i.discount,
                i.generated_at,
                u1.name AS waiter_name,
                c.name AS customer_name,
                c.mobile AS customer_mobile
            FROM invoices i
            LEFT JOIN orders o ON i.orderid = o.id
            LEFT JOIN user u1 ON o.waiter_id = u1.userid
            LEFT JOIN customer c ON o.id = c.order_id
            WHERE i.payment_status = 'paid'
        `);

        if (userRows.length > 0) {
            return { payments: userRows };
        } else {
            return { payments: [] };
        }

    } catch (error: any) {
        console.error("Error fetching recent payments:", error);
        throw error;
    } finally {
        await connection.end();
    }
}

export async function getInvoice() {
    const connection = await dbConnect();
    try {
        // Fetch data from the 'invoice' table
        const [userRows] = await connection.query<RowDataPacket[]>(
            'SELECT id,orderid,table_id,subtotal,gst,total_amount,discount,payment_method,payment_status,generated_at FROM invoices'
        );

        if (userRows.length > 0) {
            return {
                invoice: userRows,
            };
        } else {
            return false;
        }

    } catch (error: any) {
        throw error;
    } finally {
        await connection.end();
    }
}

export async function getPayout() {
    const connection = await dbConnect();
    try {
        // Fetch data from the 'payout' table
        const [userRows] = await connection.query<RowDataPacket[]>(
            'SELECT userid,account_number,upi_id,amount,status FROM payout'
        );

        if (userRows.length > 0) {
            return {
                payout: userRows,
            };
        } else {
            return false;
        }

    } catch (error: any) {
        throw error;
    } finally {
        await connection.end();
    }
}
export async function payPayout(data: any) {
    const connection = await dbConnect();
    try {
        const [userRows] = await connection.query<RowDataPacket[]>(
            'UPDATE payout SET status = ? WHERE userid = ?',
            [data.status, data.userid]
        );

        if (userRows.length > 0) {
            return {
                payout: userRows,
            };
        } else {
            return userRows;
        }

    } catch (error: any) {
        throw error;
    } finally {
        await connection.end();
    }
}

export async function getTables() {
    const connection = await dbConnect();
    try {
        // Fetch data from the 'menu' table
        const [tablesRow] = await connection.query<RowDataPacket[]>(
            'SELECT * FROM tables'
        );

        if (tablesRow.length > 0) {
            return {
                tables: tablesRow,
            };
        } else {
            return false;
        }

    } catch (error: any) {
        throw error;
    } finally {
        await connection.end();
    }
}

export async function getAccount(userid: string) {
    const connection = await dbConnect();
    try {
        const [rows] = await connection.execute<RowDataPacket[]>('SELECT account_name,account_number,ifsc_code,branch_name,upiid FROM payout_details WHERE userid = ?', [userid]);

        if (rows.length > 0) {
            return rows;
        } else {
            return false;
        }


    } catch (error: any) {
        throw error;
    } finally {
        await connection.end();
    }
}

export async function updateMember(data: any) {
    const connection = await dbConnect();
    const { userid, name, role, mobile, email, photo, aadhaar, pancard,
        account_name, account_number, ifsc_code, branch_name, upiid,
        street_or_house_no, landmark, address_one, address_two, city, state, pin } = data;

    try {
        // Start transaction
        await connection.beginTransaction();

        // Update user information
        await connection.query(
            `UPDATE user SET name = ?, role = ?, mobile = ?, email = ?, photo = ?, aadhaar = ?, pancard = ?
             WHERE userid = ?`,
            [name, role, mobile, email, photo, aadhaar, pancard, userid]
        );

        // Update payout details
        await connection.query(
            `UPDATE payout_details SET account_name = ?, account_number = ?, ifsc_code = ?, branch_name = ?, upiid = ?
             WHERE userid = ?`,
            [account_name, account_number, ifsc_code, branch_name, upiid, userid]
        );

        // Update address details
        await connection.query(
            `UPDATE user_address SET street_or_house_no = ?, landmark = ?, address_one = ?, address_two = ?, city = ?, state = ?, pin = ?
             WHERE userid = ?`,
            [street_or_house_no, landmark, address_one, address_two, city, state, pin, userid]
        );

        // Commit transaction
        await connection.commit();

        return NextResponse.json({ success: true, message: 'Member updated successfully' });

    } catch (error: any) {
        // Rollback transaction in case of error
        await connection.rollback();
        console.error('Error updating member:', error);
        return NextResponse.json({ success: false, message: 'Error updating member' });

    } finally {
        await connection.end();
    }
}

export async function updateMenu(data: any) {
    const connection = await dbConnect();
    const { item_id, item_description, item_name, item_foodtype, item_price, item_thumbnail, item_type } = data;

    try {
        // Start transaction
        await connection.beginTransaction();

        // Update menu information
        await connection.query(
            `UPDATE menu SET item_description = ?, item_name = ?, item_foodtype = ?, item_price = ?, item_thumbnail = ?,item_type = ?
             WHERE item_id = ?`,
            [item_id, item_description, item_name, item_foodtype, item_type, item_price, item_thumbnail, item_type]
        );

        // Commit transaction
        await connection.commit();

        return NextResponse.json({ success: true, message: 'Menu updated successfully' });

    } catch (error: any) {
        // Rollback transaction in case of error
        await connection.rollback();
        console.error('Error updating menu:', error.message);
        return NextResponse.json({ success: false, message: 'Error updating menu' });

    } finally {
        await connection.end();
    }
}

export async function getInventory() {
    const connection = await dbConnect();
    try {
        // Fetch data from the 'inventory' table
        const [userRows] = await connection.query<RowDataPacket[]>(
            'SELECT item_id,item_name,current_stock,low_limit,unit FROM inventory'
        );

        if (userRows.length > 0) {
            return {
                users: userRows,
            };
        } else {
            return false;
        }

    } catch (error: any) {
        throw error;
    } finally {
        await connection.end();
    }
}

export async function updateInventory(data: any) {
    const connection = await dbConnect();
    const { item_id, item_name, current_stock, low_limit, unit } = data;

    try {
        // Start transaction
        await connection.beginTransaction();

        // Update inventory information
        const query = `
            UPDATE inventory 
            SET item_name = ?, current_stock = ?, low_limit = ?, unit = ?
            WHERE item_id = ?`;
        const values = [item_name, current_stock, low_limit, unit, item_id];

        const [result] = await connection.query(query, values);

        // Commit transaction
        await connection.commit();

        return NextResponse.json({ success: true, message: 'Kitchen Order updated successfully' });

    } catch (error: any) {
        // Rollback transaction in case of error
        await connection.rollback();
        console.error('Error updating inventory:', error.message);
        return false;

    } finally {
        // Ensure the connection is closed
        await connection.end();
    }
}


export async function getKitchenOrders() {
    const connection = await dbConnect();
    try {
        // Fetch data from the 'kitchen_order' table
        const [userRows] = await connection.query<RowDataPacket[]>(
            'SELECT order_id,item_name,time,date,remarks,quantity,status,unit FROM kitchen_order WHERE status = "pending"'
        );

        if (userRows.length > 0) {
            return {
                users: userRows,
            };
        } else {
            return false;
        }

    } catch (error: any) {
        throw error;
    } finally {
        await connection.end();
    }
}

export async function updateKitchenOrders(data: any) {
    const connection = await dbConnect();
    const { order_id, item_name, quantity, status, unit } = data;

    try {
        // Start transaction
        await connection.beginTransaction();

        // Update kitchen order information
        const query = `
            UPDATE kitchen_order 
            SET item_name = ?, quantity = ?, status = ?, unit = ?
            WHERE order_id = ?`;
        const values = [item_name, quantity, status, unit, order_id];

        const [result] = await connection.query(query, values);

        // Commit transaction
        await connection.commit();

        // Check if any rows were affected
        return NextResponse.json({ success: true, message: 'Kitchen Order updated successfully' });
    } catch (error: any) {
        // Rollback transaction in case of error
        await connection.rollback();
        console.error('Error updating kitchen orders:', error.message);
        return false;
    } finally {
        // Ensure the connection is closed
        await connection.end();
    }
}

export async function getRecentOrders() {
    const connection = await dbConnect();
    try {
        // Fetch data from the 'recent_inventory_order' table
        const [userRows] = await connection.query<RowDataPacket[]>(
            'SELECT order_id,order_name,price,quantity,date,total_amount,unit FROM recent_inventory_order'
        );

        if (userRows.length > 0) {
            return {
                users: userRows,
            };
        } else {
            return false;
        }

    } catch (error: any) {
        throw error;
    } finally {
        await connection.end();
    }
}

export async function updateRecentOrders(data: any) {
    const connection = await dbConnect();
    const { order_id, order_name, price, quantity, date, total_amount, unit } = data;

    try {
        // Start transaction
        await connection.beginTransaction();

        // Update menu information
        const query = `
            UPDATE recent_inventory_order 
            SET order_name = ?, price = ?, quantity = ?, date = ?, total_amount = ?, unit = ?
            WHERE order_id = ?`;
        const values = [order_name, price, quantity, date, total_amount, unit, order_id];

        await connection.query(query, values);

        // Commit transaction
        await connection.commit();

        return NextResponse.json({ success: true, message: 'Recent Orders updated successfully' });

    } catch (error: any) {
        // Rollback transaction in case of error
        await connection.rollback();
        console.error('Error updating Recent Orders:', error.message);
        return NextResponse.json({ success: false, message: 'Error updating Recent Orders' });
    } finally {
        // Ensure the connection is closed
        await connection.end();
    }
}

// Financial Overview Functions

export async function getTotalRevenue(startDate: string, endDate: string) {
    const connection = await dbConnect();
    
    try {
        // Convert string dates to MySQL date format with proper timestamps
        const startDateTime = `${startDate} 00:00:00`;
        const endDateTime = `${endDate} 23:59:59`;
                
        // Get revenue from invoices table with paid status
        const [rows] = await connection.execute<RowDataPacket[]>(
            `SELECT COALESCE(SUM(total_amount), 0) as total_revenue
             FROM invoices
             WHERE payment_status = 'paid' 
             AND generated_at >= ? 
             AND generated_at <= ?`,
            [startDateTime, endDateTime]
        );
        
        const revenue = rows[0]?.total_revenue;
        return revenue !== null ? Number(revenue) : 0;
    } finally {
        await connection.end();
    }
}

export async function getOrdersCount(startDate: string, endDate: string) {
    const connection = await dbConnect();
    
    try {
        // Convert string dates to MySQL date format with proper timestamps
        const startDateTime = `${startDate} 00:00:00`;
        const endDateTime = `${endDate} 23:59:59`;
                
        // Count completed orders from invoices with paid status
        const [rows] = await connection.execute<RowDataPacket[]>(
            `SELECT COUNT(*) as count 
             FROM invoices 
             WHERE payment_status = 'paid' 
             AND generated_at >= ? 
             AND generated_at <= ?`,
            [startDateTime, endDateTime]
        );
        
        // Ensure we're returning a number
        return rows[0]?.count !== null ? Number(rows[0].count) : 0;
    } finally {
        await connection.end();
    }
}

export async function getFinancialOverview(period: string) {
    // Calculate date range based on period
    const endDate = new Date();
    let startDate = new Date();
    
    switch (period) {
        case 'today':
            startDate.setDate(endDate.getDate());
            break;
        case 'yesterday':
            startDate.setDate(endDate.getDate() - 1);
            break;
        case '7days':
            startDate.setDate(endDate.getDate() - 7);
            break;
        case '30days':
            startDate.setDate(endDate.getDate() - 30);
            break;
        case 'month':
            startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
            break;
        default:
            startDate.setDate(endDate.getDate() - 7);
    }
    
    // Format dates for MySQL queries
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);
    
    // Get current period data
    const revenue = await getTotalRevenue(startDateStr, endDateStr);
    const ordersCount = await getOrdersCount(startDateStr, endDateStr);
    const averageOrderValue = ordersCount > 0 ? revenue / ordersCount : 0;
    
    // Calculate previous period
    const prevEndDate = new Date(startDate);
    let prevStartDate = new Date();
    
    switch (period) {
        case '7days':
            prevStartDate.setDate(prevEndDate.getDate() - 7);
            break;
        case '30days':
            prevStartDate.setDate(prevEndDate.getDate() - 30);
            break;
        case 'month':
            prevStartDate = new Date(prevEndDate.getFullYear(), prevEndDate.getMonth() - 1, 1);
            prevEndDate.setDate(0); // Last day of previous month
            break;
        default:
            prevStartDate.setDate(prevEndDate.getDate() - 7);
    }
    
    const prevStartDateStr = formatDate(prevStartDate);
    const prevEndDateStr = formatDate(prevEndDate);
    
    // Get previous period data
    const prevRevenue = await getTotalRevenue(prevStartDateStr, prevEndDateStr);
    const prevOrdersCount = await getOrdersCount(prevStartDateStr, prevEndDateStr);
    const prevAverageOrderValue = prevOrdersCount > 0 ? prevRevenue / prevOrdersCount : 0;
    
    // Calculate percentage changes
    const revenueChange = prevRevenue > 0
        ? ((revenue - prevRevenue) / prevRevenue) * 100
        : 0;
    
    const ordersChange = prevOrdersCount > 0
        ? ((ordersCount - prevOrdersCount) / prevOrdersCount) * 100
        : 0;
    
    const avgOrderValueChange = prevAverageOrderValue > 0
        ? ((averageOrderValue - prevAverageOrderValue) / prevAverageOrderValue) * 100
        : 0;
    
    // Format results
    return {
        revenue: {
            value: revenue,
            change: Math.round(revenueChange)
        },
        orders: {
            value: ordersCount,
            change: Math.round(ordersChange)
        },
        averageOrderValue: {
            value: averageOrderValue,
            change: Math.round(avgOrderValueChange)
        },
        period
    };
}

export async function getOrdersByStatus(status?: string) {
    const connection = await dbConnect();
    try {
        // Base query
        let query = `
            SELECT 
                o.id, 
                o.table_id, 
                o.waiter_id, 
                u1.name AS waiter_name, 
                o.chef_id, 
                u2.name AS chef_name, 
                o.order_items, 
                o.start_time, 
                o.end_time, 
                o.status
            FROM orders o
            LEFT JOIN user u1 ON o.waiter_id = u1.userid
            LEFT JOIN user u2 ON o.chef_id = u2.userid
        `;
        
        // Add WHERE clause if status is provided
        if (status && status !== 'all') {
            query += ` WHERE o.status = ?`;
        }
        
        // Add ORDER BY to show newest orders first
        query += ` ORDER BY o.start_time DESC`;
        
        // Execute the query with or without the status parameter
        const [rows] = status && status !== 'all' 
            ? await connection.query<RowDataPacket[]>(query, [status])
            : await connection.query<RowDataPacket[]>(query);

        return {
            orders: rows
        };
    } catch (error: any) {
        console.error("Error fetching orders by status:", error);
        throw error;
    } finally {
        await connection.end();
    }
}