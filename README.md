# Restaurant Management System (RMS)

A comprehensive web-based solution for restaurant operations management, built with Next.js, TypeScript, and MySQL.

## Project Overview

The Restaurant Management System (RMS) is a full-stack application designed to streamline restaurant operations across multiple roles. This solution provides specialized interfaces for administrators, waiters, chefs, and customers, enabling efficient order management, inventory tracking, and financial reporting.

With real-time updates, the system ensures seamless coordination between the dining area and kitchen. The platform incorporates features like attendance tracking and detailed financial analytics to optimize restaurant operations.

## Features

### Role-Based Access

- **Admin Dashboard**: Financial overview, staff management, inventory tracking, and business analytics
- **Waiter Interface**: Order management and bill generation
- **Chef Portal**: Kitchen queue monitoring and order status updates
- **Customer Experience**: Menu browsing and order placement

### Key Capabilities

- **Real-time Updates**: Instant communication and synchronization between staff
- **Financial Management**: Track revenue, expenses, and generate reports
- **Inventory Control**: Stock monitoring with low-stock alerts
- **Staff Management**: Attendance tracking and payroll processing
- **Theme Customization**: Configurable UI themes to match your restaurant's branding

## Tech Stack

- **Frontend**: Next.js (App Router), React, TypeScript
- **Backend**: Next.js API routes (Edge-ready)
- **Database**: MySQL
- **Authentication**: NextAuth.js
- **Styling**: Vanilla CSS, TailwindCSS

## Demo Credentials

### Staff Access
- **Admin**: 
  - ID: AD4477
  - Password: w%%#Ja
- **Chef**:
  - ID: CH4475
  - Password: 42gQ$_l!A=mh
- **Waiter**:
  - ID: WA4457
  - Password: 1dNv1BnKsb!p

### Customer Access
- Use any mobile number to register/login



## Workflows

### Order Processing
1. Customer or waiter places an order
2. Order appears in the kitchen queue
3. Chef updates preparation status
4. Waiter delivers and processes payment
5. System generates invoice and updates inventory

### Inventory Management
1. System monitors stock levels
2. Low-stock alerts trigger reorder notifications
3. Purchase orders are tracked

### Financial Reporting
1. System tracks all sales and expenses
2. Daily, weekly, and monthly reports are generated
3. Profit and loss statements are calculated automatically
4. Tax calculations are handled based on configurable rates

### Staff Management
1. Employee attendance is tracked with check-in/out
2. Payroll is calculated based on configurations
3. Shift management basics

## System Architecture

The RMS follows a modern architecture pattern with several key components:

### Frontend Layer
- **Client Applications**: Responsive web interfaces for different user roles
- **State Management**: React hooks and context for local state management
- **UI Components**: Reusable component library with Tailwind styling

### Backend Layer
- **API Routes**: Next.js API routes for handling requests
- **Authentication**: Role-based access control with NextAuth.js
- **Business Logic**: Core application logic for order processing, inventory management, etc.

### Data Layer
- **Database**: MySQL for persistent storage
- **Caching**: Server-side in-memory caching for dashboard data

## Security Features

- **Authentication**: Secure login with role-based access control (RBAC)
- **Data Protection**: Standardized API error handling (no info leaks)
- **Input Validation**: Zod-based validation on both frontend and backend
- **Session Management**: Secure JWT-based sessions

## Future Roadmap

- **Mobile Applications**: Native mobile apps for Android and iOS
- **Advanced Analytics**: Enhanced business intelligence dashboards
- **Multi-language Support**: Internationalization for global use
- **Integration APIs**: Connect with third-party delivery and accounting services
- **AI-powered Recommendations**: Smart menu suggestions based on customer preferences

## Development Team

- [Muhammad Ashif Raza](https://www.linkedin.com/in/muhammad-ashif-r/) - Software Engineer
- [Zeeshan Sayeed](https://www.linkedin.com/in/zeeshan-sayeed-18a76120a/) - Full Stack Developer
