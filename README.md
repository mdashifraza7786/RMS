# Restaurant Management System (RMS)

A comprehensive web-based solution for restaurant operations management, built with Next.js, TypeScript, and MySQL.

## Project Overview

The Restaurant Management System (RMS) is a full-stack application designed to streamline restaurant operations across multiple roles. This solution provides specialized interfaces for administrators, waiters, chefs, and customers, enabling efficient order management, inventory tracking, and financial reporting.

With real-time updates, the system ensures seamless coordination between the dining area and kitchen. The platform incorporates advanced features like ML-based inventory forecasting, attendance tracking, and detailed financial analytics to optimize restaurant operations and enhance decision-making.

## Features

### Role-Based Access

- **Admin Dashboard**: Financial overview, staff management, inventory tracking, and business analytics
- **Waiter Interface**: Order management, table assignments, and bill generation
- **Chef Portal**: Kitchen queue monitoring and order status updates
- **Customer Experience**: Menu browsing, order placement, and status tracking

### Key Capabilities

- **Real-time Updates**: Instant communication and synchronization between staff
- **Financial Management**: Track revenue, expenses, and generate reports
- **Inventory Control**: Stock monitoring with low-stock alerts and ML-based forecasting
- **Staff Management**: Attendance tracking and payroll processing
- **Theme Customization**: Configurable UI themes to match your restaurant's branding

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Backend**: Next.js API routes, Node.js
- **Database**: MySQL
- **Authentication**: NextAuth.js
- **State Management**: React Context API
- **ML/Analytics**: Python with Prophet for forecasting
- **Styling**: TailwindCSS, CSS Modules

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
3. ML forecasting predicts future inventory needs
4. Purchase orders are generated and tracked

### Financial Reporting
1. System tracks all sales and expenses
2. Daily, weekly, and monthly reports are generated
3. Profit and loss statements are calculated automatically
4. Tax calculations are handled based on configured rates

### Staff Management
1. Employee attendance is tracked with check-in/out
2. Payroll is calculated based on hours worked
3. Performance metrics are generated for staff evaluation
4. Shift scheduling and management

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
- **Database**: MySQL for persistent storage with optimized queries
- **Data Synchronization**: Efficient polling and state management for updates
- **Caching**: In-memory caching for frequently accessed data

### Analytics Layer
- **ML Service**: Python-based forecasting service with Prophet
- **Data Processing**: ETL processes for transforming raw data
- **Reporting Engine**: Dynamic report generation for business insights

## Security Features

- **Authentication**: Secure login system with role-based access control
- **Data Protection**: Encrypted sensitive information and secure API endpoints
- **Input Validation**: Comprehensive validation to prevent injection attacks
- **Session Management**: Secure session handling with automatic timeouts
- **API Security**: Protected API routes with proper authorization checks

## Future Roadmap

- **Mobile Applications**: Native mobile apps for Android and iOS
- **Advanced Analytics**: Enhanced business intelligence dashboards
- **Multi-language Support**: Internationalization for global use
- **Integration APIs**: Connect with third-party delivery and accounting services
- **AI-powered Recommendations**: Smart menu suggestions based on customer preferences

## Development Team

- [Muhammad Ashif Raza](https://www.linkedin.com/in/muhammad-ashif-r/) - Software Engineer
- [Zeeshan Sayeed](https://www.linkedin.com/in/zeeshan-sayeed-18a76120a/) - Full Stack Developer
