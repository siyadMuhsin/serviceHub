import nodemailer from 'nodemailer'
import crypto from 'crypto';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
export const generateOTP = () => {
    return crypto.randomInt(1000, 9999).toString(); // 6-digit OTP
};

export const sendMailer = async (email: string, otp: string) => {
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
    };
  
  
  return transporter.sendMail(mailOptions)
   


}