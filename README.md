# Glassware ERP System

A comprehensive Enterprise Resource Planning (ERP) system designed specifically for Glass Lab Articles Manufacturers. This system handles the complete workflow from customer orders to production, including custom manufacturing requirements.

## Features

### 1. Inventory Management
- **Base Products**: Track manufactured glassware products (RBR-117, RB-121, RB-122, etc.)
- **Components**: Track components purchased from suppliers for customization (outlets, joints, caps)
- **Packaging Materials**: Track packaging items outsourced from suppliers
- **Damaged/Scrap Items**: Track broken, damaged, or scrap goods
- Stock alerts and low inventory warnings
- Real-time inventory value tracking

### 2. Production/Manufacturing
- **Production Orders**: Manage custom manufacturing orders
- **Batch Tracking**: Track production batches with unique batch IDs
- **Quality Control**: Record quality inspections, pass/fail rates
- **Customization Workflow**: Automatically tracks required components and packaging for customized orders
- Production status tracking (pending, in_progress, completed)

### 3. Sales & Distribution
- **Customer Management**: Maintain customer database with GST, credit limits
- **Sales Orders**: Create orders with customization requirements
- **Order Tracking**: Track order status from pending to delivery
- **Invoices**: Generate and manage invoices
- **Shipments**: Track shipment status and delivery dates

### 4. Purchase & Suppliers
- **Supplier Management**: Maintain supplier database
- **Purchase Orders**: Create purchase orders for components and packaging
- **Receipts**: Track received goods
- **Payments**: Manage supplier payments

### 5. HR & Payroll
- **Employee Management**: Employee records, departments, positions
- **Attendance**: Track employee attendance and check-in/check-out
- **Payroll**: Process monthly payroll
- **Roles & Permissions**: Manage user roles and module access

### 6. Accounting & Finance
- **Ledgers**: Financial ledger management
- **Accounts Payable**: Track money owed to suppliers
- **Accounts Receivable**: Track money owed by customers
- **Financial Reports**: Profit & Loss, Balance Sheet, Cash Flow
- Revenue, expenses, and profit tracking

### 7. Reporting & Analytics
- **Dashboards**: Module-specific dashboards with key metrics
- **Charts & Graphs**: Visual representation of data
- **Month-on-Month & Year-on-Year**: Compare statistics across periods
- **Custom Reports**: Generate various analytical reports

## Key Workflow: Custom Manufacturing

The system handles the critical workflow where:

1. **Customer places order** with customization requirements (e.g., "Add 2 outlet tubes to RBR-117 flask")
2. **System checks inventory**:
   - Base product stock (RBR-117)
   - Required components (outlet tubes)
   - Required packaging
3. **Automatic production order creation**:
   - If components are missing, system flags for purchase order
   - Production order tracks all required materials
4. **Purchase order generation** for missing components/packaging
5. **Production tracking** once materials are available
6. **Quality control** before delivery
7. **Shipment and invoicing**

## Technology Stack

- **React 18**: Frontend framework
- **React Router**: Navigation and routing
- **Recharts**: Charts and data visualization
- **Vite**: Build tool and dev server
- **CSS3**: Styling with CSS variables for theming

## Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open browser to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Login Credentials

### Admin (Full Access)
- Email: `admin@glassware.com`
- Password: `admin123`

### Inventory Manager
- Email: `inventory@glassware.com`
- Password: `inv123`

### Sales Manager
- Email: `sales@glassware.com`
- Password: `sales123`

### Production Manager
- Email: `production@glassware.com`
- Password: `prod123`

### HR Manager
- Email: `hr@glassware.com`
- Password: `hr123`

### Accountant
- Email: `accountant@glassware.com`
- Password: `acc123`

## Features

### Light/Dark Theme
Toggle between light and dark themes using the theme switcher in the header.

### Role-Based Access Control
- Admin has access to all modules
- Other roles have access only to their assigned modules
- Sidebar automatically filters based on user permissions

### CRUD Operations
All modules support Create, Read, Update, and Delete operations:
- Add new records
- View details
- Edit existing records
- Delete records (with confirmation)

### Responsive Design
- Mobile-friendly layout
- Collapsible sidebar on mobile
- Responsive tables and cards

## Project Structure

```
glassware/
├── src/
│   ├── components/       # Reusable components (Layout, Sidebar, Header)
│   ├── contexts/         # React contexts (Theme, Auth)
│   ├── data/            # Static data
│   ├── modules/         # Feature modules
│   │   ├── Inventory/
│   │   ├── Production/
│   │   ├── Sales/
│   │   ├── Purchase/
│   │   ├── HR/
│   │   ├── Accounting/
│   │   └── Analytics/
│   ├── pages/           # Main pages (Login, Dashboard)
│   └── App.jsx          # Main app component
├── package.json
└── README.md
```

## Key Modules

### Inventory Module
- Base Products: RBR-117, RB-121, RB-122, etc.
- Components: Outlets, joints, caps from suppliers
- Packaging: Boxes, bubble wrap, foam padding
- Damaged Items: Track scrap and damaged goods

### Production Module
- Production Orders: Track custom manufacturing
- Batch Management: Unique batch IDs for tracking
- Quality Control: Pass/fail tracking

### Sales Module
- Customer Orders: With customization support
- Order Status: Pending → In Production → Completed → Shipped
- Invoices and Shipments

## Future Enhancements

- Backend API integration
- Database connectivity
- Real-time notifications
- Advanced reporting
- Export to PDF/Excel
- Email notifications
- Barcode scanning
- Mobile app

## License

This project is for demonstration purposes.

