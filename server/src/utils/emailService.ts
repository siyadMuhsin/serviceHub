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


export const generateResetToken=()=>{
    return crypto.randomBytes(20).toString('hex')
}

export const sendResetMail=async(email:string,token:string)=>{
    const resetUrl =`http://localhost:5173/reset-password/${token}`
    const mailOptions={
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset",
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
               Please click on the following link, or paste it into your browser to complete the process:\n\n
               ${resetUrl}\n\n
               If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    }
    await transporter.sendMail(mailOptions)
}


export const sendExpertStatusUpdate = async (email: string, status: string) => {
    const subject = status === 'approved' 
        ? 'Your Expert Account Has Been Approved!' 
        : 'Your Expert Account Has Been Rejected';

    const text = status === 'approved' 
        ? `Congratulations! Your expert account has been approved. You can now log in and access all expert features.`
        : `We're sorry to inform you that your expert account request has been rejected. If you have any questions, please contact support.`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        text
    };

    await transporter.sendMail(mailOptions);
};