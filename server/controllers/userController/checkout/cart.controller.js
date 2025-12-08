import { User } from "../../../mongodb/models/user.model.js";
import Product from "../../../mongodb/models/product.model.js";

const getCart = async(req,res) => {
    const { id } = req.user;

    try{
        const user = await User.findById(id);

        if(!user){
            return res.status(404).json({ success: false, message: "User not found"});
        }

        return res.status(200).json({ success: true, data: user.cart });
    }catch(err){
        return res.status(500).json({ success: false, message: err.message });
    }
};

const addCartItem = async(req,res) => {
    const { id } = req.user;
    const { pid, color, size, quantity } = req.body;
    console.log(req.body)
    try{
        const user = await User.findById(id);

        const existingItemIndex = user.cart.findIndex(item =>
            item.pid.toString() === pid && 
            item.color === color && 
            item.size === size
        );

        const product = await Product.findById(pid);
        if(!product){
            return res.status(404).json({ success: false, message: "Product not found"});
        }

        if(existingItemIndex > -1){
            user.cart[existingItemIndex].quantity += quantity;
        }else{
            user.cart.push({ pid, color, size, quantity });
        }

        await user.save();

        return res.status(200).json({ success: true, data: user.cart });
    }catch(err){
        console.log(err)
        return res.status(500).json({ success: false, message: err.message });
    }
};

const updateCartItem = async(req,res) => {
    const { id } = req.user;
    const { cid, quantity } = req.body;

    try{
        const user = await User.findById(id);

        const itemIndex = user.cart.findIndex(item =>
            item._id.toString()===cid
        );
        const product = await Product.findById(user.cart[itemIndex].pid);

        if(itemIndex >= 0){
            if(quantity <= 0){
                user.cart.splice(itemIndex, 1);
            }else{
                if(!product){
                    console.log("triggered");
                    return res.status(404).json({ success: false, message: "Product not found"});
                }
        
                user.cart[itemIndex].quantity = quantity;
            }
            await user.save();
            return res.status(200).json({ success: true, data: user.cart });
        }else{
            return res.status(404).json({ success: false, message: "Item not found in the cart" });
        }
    }catch(err){
        return res.status(500).json({ success: false, message: err.message });
        console.log(err)
    }
};

const removeCartItem = async(req,res) => {
    const { id } = req.user;
    const { cid } = req.body;

    try{
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const index = user.cart.findIndex(item=>item._id.toString()===cid)
        if(index<0){
            return res.status(404).json({ success: false, message: "Item not found in the cart"})
        }

        user.cart.splice(index,1);
        await user.save();

        return res.status(200).json({ success: true, data: user.cart });
    }catch(err){
        return res.status(500).json({ success: false, message: err.message });
    }
};

const clearCart = async(req,res) => {
    const { id } = req.user;

    try{
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.cart = [];
        await user.save();

        return res.status(200).json({ success: true, data: user.cart });
    }catch(err){
        return res.status(500).json({ success: false, message: err });
    }
};

export { getCart, addCartItem, updateCartItem, removeCartItem, clearCart };

