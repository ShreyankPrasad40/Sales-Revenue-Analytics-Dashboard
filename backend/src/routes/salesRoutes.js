const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
    importSalesData,
    getSalesStats,
    getSalesTrends,
    getSalesDistribution
} = require('../controllers/salesController');

// Helper to wrap async routes
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Routes
router.post('/upload', (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            console.error('Multer Error:', err);
            return res.status(400).json({ message: err.message });
        }
        next();
    });
}, asyncHandler(importSalesData));
router.get('/stats', asyncHandler(getSalesStats));
router.get('/trends', asyncHandler(getSalesTrends));
router.get('/distribution', asyncHandler(getSalesDistribution));

module.exports = router;
