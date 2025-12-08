import { User } from "../../mongodb/models/user.model.js";

const getWishlist = async(req,res) => {
    const { id } = req.user;
    try{
        const user = await User.findById(id);

        if(!user){
            return res.status(404).json({ success: false, message: "User not found"});
        }

        return res.status(200).json({ success: true, data: user.wishlist });
    }catch(err){
        return res.status(500).json({ success: false, message: err });
    }
};

const addToWishlist = async(req,res) => {
    try{
        const { id } = req.user;
        const { pid } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                $addToSet: { wishlist: pid}
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if(!updatedUser){
            return res.status(404).json({ success: false, message: "User not found"});
        }

        return res.status(200).json({ success: true, data: updatedUser.wishlist });
    }catch(err){
        return res.status(500).json({ success: false, message: err.message });
    }
};

const removeFromWishlist = async(req,res) => {
    try{
        const { id } = req.user;
        const { pid } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                $pull: { wishlist: pid }
            },
            {
                new: true,
            }
        );

        if(!updatedUser){
            return res.status(404).json({ success: false, message: "User not found"});
        }

        return res.status(200).json({ success: true, data: updatedUser.wishlist });
    }catch(err){
        return res.status(500).json({ success: false, message: err.message });
    }
};


export { getWishlist, addToWishlist, removeFromWishlist };

