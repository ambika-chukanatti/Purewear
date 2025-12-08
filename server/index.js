import express from "express";
import * as dotenv from "dotenv";
import cors from 'cors';
import cookieParser from "cookie-parser";

import connectDB from "./config/connectDB.js";
import product_router from "./routes/product.routes.js";
import auth_router from "./routes/auth.routes.js";
import user_router from "./routes/user.routes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors({
    origin:'https://purewear.vercel.app',
    methods: ['GET', 'POST', 'DELETE','PUT'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', auth_router);
app.use('/api/product', product_router);
app.use('/api/user', user_router);

const startserver = async() => {
    try{
        connectDB();
        app.listen(PORT, ()=>{
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    }catch(err){
        console.log(err)
    }
};

startserver();