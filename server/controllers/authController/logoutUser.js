import { User } from "../../mongodb/models/user.model.js";

const logoutUser = async(req, res) => {
    const { id } = req.user;
    try{
        const user = await User.findById(id);

        if(!user){
            return res.status(401).json({ success: false, message: "Invalid logout" });
        }

        res.clearCookie('access_token', {
            domain: "purewear-client.vercel.app",
            path: "/"
        });
        
        return res.status(200).json({ success: true, message: "Logged out successfully"});
    }catch(err){
        console.log(err)
        return res.status(500).json({ success: false, message: err});
    }
};

export default logoutUser;