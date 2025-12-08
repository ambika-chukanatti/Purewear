import { User } from "../../mongodb/models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const loginUser = async(req,res)=>{
    console.log(req.body)
    const { email, password } = req.body;
    try{
        const user = await User.findOne({email:email});

        if(!user){
            return res.status(401).json({ success: false, message: "Invalid Username or Password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(isMatch){
            const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: '7d'});

            user.sessionToken = token;
            user.sessionExpiresIn = Date.now() + 300000;
            await user.save();

            res.cookie('access_token', token, {
                domain: "purewear-client.vercel.app",
                path: "/",
                maxAge: 1000 * 63 * 10,
                httpOnly: true,
                secure: true,
                sameSite: 'None',
            });
            
            return res.status(200).json({ success: true, message: "User Logged in successfully" });
        }else{
            return res.status(401).json({ success: false, message: "Invalid Username or Password" });
        }
    }catch(err){
        console.log(err)
        return res.status(500).json({ success: false, message: err});
    }
};

export default loginUser;