import { z } from "zod";

// Auth
export const loginSchema = z.object({
  userid: z.string().min(1, "User ID is required"),
  password: z.string().min(1, "Password is required"),
});

// Members
export const registerMemberSchema = z.object({
  basicInfoFields: z.object({
    name: z.string().min(2, "Name is too short"),
    role: z.enum(["admin", "chef", "waiter", "washer"]),
    photo: z.string().optional().nullable(),
    phone_number: z.string().min(10, "Invalid phone number"),
    email: z.string().email("Invalid email").optional().nullable(),
    aadhar_no: z.string().optional().nullable(),
    pan_no: z.string().optional().nullable(),
  }),
  addressFields: z.object({
    street_or_house_no: z.string().optional().nullable(),
    landmark: z.string().optional().nullable(),
    address_one: z.string().optional().nullable(),
    address_two: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    state: z.string().optional().nullable(),
    pin_code: z.string().optional().nullable(),
    country: z.string().optional().nullable(),
  }),
  payoutFields: z.object({
    account_name: z.string().optional().nullable(),
    account_number: z.string().optional().nullable(),
    ifsc_code: z.string().optional().nullable(),
    branch_name: z.string().optional().nullable(),
    upiid: z.string().optional().nullable(),
  }),
});

// Orders
export const orderItemSchema = z.object({
  item_id: z.string(),
  item_name: z.string(),
  quantity: z.number().positive(),
  price: z.number().nonnegative(),
});

export const placeOrderSchema = z.object({
  tableNumber: z.number().int().positive(),
  items: z.array(orderItemSchema).min(1, "Order must have at least one item"),
  subtotal: z.number().nonnegative(),
  gst: z.number().nonnegative(),
  totalAmount: z.number().nonnegative(),
});

// Expenses
export const registerExpenseSchema = z.object({
  expenses_for: z.string().min(1, "Expense name is required"),
  frequency: z.enum(["daily", "weekly", "monthly", "yearly", "once"]),
  cost: z.number().positive(),
});

// Tables
export const addTableSchema = z.object({
  tablenumber: z.number().int().positive("Table number must be positive"),
});

// Menu
export const registerMenuItemSchema = z.object({
  item_name: z.string().min(1, "Item name is required"),
  item_description: z.string().optional().nullable(),
  item_foodtype: z.enum(["veg", "nveg"], "Food type must be 'veg' or 'nveg'"),
  item_price: z.number().positive("Price must be greater than 0"),
  making_cost: z.number().nonnegative("Making cost must be 0 or greater").optional().nullable(),
  item_type: z.string().min(1, "Item category is required"),
  item_thumbnail: z.string().optional().nullable(),
});
