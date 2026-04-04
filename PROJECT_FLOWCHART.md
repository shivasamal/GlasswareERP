# Glassware ERP System - Flowchart & Architecture Diagrams

This document contains visual flowcharts and diagrams representing the entire Glassware ERP system architecture, workflows, and data flow.

---

## 1. System Architecture Overview

```mermaid
graph TB
    A[User] --> B[Browser]
    B --> C[React App]
    C --> D[Layout Component]
    D --> E[Sidebar Navigation]
    D --> F[Header]
    D --> G[Content Area]
    
    G --> H[Inventory Module]
    G --> I[Production Module]
    G --> J[Sales Module]
    G --> K[Purchase Module]
    G --> L[Accounting Module]
    G --> M[HR Module]
    G --> N[Analytics Module]
    
    H --> O[Data Layer]
    I --> O
    J --> O
    K --> O
    L --> O
    M --> O
    N --> O
    
    O --> P[Static Data Files]
    O --> Q[Context Providers]
    
    Q --> R[Auth Context]
    Q --> S[Theme Context]
    
    style A fill:#e1f5ff
    style C fill:#4CAF50
    style H fill:#2196F3
    style O fill:#FF9800
```

---

## 2. Inventory Module Flow

```mermaid
graph TD
    A[Inventory Dashboard] --> B[Raw Materials]
    A --> C[Finished Goods]
    A --> D[Stock Movements]
    A --> E[Suppliers]
    A --> F[Purchase Orders]
    A --> G[Customer Orders]
    A --> H[Reports]
    
    B --> B1[Add Material]
    B --> B2[Filter: All/Low Stock/Supplier/Inhouse]
    B --> B3[Edit/Delete]
    B --> B4[View Stock Levels]
    
    E --> E1[Add Supplier]
    E --> E2[View Supplier Details]
    E --> E3[Track Purchase History]
    
    F --> F1[Create Purchase Order]
    F1 --> F2[Select Supplier]
    F2 --> F3[Add Items]
    F3 --> F4[Set Delivery Date]
    F4 --> F5[Upload Order Document]
    F5 --> F6[Submit Order]
    
    F --> F7[Inspect Order]
    F7 --> F8[Enter Received Quantities]
    F8 --> F9[Record Damages]
    F9 --> F10[Upload Invoice]
    F10 --> F10a[Camera Capture]
    F10 --> F10b[File Upload]
    F10a --> F11[Save Inspection]
    F10b --> F11
    F11 --> F12{Excess Items?}
    F12 -->|Yes| F13[Add to Inventory]
    F12 -->|No| F14[Update Stock]
    F13 --> F14
    
    G --> G1[Create Customer Order]
    G1 --> G2[Select Customer]
    G2 --> G3[Add Finished Goods]
    G3 --> G4[Generate Invoice]
    G4 --> G5[Track Delivery]
    
    D --> D1[Inward Movement]
    D --> D2[Outward Movement]
    D1 --> D3[Approve & Authorize]
    D2 --> D3
    D3 --> D4[Update Stock]
    
    style A fill:#2196F3,color:#fff
    style F fill:#4CAF50,color:#fff
    style G fill:#FF9800,color:#fff
```

---

## 3. Purchase Order Workflow (Detailed)

```mermaid
flowchart TD
    Start([Start: Need Raw Materials]) --> CheckStock{Check Stock Levels}
    CheckStock -->|Low Stock| CreatePO[Create Purchase Order]
    CheckStock -->|Stock OK| End1([End])
    
    CreatePO --> SelectSupplier[Select Supplier]
    SelectSupplier --> AddItems[Add Items to Order]
    AddItems --> SetDates[Set Order & Delivery Dates]
    SetDates --> UploadDoc[Upload Order Document Optional]
    UploadDoc --> SubmitPO[Submit Purchase Order]
    SubmitPO --> POStatus[Status: Pending]
    
    POStatus --> WaitDelivery[Wait for Supplier Delivery]
    WaitDelivery --> ReceiveOrder[Order Received]
    ReceiveOrder --> Inspect[Open Inspection Modal]
    
    Inspect --> EnterReceived[Enter Received Quantities]
    EnterReceived --> CheckDamages{Any Damages?}
    CheckDamages -->|Yes| RecordDamages[Record Damaged Items]
    CheckDamages -->|No| UploadInvoice
    RecordDamages --> UploadInvoice[Upload Supplier Invoice]
    
    UploadInvoice --> ChooseMethod{Upload Method?}
    ChooseMethod -->|Camera| OpenCamera[Open Camera]
    ChooseMethod -->|File| SelectFile[Select File]
    
    OpenCamera --> CapturePhoto[Capture Photo]
    CapturePhoto --> ProcessImage[Convert to Base64]
    SelectFile --> ProcessFile[Read File as Base64]
    ProcessImage --> SaveInvoice
    ProcessFile --> SaveInvoice[Save Invoice File]
    
    SaveInvoice --> SaveInspection[Save Inspection]
    SaveInspection --> CheckExcess{Excess Items?}
    
    CheckExcess -->|Yes| ShowNotification[Show Excess Notification]
    CheckExcess -->|No| UpdateStock[Update Inventory Stock]
    
    ShowNotification --> ChooseAction{Action?}
    ChooseAction -->|Add to Existing| AddExisting[Add to Existing Material]
    ChooseAction -->|Create New| CreateNew[Create New Material Entry]
    
    AddExisting --> UpdateStock
    CreateNew --> UpdateStock
    UpdateStock --> UpdateStatus[Status: Completed]
    UpdateStatus --> End2([End: Stock Updated])
    
    style Start fill:#e1f5ff
    style CreatePO fill:#4CAF50,color:#fff
    style Inspect fill:#FF9800,color:#fff
    style UpdateStock fill:#2196F3,color:#fff
    style End2 fill:#e1f5ff
```

---

## 4. Low Stock Alert Flow

```mermaid
flowchart LR
    A[Dashboard] --> B{Low Stock Items?}
    B -->|Yes| C[Display Alert Card]
    B -->|No| D[No Alerts]
    
    C --> E[Show Alert Count]
    C --> F[Display Alert List]
    
    E --> G[Click Alert Card]
    F --> H[Click Alert Item]
    F --> I[Click View All Button]
    
    G --> J[Navigate to Raw Materials]
    H --> J
    I --> J
    
    J --> K[Apply Low Stock Filter]
    K --> L[Display Low Stock Items]
    L --> M[Visual Indicators]
    
    M --> N[Red Background Rows]
    M --> O[Warning Emoji]
    M --> P[Red Stock Text]
    
    L --> Q[Create Purchase Order]
    Q --> R[Replenish Stock]
    
    style A fill:#2196F3,color:#fff
    style C fill:#f44336,color:#fff
    style J fill:#4CAF50,color:#fff
    style M fill:#FF9800,color:#fff
```

---

## 5. Data Flow Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[React Components]
        B[Context Providers]
        C[Custom Hooks]
    end
    
    subgraph "State Management"
        D[Component State]
        E[Context State]
        F[URL State]
    end
    
    subgraph "Data Layer"
        G[inventoryData.js]
        H[staticData.js]
        I[api.js Services]
    end
    
    subgraph "Storage"
        J[In-Memory State]
        K[Base64 Files]
        L[Local Storage]
    end
    
    A --> D
    A --> E
    A --> F
    B --> E
    C --> D
    
    D --> G
    E --> H
    F --> I
    
    G --> J
    H --> J
    I --> J
    
    A --> K
    A --> L
    
    style A fill:#4CAF50,color:#fff
    style G fill:#2196F3,color:#fff
    style J fill:#FF9800,color:#fff
```

---

## 6. Module Interaction Flow

```mermaid
graph LR
    subgraph "Inventory Module"
        A1[Raw Materials]
        A2[Finished Goods]
        A3[Suppliers]
        A4[Purchase Orders]
        A5[Customer Orders]
    end
    
    subgraph "Production Module"
        B1[Batches]
        B2[Quality Control]
    end
    
    subgraph "Sales Module"
        C1[Orders]
        C2[Invoices]
    end
    
    subgraph "Accounting Module"
        D1[Accounts Payable]
        D2[Accounts Receivable]
    end
    
    A3 --> A4
    A4 --> A1
    A1 --> B1
    B1 --> A2
    A2 --> C1
    C1 --> C2
    A4 --> D1
    C2 --> D2
    B1 --> B2
    
    style A4 fill:#4CAF50,color:#fff
    style C2 fill:#2196F3,color:#fff
    style B1 fill:#FF9800,color:#fff
```

---

## 7. File Upload Flow (Camera & File)

```mermaid
flowchart TD
    Start([User Clicks Upload Invoice]) --> ShowOptions[Show Upload Options]
    ShowOptions --> Option1[Open Camera Button]
    ShowOptions --> Option2[Upload PDF/File Button]
    
    Option1 --> RequestCamera[Request Camera Permission]
    RequestCamera --> PermissionGranted{Permission Granted?}
    PermissionGranted -->|Yes| OpenVideo[Open Camera Video Stream]
    PermissionGranted -->|No| ShowError[Show Error Message]
    ShowError --> End1([End])
    
    OpenVideo --> DisplayPreview[Display Live Preview]
    DisplayPreview --> CaptureButton[User Clicks Capture]
    CaptureButton --> CaptureFrame[Capture Video Frame]
    CaptureFrame --> CreateCanvas[Create Canvas Element]
    CreateCanvas --> DrawImage[Draw Frame to Canvas]
    DrawImage --> ConvertBlob[Convert to Blob]
    ConvertBlob --> CreateFile[Create File Object]
    CreateFile --> ProcessFile
    
    Option2 --> OpenFilePicker[Open File Picker]
    OpenFilePicker --> SelectFile[User Selects File]
    SelectFile --> ValidateFile{Valid File Type?}
    ValidateFile -->|No| ShowError2[Show Error]
    ValidateFile -->|Yes| ProcessFile[Process File]
    ShowError2 --> End2([End])
    
    ProcessFile --> ReadFile[Read File with FileReader]
    ReadFile --> ConvertBase64[Convert to Base64]
    ConvertBase64 --> SaveToOrder[Save to Order Object]
    SaveToOrder --> UpdateUI[Update UI with File Name]
    UpdateUI --> CloseCamera[Close Camera if Open]
    CloseCamera --> End3([End: File Saved])
    
    style Start fill:#e1f5ff
    style ProcessFile fill:#4CAF50,color:#fff
    style SaveToOrder fill:#2196F3,color:#fff
    style End3 fill:#e1f5ff
```

---

## 8. Filter System Flow

```mermaid
flowchart TD
    A[Raw Materials Page] --> B[Filter Dropdown]
    B --> C{Selected Filter}
    
    C -->|All| D[Show All Materials]
    C -->|Low Stock| E[Filter: stock < minStock]
    C -->|Supplier Materials| F[Filter: source = supplier]
    C -->|Inhouse| G[Filter: source = inhouse]
    
    D --> H[Apply Search Filter]
    E --> H
    F --> H
    G --> H
    
    H --> I[Display Filtered Results]
    I --> J[Apply Pagination]
    J --> K[Render Table]
    
    K --> L[Apply Visual Indicators]
    L --> M[Low Stock: Red Background]
    L --> N[Source Badges: Blue/Green]
    L --> O[Warning Icons]
    
    B --> P[Update URL Parameter]
    P --> Q[Persist Filter State]
    Q --> R[On Page Reload: Restore Filter]
    
    style B fill:#2196F3,color:#fff
    style E fill:#f44336,color:#fff
    style I fill:#4CAF50,color:#fff
    style L fill:#FF9800,color:#fff
```

---

## 9. Complete User Journey Flow

```mermaid
journey
    title Complete User Journey: From Login to Order Fulfillment
    section Login
      Access System: 5: User
      View Dashboard: 5: User
    section Inventory Management
      View Low Stock Alerts: 4: User
      Navigate to Raw Materials: 5: User
      Filter Low Stock Items: 5: User
      Create Purchase Order: 4: User
    section Purchase Process
      Select Supplier: 5: User
      Add Items: 5: User
      Submit Order: 4: User
      Wait for Delivery: 3: System
    section Inspection
      Receive Order: 5: User
      Inspect Items: 5: User
      Upload Invoice: 5: User
      Save Inspection: 4: User
    section Stock Update
      Handle Excess Items: 4: User
      Update Inventory: 5: System
      View Updated Stock: 5: User
```

---

## 10. Component Hierarchy

```mermaid
graph TD
    App[App.jsx] --> Router[React Router]
    Router --> ProtectedRoute[ProtectedRoute]
    ProtectedRoute --> Layout[Layout Component]
    
    Layout --> Sidebar[Sidebar]
    Layout --> Header[Header]
    Layout --> Outlet[Outlet - Route Content]
    
    Outlet --> InventoryDashboard[Inventory Dashboard]
    Outlet --> RawMaterials[Raw Materials]
    Outlet --> PurchaseOrders[Purchase Orders]
    Outlet --> CustomerOrders[Customer Orders]
    Outlet --> OtherModules[Other Modules...]
    
    RawMaterials --> MaterialForm[Add/Edit Material Form]
    RawMaterials --> MaterialTable[Materials Table]
    RawMaterials --> FilterDropdown[Filter Dropdown]
    
    PurchaseOrders --> OrderForm[Order Form]
    PurchaseOrders --> InspectionModal[Inspection Modal]
    PurchaseOrders --> CameraModal[Camera Modal]
    PurchaseOrders --> ExcessModal[Excess Items Modal]
    
    InspectionModal --> CameraButton[Camera Button]
    InspectionModal --> FileUploadButton[File Upload Button]
    InspectionModal --> DamageForm[Damage Form]
    
    CameraModal --> VideoElement[Video Element]
    CameraModal --> CaptureButton[Capture Button]
    
    style App fill:#4CAF50,color:#fff
    style Layout fill:#2196F3,color:#fff
    style PurchaseOrders fill:#FF9800,color:#fff
```

---

## 11. State Management Flow

```mermaid
stateDiagram-v2
    [*] --> InitialState
    
    InitialState --> LoadingData: Fetch Data
    LoadingData --> DataLoaded: Data Ready
    
    DataLoaded --> ViewingList: User Views List
    DataLoaded --> CreatingNew: User Creates New
    DataLoaded --> EditingItem: User Edits Item
    DataLoaded --> Filtering: User Applies Filter
    
    ViewingList --> Filtering: Apply Filter
    ViewingList --> CreatingNew: Click Add
    ViewingList --> EditingItem: Click Edit
    
    CreatingNew --> FormOpen: Form Modal Opens
    EditingItem --> FormOpen: Form Modal Opens
    
    FormOpen --> FillingForm: User Fills Form
    FillingForm --> Submitting: User Submits
    Submitting --> Validating: Validate Data
    Validating --> Saving: Save to State
    Validating --> FormError: Validation Error
    FormError --> FillingForm: Fix Errors
    
    Saving --> DataUpdated: Update State
    DataUpdated --> ViewingList: Return to List
    
    Filtering --> FilteredView: Show Filtered Results
    FilteredView --> ViewingList: Clear Filter
    
    FilteredView --> CreatingNew: Create from Filter
    FilteredView --> EditingItem: Edit from Filter
```

---

## 12. Technology Stack Visualization

```mermaid
graph TB
    subgraph "Core Framework"
        A[React 18.2.0]
        B[React Router 6.20.0]
        C[Vite 5.0.8]
    end
    
    subgraph "UI Libraries"
        D[Lucide React Icons]
        E[Recharts Charts]
        F[Custom CSS]
    end
    
    subgraph "PDF & Files"
        G[jsPDF 3.0.4]
        H[jsPDF-AutoTable]
        I[FileReader API]
        J[Canvas API]
    end
    
    subgraph "Browser APIs"
        K[MediaDevices API]
        L[FileReader API]
        M[Canvas API]
        N[URL API]
    end
    
    A --> B
    A --> C
    A --> D
    A --> E
    A --> F
    
    G --> H
    I --> G
    J --> G
    
    K --> Camera[Camera Feature]
    L --> FileUpload[File Upload]
    M --> ImageProcessing[Image Processing]
    N --> Routing[URL Routing]
    
    style A fill:#61DAFB,color:#000
    style G fill:#FF6B6B,color:#fff
    style K fill:#4ECDC4,color:#fff
```

---

## How to Use These Diagrams

### Option 1: Mermaid Live Editor
1. Go to https://mermaid.live/
2. Copy any diagram code
3. Paste and view/export as PNG/SVG

### Option 2: VS Code Extension
1. Install "Markdown Preview Mermaid Support" extension
2. Open this file in VS Code
3. Preview to see rendered diagrams

### Option 3: GitHub/GitLab
- These diagrams render automatically in markdown files on GitHub/GitLab

### Option 4: Online Converters
- Use tools like:
  - https://mermaid.ink/
  - https://kroki.io/
  - Various Mermaid to image converters

---

## Diagram Descriptions

1. **System Architecture Overview**: High-level view of the entire system structure
2. **Inventory Module Flow**: Detailed flow of inventory management features
3. **Purchase Order Workflow**: Step-by-step purchase order process
4. **Low Stock Alert Flow**: How low stock alerts work and navigate
5. **Data Flow Architecture**: How data moves through the system
6. **Module Interaction Flow**: How different modules interact
7. **File Upload Flow**: Camera and file upload process
8. **Filter System Flow**: How filtering works in Raw Materials
9. **Complete User Journey**: User experience flow
10. **Component Hierarchy**: React component structure
11. **State Management Flow**: State transitions in the application
12. **Technology Stack Visualization**: Technologies used and their relationships

---

**Note**: All diagrams use Mermaid syntax which is widely supported. You can copy any diagram code and use it in documentation tools, presentations, or convert to images using online tools.

