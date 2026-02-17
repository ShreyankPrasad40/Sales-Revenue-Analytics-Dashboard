const { getSalesData, saveSalesData, filterSales } = require('../config/db');
const xlsx = require('xlsx');
const fs = require('fs');


const parseDate = (dateStr) => {
    if (!dateStr) return null;
    let date;
    if (typeof dateStr === 'number') {

        date = new Date((dateStr - (25567 + 2)) * 86400 * 1000);
    } else {
        date = new Date(dateStr);
    }

    if (isNaN(date.getTime())) {
        return null;
    }
    return date.toISOString().split('T')[0];
};


const parseCurrency = (str) => {
    if (typeof str === 'number') return str;
    if (!str) return 0;
    return Number(str.toString().replace(/[₹,]/g, '').trim()) || 0;
};


const getRandomDate = () => {
    const end = new Date();
    const start = new Date();
    start.setFullYear(end.getFullYear() - 1);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
};

exports.importSalesData = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;

    try {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        if (!data.length) {
            throw new Error('File is empty');
        }

        console.log('Detected headers:', Object.keys(data[0]));




        const newSales = [];
        let idCounter = 1;



        for (const row of data) {
            try {

                const normalizedRow = {};
                Object.keys(row).forEach(key => {
                    normalizedRow[key.toLowerCase().trim()] = row[key];
                });


                const dateRaw = normalizedRow['date'] || normalizedRow['order date'] || row['Date'];
                const product = normalizedRow['product'] || normalizedRow['product_name'] || normalizedRow['product name'] || row['Product'];


                let categoryRequest = normalizedRow['category'] || row['Category'] || 'Uncategorized';
                if (typeof categoryRequest === 'string' && categoryRequest.includes('|')) {
                    categoryRequest = categoryRequest.split('|')[0].trim();
                }
                const category = categoryRequest;

                const region = normalizedRow['region'] || row['Region'] || ['North', 'South', 'East', 'West'][Math.floor(Math.random() * 4)]; // Random region if missing


                let amount = 0;
                if (normalizedRow['discounted_price']) {
                    amount = parseCurrency(normalizedRow['discounted_price']);
                } else {
                    amount = Number(normalizedRow['sales'] || normalizedRow['sales amount'] || normalizedRow['amount'] || row['Sales'] || 0);
                }


                const quantity = 1;


                const revenue = amount * quantity;

                if (!product) {
                    continue;
                }

                let parsedDate = parseDate(dateRaw);


                if (!parsedDate) {
                    parsedDate = getRandomDate();
                }
                newSales.push({
                    id: idCounter++,
                    date: parsedDate,
                    product,
                    category,
                    region,
                    sales_amount: amount,
                    quantity,
                    revenue,
                    created_at: new Date().toISOString()
                });
            } catch (e) {
                console.error('Row error', e);
            }
        }

        if (newSales.length === 0) {
            const headers = data.length > 0 ? Object.keys(data[0]).join(', ') : 'None';
            throw new Error(`No valid sales rows imported. Found headers: ${headers}.`);
        }


        const sales = newSales;
        saveSalesData(sales);

        try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch (e) { }

        res.status(200).json({ message: 'Data imported successfully', count: newSales.length });

    } catch (error) {
        console.error('Import Error:', error);
        const logContent = `${new Date().toISOString()} - Import Error: ${error.message}\n${error.stack}\n`;
        try {
            const fs = require('fs');
            const path = require('path');
            fs.appendFileSync(path.join(__dirname, '../../server.log'), logContent);
        } catch (e) { console.error("Logging failed", e); }

        res.status(500).json({ message: 'Failed to process file: ' + error.message });
    }
};

// Helper to apply implicit date range based on period (if no dates provided)
const applyPeriodFilter = (filters) => {
    // If date range is already provided, respect it
    if (filters.startDate || filters.endDate) return filters;

    const period = filters.period || 'monthly';
    const now = new Date();
    const newFilters = { ...filters };

    // Default ranges:
    // Daily -> Last 30 Days
    // Weekly -> Last 12 Weeks (approx 3 months)
    // Monthly -> Last 12 Months

    let startDate = new Date();

    switch (period) {
        case 'daily':
            startDate.setDate(now.getDate() - 30);
            break;
        case 'weekly':
            startDate.setDate(now.getDate() - (12 * 7)); // 12 weeks
            break;
        case 'monthly':
            startDate.setMonth(now.getMonth() - 12);
            break;
        default:
            return filters;
    }

    newFilters.startDate = startDate.toISOString().split('T')[0];
    // implicit end date is "now", but filterSales handles explicit endDate only.
    // If endDate is missing, filterSales doesn't filter by end date, effectively "until now".
    // but filterSales logic:
    // if (filters.endDate) ...

    return newFilters;
};

exports.getSalesStats = (req, res) => {
    try {
        let filters = req.query;
        filters = applyPeriodFilter(filters);

        const sales = getSalesData() || [];
        const filtered = filterSales(sales, filters);


        const stats = filtered.reduce((acc, curr) => {
            if (curr) {
                acc.total_sales_amount += (Number(curr.sales_amount) || 0);
                acc.total_revenue += (Number(curr.revenue) || 0);
                acc.total_quantity += (Number(curr.quantity) || 0);
            }
            return acc;
        }, { total_sales_amount: 0, total_revenue: 0, total_quantity: 0 });

        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching stats', error: err.message });
    }
};

exports.getSalesTrends = (req, res) => {

    try {
        let filters = req.query;
        const period = filters.period || 'monthly';
        filters = applyPeriodFilter(filters);

        const sales = getSalesData() || [];
        const filtered = filterSales(sales, filters);

        const groups = {};

        filtered.forEach(item => {
            let key;
            const d = new Date(item.date);

            switch (period) {
                case 'daily': key = item.date; break;
                case 'weekly':
                    const start = new Date(d.getFullYear(), 0, 1);
                    const diff = d - start;
                    const oneDay = 1000 * 60 * 60 * 24;
                    const day = Math.floor(diff / oneDay);
                    const week = Math.ceil((day + 1) / 7);
                    key = `${d.getFullYear()}-W${week}`;
                    break;
                case 'monthly':
                    key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
                    break;
                default: key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
            }

            if (!groups[key]) groups[key] = { period: key, revenue: 0, sales: 0 };
            groups[key].revenue += item.revenue;
            groups[key].sales += item.quantity;
        });

        const result = Object.values(groups).sort((a, b) => a.period.localeCompare(b.period));
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching trends', error: err.message });
    }
};

exports.getSalesDistribution = (req, res) => {

    try {
        let { type, ...filters } = req.query;
        filters = applyPeriodFilter(filters);

        const sales = getSalesData() || [];
        const filtered = filterSales(sales, filters);

        const groups = {};
        const field = type || 'category';

        filtered.forEach(item => {
            const key = item[field] || 'Unknown';
            if (!groups[key]) groups[key] = { name: key, value: 0 };
            groups[key].value += item.revenue;
        });

        const result = Object.values(groups).sort((a, b) => b.value - a.value);
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching distribution', error: err.message });
    }
};
