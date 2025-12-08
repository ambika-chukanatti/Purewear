import express from "express";
import { getAllProducts, getProduct, postProduct, updateProduct, deleteProduct } from "../controllers/productController/product.controller.js";

const product_router = express.Router();

product_router.get('/get/all', getAllProducts);
product_router.get('/get/:pid', getProduct);
product_router.post('/create', postProduct);
product_router.put('/update/:pid', updateProduct);
product_router.delete('/delete/:pid', deleteProduct);

export default product_router

