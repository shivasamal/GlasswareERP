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
   - Creates Purchase Receipt (REC-2024-XXX)
   - Generates GRN Number (Goods Receipt Note)
   - Records receipt date and received by information
   - Updates component inventory
   - Updates Production Order component status to "available"
   - Sets receipt status to "complete" (ready for inspection)

### Step 4.1: Inspect Received Items (Purchase Module)

1. Go to **Purchase → Inspection**
2. View receipts pending inspection
3. Click "Start Inspection" on any receipt
4. For each item, check:
   - **Quantity Verification**: Compare ordered vs received quantities
   - **Quality Check**: Inspect for damage or defects
   - **Item Verification**: Verify correct items were received
   - **Quantity Accuracy**: Check if quantities match order
5. Fill inspection form:
   - Enter inspected quantity
   - Mark passed quantity (items in good condition)
   - Mark damaged quantity (if any)
   - Check "Wrong Item" if incorrect item received
   - Check "Wrong Quantity" if quantity doesn't match
   - Add damage/issue description (required if issues found)
   - Add inspection notes
6. Submit inspection
7. System automatically:
   - Updates inspection status (Passed, Partial, Failed)
   - Records inspection date and inspector name
   - Creates damage claims for any issues found
   - Generates claim numbers (CLM-XXX)

### Step 4.2: Handle Damage Claims (Purchase Module)

1. After inspection, if issues found:
   - System creates claims automatically
   - View claims in **Purchase → Inspection → Damage Claims**
2. For each claim:
   - Review claim details (item, quantity, issue description)
   - Click "Request Replacement" button
   - System creates replacement purchase order
   - Replacement order linked to original claim
3. Send replacement order to supplier
4. Track replacement status until resolved

### Step 5: Start Production (Production Module)

1. Go to **Production → Orders**
2. View production order details
3. Check all components and packaging are available
4. Click "Start Production"
5. System:
   - Creates Batch ID (BATCH-2024-XXX)
   - Sets status to "in_progress"
   - Records start date
   - Initializes batch tracking with production phases

### Step 5.1: Track Batch Progress (Production Module)

1. Go to **Production → Batches**
2. Click on any **Batch ID** to view detailed tracking
3. View production phases timeline:
   - **Material Preparation**: ✓ Gathering components and raw materials
   - **Manufacturing**: 🔄 Production and assembly process (Current Phase)
   - **Quality Control**: ⏳ Inspection and testing
   - **Packaging**: ⏳ Final packaging and labeling
   - **Completed**: ⏳ Ready for shipment
4. Features:
   - Visual timeline with current phase highlighted
   - Progress percentage indicator (circular progress)
   - Phase status indicators (completed ✓, in progress 🔄, pending ⏳)
   - Start and completion dates for each phase
   - Add notes about batch progress, issues, or observations
   - View component availability and order information
   - Track customization requirements
5. Add notes:
   - Click "Add Note" button
   - Enter notes about production progress
   - Notes are timestamped with author name
   - Useful for tracking issues, delays, or observations

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
3. Click the **View icon** (Eye) on any invoice to see:
   - **Professional Invoice View**: Complete invoice document showing:
     - Company details (name, address, GSTIN, PAN)
     - Customer billing and shipping information
     - Invoice number and formatted date
     - Detailed line items with:
       - Product codes and descriptions
       - Quantities and unit prices
       - Customization notes (if applicable)
       - Item totals
     - Tax calculations (GST 18%)
     - Subtotal, tax, and total amounts
     - Terms & conditions
     - Payment status badge
     - Authorized signature section
   - **Invoice Details**: Additional tracking information
     - Created by and creation date
     - Last updated by and update dat
     - Order number and customer details
4. System:
   - Creates invoice number (INV-XXX)
   - Links to sales order
   - Updates Accounts Receivable
   - Displays invoice in professional format for better understanding

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

7. **Invoice Generated**:
   - Invoice Number: INV-SO-2024-001
   - Click View icon to see professional invoice with:
     - Complete company and customer details
     - Line items with customization notes
     - GST calculation (18%)
     - Total amount
     - Payment status

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
   - Visual production phase timeline
   - Real-time progress tracking with percentage
   - Current phase indicator
   - Notes and observations tracking
   - Component and order information display
   - Click on Batch ID to view detailed tracking

5. **Quality Control**: Track pass/fail rates and move failed items to damaged inventory

6. **End-to-End Visibility**: Track order from customer request to delivery

7. **Professional Invoice Display**: View invoices in a professional format with complete details, tax calculations, and line items for better understanding

8. **Purchase Receipt Management**: Comprehensive receipt tracking with:
   - Receipt numbers and GRN (Goods Receipt Note) numbers
   - Supplier invoice tracking
   - Item-level quantity verification (ordered vs received)
   - Received by tracking
   - Notes and remarks

9. **Purchase Inspection System**: Quality control for received items
   - Inspect received items for damage, correctness, and quality
   - Track inspected, passed, and damaged quantities
   - Report wrong items or quantities
   - Automatic claim generation for issues
   - Replacement order creation from claims
   - Inspection reports and documentation

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

