# Inventory Management System Workflow

This document explains how the Inventory Management System handles inventory, supplier orders, customer orders, and the complete workflow from procurement to delivery.

## System Overview

The Inventory Management System is a comprehensive solution for managing:
- **Raw Materials**: Items purchased from suppliers (components, materials)
- **Finished Goods**: Products ready for sale
- **Stock Movements**: Manual inward/outward transactions with authorization
- **Suppliers**: Supplier management and purchase tracking
- **Purchase Orders**: Ordering from suppliers with inspection and damage tracking
- **Customer Orders**: Managing customer orders with invoice generation
- **Reports**: Analytics and reporting with charts and PDF export

## Core Workflow

### Step 1: Add Inventory Items

#### 1.1 Add Raw Materials
1. Go to **Inventory → Raw Materials**
2. Click **"Add Material"**
3. Fill in details:
   - Product ID (e.g., RM-001)
   - Name (e.g., Glass Tube)
   - Category (e.g., Raw Material, Component, Packaging)
   - Stock quantity
   - Minimum stock level
   - Unit (pcs, kg, sqm)
   - Unit price
   - Location (e.g., Warehouse A)
   - Supplier ID (if purchased from supplier)
4. Save

**System Action:**
- Creates inventory item with unique Product ID
- Tracks stock levels and minimum thresholds
- Enables low stock alerts

#### 1.2 Add Finished Goods
1. Go to **Inventory → Finished Goods**
2. Click **"Add Product"**
3. Fill in product details:
   - Product ID (e.g., FG-001)
   - Name (e.g., Round Bottom Flask)
   - Category
   - Stock quantity
   - Minimum stock
   - Unit price
   - Location
   - Components required (which raw materials are needed to create this product)
4. Save

**System Action:**
- Creates finished product entry
- Links to required components for production planning
- Tracks finished goods inventory

### Step 2: Manage Suppliers

1. Go to **Inventory → Suppliers**
2. Click **"Add Supplier"**
3. Enter supplier information:
   - Name
   - Email and Phone
   - Address
   - GST Number
   - Payment Terms (Net 30, Net 45, Net 60)
   - Products they supply
4. Save

**System Action:**
- Stores supplier details
- Tracks purchase history
- Calculates total orders and spending per supplier

### Step 3: Place Purchase Order to Supplier

1. Go to **Inventory → Purchase Orders**
2. Click **"New Order"**
3. Select supplier
4. Add items:
   - Select product (from raw materials)
   - Enter quantity ordered
   - Enter unit price
   - Add multiple items if needed
5. Set order date and expected delivery date
6. Upload order document (PDF, DOC, DOCX, or image) - optional
7. Add notes
8. Submit order

**System Action:**
- Creates Purchase Order (PO-2024-XXX)
- Stores order details
- Status: "pending" → "in_progress" → "completed"
- Tracks expected delivery date

### Step 4: Receive and Inspect Supplier Order

#### 4.1 Receive Order
1. When supplier delivers items, go to **Inventory → Purchase Orders**
2. Find the order and click **"Inspect"** (Eye icon)
3. Fill inspection form:
   - Inspection Status: Pending, Passed, or Failed
   - Inspection Date
   - Inspected By (name)
   - For each item:
     - Enter received quantity (may differ from ordered)
     - System automatically calculates excess quantity if received more than ordered
   - Add damaged items:
     - Select product
     - Enter damaged quantity
     - Enter reason for damage
   - Upload supplier invoice (PDF, DOC, DOCX, or image)
   - Add inspection notes
4. Save inspection

**System Action:**
- Updates order status based on inspection
- Records received quantities
- Tracks excess quantities (if received more than ordered)
- Records damaged items
- Updates inventory stock levels (only for good items)
- Stores invoice file

#### 4.2 Handle Damages and Excess
- **Damaged Items**: Recorded separately, not added to inventory
- **Excess Items**: If supplier sends more than ordered (e.g., ordered 100, received 200):
  - System tracks excess quantity separately
  - Excess items can be added to inventory if acceptable
  - Helps identify discrepancies between order and invoice

### Step 5: Manual Stock Updates

1. Go to **Inventory → Stock Movements**
2. Click **"New Movement"**
3. Select movement type:
   - **Inward**: Adding stock to inventory
   - **Outward**: Removing stock from inventory
4. Fill details:
   - Select product
   - Enter quantity
   - Enter date
   - Reference number (PO-001, SO-001, etc.)
   - **Authorized By**: Person who approved the movement
   - **Dispatched By**: Person who dispatched (for outward movements)
   - Notes
5. Save

**System Action:**
- Records stock movement transaction
- Updates inventory stock levels
- Tracks authorization for audit trail
- Maintains complete movement history

### Step 6: Create Customer Order

1. Go to **Inventory → Customer Orders**
2. Click **"New Order"**
3. Select customer
4. Add items:
   - Select finished product
   - Enter **Ordered Quantity** (what customer ordered)
   - Enter **Produced Quantity** (what you actually produced - can be more than ordered)
   - Enter unit price
   - Add multiple items if needed
5. Set order date and delivery date
6. Upload customer order document (optional)
7. Add notes
8. Submit order

**System Action:**
- Creates Customer Order (CO-2024-XXX)
- Generates Invoice Number (INV-2024-XXX)
- **Checks component availability**:
  - For each finished product, checks if required components are available
  - If components available: Status = "in_production"
  - If components missing: Status = "pending", shows missing items
- Calculates excess quantity: Produced Quantity - Ordered Quantity
- Stores order file
- Order status flow: `pending` → `in_production` → `ready` → `in_transit` → `delivered`

### Step 7: Component Availability Check

When customer order is created, system automatically:

1. **Checks Required Components**:
   - For each finished product ordered, checks which raw materials/components are needed
   - Calculates total quantity needed (e.g., if product X needs 2 units of component Y, and customer orders 50 units of X, system checks for 100 units of Y)

2. **Availability Status**:
   - **Available**: All required components are in stock → Order can proceed to production
   - **Missing**: Some components are low/out of stock → Order status remains "pending"
   - Shows which items are missing and how much is needed vs available

3. **Decision Making**:
   - If components available: Proceed to production
   - If components missing: Place purchase order to supplier first

### Step 8: Production Planning

**Scenario: Customer orders 50 units of Product X**

1. System checks Product X components:
   - Product X = Component A (2 units) + Component B (1 unit) + Component C (3 units)
   - Required for 50 units:
     - Component A: 100 units needed
     - Component B: 50 units needed
     - Component C: 150 units needed

2. **If all components available**:
   - Order status: "in_production"
   - Can start production immediately
   - System reserves components (conceptual)

3. **If any component missing**:
   - Order status: "pending"
   - System shows missing items:
     - Component A: Need 100, Available 80 → Need to order 20 more
   - Create purchase order for missing components
   - After receiving components, order status changes to "in_production"

### Step 9: Production Status Management

#### 9.1 Change Order Status
1. Go to **Inventory → Customer Orders**
2. Find the order you want to update
3. Click the **arrow icon** (→) in Actions column to change status
4. Select new status:
   - **Pending**: Waiting for components
   - **In Production**: Currently being produced
   - **Ready**: Production completed, ready for delivery
   - **In Transit**: Items are being delivered to customer

**Note:** When status changes to "Ready", you can start delivery inspection.

### Step 10: Delivery Inspection

#### 10.1 Start Delivery Inspection
1. Go to **Inventory → Customer Orders**
2. Find order with status "Ready" or "In Transit"
3. Click the **truck icon** (🚚) for "Ready" orders or **checkmark icon** (✓) for "In Transit" orders
4. Or click **"View"** (eye icon) and then click **"Start/Update Delivery Inspection"** button

#### 10.2 Delivery Inspection Form
1. Enter **Delivery Date**
2. Enter **Delivered By** (person name)
3. For each item, inspect and enter:
   - **Good Items**: Number of items delivered to customer in good condition
   - **Damaged Items**: Number of items damaged during delivery (enter manually)
4. System shows:
   - Ordered quantity
   - Produced quantity
   - Excess quantity (if produced > ordered)
5. Click **"Save Delivery"**

**System Action:**
- Updates order with delivery details
- Calculates excess items: **Excess = Produced - Good** (items not delivered)
- Tracks damaged items separately
- Updates order status:
  - If all items delivered: Status = "delivered"
  - If partial delivery: Status = "in_transit"

#### 10.3 Excess Items Handling
**Scenario: Ordered 25, Produced 30, Good 25**

1. After saving delivery, system automatically calculates:
   - Excess = 30 - 25 = 5 items (in good shape, not delivered)
2. **Excess Items Modal** appears automatically
3. For each excess item, choose:
   - **Add to Existing Raw Material**: Select from dropdown, stock increases
   - **Add as New Item**: Fill in details to create new raw material
4. Click **"Add to Raw Materials"**

**System Action:**
- Adds excess items to raw materials inventory
- Updates stock levels immediately
- Items are now available in Raw Materials module

#### 10.4 Damaged Items Handling
**Scenario: Ordered 25, Produced 30, Good 25, Damaged 2**

1. Enter damaged quantity manually in delivery inspection
2. System records damaged items separately
3. **No automatic replacement orders** - you handle manually
4. You can:
   - Create replacement order manually if needed
   - Track damages for reporting
   - Handle with supplier/customer separately

**Note:** Damaged items are tracked but don't affect excess items calculation.

### Step 11: Order Cancellation

#### 11.1 Cancel Customer Order
1. Go to **Inventory → Customer Orders**
2. Find order (must not be "delivered" or "cancelled")
3. Click **cancel icon** (X) in Actions column
4. **Cancellation Modal** appears showing:
   - All produced items
   - Excess items (if any)
5. For each item, choose:
   - **Add to Existing Finished Good**: Select from dropdown, stock increases
   - **Add as New Item**: Fill in details to create new finished good
6. Click **"Cancel Order & Return to Inventory"**

**System Action:**
- Order status changes to "cancelled"
- All produced items returned to finished goods inventory
- Excess items also returned
- Order cannot be edited or deleted after cancellation

**Note:** Orders in "in_transit" or "delivered" status cannot be cancelled.

### Step 12: Replacement Orders

#### 12.1 Create Replacement Order Manually
1. Go to **Inventory → Customer Orders**
2. Find order with damaged items
3. Click **"New Order"** to create replacement
4. Select same customer
5. Add items that need replacement
6. Submit order

**System Action:**
- Creates new customer order
- Links to original order (shows "Replacement" badge)
- Order goes through normal production and delivery process

### Step 13: Download Order PDF

1. Go to **Inventory → Customer Orders**
2. Find any order
3. Click **download icon** (📥) in Actions column
4. PDF includes:
   - Order details (number, customer, dates, status)
   - Complete item breakdown (ordered, produced, excess, delivered, good, damaged)
   - Production status
   - Component availability
   - Missing components (if any)
   - Damages list
   - Replacement order reference (if any)
   - Cancellation details (if cancelled)
   - Notes

### Step 14: Inventory Management Best Practices

#### 14.1 Excess Production Strategy
- When producing customer orders, produce extra units for safety
- Excess items automatically go to raw materials (if not delivered)
- Next order can use from inventory if available
- Reduces production time for repeat orders

#### 14.2 Stock Management
- **Manual Updates**: Use Stock Movements for any manual adjustments
- **Authorization Required**: All outward movements require authorization
- **Tracking**: Complete audit trail of all stock movements
- **Low Stock Alerts**: System alerts when stock falls below minimum threshold

#### 14.3 Excess Items Management
- **Always track excess**: Produced - Good = Excess
- **Add to raw materials**: Excess items in good shape can be reused
- **Separate from damages**: Damaged items handled separately
- **Inventory benefit**: Excess items increase raw materials stock

### Step 15: Generate Reports

1. Go to **Inventory → Reports**
2. View comprehensive reports:
   - **Total Spending**: Sum of all purchase orders
   - **Total Revenue**: Sum of all customer orders
   - **Inventory Value**: Total value of all inventory items
   - **Net Profit**: Revenue minus spending

3. **Charts and Analytics**:
   - Supplier-wise purchases (bar chart)
   - Customer-wise sales (bar chart)
   - Inventory by category (pie chart)

4. **Download Reports**:
   - Click **"Download PDF"** to export report
   - Report includes:
     - Summary statistics
     - Supplier-wise purchases
     - Customer-wise sales
     - Inventory breakdown by category

## Example Scenarios

### Scenario 1: Complete Purchase Order Flow

1. **Add Raw Material**:
   - Product ID: RM-001
   - Name: Glass Tube
   - Stock: 0 (need to order)

2. **Add Supplier**:
   - Name: Glass Components Ltd
   - Contact details and GST

3. **Place Purchase Order**:
   - Order 100 units of RM-001
   - Expected delivery: 2024-01-20
   - Upload order document

4. **Receive Order**:
   - Supplier delivers 120 units (20 excess)
   - Inspect: 115 good, 5 damaged
   - Upload supplier invoice
   - System updates:
     - RM-001 stock: 115 units (good items only)
     - Tracks 5 damaged items
     - Tracks 20 excess units (120 received - 100 ordered)

5. **Handle Damages**:
   - Report 5 damaged units to supplier
   - Supplier sends replacement
   - Receive replacement and add to inventory

### Scenario 2: Complete Customer Order Flow

1. **Customer Orders**:
   - Product: FG-001 (Round Bottom Flask)
   - Ordered Quantity: 25 units
   - Produced Quantity: 30 units (produced extra for safety)
   - Unit Price: ₹150

2. **System Checks Components**:
   - FG-001 requires:
     - RM-001 (Glass Tube): 1 unit per product
     - RM-002 (Outlet Tube): 2 units per product
   - For 30 units produced:
     - RM-001: 30 units (Available: 100 ✓)
     - RM-002: 60 units (Available: 80 ✓)
   - Order status: "in_production"

3. **Production**:
   - Use 30 units of RM-001
   - Use 60 units of RM-002
   - Create 30 units of FG-001
   - Order status changes to "ready"

4. **Delivery Inspection**:
   - Click truck icon to start delivery inspection
   - Enter Good Items: 25 (delivered to customer)
   - Enter Damaged Items: 2 (damaged during delivery)
   - System calculates:
     - Delivered: 27 (25 good + 2 damaged)
     - Excess: 30 - 25 = 5 items (in good shape, not delivered)

5. **Excess Items Handling**:
   - System shows excess items modal automatically
   - 5 excess items available to add to raw materials
   - Choose to add to existing raw material or create new
   - Items added to Raw Materials inventory

6. **Damaged Items**:
   - 2 damaged items recorded
   - User can create replacement order manually if needed
   - Damaged items tracked separately from excess

7. **Order Status**:
   - Status: "delivered" (all ordered items delivered)
   - Order complete
   - Can download PDF with all details

### Scenario 3: Excess Items in Customer Orders

**Customer Order**: Ordered 25, Produced 30, Delivered 25 (no damage)

1. **Order Creation**:
   - Ordered: 25 units
   - Produced: 30 units (extra for safety)
   - Excess: 5 units (calculated automatically)

2. **Delivery Inspection**:
   - Good Items: 25 (delivered to customer)
   - Damaged Items: 0
   - System calculates: Excess = 30 - 25 = 5 items

3. **Excess Items Modal**:
   - Appears automatically after saving delivery
   - Shows 5 excess items in good shape
   - Options:
     - Add to existing raw material (stock increases)
     - Create new raw material entry

4. **System Action**:
   - Excess items added to Raw Materials inventory
   - Available for future use
   - Reduces need to purchase new materials

### Scenario 4: Purchase Order Excess Items

**Purchase Order**: Order 100 units, receive 200 units

1. **Inspection**:
   - Received: 200 units
   - Ordered: 100 units
   - Excess: 100 units
   - All items in good condition

2. **System Handling**:
   - Updates inventory with 200 units
   - Tracks that 100 units were excess
   - Order shows: Ordered 100, Received 200, Excess 100
   - Notification appears to add excess to inventory

3. **Excess Items Handling**:
   - System shows modal to add excess items
   - Can add to existing raw material or create new
   - Helps identify discrepancies between order and supplier invoice

4. **Decision**:
   - Accept excess if beneficial
   - Or return excess to supplier
   - System tracks both scenarios

## Key Features

### 1. Authorization Tracking
- **Approved By**: Person who authorized stock movement
- **Dispatched By**: Person who dispatched items (for outward movements)
- Complete audit trail for all transactions

### 2. File Management
- Upload order documents (PDF, DOC, DOCX, images)
- Upload supplier invoices
- Upload customer order documents
- Upload delivery challans
- View files when needed

### 3. Damage Tracking
- Record damages during:
  - Supplier delivery (inspection)
  - Production
  - Customer delivery (delivery inspection)
- Track damage reasons
- Handle replacements manually (no automatic replacement orders)
- Damaged items tracked separately from excess items

### 4. Excess Quantity Handling
- **Purchase Orders**: Track when supplier sends more than ordered
- **Customer Orders**: Track when produced more than ordered (Excess = Produced - Good)
- Compare order vs received vs invoice
- Add excess items to raw materials inventory
- Make informed decisions about excess items

### 5. Component Availability Check
- Automatic check when customer orders
- Shows which components are missing
- Calculates exact quantities needed
- Helps in production planning

### 6. Production Planning
- Check component availability before production
- Plan production based on inventory
- Handle excess production for future orders

### 7. Reports and Analytics
- Supplier-wise purchase tracking
- Customer-wise sales tracking
- Inventory value calculations
- Spending and revenue reports
- Visual charts and graphs
- PDF export functionality

## Inventory Structure

### Raw Materials
- Items purchased from suppliers
- Components used in production
- Packaging materials
- Tracked by Product ID, stock levels, locations

### Finished Goods
- Products ready for sale
- Linked to required components
- Stock levels and pricing
- Production planning support

### Stock Movements
- Manual inward/outward transactions
- Authorization tracking
- Complete audit trail
- Reference to orders/receipts

## Decision Making Support

The system is designed to make decision-making simple:

1. **Clear Status Indicators**: 
   - Order statuses (pending, in_production, ready, in_transit, delivered, cancelled)
   - Component availability (available/missing)
   - Inspection status (pending/passed/failed)
   - Delivery status (good items, damaged items, excess items)

2. **Visual Alerts**:
   - Low stock warnings
   - Missing components highlighted
   - Damage alerts

3. **Complete Information**:
   - All order details visible
   - Component requirements shown
   - Stock levels displayed
   - Supplier and customer history

4. **Easy Navigation**:
   - Simple menu structure
   - Quick actions from dashboard
   - Search and filter capabilities

5. **Reports for Insights**:
   - Spending trends
   - Revenue tracking
   - Inventory analysis
   - Supplier and customer performance

## System Benefits

1. **Prevents Stock Mismatch**: Complete tracking of all movements
2. **Improves Production Efficiency**: Component availability checking
3. **No Unauthorized Dispatch**: Authorization required for all outward movements
4. **Accurate Sales Records**: Complete order and invoice tracking
5. **Supplier Management**: Track all purchases and supplier performance
6. **Customer Management**: Track all sales and customer history
7. **Damage Control**: Track and handle all damages systematically
8. **Excess Handling**: Track and manage excess quantities received
9. **File Storage**: Store all important documents (orders, invoices, challans)
10. **Reporting**: Comprehensive reports for decision making

## User Interface

- **Clean and Simple**: Not bulky, easy to understand
- **Responsive**: Works on all device sizes
- **Consistent Design**: Simple color scheme, professional look
- **Pagination**: All tables have pagination for better performance
- **Search and Filter**: Easy to find items
- **Modal Forms**: Clean forms for data entry
- **Visual Indicators**: Status badges, icons, charts

## Getting Started

1. **Start with Inventory**: Add raw materials and finished goods
2. **Add Suppliers**: Register your suppliers
3. **Place Purchase Orders**: Order items from suppliers
4. **Receive and Inspect**: Inspect received items, handle damages and excess
5. **Create Customer Orders**: Take orders from customers with production tracking
6. **Check Components**: System automatically checks availability
7. **Manage Production**: Track produced quantities and excess items
8. **Delivery Inspection**: Inspect deliveries, track good/damaged items, add excess to raw materials
9. **Manage Stock**: Use stock movements for manual updates
10. **Generate Reports**: View analytics and export reports with PDF download

## Key Workflow Points

### Customer Order Status Flow
1. **Pending**: Waiting for components
2. **In Production**: Currently being produced
3. **Ready**: Production completed, ready for delivery inspection
4. **In Transit**: Items being delivered to customer
5. **Delivered**: All items delivered to customer
6. **Cancelled**: Order cancelled, items returned to inventory

### Excess Items Calculation
- **Formula**: Excess = Produced Quantity - Good Items (delivered)
- **Example**: Produced 30, Good 25 → Excess = 5 items
- **Action**: Add excess items to Raw Materials inventory
- **Benefit**: Reuse excess items, reduce waste, save costs

### Delivery Inspection Process
1. Enter Good Items (delivered to customer)
2. Enter Damaged Items (if any) - handled manually
3. System calculates Excess = Produced - Good
4. Excess items modal appears automatically
5. Add excess to raw materials
6. Order status updates based on delivery

The system is designed to be intuitive and help you make better inventory management decisions with complete tracking from procurement to delivery.
