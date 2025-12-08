import { User } from "../../mongodb/models/user.model.js";
import crypto from "crypto"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"

const passwordForgot = async(req,res) => {
    const { email } = req.body;

    try{
        const user = await User.findOne({ email: email });
        if(!user){
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const otp = crypto.randomInt(100000, 1000000);
        user.sessionToken = otp;
        user.sessionExpiresIn = Date.now() + 300000;
        await user.save();
        
        const transporter = nodemailer.createTransport({
            secure: true,
            host: 'smtp.gmail.com',
            port: 465,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            to: email,
            from: process.env.EMAIL_USER,
            subject: "Password Reset",
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <p>You are receiving this because you have requested the reset of the password for your account.</p>
                <p style="font-size: 14px; font-weight: bold; color: #333;">
                    Your OTP for password reset is: <span style="font-size: 18px;">${otp}</span>
                </p>
                <p>This verification code will expire in 10 minutes.</p>
                <p>Thanks!<br>Team PUREWEAR</p>
            </div>
        `
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, message: "OTP sent successfully" });
    }catch(err){
        console.log(err)
        return res.status(500).json({ success: false, message: err});
    }
};

const passwordAuth = async(req,res)=>{
    const { otp } = req.body;
    
    try{
        const user = await User.findOne({
            sessionToken: otp,
            sessionExpiresIn: { $gt: Date.now() },
        });

        if(!user){
            return res.status(400).json({ success: false, message: "Password reset is invalid or has expired" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: '5m'});
        
        user.sessionToken = undefined;
        user.sessionExpiresIn = undefined;
        res.cookie('access_token', token, {
            domain: "purewear-client.vercel.app",
            path: "/",
            maxAge: 1000 * 63 * 10,
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        });
        await user.save();

        return res.status(200).json({ success: true, message: "Email verified successfully"});
    }catch(err){
        console.log(err)
        return res.status(500).json({ success: false, message: err});
    }
};

const passwordReset = async(req,res)=>{
    const { id } = req.user;
    const { password } = req.body;
    console.log({ id, password });

    try{
        const user = await User.findById(id);

        if (!user){
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const hashedPassword = await bcrypt.hash(password, 4);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ success:true, message: "Password has been reset successfully"});
    }catch(err){
        console.log(err)
        return res.status(500).json({ success: false, message: err});
    }
};

export { passwordForgot, passwordAuth, passwordReset };