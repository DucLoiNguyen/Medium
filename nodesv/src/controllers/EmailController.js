import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

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
                subject: 'Subscription Membership',
                html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
    <div style="background-color: #1E88E5; color: white; padding: 20px; text-align: center;">
      <h1>🥳 Membership Activated!</h1>
    </div>
    <div style="padding: 24px;">
      <p>Hi <strong>${ user.username }</strong>,</p>
      <p>We're excited to let you know that your account has been successfully upgraded to a <strong>Member</strong> status.</p>

      <div style="background-color: #f1f1f1; padding: 15px; border-left: 4px solid #1E88E5; margin: 20px 0; border-radius: 5px;">
        <h3 style="margin-top: 0;">🔒 Membership Details</h3>
        <p><strong>Email:</strong> ${ user.email }</p>
        <p><strong>Status:</strong> Active Member</p>
        <p><strong>Expiration Date:</strong> ${ user.subscriptionEndDate.toLocaleDateString() }</p>
      </div>

      <p>As a member, you now have full access to exclusive features, premium content, and more. 🎉</p>
      
      <p>If you have any questions or need assistance, feel free to contact our support team anytime.</p>

      <div style="text-align: center; margin-top: 30px;">
        <a href="http://localhost:8080/home" style="
          background-color: #1E88E5;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          font-weight: bold;
          border-radius: 5px;
          display: inline-block;
        ">
          Go to Your Dashboard
        </a>
      </div>

      <p style="margin-top: 40px; font-size: 12px; color: #888; text-align: center;">
        Thank you for being a part of our community!
      </p>
    </div>
  </div>`
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
                subject: 'Cancle Membership',
                html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
    <div style="background-color: #f44336; color: white; padding: 20px; text-align: center;">
      <h1>Membership Cancelled</h1>
    </div>
    <div style="padding: 24px;">
      <p>Hi <strong>${ user.username }</strong>,</p>

      <p>We're writing to confirm that your <strong>membership</strong> has been successfully cancelled.</p>

      <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #f44336; margin: 20px 0; border-radius: 5px;">
        <h3 style="margin-top: 0;">🗓 Final Membership Details</h3>
        <p><strong>Email:</strong> ${ user.email }</p>
        <p><strong>Membership Ended On:</strong> ${ user.endDate.toLocaleDateString() }</p>
        <p><strong>Status:</strong> Inactive</p>
      </div>

      <p>You will retain access to member-only features until the end of your billing period. After that, your account will revert to a standard user status.</p>

      <p>If this was a mistake or you change your mind, you can re-subscribe anytime from your dashboard.</p>

      <div style="text-align: center; margin-top: 30px;">
        <a href="http://localhost:8080/home/your-plan" style="
          background-color: #f44336;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          font-weight: bold;
          border-radius: 5px;
          display: inline-block;
        ">
          Renew Membership
        </a>
      </div>

      <p style="margin-top: 40px; font-size: 12px; color: #888; text-align: center;">
        Thank you for being with us. We hope to see you again soon!
      </p>
    </div>
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

    async sendPasswordResetEmail( email, sessionId ) {
        try {
            const resetLink = `http://localhost:8080/reset-password?sessionId=${ sessionId }`;

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Password Reset Request',
                html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <div style="background-color: #007bff; color: white; padding: 20px; text-align: center;">
            <h1>Password Reset</h1>
          </div>
          <div style="padding: 24px;">
            <p>Hello,</p>
            <p>We received a request to reset your password for the account associated with this email address.</p>

            <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0; border-radius: 5px;">
              <p><strong>Email:</strong> ${ email }</p>
            </div>

            <p>Please click the button below to reset your password:</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${ resetLink }" style="
                background-color: #007bff;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                font-weight: bold;
                border-radius: 5px;
                display: inline-block;
              ">
                Reset Password
              </a>
            </div>

            <p>If you did not request a password reset, please ignore this email. Your account will remain secure.</p>

            <p>Thank you,<br>The Support Team</p>
          </div>
        </div>
      `
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`Email reset password đã gửi tới ${ email }`);
        } catch ( error ) {
            console.error('Lỗi gửi email reset password:', error);
            throw new Error('Không thể gửi email đặt lại mật khẩu');
        }
    }

    async sendAccountDeletionNotification( user ) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Account Deletion Confirmation',
                html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
  <div style="background-color: #d32f2f; color: white; padding: 20px; text-align: center;">
    <h1>Account Deletion Confirmation</h1>
  </div>
  <div style="padding: 24px;">
    <p>Hi <strong>${ user.username }</strong>,</p>

    <p>We're writing to confirm that your <strong>account</strong> has been successfully deleted from our platform.</p>

    <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #d32f2f; margin: 20px 0; border-radius: 5px;">
      <h3 style="margin-top: 0;">🗑️ Account Deletion Details</h3>
      <p><strong>Email:</strong> ${ user.email }</p>
      <p><strong>Deleted On:</strong> ${ new Date().toLocaleDateString() }</p>
      <p><strong>Status:</strong> Permanently Removed</p>
      ${ user.subscriptionId ? `<p><strong>Subscription:</strong> Cancelled immediately (ID: ${ user.subscriptionId })</p>` : '' }
    </div>

    <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h4 style="margin-top: 0; color: #856404;">⚠️ Important Information</h4>
      <ul style="margin: 0; padding-left: 20px; color: #856404;">
        <li>All your personal data has been permanently removed</li>
        <li>Your posts, comments, and interactions have been deleted</li>
        ${ user.subscriptionId ? '<li>Your subscription has been cancelled and you will not be charged further</li>' : '' }
        <li>This action cannot be undone</li>
      </ul>
    </div>

    <p>Thank you for being part of our community. If you decide to join us again in the future, you're always welcome to create a new account.</p>

    <div style="text-align: center; margin-top: 30px;">
      <a href="http://localhost:8080/register" style="
        background-color: #4caf50;
        color: white;
        padding: 12px 24px;
        text-decoration: none;
        font-weight: bold;
        border-radius: 5px;
        display: inline-block;
      ">
        Create New Account
      </a>
    </div>

    <p style="margin-top: 40px; font-size: 12px; color: #888; text-align: center;">
      If you have any questions about this deletion, please contact our support team.
    </p>
  </div>
</div>
`
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`Email xác nhận xóa tài khoản đã gửi tới ${ user.email }`);
        } catch ( error ) {
            console.error('Lỗi gửi email xóa tài khoản:', error);
            throw new Error('Không thể gửi email xóa tài khoản');
        }
    }
}

export default new EmailService();