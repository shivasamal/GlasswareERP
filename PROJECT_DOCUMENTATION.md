# Glassware ERP System - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Module Structure](#module-structure)
5. [Core Features](#core-features)
6. [Data Models](#data-models)
7. [Key Workflows](#key-workflows)
8. [Components & Libraries](#components--libraries)
9. [File Structure](#file-structure)
10. [Deployment & Configuration](#deployment--configuration)

---

## Project Overview

**Glassware ERP** is a comprehensive Enterprise Resource Planning system designed specifically for glassware manufacturing companies. The system manages the complete lifecycle from raw material procurement to finished goods delivery, including inventory management, supplier relations, customer orders, production tracking, and financial accounting.

### Key Objectives
- **Inventory Management**: Track raw materials, finished goods, and stock movements
- **Supplier Management**: Manage supplier relationships and purchase orders
- **Customer Orders**: Process customer orders with invoice generation
- **Production Tracking**: Monitor batches and quality control
- **Financial Management**: Handle accounts payable, receivable, and ledgers
- **HR Management**: Employee management, attendance, and payroll
- **Analytics**: Comprehensive reporting and data visualization

---

## Technology Stack

### Frontend Framework
- **React 18.2.0**: Modern UI library for building interactive user interfaces
- **React Router DOM 6.20.0**: Client-side routing and navigation
- **Vite 5.0.8**: Fast build tool and development server

### UI Libraries & Icons
- **Lucide React 0.294.0**: Modern icon library with 1000+ icons
- **Recharts 2.10.3**: Composable charting library for data visualization
- **Custom CSS**: Modular CSS architecture with component-specific stylesheets

### PDF Generation
- **jsPDF 3.0.4**: Client-side PDF generation
- **jsPDF-AutoTable 5.0.2**: Table generation plugin for jsPDF

### State Management
- **React Context API**: Global state management for authentication and theme
- **React Hooks**: useState, useEffect, useRef, useNavigate, useSearchParams

### Development Tools
- **Vite Plugin React**: React support for Vite
- **TypeScript Types**: Type definitions for React and React DOM

---

## System Architecture

### Application Structure
```
GlasswareERP/
├── src/
│   ├── App.jsx              # Main application component with routing
│   ├── main.jsx             # Application entry point
│   ├── index.css            # Global styles
│   ├── components/          # Reusable UI components
│   ├── contexts/            # React Context providers
│   ├── data/               # Static data and mock APIs
│   ├── modules/            # Feature modules
│   ├── pages/              # Page components
│   └── services/           # API service layer
```

### Routing Architecture
- **Base Path**: `/GlasswareERP` (configured for static hosting)
- **Protected Routes**: All routes wrapped in `ProtectedRoute` component
- **Default Route**: Redirects to `/inventory` dashboard
- **Nested Routes**: Module-specific routes under main layout

### Context Providers
1. **ThemeProvider**: Manages light/dark theme across the application
2. **AuthProvider**: Handles user authentication and authorization
3. **Layout Component**: Provides consistent sidebar and header structure

---

## Module Structure

### 1. Inventory Module (Primary Focus)
The most developed module with complete CRUD operations and workflows.

#### Components:
- **Dashboard** (`Dashboard.jsx`): Overview with stats, charts, and low stock alerts
- **Raw Materials** (`RawMaterials/`): Manage raw materials with filtering
- **Finished Goods** (`FinishedGoods/`): Manage finished products
- **Stock Movements** (`StockMovements/`): Track inward/outward transactions
- **Suppliers** (`Suppliers/`): Supplier management
- **Purchase Orders** (`PurchaseOrders/`): Order management with inspection
- **Customer Orders** (`CustomerOrders/`): Customer order processing
- **Reports** (`Reports/`): Analytics and reporting

#### Key Features:
- **Filtering System**: All, Low Stock, Supplier Materials, Inhouse Materials
- **Camera Integration**: Direct camera capture for invoice uploads
- **File Upload**: PDF, DOC, DOCX, and image file support
- **Low Stock Alerts**: Visual indicators and dashboard notifications
- **Excess Item Handling**: Automatic detection and inventory addition
- **Damage Tracking**: Record and track damaged items during inspection

### 2. Production Module
- **Dashboard**: Production overview and metrics
- **Batches**: Batch tracking and management
- **Orders**: Production order management
- **Quality Control**: Quality inspection and testing

### 3. Sales Module
- **Dashboard**: Sales overview
- **Customers**: Customer management
- **Orders**: Sales order processing
- **Invoices**: Invoice generation and management
- **Shipments**: Shipping and delivery tracking

### 4. Purchase Module
- **Dashboard**: Purchase overview
- **Orders**: Purchase order management
- **Suppliers**: Supplier relations
- **Inspection**: Quality inspection
- **Payments**: Payment processing
- **Receipts**: Receipt management

### 5. Accounting Module
- **Dashboard**: Financial overview
- **Accounts Payable**: Manage payables
- **Accounts Receivable**: Manage receivables
- **Ledgers**: General ledger management
- **Reports**: Financial reporting

### 6. HR Module
- **Dashboard**: HR overview
- **Employees**: Employee management
- **Attendance**: Attendance tracking
- **Payroll**: Payroll processing
- **Roles**: Role and permission management

### 7. Analytics Module
- **Dashboard**: Comprehensive analytics and insights

---

## Core Features

### 1. Inventory Management

#### Raw Materials Management
- **CRUD Operations**: Create, Read, Update, Delete raw materials
- **Source Classification**: 
  - Supplier Materials (purchased from suppliers)
  - Inhouse Materials (manufactured internally)
- **Stock Tracking**: Real-time stock levels with minimum stock thresholds
- **Location Management**: Shelf-based organization (Shelf A, B, C)
- **Filtering Options**:
  - All Materials
  - Low Stock (stock < minStock)
  - Supplier Materials
  - Inhouse Materials
- **Visual Indicators**:
  - Red background for low stock rows
  - Warning emoji (⚠️) with pulse animation
  - Color-coded source badges (Blue: Supplier, Green: Inhouse)

#### Finished Goods Management
- Product catalog management
- Component linking (which raw materials are needed)
- Stock level tracking
- Price management

#### Stock Movements
- **Inward Movements**: Stock received from suppliers or production
- **Outward Movements**: Stock dispatched to customers or used in production
- **Authorization System**: Multi-level approval (Approved By, Authorized By)
- **Reference Tracking**: Link to Purchase Orders, Sales Orders, etc.

### 2. Purchase Order Management

#### Order Creation
- Select supplier
- Add multiple items with quantities and prices
- Set delivery dates
- Upload order documents (PDF, DOC, DOCX, images)
- Add notes

#### Order Inspection
- **Inspection Status**: Pending, Passed, Failed
- **Received Quantities**: Track actual vs ordered quantities
- **Excess Items**: Automatic detection of items received in excess
- **Damage Tracking**: Record damaged items with reasons
- **Invoice Upload**:
  - **Camera Capture**: Direct photo capture using device camera
  - **File Upload**: Upload PDF or image files
  - Both methods save files as base64 data

#### Excess Item Handling
- Automatic notification when excess items detected
- Options to:
  - Add to existing raw material stock
  - Create new raw material entry
- Automatic inventory updates

### 3. Customer Order Management

#### Order Processing
- Create customer orders
- Track order status (Pending, In Production, Ready, In Transit, Delivered, Cancelled)
- Link to finished goods
- Generate invoices
- Track deliveries

#### Invoice Generation
- PDF invoice generation using jsPDF
- Automatic calculations
- Professional formatting
- Download capability

### 4. Supplier Management

#### Supplier Information
- Contact details (name, email, phone, address)
- GST number
- Payment terms (Net 30, Net 45, Net 60)
- Products supplied
- Purchase history tracking
- Total orders and spending

### 5. Dashboard & Analytics

#### Inventory Dashboard
- **Statistics Cards**:
  - Total Items
  - Low Stock Alerts (clickable - redirects to filtered view)
  - Total Inventory Value
  - Total Spending
- **Charts**:
  - Inventory Trends (Line Chart)
  - Stock Distribution (Bar Chart)
- **Low Stock Alerts Section**:
  - List of items below minimum stock
  - Clickable items redirect to Raw Materials with Low Stock filter
  - "View All Low Stock Items" button
- **Quick Actions**: Direct navigation to key modules

#### Reports Module
- Comprehensive reporting
- Data visualization
- Export capabilities (PDF)
- Custom date range filtering

### 6. Search & Filtering

#### Search Functionality
- Real-time search across:
  - Product IDs
  - Product names
  - Supplier names
  - Order numbers

#### Advanced Filtering
- Status filters (All, Pending, In Progress, Completed)
- Stock level filters (All, Low Stock)
- Source filters (All, Supplier, Inhouse)
- Date range filters
- Pagination support

### 7. File Management

#### Supported File Types
- PDF documents
- DOC/DOCX files
- Images (JPG, JPEG, PNG)

#### Upload Methods
- **File Picker**: Traditional file selection
- **Camera Capture**: Direct photo capture using device camera
  - Uses MediaDevices API
  - Supports mobile back camera
  - Converts to JPEG format
  - Saves as base64 data

#### File Storage
- Files stored as base64 encoded strings
- Associated with orders/invoices
- Display file names in UI
- Download/view capabilities

---

## Data Models

### Raw Materials
```javascript
{
  id: number,
  productId: string,        // e.g., "RM-001"
  name: string,
  description: string,
  category: string,          // Raw Material, Component, Packaging, Tooling
  stock: number,
  minStock: number,
  unit: string,             // pcs, kg, sqm
  price: number,
  supplierId: number | null, // null for inhouse materials
  status: string,           // active, inactive
  location: string,         // Shelf A, Shelf B, Shelf C
  source: string            // 'supplier' or 'inhouse'
}
```

### Finished Goods
```javascript
{
  id: number,
  productId: string,        // e.g., "FG-001"
  name: string,
  description: string,
  category: string,
  stock: number,
  minStock: number,
  unit: string,
  price: number,
  status: string,
  location: string,
  components: [             // Required raw materials
    {
      productId: string,
      quantity: number
    }
  ]
}
```

### Purchase Orders
```javascript
{
  id: number,
  orderNumber: string,      // e.g., "PO-2024-001"
  supplierId: number,
  supplierName: string,
  date: string,             // ISO date
  expectedDelivery: string,
  items: [
    {
      productId: string,
      productName: string,
      quantity: number,
      receivedQuantity: number,
      damagedQuantity: number,
      excessQuantity: number,
      unitPrice: number,
      total: number
    }
  ],
  totalAmount: number,
  status: string,           // pending, in_progress, completed
  inspectionStatus: string, // pending, passed, failed
  inspectionDate: string,
  inspectedBy: string,
  receivedDate: string,
  receivedBy: string,
  orderFile: {
    name: string,
    data: string            // base64 encoded
  },
  invoiceFile: {
    name: string,
    data: string            // base64 encoded
  },
  damages: [
    {
      productId: string,
      productName: string,
      quantity: number,
      reason: string
    }
  ],
  notes: string,
  excessItemsProcessed: boolean
}
```

### Customer Orders
```javascript
{
  id: number,
  orderNumber: string,      // e.g., "SO-2024-001"
  customerId: number,
  customerName: string,
  date: string,
  deliveryDate: string,
  items: [
    {
      productId: string,
      productName: string,
      quantity: number,
      producedQuantity: number,
      unitPrice: number,
      total: number
    }
  ],
  totalAmount: number,
  status: string,           // pending, in_production, ready, in_transit, delivered, cancelled
  orderFile: object,
  invoiceFile: object,
  deliveryChallanFile: object,
  notes: string
}
```

### Suppliers
```javascript
{
  id: number,
  name: string,
  email: string,
  phone: string,
  address: string,
  gst: string,
  products: string[],
  status: string,
  paymentTerms: string,     // Net 30, Net 45, Net 60
  totalOrders: number,
  totalSpent: number,
  lastOrderDate: string
}
```

### Stock Movements
```javascript
{
  id: number,
  type: string,             // 'inward' or 'outward'
  productId: string,
  productName: string,
  quantity: number,
  date: string,
  reference: string,        // PO-001, SO-001, etc.
  approvedBy: string,
  authorizedBy: string,
  dispatchedBy: string,     // for outward movements
  notes: string,
  status: string           // pending, completed
}
```

---

## Key Workflows

### Workflow 1: Raw Material Procurement

1. **Add Supplier**
   - Navigate to Inventory → Suppliers
   - Add supplier details (name, contact, GST, payment terms)
   - Save supplier

2. **Create Purchase Order**
   - Navigate to Inventory → Purchase Orders
   - Click "New Order"
   - Select supplier
   - Add items (raw materials) with quantities and prices
   - Set delivery date
   - Upload order document (optional)
   - Submit order

3. **Receive & Inspect Order**
   - When supplier delivers, click "Inspect" on the order
   - Fill inspection form:
     - Inspection status (Pending/Passed/Failed)
     - Received quantities (may differ from ordered)
     - Add damaged items if any
     - Upload supplier invoice:
       - Option 1: Open Camera → Capture photo
       - Option 2: Upload PDF/File from device
   - Save inspection

4. **Handle Excess Items** (if applicable)
   - System automatically detects excess quantities
   - Notification appears
   - Choose to:
     - Add to existing raw material stock
     - Create new raw material entry
   - Inventory automatically updates

5. **Update Inventory**
   - Stock levels automatically updated for good items
   - Damaged items tracked separately
   - Excess items added based on selection

### Workflow 2: Low Stock Management

1. **Dashboard Alert**
   - Low stock items appear on dashboard
   - Click on "Low Stock Alerts" stat card or alert item
   - Redirects to Raw Materials with "Low Stock" filter applied

2. **Filter & View**
   - Use dropdown filter: "Low Stock"
   - View all items below minimum stock
   - Visual indicators:
     - Red background rows
     - Warning emoji
     - Red text for stock numbers

3. **Create Purchase Order**
   - Select low stock items
   - Create purchase order to replenish stock

### Workflow 3: Customer Order Fulfillment

1. **Create Customer Order**
   - Navigate to Inventory → Customer Orders
   - Select customer
   - Add finished goods items
   - Set delivery date
   - Submit order

2. **Production Planning**
   - System checks component availability
   - Links to required raw materials
   - Production team can view requirements

3. **Order Processing**
   - Update order status as it progresses
   - Track through: Pending → In Production → Ready → In Transit → Delivered

4. **Invoice Generation**
   - Generate PDF invoice
   - Download and send to customer
   - Track payment status

### Workflow 4: Stock Movement Tracking

1. **Inward Movement**
   - Navigate to Inventory → Stock Movements
   - Create inward movement
   - Select product
   - Enter quantity
   - Add reference (PO number, etc.)
   - Get approvals (Approved By, Authorized By)
   - Complete movement

2. **Outward Movement**
   - Create outward movement
   - Select product
   - Enter quantity
   - Add reference (SO number, etc.)
   - Add dispatcher name
   - Get approvals
   - Complete movement

---

## Components & Libraries

### React Components

#### Layout Components
- **Layout.jsx**: Main application layout with sidebar and header
- **Sidebar.jsx**: Navigation sidebar with module menu
- **Header.jsx**: Top header with user info and theme toggle
- **ProtectedRoute.jsx**: Route protection wrapper

#### Feature Components
- **BatchDetailView.jsx**: Production batch details
- **InvoiceView.jsx**: Invoice display component

### Third-Party Libraries

#### jsPDF
- **Purpose**: Client-side PDF generation
- **Usage**: 
  - Invoice generation
  - Purchase order PDFs
  - Report exports
- **Features Used**:
  - Text formatting
  - Table generation (via AutoTable plugin)
  - File download

#### Recharts
- **Purpose**: Data visualization
- **Usage**: Dashboard charts
- **Chart Types Used**:
  - Line Chart: Inventory trends over time
  - Bar Chart: Stock distribution
- **Features**: Responsive, interactive tooltips

#### Lucide React
- **Purpose**: Icon library
- **Icons Used**: 50+ icons including:
  - Package, Eye, Upload, Camera, Search, Plus, Edit, Trash2
  - CheckCircle, XCircle, AlertTriangle, Download, Bell
  - And many more

#### React Router DOM
- **Purpose**: Client-side routing
- **Features Used**:
  - BrowserRouter with basename
  - Nested routes
  - URL parameters (useSearchParams)
  - Navigation hooks (useNavigate, useLocation)

### Browser APIs Used

#### MediaDevices API
- **Purpose**: Camera access
- **Usage**: Invoice photo capture
- **Implementation**:
  ```javascript
  navigator.mediaDevices.getUserMedia({ 
    video: { facingMode: 'environment' } 
  })
  ```

#### FileReader API
- **Purpose**: File reading
- **Usage**: Convert files to base64 for storage
- **Implementation**:
  ```javascript
  reader.readAsDataURL(file)
  ```

#### Canvas API
- **Purpose**: Image processing
- **Usage**: Convert video frame to image
- **Implementation**:
  ```javascript
  canvas.toBlob((blob) => {...}, 'image/jpeg', 0.9)
  ```

---

## File Structure

### Root Directory
```
GlasswareERP/
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── index.html             # HTML entry point
├── README.md              # Project readme
├── WORKFLOW.md            # Workflow documentation
├── PROJECT_DOCUMENTATION.md  # This file
├── public/                # Static assets
├── dist/                  # Build output
└── src/                   # Source code
```

### Source Directory Structure
```
src/
├── App.jsx                # Main app component with routing
├── main.jsx               # Application entry point
├── index.css              # Global styles
│
├── components/            # Reusable components
│   ├── Layout.jsx         # Main layout wrapper
│   ├── Layout.css
│   ├── Sidebar.jsx        # Navigation sidebar
│   ├── Sidebar.css
│   ├── Header.jsx         # Top header
│   ├── Header.css
│   ├── ProtectedRoute.jsx # Route protection
│   ├── BatchDetailView.jsx
│   ├── BatchDetailView.css
│   ├── InvoiceView.jsx
│   └── InvoiceView.css
│
├── contexts/              # React Context providers
│   ├── AuthContext.jsx    # Authentication context
│   └── ThemeContext.jsx   # Theme context
│
├── data/                  # Data layer
│   ├── inventoryData.js   # Inventory data models
│   └── staticData.js      # Static/mock data
│
├── modules/               # Feature modules
│   ├── Inventory/         # Inventory module (primary)
│   │   ├── Dashboard.jsx
│   │   ├── Dashboard.css
│   │   ├── RawMaterials/
│   │   │   ├── RawMaterials.jsx
│   │   │   └── RawMaterials.css
│   │   ├── FinishedGoods/
│   │   ├── StockMovements/
│   │   ├── Suppliers/
│   │   ├── PurchaseOrders/
│   │   ├── CustomerOrders/
│   │   └── Reports/
│   ├── Production/
│   ├── Sales/
│   ├── Purchase/
│   ├── Accounting/
│   ├── HR/
│   └── Analytics/
│
├── pages/                 # Page components
│   ├── Dashboard.jsx
│   ├── Dashboard.css
│   ├── Login.jsx
│   └── Login.css
│
└── services/              # Service layer
    └── api.js             # API service functions
```

---

## Deployment & Configuration

### Build Configuration

#### Vite Configuration (`vite.config.js`)
- React plugin enabled
- Build output to `dist/` directory
- Optimized for production

#### Package Scripts
```json
{
  "dev": "vite",              // Development server
  "build": "vite build",      // Production build
  "preview": "vite preview"   // Preview production build
}
```

### Routing Configuration

#### Base Path
- Configured for static hosting: `/GlasswareERP`
- All routes prefixed with base path
- Router configured in `App.jsx`:
  ```javascript
  <Router basename="/GlasswareERP">
  ```

#### Route Structure
```
/ → /inventory (redirect)
/inventory → Dashboard
/inventory/raw-materials → Raw Materials
/inventory/finished-goods → Finished Goods
/inventory/stock-movements → Stock Movements
/inventory/suppliers → Suppliers
/inventory/purchase-orders → Purchase Orders
/inventory/customer-orders → Customer Orders
/inventory/reports → Reports
```

### Environment Setup

#### Development
1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Access at: `http://localhost:5173/GlasswareERP`

#### Production Build
1. Build: `npm run build`
2. Output in `dist/` directory
3. Deploy `dist/` contents to static hosting

### Data Storage

#### Current Implementation
- **Storage Type**: In-memory (React state)
- **Data Source**: Static data files (`inventoryData.js`, `staticData.js`)
- **Persistence**: None (data resets on page refresh)

#### Future Enhancement
- Backend API integration
- Database storage (PostgreSQL, MongoDB, etc.)
- Authentication service
- File storage service (AWS S3, etc.)

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires:
  - ES6+ support
  - MediaDevices API (for camera)
  - FileReader API (for file uploads)
  - Canvas API (for image processing)

---

## Key Features Summary

### ✅ Implemented Features

1. **Complete Inventory Management**
   - Raw materials with source classification
   - Finished goods with component linking
   - Stock level tracking with alerts
   - Location-based organization

2. **Advanced Filtering**
   - Multi-criteria filtering
   - URL-based filter persistence
   - Real-time search
   - Pagination

3. **Purchase Order Workflow**
   - Order creation and tracking
   - Inspection system
   - Damage tracking
   - Excess item handling
   - Camera integration for invoice upload

4. **Customer Order Management**
   - Order processing
   - Status tracking
   - Invoice generation (PDF)
   - Delivery tracking

5. **Visual Indicators**
   - Low stock alerts
   - Color-coded rows
   - Source badges
   - Warning animations

6. **File Management**
   - Multiple upload methods
   - Camera integration
   - PDF generation
   - File storage (base64)

7. **Dashboard & Analytics**
   - Statistics cards
   - Interactive charts
   - Low stock alerts
   - Quick actions

8. **Responsive Design**
   - Mobile-friendly
   - Tablet support
   - Desktop optimized

### 🔄 Future Enhancements

1. **Backend Integration**
   - RESTful API
   - Database persistence
   - Real-time updates
   - Multi-user support

2. **Advanced Features**
   - Barcode scanning
   - Email notifications
   - SMS alerts
   - Advanced reporting
   - Export to Excel

3. **Security**
   - JWT authentication
   - Role-based access control
   - Data encryption
   - Audit logging

4. **Performance**
   - Code splitting
   - Lazy loading
   - Caching strategies
   - Optimistic updates

---

## Development Guidelines

### Code Structure
- **Component-based**: Each feature in its own component
- **Modular CSS**: Component-specific stylesheets
- **Data Separation**: Data models in separate files
- **Service Layer**: API calls abstracted in services

### Naming Conventions
- **Components**: PascalCase (e.g., `RawMaterials.jsx`)
- **Files**: Match component names
- **CSS Classes**: kebab-case (e.g., `low-stock-row`)
- **Functions**: camelCase (e.g., `handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE

### State Management
- **Local State**: useState for component-specific state
- **Global State**: Context API for theme and auth
- **URL State**: useSearchParams for filter persistence

### Best Practices
- **Component Reusability**: Extract common patterns
- **Error Handling**: Try-catch blocks for async operations
- **User Feedback**: Loading states and error messages
- **Accessibility**: Semantic HTML and ARIA labels

---

## Support & Maintenance

### Version Information
- **Project Name**: Glassware ERP
- **Version**: 1.0.0
- **Last Updated**: 2024

### Dependencies
All dependencies listed in `package.json`. Key versions:
- React: 18.2.0
- React Router: 6.20.0
- Vite: 5.0.8
- jsPDF: 3.0.4
- Recharts: 2.10.3
- Lucide React: 0.294.0

### Known Limitations
1. **Data Persistence**: Currently in-memory only
2. **Authentication**: Mock implementation
3. **File Storage**: Base64 encoding (not scalable for large files)
4. **Multi-user**: Single-user system

---

## Conclusion

The Glassware ERP system is a comprehensive solution for managing glassware manufacturing operations. With its modular architecture, modern tech stack, and user-friendly interface, it provides a solid foundation for inventory management, order processing, and business operations.

The system is designed to be:
- **Scalable**: Modular architecture allows easy expansion
- **Maintainable**: Clean code structure and documentation
- **User-Friendly**: Intuitive UI with visual indicators
- **Feature-Rich**: Comprehensive functionality for ERP needs

For questions or support, refer to the codebase documentation or contact the development team.

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Maintained By**: Development Team

