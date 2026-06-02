from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB Atlas Configuration
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb+srv://username:password@cluster.mongodb.net/')
DATABASE_NAME = os.getenv('DATABASE_NAME', 'transport_invoice')

# Initialize MongoDB connection variables
client = None
db = None
invoices_collection = None
admin_collection = None

def get_db():
    global client, db, invoices_collection, admin_collection
    if db is not None:
        return db
    
    # Try primary MONGODB_URI
    try:
        print(f"Connecting to MongoDB URI...")
        client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=3000)
        # Force connection check
        client.server_info()
        db = client[DATABASE_NAME]
        invoices_collection = db['invoices']
        admin_collection = db['admin']
        print("Connected to MongoDB Atlas successfully!")
        return db
    except Exception as e:
        print(f"Error connecting to MongoDB Atlas: {e}")
        
        # Fallback to local MongoDB
        try:
            local_uri = "mongodb://127.0.0.1:27017/"
            print(f"Attempting fallback to local MongoDB: {local_uri}")
            client = MongoClient(local_uri, serverSelectionTimeoutMS=3000)
            client.server_info()
            db = client[DATABASE_NAME]
            invoices_collection = db['invoices']
            admin_collection = db['admin']
            print("Connected to local MongoDB successfully!")
            return db
        except Exception as local_err:
            print(f"Failed to connect to local MongoDB: {local_err}")
            # Keep variables as None, do not crash the process.
            # Route handlers will return 503 Service Unavailable if they need DB.
            return None

# Admin credentials (stored in database)
ADMIN_NUMBER = "9894589418"
ADMIN_PASSWORD = "12345678"

# Initialize admin user in database
def initialize_admin():
    try:
        get_db()
        if admin_collection is not None:
            admin = admin_collection.find_one({"admin_number": ADMIN_NUMBER})
            if not admin:
                admin_collection.insert_one({
                    "admin_number": ADMIN_NUMBER,
                    "password": ADMIN_PASSWORD,
                    "created_at": datetime.utcnow()
                })
                print("Admin user initialized")
    except Exception as e:
        print(f"Warning: Could not initialize admin user: {e}")

initialize_admin()

@app.route('/api/login', methods=['POST'])
def login():
    """Handle admin login"""
    try:
        get_db()
        if admin_collection is None:
            return jsonify({
                "success": False,
                "message": "Database connection not available"
            }), 503
            
        data = request.json
        admin_number = data.get('admin_number')
        password = data.get('password')
        
        # Verify credentials
        admin = admin_collection.find_one({
            "admin_number": admin_number,
            "password": password
        })
        
        if admin:
            return jsonify({
                "success": True,
                "message": "Login successful"
            })
        else:
            return jsonify({
                "success": False,
                "message": "Invalid credentials"
            }), 401
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@app.route('/api/next-invoice-number', methods=['GET'])
def next_invoice_number():
    """Get next sequential invoice number for a specific company"""
    try:
        get_db()
        if invoices_collection is None:
            return jsonify({"success": False, "message": "Database connection not available"}), 503
            
        company_name = request.args.get('company', '')
        if not company_name:
            return jsonify({"success": False, "message": "Company name required"}), 400

        # Find the highest invoice_seq for this company
        last_invoice = invoices_collection.find_one(
            {"company.name": company_name},
            sort=[("invoice_seq", -1)]
        )

        next_num = 1
        if last_invoice and "invoice_seq" in last_invoice:
            next_num = last_invoice["invoice_seq"] + 1

        return jsonify({
            "success": True,
            "next_number": next_num
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@app.route('/api/invoice', methods=['POST'])
def create_invoice():
    """Create and save new invoice"""
    try:
        get_db()
        if invoices_collection is None:
            return jsonify({"success": False, "message": "Database connection not available"}), 503
            
        data = request.json
        
        # Add timestamp
        data['created_at'] = datetime.utcnow()
        
        # Insert into database
        result = invoices_collection.insert_one(data)
        
        return jsonify({
            "success": True,
            "message": "Invoice saved successfully",
            "invoice_id": str(result.inserted_id)
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@app.route('/api/invoices', methods=['GET'])
def get_invoices():
    """Get all invoices"""
    try:
        get_db()
        if invoices_collection is None:
            return jsonify({"success": False, "message": "Database connection not available"}), 503
            
        # Get query parameters for filtering
        limit = int(request.args.get('limit', 100))
        skip = int(request.args.get('skip', 0))
        
        # Fetch invoices
        invoices = list(invoices_collection.find()
                       .sort('created_at', -1)
                       .skip(skip)
                       .limit(limit))
        
        # Convert ObjectId to string
        for invoice in invoices:
            invoice['_id'] = str(invoice['_id'])
            if 'created_at' in invoice:
                invoice['created_at'] = invoice['created_at'].isoformat()
        
        return jsonify({
            "success": True,
            "invoices": invoices,
            "count": len(invoices)
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@app.route('/api/invoice/<invoice_number>', methods=['GET'])
def get_invoice(invoice_number):
    """Get specific invoice by invoice number"""
    try:
        get_db()
        if invoices_collection is None:
            return jsonify({"success": False, "message": "Database connection not available"}), 503
            
        invoice = invoices_collection.find_one({"invoice_number": invoice_number})
        
        if invoice:
            invoice['_id'] = str(invoice['_id'])
            if 'created_at' in invoice:
                invoice['created_at'] = invoice['created_at'].isoformat()
            
            return jsonify({
                "success": True,
                "invoice": invoice
            })
        else:
            return jsonify({
                "success": False,
                "message": "Invoice not found"
            }), 404
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get invoice statistics"""
    try:
        get_db()
        if invoices_collection is None:
            return jsonify({"success": False, "message": "Database connection not available"}), 503
            
        total_invoices = invoices_collection.count_documents({})
        
        # Calculate total revenue
        pipeline = [
            {
                "$group": {
                    "_id": None,
                    "total_revenue": {"$sum": "$price"}
                }
            }
        ]
        
        result = list(invoices_collection.aggregate(pipeline))
        total_revenue = result[0]['total_revenue'] if result else 0
        
        # Get invoices by vehicle
        vehicle_pipeline = [
            {
                "$group": {
                    "_id": "$vehicle_number",
                    "count": {"$sum": 1},
                    "revenue": {"$sum": "$price"}
                }
            }
        ]
        
        vehicle_stats = list(invoices_collection.aggregate(vehicle_pipeline))
        
        return jsonify({
            "success": True,
            "stats": {
                "total_invoices": total_invoices,
                "total_revenue": total_revenue,
                "vehicle_stats": vehicle_stats
            }
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    get_db()
    db_connected = False
    try:
        if client and client.server_info():
            db_connected = True
    except Exception:
        pass
        
    return jsonify({
        "success": True,
        "message": "Server is running",
        "database": "connected" if db_connected else "disconnected"
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
