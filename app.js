const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const PORT = 3000;
const app = express();

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});


const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ success: true, url: fileUrl });
});  

app.use('/uploads', express.static(uploadDir));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});