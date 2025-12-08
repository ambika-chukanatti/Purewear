import { User } from "../../mongodb/models/user.model.js";

const getUserProfile = async(req,res) => {
    const { id } = req.user;
    try{
        const user = await User.findById(id);

        if(!user){
            return res.status(404).json({ success: false, message: "User not found"});
        }

        const data = {
            fname: user.fname,
            lname: user.lname,
            phone: user.phone,
            email: user.email
        }

        return res.status(200).json({ success: true, data: data });
    }catch(err){
        return res.status(500).json({ success: false, message: err.message });
    }
};

const editUserProfile = async(req,res) => {
    const { id } = req.user;
    const { fname, lname, phone, email } = req.body;
    console.log(req.body)
    try{
        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                fname: fname,
                lname: lname,
                phone: phone,
                email: email
            },
            {
                new: true,
                runValidators: true,
                useFindAndModify: false
            }
        );

        if(!updatedUser){
            return res.status(404).json({ success: false, message: "User not found"});
        }
        
        const data = {
            fname: updatedUser.fname,
            lname: updatedUser.lname,
            phone: updatedUser.phone,
            email: updatedUser.email,
            addresses: updatedUser.addresses
        }

        return res.status(200).json({ success: true, data: data });
    }catch(err){
        console.log(err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

const deleteUserProfile = async(req,res) => {
    const { id } = req.user;
    try{
        const deletedUser = await User.findByIdAndDelete(id);

        if(!deletedUser){
            return res.status(404).json({ success: false, message: "User not found"});
        }

        return res.status(200).json({ success: true, message: "User deleted successfully" });
    }catch(err){
        return res.status(500).json({ success: false, message: err.message });
    }
};

export { getUserProfile, editUserProfile, deleteUserProfile };

