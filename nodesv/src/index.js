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
import cron from 'node-cron';

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

app.post('/webhook', express.raw({ type: 'application/json' }), async ( req, res ) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch ( err ) {
        console.error(`Webhook Error: ${ err.message }`);
        return res.status(400).send(`Webhook Error: ${ err.message }`);
    }

    // Xử lý các sự kiện từ Stripe
    try {
        switch ( event.type ) {
            case 'invoice.payment_succeeded':
                // Cập nhật ngày hết hạn khi thanh toán thành công
                const invoice = event.data.object;
                if ( invoice.subscription ) {
                    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
                    await User.updateOne(
                        { stripeCustomerId: invoice.customer },
                        {
                            subscriptionEndDate: new Date(subscription.current_period_end * 1000),
                            isMember: true,
                            subscriptionStatus: subscription.status
                        }
                    );
                    console.log(`✅ Updated subscription for customer ${ invoice.customer } after payment success`);
                }
                break;

            case 'invoice.payment_failed':
                // Xử lý thanh toán thất bại
                const failedInvoice = event.data.object;
                if ( failedInvoice.subscription ) {
                    const user = await User.findOne({ stripeCustomerId: failedInvoice.customer });
                    if ( user ) {
                        await EmailController.sendPaymentFailureNotification({
                            email: user.email,
                            username: user.username
                        });
                        console.log(`📧 Sent payment failure email to ${ user.email }`);
                    }
                }
                break;

            case 'customer.subscription.deleted':
                // Subscription bị xóa (hết hạn hoặc bị hủy)
                const deletedSubscription = event.data.object;
                await User.updateOne(
                    { stripeCustomerId: deletedSubscription.customer },
                    { isMember: false, subscriptionStatus: 'inactive' }
                );
                console.log(`❌ Marked subscription as inactive for customer ${ deletedSubscription.customer }`);
                break;

            case 'customer.subscription.updated':
                // Subscription được cập nhật
                const updatedSubscription = event.data.object;
                await User.updateOne(
                    { stripeCustomerId: updatedSubscription.customer },
                    {
                        subscriptionEndDate: new Date(updatedSubscription.current_period_end * 1000),
                        subscriptionStatus: updatedSubscription.status
                    }
                );
                console.log(`📝 Updated subscription details for customer ${ updatedSubscription.customer }`);
                break;

            case 'customer.subscription.trial_will_end':
                // Thông báo trước khi kết thúc thời gian dùng thử (nếu có)
                const trialEndSubscription = event.data.object;
                const trialEndUser = await User.findOne({ stripeCustomerId: trialEndSubscription.customer });
                if ( trialEndUser ) {
                    await EmailController.sendTrialEndingSoon({
                        email: trialEndUser.email,
                        username: trialEndUser.username,
                        endDate: new Date(trialEndSubscription.trial_end * 1000)
                    });
                }
                break;

            default:
                console.log(`Unhandled event type: ${ event.type }`);
        }
    } catch ( error ) {
        console.error(`Error processing webhook event ${ event.type }:`, error);
        // Không trả lỗi 500 cho Stripe, vì nó sẽ thử lại sự kiện
        // Thay vào đó, chúng ta ghi log và vẫn trả về thành công
    }

    // Trả về thành công để Stripe biết rằng chúng ta đã nhận được sự kiện
    res.json({ received: true });
});

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(sessionMiddleware);

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

        // Lưu thông tin subscription
        await User.updateOne(
            { email },
            {
                isMember: true,
                subscriptionId: subscription.id,
                subscriptionStatus: 'active',
                subscriptionEndDate: new Date(subscription.current_period_end * 1000) // Chuyển timestamp sang Date
            }
        );

        req.session.user.isMember = true;

        await EmailController.sendRegistrationConfirmation({
            email: req.session.user.email,
            username: req.session.user.username,
            subscriptionEndDate: new Date(subscription.current_period_end * 1000)
        });

        res.json({
            message: 'Subscription successful',
            subscriptionId: subscription.id,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000)
        });
    } catch ( error ) {
        res.status(500).json({ error: error.message });
    }
});

// Route để hủy đăng ký nhưng vẫn duy trì đến khi hết chu kỳ
app.post('/cancel-subscription', async ( req, res ) => {
    try {
        const { email } = req.body;

        // Tìm user theo email
        const user = await User.findOne({ email });
        if ( !user?.stripeCustomerId || !user?.subscriptionId ) {
            return res.status(404).json({ error: 'User not found or not subscribed' });
        }

        // Hủy subscription nhưng đặt cancel_at_period_end thành true để duy trì đến khi hết chu kỳ
        const subscription = await stripe.subscriptions.update(user.subscriptionId, {
            cancel_at_period_end: true
        });

        // Cập nhật trạng thái subscription trong database
        await User.updateOne(
            { email },
            {
                // Không cập nhật isMember thành false ngay,
                // vì người dùng vẫn là thành viên cho đến khi hết hạn
                subscriptionStatus: 'canceled',
                // Vẫn giữ subscriptionEndDate để biết khi nào subscription thực sự kết thúc
            }
        );

        await EmailController.sendAccountCancellationConfirmation({
            email: req.session.user.email,
            username: req.session.user.username,
            endDate: new Date(subscription.current_period_end * 1000) // Thêm ngày kết thúc vào email
        });

        res.json({
            message: 'Subscription canceled successfully. Membership will remain active until the end of the billing period.',
            endDate: new Date(subscription.current_period_end * 1000)
        });

    } catch ( error ) {
        console.error('❌ Error canceling subscription:', error);
        res.status(500).json({ error: error.message });
    }
});

// Chạy mỗi ngày lúc nửa đêm
cron.schedule('0 0 * * *', async () => {
    console.log('Running membership status check cron job...');
    await checkAndUpdateMembershipStatus();
});

// Task định kỳ để kiểm tra và cập nhật trạng thái membership
async function checkAndUpdateMembershipStatus() {
    const now = new Date();

    // Tìm tất cả người dùng có subscription đã hết hạn
    const usersToUpdate = await User.find({
        isMember: true,
        subscriptionStatus: 'canceled',
        subscriptionEndDate: { $lt: now }
    });

    // Cập nhật trạng thái thành viên
    for ( const user of usersToUpdate ) {
        await User.updateOne(
            { _id: user._id },
            { isMember: false, subscriptionStatus: 'inactive' }
        );

        // Gửi email thông báo membership đã kết thúc
        await EmailController.sendMembershipEndedNotification({
            email: user.email,
            username: user.username
        });
    }

    console.log(`Updated membership status for ${ usersToUpdate.length } users`);
}

connect();
route(app);

server.listen(port, () => {
    console.log(`listen on http://localhost:${ port }`);
});
