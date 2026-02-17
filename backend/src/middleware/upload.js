const multer = require('multer');
const path = require('path');

const fs = require('fs');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isVercel = process.env.VERCEL || process.env.AWS_Region;
        const dir = isVercel ? '/tmp' : path.join(__dirname, '../../uploads');

        if (!fs.existsSync(dir)) {
            try {
                fs.mkdirSync(dir, { recursive: true });
            } catch (e) {
                console.error("Error creating upload dir", e);
            }
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});


const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.csv', '.xlsx', '.xls'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Only CSV and Excel files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        console.log('Multer processing file:', file.originalname);
        fileFilter(req, file, cb);
    },
    limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = upload;
