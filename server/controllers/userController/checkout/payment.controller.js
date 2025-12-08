import { Order, User } from "../../../mongodb/models/user.model.js";

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async(req,res) => {
    const { amount } = req.body;

    try{
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true
            }
        });

        return res.status(200).json({ success: true, clientSecret: paymentIntent.client_secret });
    }catch (err) {
        return res.status(500).json({ success: false, error: err.message });
        console.log(err)
    }
}



export default createPaymentIntent