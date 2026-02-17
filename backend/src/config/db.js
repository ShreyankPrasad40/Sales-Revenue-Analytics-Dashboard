const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../data');
const salesFile = path.join(dbPath, 'sales.json');


if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
}


if (!fs.existsSync(salesFile)) {
    fs.writeFileSync(salesFile, JSON.stringify([]));
}


const getSalesData = () => {
    try {
        const data = fs.readFileSync(salesFile, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading DB", err);
        return [];
    }
};


const saveSalesData = (data) => {
    try {
        fs.writeFileSync(salesFile, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error saving DB", err);
    }
};


const filterSales = (sales, filters) => {
    return sales.filter(item => {
        let match = true;
        const itemDate = new Date(item.date);

        if (filters.startDate) {
            const start = new Date(filters.startDate);
            if (itemDate < start) match = false;
        }

        if (filters.endDate) {
            const end = new Date(filters.endDate);

            end.setHours(23, 59, 59, 999);
            if (itemDate > end) match = false;
        }

        if (filters.category) {
            const filterCat = filters.category.toLowerCase().trim();
            const itemCat = (item.category || '').toLowerCase();
            if (!itemCat.includes(filterCat)) match = false;
        }

        if (filters.region) {
            const filterReg = filters.region.toLowerCase().trim();
            const itemReg = (item.region || '').toLowerCase();
            if (!itemReg.includes(filterReg)) match = false;
        }

        return match;
    });
};

module.exports = {
    getSalesData,
    saveSalesData,
    filterSales,
    connectDB: () => console.log("JSON DB Adapter Ready")
};
