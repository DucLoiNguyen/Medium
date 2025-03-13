import express from "express";
import morgan from "morgan";
import http from "http";
import dotenv from "dotenv";
import route from "./routes/index.js";
import connect from "./config/db.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

dotenv.config();

const app = express();
const port = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(morgan("combined"));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Cấu hình multer để xử lý file upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'src/uploads/'); // Thư mục lưu ảnh upload
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Đặt tên file để tránh trùng lặp
    }
});

// Kiểm tra loại file
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file ảnh!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 50 }, // Giới hạn kích thước file: 5MB
    fileFilter: fileFilter
});

// API endpoint để upload ảnh
app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Vui lòng chọn file ảnh!' });
        }

        // Trả về đường dẫn của ảnh đã upload
        res.status(200).json({
            message: 'Upload thành công!',
            filePath: `/${req.file.filename}`
        });
    } catch (error) {
        res.status(500).json({
            message: 'Có lỗi khi upload ảnh!',
            error: error.message
        });
    }
});

// API endpoint để lấy danh sách ảnh đã upload
app.get('/api/images', (req, res) => {
    try {
        const files = fs.readdirSync(uploadDir);
        const images = files.map(file => ({
            name: file,
            path: `/uploads/${file}`,
            url: `http://localhost:${PORT}/${file}`
        }));

        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({
            message: 'Lỗi khi lấy danh sách ảnh',
            error: error.message
        });
    }
});

connect();
route(app);

const server = http.createServer(app);
server.listen(port, () => {
    console.log(`listen on http://localhost:${port}`);
});
