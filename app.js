// Configuration
const API_URL = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost' 
    ? 'http://127.0.0.1:5000/api' 
    : '/api';

// Company Details — Both companies
const COMPANIES = [
    {
        name: 'SRI PADMAVATHI TRADERS',
        phone: '9894589418 / 8098338668',
        gstin: '33AOVPA1217L1Z0',
        email: 'sangeethacons@gmail.com',
        address: 'Shop No.3 & 4, Sy No.1612/1B, 1B, 1 Tambaram Main Road, Pattunoolchatram, Sriperumbudur 602 105'
    },
    {
        name: 'DHANRAJ STEEL',
        phone: '9894589418 / 8098338668',
        gstin: '33BTKPP4490F1ZH',
        email: 'sangeethacons@gmail.com',
        address: 'Shop No.3 & 4, Sy No.1612/1B, 1B, 1 Tambaram Main Road, Pattunoolchatram, Sriperumbudur 602 105'
    }
];

// State
let currentInvoiceData = null;
let selectedCompany = null;
let currentInvoiceSeq = 1;

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

function initializeApp() {
    showPage('loginPage');
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('invoiceForm').addEventListener('submit', handleInvoiceSubmit);
    setInterval(updateTime, 1000);
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

async function handleLogin(e) {
    e.preventDefault();

    const adminNumber = document.getElementById('adminNumber').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ admin_number: adminNumber, password: password })
        });

        const data = await response.json();

        if (data.success) {
            errorDiv.textContent = '';
            showCompanySelection();
        } else {
            errorDiv.textContent = data.message || 'Invalid credentials';
        }
    } catch (error) {
        errorDiv.textContent = 'Connection error. Please try again.';
        console.error('Login error:', error);
    }
}

// Company Selection
function showCompanySelection() {
    const grid = document.getElementById('companyCardsGrid');
    grid.innerHTML = '';

    COMPANIES.forEach((company, index) => {
        const card = document.createElement('div');
        card.className = 'company-select-card';
        card.onclick = () => selectCompany(index);
        card.innerHTML = `
            <div class="company-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="40" height="40">
                    <path d="M8 38h4l4-10h18v-8H12a4 4 0 0 0-4 4v14zm0 2a4 4 0 0 0 4 4h1.2a5 5 0 0 1 9.6 0h10.4a5 5 0 0 1 9.6 0H48a4 4 0 0 0 4-4v-6l-6-8H38v14H8z" fill="#e94560"/>
                    <circle cx="18" cy="44" r="3" fill="#00d4aa"/>
                    <circle cx="42" cy="44" r="3" fill="#00d4aa"/>
                </svg>
            </div>
            <h3 class="company-card-name">${company.name}</h3>
            <p class="company-card-gstin">GSTIN: ${company.gstin}</p>
            <p class="company-card-phone">${company.phone}</p>
        `;
        grid.appendChild(card);
    });

    showPage('companyPage');
}

async function selectCompany(index) {
    selectedCompany = COMPANIES[index];
    await initializeInvoicePage();
    showPage('invoicePage');
}

function switchCompany() {
    document.getElementById('invoiceForm').reset();
    showCompanySelection();
}

async function initializeInvoicePage() {
    document.getElementById('companyName').textContent = selectedCompany.name;
    document.getElementById('companyMobile').textContent = selectedCompany.phone;
    document.getElementById('gstinNumber').textContent = selectedCompany.gstin;
    document.getElementById('companyEmail').textContent = selectedCompany.email;

    // Set default source
    document.getElementById('source').value = 'PATTUNOOLCHATRAM';

    await fetchNextInvoiceNumber();
    updateDateTime();
}

async function fetchNextInvoiceNumber() {
    try {
        const response = await fetch(`${API_URL}/next-invoice-number?company=${encodeURIComponent(selectedCompany.name)}`);
        const data = await response.json();
        if (data.success) {
            currentInvoiceSeq = data.next_number;
        } else {
            currentInvoiceSeq = 1;
        }
    } catch (error) {
        console.error('Error fetching invoice number:', error);
        currentInvoiceSeq = 1;
    }
    document.getElementById('invoiceNumber').textContent = currentInvoiceSeq;
}

function updateDateTime() {
    const now = new Date();
    document.getElementById('currentDate').textContent = now.toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
    });
    document.getElementById('currentTime').textContent = now.toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
}

function updateTime() {
    const el = document.getElementById('currentTime');
    if (el) {
        el.textContent = new Date().toLocaleTimeString('en-IN', {
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    }
}

async function handleInvoiceSubmit(e) {
    e.preventDefault();

    const selectedVehicle = document.querySelector('input[name="vehicle"]:checked');
    const source = document.getElementById('source').value;
    const destination = document.getElementById('destination').value;
    const price = document.getElementById('price').value;

    if (!selectedVehicle) {
        alert('Please select a vehicle');
        return;
    }

    const invoiceData = {
        invoice_number: String(currentInvoiceSeq),
        invoice_seq: currentInvoiceSeq,
        date: document.getElementById('currentDate').textContent,
        time: document.getElementById('currentTime').textContent,
        vehicle_number: selectedVehicle.value,
        source: source,
        destination: destination,
        price: parseFloat(price),
        company: selectedCompany
    };

    try {
        const response = await fetch(`${API_URL}/invoice`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(invoiceData)
        });

        const data = await response.json();

        if (data.success) {
            currentInvoiceData = invoiceData;
            displayPrintPreview(invoiceData);
            showPage('printPage');
        } else {
            alert('Error saving invoice: ' + (data.message || 'Unknown error'));
        }
    } catch (error) {
        alert('Connection error. Please try again.');
        console.error('Save error:', error);
    }
}

function displayPrintPreview(data) {
    document.getElementById('printCompanyName').textContent = data.company.name;
    document.getElementById('printMobile').textContent = data.company.phone;
    document.getElementById('printAddress').textContent = data.company.address;
    document.getElementById('printGSTIN').textContent = data.company.gstin;
    document.getElementById('printEmail').textContent = data.company.email;

    document.getElementById('printInvoiceNum').textContent = data.invoice_number;
    document.getElementById('printDate').textContent = data.date;
    document.getElementById('printTime').textContent = data.time;

    document.getElementById('printSource').textContent = data.source;
    document.getElementById('printDestination').textContent = data.destination;
    document.getElementById('printVehicle').textContent = data.vehicle_number;
    document.getElementById('printPrice').textContent = '₹' + data.price.toFixed(2);
    document.getElementById('printTotal').textContent = data.price.toFixed(2);
}

function printInvoice() {
    window.print();
}

async function newInvoice() {
    document.getElementById('invoiceForm').reset();
    // Restore default source
    document.getElementById('source').value = 'PATTUNOOLCHATRAM';
    await fetchNextInvoiceNumber();
    updateDateTime();
    showPage('invoicePage');
}

function logout() {
    document.getElementById('loginForm').reset();
    document.getElementById('invoiceForm').reset();
    document.getElementById('loginError').textContent = '';
    selectedCompany = null;
    showPage('loginPage');
}
