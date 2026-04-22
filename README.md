# Transport Invoice Management System

A single-page web application for managing transport invoices with login authentication, invoice generation, and print functionality.

## Features

- **Secure Login**: Admin authentication with mobile number and password
- **Invoice Generation**: Create invoices with vehicle selection, destination, and pricing
- **Print Ready**: A4 portrait format invoice printing
- **MongoDB Atlas**: Cloud database for storing invoices
- **Real-time Updates**: Dynamic date, time, and invoice numbering
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- HTML5
- CSS3 (Custom styling with gradients and animations)
- Vanilla JavaScript
- Google Fonts (Bebas Neue, Crimson Pro)

### Backend
- Python 3.8+
- Flask (Web framework)
- Flask-CORS (Cross-origin resource sharing)
- PyMongo (MongoDB driver)
- MongoDB Atlas (Cloud database)

## Project Structure

```
transport-invoice-system/
├── index.html          # Main HTML file
├── styles.css          # Stylesheet
├── app.js             # Frontend JavaScript
├── app.py             # Flask backend
├── requirements.txt    # Python dependencies
├── .env.example       # Environment variables template
└── README.md          # This file
```

## Setup Instructions

### 1. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or login
3. Create a new cluster (Free tier M0 is sufficient)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<username>` and `<password>` with your database credentials

### 2. Backend Setup

1. Install Python 3.8 or higher

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Edit `.env` and add your MongoDB Atlas connection string:
```
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=transport_invoice
```

5. Run the Flask server:
```bash
python app.py
```

The server will start on `http://localhost:5000`

### 3. Frontend Setup

1. Open `index.html` in a web browser, or
2. Use a local server:

**Using Python:**
```bash
python -m http.server 8000
```
Then open `http://localhost:8000`

**Using Node.js (if installed):**
```bash
npx http-server
```

## Default Login Credentials

- **Admin Mobile**: 9894589418
- **Password**: 12345678

## Company Details Configuration

Edit the `COMPANY_DATA` object in `app.js` to customize company information:

```javascript
const COMPANY_DATA = {
    name: 'YOUR COMPANY NAME',
    owner: 'Owner Name',
    mobile: '+91 XXXXX XXXXX',
    address: 'Your Address',
    gstin: 'Your GSTIN Number'
};
```

## Vehicle Configuration

The system comes with three pre-configured vehicles:
- TN87A4011
- TN87E2751
- TH87F9707

To add or modify vehicles, edit the vehicle options in `index.html`:

```html
<label class="vehicle-option">
    <input type="radio" name="vehicle" value="NEW_VEHICLE_NUMBER" required>
    <div class="vehicle-card">
        <div class="vehicle-plate">NEW_VEHICLE_NUMBER</div>
    </div>
</label>
```

## Usage

### Creating an Invoice

1. **Login**: Enter admin credentials
2. **Select Vehicle**: Choose from available vehicles
3. **Enter Destination**: Type the destination address
4. **Enter Price**: Input the trip cost
5. **Save**: Click "Save & Preview"
6. **Print**: Review and print the invoice

### Printing

The invoice is designed for A4 portrait format. Use the browser's print function:
- Click "Print Invoice" button
- Or use Ctrl+P (Windows) / Cmd+P (Mac)
- Select your printer or "Save as PDF"

## API Endpoints

### POST /api/login
Login authentication
```json
{
  "admin_number": "9894589418",
  "password": "12345678"
}
```

### POST /api/invoice
Create new invoice
```json
{
  "invoice_number": "INV-202401-0001",
  "date": "15 Jan 2024",
  "time": "10:30:00",
  "vehicle_number": "TN87A4011",
  "destination": "Chennai",
  "price": 5000.00,
  "company": { ... }
}
```

### GET /api/invoices
Retrieve all invoices (with pagination)
- Query params: `limit`, `skip`

### GET /api/invoice/:invoice_number
Get specific invoice

### GET /api/stats
Get statistics (total invoices, revenue, vehicle-wise breakdown)

### GET /api/health
Server health check

## Database Schema

### Invoices Collection
```javascript
{
  "_id": ObjectId,
  "invoice_number": String,
  "date": String,
  "time": String,
  "vehicle_number": String,
  "destination": String,
  "price": Number,
  "company": {
    "name": String,
    "owner": String,
    "mobile": String,
    "address": String,
    "gstin": String
  },
  "created_at": DateTime
}
```

### Admin Collection
```javascript
{
  "_id": ObjectId,
  "admin_number": String,
  "password": String,
  "created_at": DateTime
}
```

## Security Notes

⚠️ **Important**: This is a basic implementation. For production use:

1. **Use proper password hashing** (bcrypt, argon2)
2. **Implement JWT tokens** for session management
3. **Add HTTPS** for secure connections
4. **Use environment variables** for all sensitive data
5. **Add rate limiting** to prevent brute force attacks
6. **Implement proper user roles** and permissions
7. **Add input validation** and sanitization
8. **Enable MongoDB authentication** and network restrictions

## Troubleshooting

### MongoDB Connection Error
- Verify connection string in `.env`
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for testing)
- Ensure database user has proper permissions

### CORS Error
- Make sure Flask server is running
- Check API_URL in `app.js` matches your backend URL
- Verify Flask-CORS is installed

### Print Layout Issues
- Use Chrome or Firefox for best results
- Check page margins in print settings
- Ensure A4 paper size is selected

## Future Enhancements

- [ ] Invoice editing and deletion
- [ ] Customer management
- [ ] Multiple user roles
- [ ] Invoice history and search
- [ ] Email invoice functionality
- [ ] PDF export
- [ ] Dashboard with analytics
- [ ] Expense tracking
- [ ] Payment status tracking
- [ ] Multi-language support

## License

This project is open source and available for personal and commercial use.

## Support

For issues or questions, please create an issue in the repository.

---

**Created for transport and logistics businesses**
