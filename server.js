const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DB_FILE = path.join(__dirname, 'database.json');

// Initial seed data if database does not exist
if (!fs.existsSync(DB_FILE)) {
  const initialDb = {
    testRides: [],
    serviceEnquiries: [],
    contactEnquiries: [],
    motorcycleOrders: [],
    accessoryOrders: [],
    promotions: [
      { id: 1, title: "Black Edition Superbike Package", discount: "Save ₹85,000 on Accessories & Ceramic Protection", validUntil: "Limited Time" },
      { id: 2, title: "Carbon Racing Equipment Bundle", discount: "20% off Shoei & Alpinestars track-pack with bike purchase", validUntil: "This Month" }
    ]
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2));
}

function getDb() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (e) {
    return { testRides: [], serviceEnquiries: [], contactEnquiries: [], motorcycleOrders: [], accessoryOrders: [], promotions: [] };
  }
}

function saveDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Token');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // API Endpoints
  if (pathname.startsWith('/api/')) {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          const db = getDb();
          const timestamp = new Date().toISOString();
          const id = 'REQ-' + Math.random().toString(36).substr(2, 9).toUpperCase();

          if (pathname === '/api/test-ride') {
            const entry = { id, timestamp, status: 'Pending', ...payload };
            db.testRides.push(entry);
            saveDb(db);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, reference: id, message: 'Test-ride request received. Our dealership ride specialist will verify availability.' }));
            return;
          }

          if (pathname === '/api/service-enquiry') {
            const entry = { id, timestamp, status: 'Pending', ...payload };
            db.serviceEnquiries.push(entry);
            saveDb(db);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, reference: id, message: 'Service enquiry logged successfully. Our master service desk will contact you.' }));
            return;
          }

          if (pathname === '/api/contact-enquiry') {
            const entry = { id, timestamp, status: 'Pending', ...payload };
            db.contactEnquiries.push(entry);
            saveDb(db);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, reference: id, message: 'Your enquiry has been submitted. Our team will get back to you shortly.' }));
            return;
          }

          if (pathname === '/api/order-motorcycle') {
            const entry = { id: 'MOTO-' + Math.random().toString(36).substr(2, 8).toUpperCase(), timestamp, status: 'Under Review', ...payload };
            db.motorcycleOrders.push(entry);
            saveDb(db);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, reference: entry.id, message: 'Vehicle reservation enquiry logged. Vehicle allocated for verification.' }));
            return;
          }

          if (pathname === '/api/order-accessory') {
            const entry = { id: 'ACC-' + Math.random().toString(36).substr(2, 8).toUpperCase(), timestamp, status: 'Confirmed', ...payload };
            db.accessoryOrders.push(entry);
            saveDb(db);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, reference: entry.id, message: 'Accessory order submitted successfully.' }));
            return;
          }

          // Secure Admin Actions (Header protected)
          if (pathname === '/api/admin/status-update') {
            const token = req.headers['x-admin-token'];
            if (token !== 'apex-secret-motorcycles-2026') {
              res.writeHead(403, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Unauthorized admin access' }));
              return;
            }
            const { type, id: targetId, status } = payload;
            if (db[type]) {
              const item = db[type].find(x => x.id === targetId);
              if (item) item.status = status;
              saveDb(db);
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, updated: targetId }));
            return;
          }

          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Endpoint not found' }));
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
        }
      });
      return;
    }

    if (req.method === 'GET') {
      if (pathname === '/api/stats') {
        const db = getDb();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          testRidesCount: db.testRides.length,
          motorcycleOrdersCount: db.motorcycleOrders.length,
          accessoryOrdersCount: db.accessoryOrders.length
        }));
        return;
      }
    }
  }

  // Static File Serving
  let filePath = pathname === '/' ? '/index.html' : pathname;
  filePath = path.join(__dirname, filePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Return 404
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Motorcycles Server running at http://localhost:${PORT}`);
});
