const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const salesRoutes = require('./routes/salesRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


const fs = require('fs');
const path = require('path');


app.use((req, res, next) => {
    const logMessage = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
    fs.appendFileSync(path.join(__dirname, '../server.log'), logMessage);
    console.log(logMessage.trim());
    next();
});

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


connectDB();


app.use('/api/sales', salesRoutes);


app.get('/', (req, res) => {
    res.send('Sales Analytics API is Running');
});


app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});


app.use((err, req, res, next) => {
    const errorLog = `${new Date().toISOString()} - Error: ${err.message}\n${err.stack}\n`;
    fs.appendFileSync(path.join(__dirname, '../server.log'), errorLog);
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});


// Export for Vercel
module.exports = app;

// Only listen if running directly (dev/local), not when imported by Vercel
if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
    });
}
