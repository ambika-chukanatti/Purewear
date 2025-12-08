import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    phone: { type: Number, required: true },
    area1: { type: String, required: true },
    area2: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: Number, required: true }
});

const cartItemSchema = new mongoose.Schema({
    pid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    color: {type: String, required: true},
    size: { type: String, required: true },
    quantity: { type: Number, required: true }
}); 

const orderSchema = new mongoose.Schema({
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    cartItems: { type:[cartItemSchema], required: true},
    totalAmount: { type: Number, required: true },
    address: { type: addressSchema, required: true},
    paymentMethod: { 
        type: String,
        enum: ['card','cod'],
        required: true
    },
    orderTime: { type: String, required: true }
});

const checkoutSchema = new mongoose.Schema({
    cartItems: {type:[cartItemSchema], required:false},
    totalAmount: { type: Number },
    address: { type:addressSchema, required: false},
    paymentMethod: { 
        type: String,
        enum: ['card','cod']
    }
});

const userSchema = new mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    phone: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    sessionToken: { type: String },
    sessionExpiresIn: { type: Date },
    wishlist:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }],
    cart: [cartItemSchema],
    checkout: checkoutSchema,
    addresses: {
        addressList: [addressSchema],
        defaultAddressIndex: { type: Number, default: -1 }
    },
    orders: [orderSchema]
});

const User = mongoose.model('User', userSchema);
const Order = mongoose.model('Order', orderSchema);
const Cart = mongoose.model('Cart', cartItemSchema)

export { User, Order, Cart };