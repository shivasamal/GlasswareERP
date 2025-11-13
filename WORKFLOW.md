# Custom Manufacturing Workflow

This document explains how the ERP system handles the critical workflow of custom manufacturing orders.

## Problem Statement

You manufacture base glassware products (e.g., RBR-117 Round Bottom Flask). Customers order customized versions (e.g., "Add 2 outlet tubes"). To fulfill these orders, you need to:
1. Check if you have the base product in stock
2. Order required components from suppliers
3. Track packaging materials
4. Manufacture the customized product
5. Deliver to the customer

## Solution Workflow

### Step 1: Customer Places Order (Sales Module)

1. Go to **Sales → Orders → Create Order**
2. Select customer
3. Add products with customization requirements:
   - Product: RBR-117 (Round Bottom Flask)
   - Quantity: 50 units
   - Customization: "Add 2 outlet tubes"
4. Set delivery date
5. Submit order

**System Action:**
- Creates Sales Order (SO-2024-XXX)
- Flags order as "customization required"
- Automatically creates Production Order

### Step 2: Production Order Created (Production Module)

**System automatically:**
1. Creates Production Order (PO-2024-XXX) linked to Sales Order
2. Identifies required components:
   - OUT-001 (Single Outlet Tube) × 100 (2 per unit × 50 units)
3. Checks component inventory:
   - If available: Status = "available"
   - If not available: Status = "needs_order"
4. Identifies required packaging:
   - PKG-002 (Cardboard Box Small) × 50
5. Sets production status to "pending"

### Step 3: Component Procurement (Purchase Module)

**If components are missing:**
1. Go to **Purchase → Orders → Create Order**
2. Select supplier (e.g., Glass Components Ltd)
3. Add required components:
   - OUT-001 × 100 units
4. Set expected delivery date
5. Submit purchase order

**System Action:**
- Creates Purchase Order (PUO-2024-XXX)
- Updates Production Order component status to "ordered"
- Tracks expected delivery

### Step 4: Receive Components (Purchase Module)

1. When components arrive, go to **Purchase → Receipts**
2. Mark purchase order as "received"
3. System automatically:
   - Updates component inventory
   - Updates Production Order component status to "available"

### Step 5: Start Production (Production Module)

1. Go to **Production → Orders**
2. View production order details
3. Check all components and packaging are available
4. Click "Start Production"
5. System:
   - Creates Batch ID (BATCH-2024-XXX)
   - Sets status to "in_progress"
   - Records start date

### Step 6: Quality Control (Production Module)

1. After manufacturing, go to **Production → Quality Control**
2. Add quality record:
   - Batch ID
   - Product code
   - Quantity inspected
   - Passed/Failed counts
   - Inspector name
   - Notes
3. System tracks:
   - Pass rate
   - Failed items (moved to Damaged Items)

### Step 7: Complete Production (Production Module)

1. Go to **Production → Orders**
2. Click "Mark Complete" on production order
3. System:
   - Sets status to "completed"
   - Records completion date
   - Updates finished goods inventory

### Step 8: Shipment (Sales Module)

1. Go to **Sales → Shipments**
2. Create shipment for completed order
3. System:
   - Updates order status to "shipped"
   - Tracks delivery date

### Step 9: Invoice (Sales Module)

1. Go to **Sales → Invoices**
2. Invoice is automatically generated
3. System:
   - Creates invoice number
   - Links to sales order
   - Updates Accounts Receivable

## Example Scenario

### Scenario: Client 1 orders 50 units of RBR-117 with 2 outlet tubes

1. **Sales Order Created**: SO-2024-001
   - Product: RBR-117 × 50
   - Customization: Add 2 outlet tubes
   - Status: Pending

2. **Production Order Created**: PO-2024-001
   - Base Product: RBR-117 (check stock: 100 units available ✓)
   - Required Components: OUT-001 × 100 (check stock: 200 available ✓)
   - Required Packaging: PKG-002 × 50 (check stock: 200 available ✓)
   - Status: Ready to start

3. **Production Started**: 
   - Batch ID: BATCH-2024-001
   - Status: In Progress

4. **Quality Control**:
   - Inspected: 50 units
   - Passed: 48 units
   - Failed: 2 units (moved to damaged items)

5. **Production Completed**:
   - Status: Completed
   - Finished goods: 48 units ready

6. **Shipment**:
   - 48 units shipped to Client 1
   - Status: Delivered

### Scenario: Client 2 orders 100 units of RB-121 and 50 units of RB-122

1. **Sales Order Created**: SO-2024-002
   - Item 1: RB-121 × 100
   - Item 2: RB-122 × 50
   - Status: Pending

2. **Production Orders Created**:
   - PO-2024-002: RB-121 × 100 (no customization, can start immediately)
   - PO-2024-003: RB-122 × 50 (check stock: 50 available ✓)

3. **Production Started**:
   - PO-2024-002: Batch BATCH-2024-002 (in progress)
   - PO-2024-003: Batch BATCH-2024-003 (in progress)

4. **Both completed and shipped**

## Inventory Tracking

### Base Products
- Track manufactured products
- Stock levels
- Minimum stock alerts
- Location tracking

### Components
- Track components from suppliers
- Link to suppliers
- Stock levels
- Reorder points

### Packaging
- Track packaging materials
- Link to suppliers
- Stock levels
- Usage tracking

### Damaged/Scrap
- Track all damaged items
- Reason for damage
- Location
- Status (damaged/scrap)

## Key Features

1. **Automatic Production Order Creation**: When sales order has customization, production order is automatically created

2. **Component Tracking**: System tracks which components are needed and their availability

3. **Purchase Order Integration**: Missing components automatically trigger purchase order suggestions

4. **Batch Tracking**: Each production run gets unique batch ID for traceability

5. **Quality Control**: Track pass/fail rates and move failed items to damaged inventory

6. **End-to-End Visibility**: Track order from customer request to delivery

## Dashboard Insights

Each module provides dashboards showing:
- Key metrics
- Charts and graphs
- Month-on-month comparisons
- Year-on-year trends
- Alerts and notifications

## Role-Based Access

- **Admin**: Full access to all modules
- **Sales Manager**: Sales, Purchase modules
- **Production Manager**: Production, Inventory modules
- **Inventory Manager**: Inventory, Production modules
- **HR Manager**: HR module only
- **Accountant**: Accounting module only

