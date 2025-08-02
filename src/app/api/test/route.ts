import { NextResponse } from 'next/server';
import { dbConnect } from '@/database/database';

// Indian names for realistic data
const indianNames = [
    'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Neha Singh', 'Vikram Malhotra',
    'Anjali Gupta', 'Rahul Verma', 'Sneha Reddy', 'Arjun Kapoor', 'Meera Iyer',
    'Karan Johar', 'Zara Khan', 'Aditya Roy', 'Ishita Das', 'Rohan Mehta',
    'Tanvi Joshi', 'Dev Shah', 'Ananya Rao', 'Vivek Nair', 'Kavya Menon',
    'Siddharth Bhat', 'Riya Choudhury', 'Aryan Tiwari', 'Diya Saxena', 'Krishna Yadav',
    'Maya Sinha', 'Dhruv Agarwal', 'Aisha Khan', 'Ritvik Sharma', 'Pooja Patel',
    'Arnav Singh', 'Kiara Malhotra', 'Shaurya Gupta', 'Avni Verma', 'Advait Reddy',
    'Myra Kapoor', 'Vihaan Iyer', 'Aaradhya Johar', 'Kabir Khan', 'Anvi Roy',
    'Aarav Das', 'Zara Mehta', 'Ved Joshi', 'Aisha Shah', 'Reyansh Rao',
    'Kyra Nair', 'Arjun Menon', 'Aisha Bhat', 'Vivaan Choudhury', 'Anaya Tiwari'
];

const indianPhoneNumbers = [
    '9876543210', '9876543211', '9876543212', '9876543213', '9876543214',
    '9876543215', '9876543216', '9876543217', '9876543218', '9876543219',
    '9876543220', '9876543221', '9876543222', '9876543223', '9876543224',
    '9876543225', '9876543226', '9876543227', '9876543228', '9876543229',
    '9876543230', '9876543231', '9876543232', '9876543233', '9876543234'
];

const indianAddresses = [
    'Mumbai, Maharashtra', 'Delhi, Delhi', 'Bangalore, Karnataka', 'Chennai, Tamil Nadu',
    'Kolkata, West Bengal', 'Hyderabad, Telangana', 'Pune, Maharashtra', 'Ahmedabad, Gujarat',
    'Jaipur, Rajasthan', 'Lucknow, Uttar Pradesh', 'Kanpur, Uttar Pradesh', 'Nagpur, Maharashtra',
    'Indore, Madhya Pradesh', 'Thane, Maharashtra', 'Bhopal, Madhya Pradesh', 'Visakhapatnam, Andhra Pradesh',
    'Pimpri-Chinchwad, Maharashtra', 'Patna, Bihar', 'Vadodara, Gujarat', 'Ghaziabad, Uttar Pradesh',
    'Ludhiana, Punjab', 'Agra, Uttar Pradesh', 'Nashik, Maharashtra', 'Faridabad, Haryana',
    'Meerut, Uttar Pradesh', 'Rajkot, Gujarat', 'Kalyan-Dombivali, Maharashtra', 'Vasai-Virar, Maharashtra',
    'Varanasi, Uttar Pradesh', 'Srinagar, Jammu and Kashmir', 'Aurangabad, Maharashtra', 'Dhanbad, Jharkhand',
    'Amritsar, Punjab', 'Allahabad, Uttar Pradesh', 'Ranchi, Jharkhand', 'Howrah, West Bengal',
    'Coimbatore, Tamil Nadu', 'Jabalpur, Madhya Pradesh', 'Gwalior, Madhya Pradesh', 'Vijayawada, Andhra Pradesh',
    'Jodhpur, Rajasthan', 'Madurai, Tamil Nadu', 'Raipur, Chhattisgarh', 'Kota, Rajasthan',
    'Guwahati, Assam', 'Chandigarh, Chandigarh', 'Solapur, Maharashtra', 'Hubli-Dharwad, Karnataka'
];

// Menu items for realistic orders (based on actual database schema)
const menuItems = [
    { item_id: 'NVEG5416', item_name: 'Spl. Hydrabadi chiken biryani', item_price: 199, making_cost: 155 },
    { item_id: 'VEG1100', item_name: 'Paneer Butter Masala', item_price: 380, making_cost: 360 },
    { item_id: 'VEG5968', item_name: 'Dal Makhani', item_price: 280, making_cost: 200 },
    { item_id: 'VEG5984', item_name: 'Chole Bhature', item_price: 60, making_cost: 50 },
    { item_id: 'VEG1101', item_name: 'Baingan Bharta', item_price: 180, making_cost: 120 },
    { item_id: 'VEG1102', item_name: 'Veg Biryani', item_price: 220, making_cost: 180 },
    { item_id: 'NVEG3913', item_name: 'Fish Curry (Bengali Maachher Jhol)', item_price: 299, making_cost: 220 },
    { item_id: 'NVEG3914', item_name: 'Butter Chicken', item_price: 350, making_cost: 280 },
    { item_id: 'NVEG3915', item_name: 'Rogan Josh', item_price: 320, making_cost: 250 },
    { item_id: 'NVEG3916', item_name: 'Mutton Korma', item_price: 399, making_cost: 400 },
    { item_id: 'NVEG3917', item_name: 'Kebab Mutton Stick', item_price: 399, making_cost: 350 },
    { item_id: 'VEG1103', item_name: 'Kebab Mushroom Stick', item_price: 399, making_cost: 300 },
    { item_id: 'BEV001', item_name: 'Coke', item_price: 399, making_cost: 50 },
    { item_id: 'BEV002', item_name: 'Blue Drink', item_price: 399, making_cost: 60 },
    { item_id: 'DES001', item_name: 'Tooti Frooti', item_price: 399, making_cost: 80 },
    { item_id: 'DES002', item_name: 'Rasmalai', item_price: 399, making_cost: 120 }
];

// Inventory items (based on actual database schema)
const inventoryItems = [
    { item_id: 'INV001', item_name: 'Rice', current_stock: 100, low_limit: 20, unit: 'kg' },
    { item_id: 'INV002', item_name: 'Wheat Flour', current_stock: 80, low_limit: 15, unit: 'kg' },
    { item_id: 'INV003', item_name: 'Chicken', current_stock: 50, low_limit: 10, unit: 'kg' },
    { item_id: 'INV004', item_name: 'Paneer', current_stock: 30, low_limit: 5, unit: 'kg' },
    { item_id: 'INV005', item_name: 'Tomatoes', current_stock: 40, low_limit: 8, unit: 'kg' },
    { item_id: 'INV006', item_name: 'Onions', current_stock: 60, low_limit: 12, unit: 'kg' },
    { item_id: 'INV007', item_name: 'Potatoes', current_stock: 70, low_limit: 15, unit: 'kg' },
    { item_id: 'INV008', item_name: 'Milk', current_stock: 45, low_limit: 10, unit: 'liters' },
    { item_id: 'INV009', item_name: 'Ghee', current_stock: 25, low_limit: 5, unit: 'kg' },
    { item_id: 'INV010', item_name: 'Spices', current_stock: 35, low_limit: 7, unit: 'kg' },
    { item_id: 'INV011', item_name: 'Sugar', current_stock: 55, low_limit: 11, unit: 'kg' },
    { item_id: 'INV012', item_name: 'Oil', current_stock: 40, low_limit: 8, unit: 'liters' },
    { item_id: 'INV013', item_name: 'Lentils', current_stock: 65, low_limit: 13, unit: 'kg' },
    { item_id: 'INV014', item_name: 'Tea Leaves', current_stock: 20, low_limit: 4, unit: 'kg' },
    { item_id: 'INV015', item_name: 'Coffee Powder', current_stock: 15, low_limit: 3, unit: 'kg' }
];

// User IDs for waiters and chefs (based on actual database schema)
const waiterIds = ['WA4477', 'WS1995', 'WA4457', 'WA7457', 'WA7459', 'WA6293'];
const chefIds = ['CH4479', 'CH4475', 'CH4675', 'CH7675'];
const tableIds = [0, 1, 2, 3, 5, 6, 7, 8];

// Helper functions
function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function formatDate(date: Date): string {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

function generateOrderItems(): string {
    const numItems = getRandomNumber(1, 4);
    const items = [];
    
    for (let i = 0; i < numItems; i++) {
        const menuItem = getRandomElement(menuItems);
        const quantity = getRandomNumber(1, 3);
        items.push({
            item_id: menuItem.item_id,
            item_name: menuItem.item_name,
            quantity: quantity,
            price: menuItem.item_price
        });
    }
    
    return JSON.stringify(items);
}

function calculateOrderTotal(orderItems: string): number {
    const items = JSON.parse(orderItems);
    return items.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);
}

export async function GET() {
    const connection = await dbConnect();
    
    try {
        // Clear existing data first
        await connection.execute('DELETE FROM recent_inventory_order');
        await connection.execute('DELETE FROM kitchen_order');
        await connection.execute('DELETE FROM invoices');
        await connection.execute('DELETE FROM customer');
        await connection.execute('DELETE FROM orders');
        await connection.execute('DELETE FROM expenses');
        
        // Reset inventory to base values
        for (const item of inventoryItems) {
            await connection.execute(
                'UPDATE inventory SET current_stock = ?, low_limit = ? WHERE item_id = ?',
                [item.current_stock, item.low_limit, item.item_id]
            );
        }

        const startDate = new Date('2024-12-31');
        const endDate = new Date('2025-08-02');
        
        // Generate 500 orders
        for (let i = 1; i <= 500; i++) {
            const orderDate = getRandomDate(startDate, endDate);
            const waiterId = getRandomElement(waiterIds);
            const chefId = getRandomElement(chefIds);
            const tableId = getRandomElement(tableIds);
            const orderItems = generateOrderItems();
            const subtotal = calculateOrderTotal(orderItems);
            const gst = subtotal * 0.18;
            const totalAmount = subtotal + gst;
            
            // Insert order
            const [orderResult] = await connection.execute(
                'INSERT INTO orders (table_id, waiter_id, chef_id, order_items, start_time, end_time, status, subtotal, gst, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    tableId,
                    waiterId,
                    chefId,
                    orderItems,
                    formatDate(orderDate),
                    formatDate(new Date(orderDate.getTime() + getRandomNumber(30, 120) * 60000)), // 30-120 minutes later
                    getRandomElement(['completed', 'completed', 'completed', 'pending', 'preparing']), // Mostly completed
                    subtotal,
                    gst,
                    totalAmount
                ]
            );
            
            const orderId = (orderResult as any).insertId;
            
            // Generate customer data for this order (based on actual schema)
            const customerName = getRandomElement(indianNames);
            const customerPhone = getRandomElement(indianPhoneNumbers);
            const customerEmail = `${customerName.toLowerCase().replace(' ', '.')}@gmail.com`;
            const customerAge = getRandomNumber(18, 65);
            const customerGender = getRandomElement(['Male', 'Female']);
            const parsedOrderItems = JSON.parse(orderItems);
            const firstItem = parsedOrderItems[0];
            
            await connection.execute(
                'INSERT INTO customer (order_id, name, mobile, email, age, gender, item_id, item_name, item_foodtype, item_price, total_people) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    orderId, 
                    customerName, 
                    customerPhone, 
                    customerEmail,
                    customerAge,
                    customerGender,
                    firstItem.item_id,
                    firstItem.item_name,
                    firstItem.item_id.startsWith('VEG') ? 'veg' : 'nveg',
                    firstItem.price,
                    getRandomNumber(1, 6)
                ]
            );
            
            // Generate invoice for completed orders (based on actual schema)
            if (Math.random() > 0.1) { // 90% of orders have invoices
                const discount = Math.random() > 0.8 ? getRandomNumber(50, 200) : 0;
                const discountType = discount > 0 ? 'flat' : null;
                const paymentStatus = getRandomElement(['paid', 'paid', 'paid', 'pending']);
                const paymentMethod = getRandomElement(['cash', 'upi', 'card', null]);
                
                await connection.execute(
                    'INSERT INTO invoices (orderid, table_id, subtotal, gst, total_amount, discount, discount_type, payment_status, payment_method, generated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [
                        orderId,
                        tableId,
                        subtotal,
                        gst,
                        totalAmount,
                        discount,
                        discountType,
                        paymentStatus,
                        paymentMethod,
                        formatDate(orderDate)
                    ]
                );
            }
            
            // Generate kitchen order (based on actual schema)
            const kitchenOrderItems = JSON.parse(orderItems);
            for (const item of kitchenOrderItems) {
                await connection.execute(
                    'INSERT INTO kitchen_order (order_id, item_id, item_name, quantity, status, unit, date, time, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [
                        orderId,
                        item.item_id,
                        item.item_name,
                        item.quantity,
                        getRandomElement(['completed', 'completed', 'completed', 'preparing', 'pending']),
                        'pieces',
                        formatDate(orderDate).split(' ')[0],
                        formatDate(orderDate).split(' ')[1],
                        Math.random() > 0.8 ? 'Special instructions' : null
                    ]
                );
            }
        }
        
        // Generate 200 expenses (based on actual schema)
        for (let i = 1; i <= 200; i++) {
            const expenseDate = getRandomDate(startDate, endDate);
            const expenseTypes = ['utilities', 'ingredients', 'maintenance', 'staff_salary', 'rent', 'marketing'];
            const expenseFor = getRandomElement(expenseTypes);
            const frequency = getRandomElement(['daily', 'weekly', 'monthly', 'quarterly']);
            const cost = getRandomNumber(500, 50000);
            
            await connection.execute(
                'INSERT INTO expenses (expenses_for, frequency, cost, date) VALUES (?, ?, ?, ?)',
                [
                    expenseFor,
                    frequency,
                    cost,
                    formatDate(expenseDate).split(' ')[0]
                ]
            );
        }
        
        // Generate 150 recent inventory orders (based on actual schema)
        for (let i = 1; i <= 150; i++) {
            const orderDate = getRandomDate(startDate, endDate);
            const inventoryItem = getRandomElement(inventoryItems);
            const quantity = getRandomNumber(10, 100);
            const price = getRandomNumber(50, 500);
            const totalAmount = quantity * price;
            const orderId = getRandomNumber(1000, 9999);
            
            await connection.execute(
                'INSERT INTO recent_inventory_order (order_id, item_id, order_name, price, quantity, total_amount, unit, date, Remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    orderId,
                    inventoryItem.item_id,
                    inventoryItem.item_name,
                    price,
                    quantity,
                    totalAmount,
                    inventoryItem.unit,
                    formatDate(orderDate).split(' ')[0],
                    Math.random() > 0.7 ? 'Urgent delivery required' : null
                ]
            );
        }
        
        // Update inventory stock based on orders and deliveries
        const [orders] = await connection.execute('SELECT order_items FROM orders');
        const [inventoryOrders] = await connection.execute('SELECT item_id, quantity FROM recent_inventory_order');
        
        // Reduce inventory based on orders (simplified calculation)
        for (const order of orders as any[]) {
            const items = JSON.parse(order.order_items);
            for (const item of items) {
                // Estimate inventory usage (simplified calculation)
                const usage = item.quantity * 0.1; // Assume 10% of menu item weight
                await connection.execute(
                    'UPDATE inventory SET current_stock = current_stock - ? WHERE item_id = ?',
                    [usage, item.item_id]
                );
            }
        }
        
        // Increase inventory based on deliveries
        for (const invOrder of inventoryOrders as any[]) {
            await connection.execute(
                'UPDATE inventory SET current_stock = current_stock + ? WHERE item_id = ?',
                [invOrder.quantity, invOrder.item_id]
            );
        }
        
        return NextResponse.json({
            success: true,
            message: 'Successfully generated 500 dummy records',
            summary: {
                orders: 500,
                customers: 500,
                invoices: 450, // 90% of orders
                expenses: 200,
                kitchen_orders: 1500, // Multiple items per order
                inventory_orders: 150
            }
        });
        
    } catch (error) {
        console.error('Error generating dummy data:', error);
        return NextResponse.json({
            success: false,
            message: 'Error generating dummy data',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    } finally {
        await connection.end();
    }
}  