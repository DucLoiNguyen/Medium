import express from 'express';
import morgan from 'morgan';
import http from 'http';
import dotenv from 'dotenv';
import route from './routes/index.js';
import connect from './config/db.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import session from 'express-session';
import stripePackage from 'stripe';
import User from './models/UserModel.js';
import { Server } from 'socket.io';
import EmailController from './controllers/EmailController.js';
import transporter from 'nodemailer/lib/smtp-pool/index.js';

dotenv.config();
const port = process.env.PORT;
const stripe = stripePackage('sk_test_51R2PhKPH7d6YNyhMVHxCw8sHlLZkTU8q17kLyqb4glmW2gRdriggjJPxgFEJWJKNACF5bv5S6kQkoiR9VpaYIacG006WLoBZay');

const app = express();
const server = http.createServer(app);
const sessionMiddleware = session({
    secret: 'my_flower',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 3600000 }
});

const io = new Server(server, {
    cors: { origin: 'http://localhost:8080', credentials: true, methods: ['GET', 'POST'] }
});

app.use(( req, res, next ) => {
    req.io = io;
    next();
});

io.on('connection', ( socket ) => {
    console.log('User connected:', socket.id);

    // Khi user đăng nhập, join vào room riêng
    socket.on('authenticate', ( userId ) => {
        socket.join(userId.toString());
        console.log(`User ${ userId } joined room`);
    });

    socket.emit('test', { test: 'test' });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'uploads')));
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(sessionMiddleware);

// Cấu hình multer để xử lý file upload
const storage = multer.diskStorage({
    destination: function ( req, file, cb ) {
        cb(null, 'src/uploads/images'); // Thư mục lưu ảnh upload
    },
    filename: function ( req, file, cb ) {
        cb(null, Date.now() + '-' + file.originalname); // Đặt tên file để tránh trùng lặp
    }
});

// Kiểm tra loại file
const fileFilter = ( req, file, cb ) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if ( allowedTypes.includes(file.mimetype) ) {
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
app.post('/api/upload', upload.single('image'), ( req, res ) => {
    try {
        if ( !req.file ) {
            // return res.status(400).json({ message: 'Vui lòng chọn file ảnh!' });
            return;
        }

        // Trả về đường dẫn của ảnh đã upload
        res.status(200).json({
            message: 'Upload thành công!',
            filePath: `/images/${ req.file.filename }`
        });
    } catch ( error ) {
        res.status(500).json({
            message: 'Có lỗi khi upload ảnh!',
            error: error.message
        });
    }
});

// API endpoint để lấy danh sách ảnh đã upload
app.get('/api/images', ( req, res ) => {
    try {
        const files = fs.readdirSync(uploadDir);
        const images = files.map(file => ( {
            name: file,
            path: `/uploads/${ file }`,
            url: `http://localhost:${ PORT }/${ file }`
        } ));

        res.status(200).json(images);
    } catch ( error ) {
        res.status(500).json({
            message: 'Lỗi khi lấy danh sách ảnh',
            error: error.message
        });
    }
});

// Tạo phiên thanh toán với Stripe
app.post('/create-subscription', async ( req, res ) => {
    try {
        const { email, paymentMethodId } = req.body;
        let user = await User.findOne({ email });

        if ( !user ) {
            const customer = await stripe.customers.create({
                email,
                payment_method: paymentMethodId,
                invoice_settings: { default_payment_method: paymentMethodId }
            });
            user = await User.create({ email, stripeCustomerId: customer.id });
        }

        if ( !user.stripeCustomerId ) {
            const customer = await stripe.customers.create({
                email,
                payment_method: paymentMethodId,
                invoice_settings: { default_payment_method: paymentMethodId },
            });

            // Cập nhật stripeCustomerId vào database
            user.stripeCustomerId = customer.id;
            await user.save();
        }

        const subscription = await stripe.subscriptions.create({
            customer: user.stripeCustomerId,
            items: [{ price: 'price_1R2kvbPH7d6YNyhMPjmmP4bl' }], // ID của gói subscription trên Stripe
            expand: ['latest_invoice.payment_intent'],
        });

        await User.updateOne({ email }, { isMember: true });

        req.session.user.isMember = true;

        await EmailController.sendRegistrationConfirmation({
            email: req.session.user.email,
            username: req.session.user.username
        });

        res.json({ message: 'Subscription successful', subscriptionId: subscription.id });
    } catch ( error ) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/cancel-subscription', async ( req, res ) => {
    try {
        const { email } = req.body;

        // Tìm user theo email
        const user = await User.findOne({ email });
        if ( !user?.stripeCustomerId ) {
            return res.status(404).json({ error: 'User not found or not linked to Stripe' });
        }

        // Lấy danh sách subscription đang active của user
        const subscriptions = await stripe.subscriptions.list({
            customer: user.stripeCustomerId,
            status: 'active'
        });

        // Kiểm tra nếu không có subscription nào
        if ( !subscriptions.data.length ) {
            return res.status(400).json({ error: 'No active subscription found' });
        }

        // Hủy subscription (ngay lập tức)
        const canceledSubscription = await stripe.subscriptions.cancel(subscriptions.data[0].id);

        // Cập nhật trạng thái isMember trong database
        await User.updateOne({ email }, { isMember: false });

        await EmailController.sendAccountCancellationConfirmation({
            email: req.session.user.email,
            username: req.session.user.username
        });

        res.json({
            message: 'Subscription canceled successfully',
            subscription: canceledSubscription
        });

    } catch ( error ) {
        console.error('❌ Error canceling subscription:', error);
        res.status(500).json({ error: error.message });
    }
});

connect();
route(app);

server.listen(port, () => {
    console.log(`listen on http://localhost:${ port }`);
});
