import { User } from "../../mongodb/models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async(req,res)=>{
    console.log(req.body);
    const { fname, lname, email, password } = req.body;

    try{
        const user = await User.findOne({email:email});

        if(user){
            return res.status(401).json({ success: false, message: "User Already Exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 4);
        const newUser = await User.create({
            fname: fname,
            lname: lname,
            email: email,
            password: hashedPassword
        }); 

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_KEY, { expiresIn: '5m'});

        res.cookie('access_token', token, {
            domain: "purewear-client.vercel.app",
            path: "/",
            maxAge: 1000 * 63 * 10,
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        });
        
        return res.status(201).json({ success: true, message: "User registered successfully" });
        
    }catch(err){
        console.log(err)
        return res.status(500).json({ success: false, message: err});
    }
};

export default registerUser;