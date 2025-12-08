import express from "express";
import verifyToken from "../middlewares/jwt.auth.js";
import { getUserProfile, editUserProfile, deleteUserProfile } from "../controllers/userController/profile.controller.js";
import { getWishlist, addToWishlist, removeFromWishlist } from "../controllers/userController/index.js";
import { removeCartItem, updateCartItem, clearCart, getCart, addCartItem } from "../controllers/userController/checkout/cart.controller.js";
import { clearCheckout, updateCheckout, getCheckout, createCheckout } from "../controllers/userController/checkout/checkout.controller.js";
import { getAddress, addAddress, editAddress, removeAddress } from "../controllers/userController/checkout/address.controller.js";
import createPaymentIntent from "../controllers/userController/checkout/payment.controller.js";
import { createOrder, getOrders, updateOrder } from "../controllers/userController/orders.controller.js";

const user_router = express.Router();

user_router.post("/profile/get", verifyToken, getUserProfile);
user_router.post("/profile/update", verifyToken, editUserProfile);
user_router.post("/profile/remove", verifyToken, deleteUserProfile);

user_router.post("/address/get", verifyToken, getAddress);
user_router.post("/address/add", verifyToken, addAddress);
user_router.post("/address/update", verifyToken, editAddress);
user_router.post("/address/remove", verifyToken, removeAddress);

user_router.post("/wishlist/get", verifyToken, getWishlist);
user_router.post("/wishlist/add", verifyToken, addToWishlist);
user_router.post("/wishlist/remove", verifyToken, removeFromWishlist);

user_router.post("/cart/get", verifyToken, getCart);
user_router.post("/cart/add", verifyToken, addCartItem);
user_router.post("/cart/remove", verifyToken, removeCartItem);
user_router.post("/cart/update", verifyToken, updateCartItem);
user_router.post("/cart/clear", verifyToken, clearCart);

user_router.post("/checkout/get", verifyToken, getCheckout);
user_router.post("/checkout/create", verifyToken, createCheckout);
user_router.post("/checkout/clear", verifyToken, clearCheckout);
user_router.post("/checkout/update", verifyToken, updateCheckout);

user_router.post("/cart/checkout/payment", verifyToken, createPaymentIntent);

user_router.post("/orders/get", verifyToken, getOrders);
user_router.post("/order/create", verifyToken, createOrder);
user_router.post("/order/update", verifyToken, updateOrder);

export default user_router;