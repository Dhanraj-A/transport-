# QUICK START GUIDE

## 🚀 Getting Started in 5 Minutes

### Step 1: MongoDB Atlas Setup (2 minutes)
1. Visit: https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create free cluster (M0)
4. Click "Connect" → "Connect your application"
5. Copy connection string (looks like: mongodb+srv://username:password@cluster.mongodb.net/)

### Step 2: Backend Setup (1 minute)
```bash
# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and paste your MongoDB connection string
# Then run:
python app.py
```

### Step 3: Frontend Setup (1 minute)
```bash
# Option 1: Open index.html in browser
# Double-click index.html

# Option 2: Use local server
python -m http.server 8000
# Then open: http://localhost:8000
```

### Step 4: Login & Use (1 minute)
- Open the website
- Login with:
  - Mobile: 9894589418
  - Password: 12345678
- Create your first invoice!

## 📁 Project Files

```
transport-invoice-system/
├── index.html         # Frontend interface
├── styles.css         # Styling
├── app.js            # Frontend logic
├── app.py            # Backend server
├── requirements.txt   # Python packages
├── .env.example      # Config template
└── README.md         # Full documentation
```

## ✏️ Customize Company Details

Edit `app.js` (around line 6):
```javascript
const COMPANY_DATA = {
    name: 'YOUR COMPANY NAME HERE',
    owner: 'Your Name',
    mobile: '+91 XXXXX XXXXX',
    address: 'Your Address',
    gstin: 'Your GSTIN'
};
```

## 🚗 Add/Change Vehicles

Edit `index.html` (find the vehicle-grid section):
```html
<label class="vehicle-option">
    <input type="radio" name="vehicle" value="YOUR_VEHICLE_NUMBER">
    <div class="vehicle-card">
        <div class="vehicle-plate">YOUR_VEHICLE_NUMBER</div>
    </div>
</label>
```

## 🔒 Change Admin Password

1. Edit MongoDB directly, OR
2. Modify `app.py` and restart server

## 🖨️ Printing Tips

- Use Chrome or Firefox
- Select A4 paper size
- Portrait orientation
- Enable background graphics for best results
- Can save as PDF

## ⚠️ Common Issues

**Can't connect to MongoDB?**
- Check connection string in .env
- Whitelist IP: 0.0.0.0/0 in MongoDB Atlas
- Verify database user credentials

**CORS errors?**
- Ensure backend is running (python app.py)
- Check API_URL in app.js matches backend

**Login not working?**
- Check browser console for errors
- Verify backend is running
- Check MongoDB connection

## 📊 Database Collections

The system creates 2 collections:
1. **invoices** - All invoice records
2. **admin** - Admin credentials

## 🎨 Features

✅ Secure login system
✅ Real-time date/time
✅ Auto invoice numbering
✅ 3 vehicle options
✅ Print-ready A4 format
✅ Cloud database (MongoDB Atlas)
✅ Responsive design

## 📞 Need Help?

Check the full README.md for:
- Detailed API documentation
- Database schema
- Security recommendations
- Advanced features
- Troubleshooting guide

---

**Enjoy your Transport Invoice System! 🚛**
