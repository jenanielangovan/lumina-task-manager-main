const mysql = require('mysql2');

// Configure the connection using your Workbench details
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'j22062007', // Replace with your actual password
  database: 'lumina_task_db'      // From your earlier screenshot
});

// Test the connection
db.connect((err) => {
  if (err) {
    console.error('Connection error: ' + err.message);
    return;
  }
  console.log('Connected to the MySQL database successfully!');
});

const http = require('node:http');

const hostname = '127.0.0.1';
const port = 3000;

 const server = http.createServer((req, res) => {
  // 1. CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 2. Handle the "handshake"
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 3. Your server response
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
