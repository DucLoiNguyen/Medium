import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import transporter from 'nodemailer/lib/smtp-pool/index.js';

dotenv.config();

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            pool: true,
            host: 'smtp-mail.outlook.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    async sendRegistrationConfirmation( user ) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Đăng Ký Tài Khoản Thành Công',
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Chào mừng ${ user.username }!</h2>
            <p>Bạn đã đăng ký tài khoản thành công trên nền tảng của chúng tôi.</p>
            <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px;">
              <strong>Thông tin tài khoản:</strong>
              <p>Tên đăng nhập: ${ user.username }</p>
              <p>Email: ${ user.email }</p>
            </div>
            <p>Cảm ơn bạn đã gia nhập cộng đồng của chúng tôi!</p>
            <a href="https://yourwebsite.com/login" style="
              display: inline-block; 
              background-color: #4CAF50; 
              color: white; 
              padding: 10px 20px; 
              text-decoration: none; 
              border-radius: 5px;
            ">
              Đăng Nhập Ngay
            </a>
          </div>
        `
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`Email xác nhận đã gửi tới ${ user.email }`);
        } catch ( error ) {
            console.error('Lỗi gửi email xác nhận:', error);
            throw new Error('Không thể gửi email xác nhận');
        }
    }

    async sendAccountCancellationConfirmation( user ) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Thông Báo Hủy Tài Khoản',
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Xác Nhận Hủy Tài Khoản</h2>
            <p>Tài khoản của bạn đã được hủy thành công.</p>
            <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px;">
              <strong>Thông tin tài khoản:</strong>
              <p>Tên đăng nhập: ${ user.username }</p>
              <p>Email: ${ user.email }</p>
              <p>Ngày hủy: ${ new Date().toLocaleDateString() }</p>
            </div>
            <p>Chúng tôi rất tiếc về quyết định của bạn. Nếu có bất kỳ vấn đề gì, hãy liên hệ với chúng tôi.</p>
          </div>
        `
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`Email xác nhận hủy đã gửi tới ${ user.email }`);
        } catch ( error ) {
            console.error('Lỗi gửi email hủy tài khoản:', error);
            throw new Error('Không thể gửi email hủy tài khoản');
        }
    }
}

export default new EmailService();