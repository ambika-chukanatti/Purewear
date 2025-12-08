import { User } from "../../../mongodb/models/user.model.js";

const getCheckout = async(req,res) => {
    const { id } = req.user;

    try{
        const user = await User.findById(id);
        console.log(user)

        if(!user){
            return res.status(404).json({ success: false, message: "User not found"});
        }

        return res.status(200).json({ success: true, data: user.checkout });
    }catch(err){
        console.log(err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

const createCheckout = async(req,res) => {
    const { id } = req.user;
    const { cartItems, totalAmount } = req.body;

    try{
        const user = await User.findById(id);

        if(!user){
            return res.status(404).json({ success: false, message: "User not found"});
        }

        user.checkout = {
            cartItems,
            totalAmount
        };

        await user.save();

        return res.status(201).json({ success: true, data: user.checkout });
    }catch(err){
        console.log(err)
        return res.status(500).json({ success: false, message: err });
    }
}

const updateCheckout = async(req,res) => {
    const { id } = req.user;
    const { cartItems, totalAmount, address, paymentMethod } = req.body;

    try{
        const user = await User.findById(id);

        if(cartItems){
            user.checkout.cartItems = cartItems;
        }
        if(totalAmount){
            user.checkout.totalAmount = totalAmount;
        }
        if(address){
            user.checkout.address = address;
        }
        if(paymentMethod){
            user.checkout.paymentMethod = paymentMethod;
        }

        await user.save();

        return res.status(200).json({ success: true, data: user.checkout });
    }catch(err){
        console.log(err)
        return res.status(500).json({ success: false, message: err });
    }
};

const clearCheckout = async(req,res) => {
    const { id } = req.user;

    try{
        const user = await User.findById(id);
        
        user.checkout = {};
        await user.save();

        return res.status(200).json({ success: true, data: user.checkout });
    }catch(err){
        console.log(err)
        return res.status(500).json({ success: false, message: err.message });
    }
};


export { getCheckout, updateCheckout, clearCheckout, createCheckout };

