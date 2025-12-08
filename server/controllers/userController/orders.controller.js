import { User, Order } from "../../mongodb/models/user.model.js";

const getOrders = async (req,res) => {
    const { id } = req.user;

    try{
        const user = await User.findById(id);

        return res.status(200).json({ success: true, orders: user.orders });
    }catch (err) {
        return res.status(500).json({ success: false, err: err.message });
        console.log(err);
    }
};

const createOrder = async(req,res) => {
    const { id } = req.user;
    const { cartItems, totalAmount, address, paymentMethod } = req.body;
    const date_ob = new Date()

    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();

    const orderTime = `${date}th ${month} ${year}`
    console.log({id,cartItems,totalAmount,address,paymentMethod,orderTime})

    try{
        const newOrder = new Order({
            uid:id,
            cartItems,
            totalAmount,
            address,
            paymentMethod,
            orderTime
        });

        await newOrder.save();

        const user = await User.findById(id);
        user.orders.push(newOrder);
        await user.save();

        return res.status(201).json({ success: true, data:newOrder});
    }catch(err){
        console.log(err);
        return res.status(500).json({ success: false, err: err.message });
    }
};

const updateOrder = async(req,res) => {
    const { oid } = req.body;

    try{
        const order = await Order.findById(oid)

        if(!order){
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export { getOrders, createOrder, updateOrder }