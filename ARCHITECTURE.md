# SYSTEM ARCHITECTURE

## 🏗️ Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      USER INTERFACE                         │
│                      (Web Browser)                          │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ LOGIN PAGE   │ │ INVOICE PAGE │ │  PRINT PAGE  │
│              │ │              │ │              │
│ • Mobile No  │ │ • Company    │ │ • A4 Format  │
│ • Password   │ │ • Vehicles   │ │ • Portrait   │
│              │ │ • Destination│ │ • Print Ready│
│              │ │ • Price      │ │              │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │
       └────────────────┼────────────────┘
                        │
                        ▼
              ┌─────────────────┐
              │   FRONTEND      │
              │   (JavaScript)  │
              │                 │
              │ • app.js        │
              │ • styles.css    │
              │ • index.html    │
              └────────┬────────┘
                       │
                       │ HTTP REST API
                       │
                       ▼
              ┌─────────────────┐
              │   BACKEND       │
              │   (Python Flask)│
              │                 │
              │ • app.py        │
              │ • Flask-CORS    │
              └────────┬────────┘
                       │
                       │ PyMongo Driver
                       │
                       ▼
              ┌─────────────────┐
              │  MONGODB ATLAS  │
              │  (Cloud DB)     │
              │                 │
              │ • invoices      │
              │ • admin         │
              └─────────────────┘
```

## 📡 API Endpoints

```
POST   /api/login              → Authenticate admin
POST   /api/invoice            → Create new invoice
GET    /api/invoices           → Get all invoices
GET    /api/invoice/:number    → Get specific invoice
GET    /api/stats              → Get statistics
GET    /api/health             → Health check
```

## 💾 Database Structure

```
MongoDB Atlas Database: transport_invoice
│
├── Collection: invoices
│   └── Document:
│       {
│         "_id": ObjectId,
│         "invoice_number": "INV-202401-0001",
│         "date": "15 Jan 2024",
│         "time": "10:30:00",
│         "vehicle_number": "TN87A4011",
│         "destination": "Chennai",
│         "price": 5000.00,
│         "company": {
│           "name": "Transport Company",
│           "owner": "Owner Name",
│           "mobile": "+91 XXXXX",
│           "address": "Address",
│           "gstin": "GSTIN"
│         },
│         "created_at": ISODate
│       }
│
└── Collection: admin
    └── Document:
        {
          "_id": ObjectId,
          "admin_number": "9894589418",
          "password": "12345678",
          "created_at": ISODate
        }
```

## 🔄 User Journey

```
1. LANDING
   ↓
2. LOGIN SCREEN
   • Enter mobile: 9894589418
   • Enter password: 12345678
   • Click "Access System"
   ↓
3. INVOICE FORM
   • Company details shown automatically
   • Select vehicle (TN87A4011, TN87E2751, TH87F9707)
   • Enter destination
   • Enter price
   • Click "Save & Preview"
   ↓
4. PRINT PREVIEW
   • Review invoice
   • Click "Print Invoice"
   • Or "New Invoice" to create another
```

## 📦 File Dependencies

```
Frontend:
  index.html
    ├── styles.css
    ├── app.js
    └── Google Fonts (Bebas Neue, Crimson Pro)

Backend:
  app.py
    ├── Flask
    ├── Flask-CORS
    ├── PyMongo
    ├── python-dotenv
    └── dnspython

Configuration:
  .env
    └── MONGODB_URI
    └── DATABASE_NAME
```

## 🎨 Design Elements

**Colors:**
- Primary: #1a1a2e (Dark blue)
- Accent: #e94560 (Red/Pink)
- Success: #00d4aa (Teal)
- Background: Gradient dark theme

**Typography:**
- Headings: Bebas Neue (Bold, uppercase)
- Body: Crimson Pro (Serif, elegant)

**Features:**
- Glassmorphism effects
- Gradient backgrounds
- Smooth animations
- Responsive grid layouts
- Print-optimized styles

## 🔐 Security Flow

```
User Login Attempt
      ↓
Frontend validates input
      ↓
POST /api/login with credentials
      ↓
Backend checks MongoDB admin collection
      ↓
If valid: Return success
If invalid: Return 401 error
      ↓
Frontend shows appropriate page
```

## 🖨️ Print Process

```
User clicks "Print Invoice"
      ↓
JavaScript triggers window.print()
      ↓
Browser print dialog opens
      ↓
CSS @media print rules activate
      ↓
- Hides buttons
- Adjusts layout for A4
- Optimizes for printing
      ↓
User prints or saves as PDF
```

---

**Built with modern web technologies for reliability and ease of use! 🚀**
