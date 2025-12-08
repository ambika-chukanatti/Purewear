import express from "express";
import verifyToken from "../middlewares/jwt.auth.js";
import { registerUser, loginUser, passwordForgot, passwordReset, passwordAuth, logoutUser } from "../controllers/authController/index.js";

const auth_router = express.Router();

auth_router.post('/login', loginUser);
auth_router.post('/signup', registerUser);
auth_router.post('/password/forgot', passwordForgot);
auth_router.post('/password/verify', passwordAuth);
auth_router.post('/password/reset', verifyToken, passwordReset);
auth_router.post('/logout', verifyToken, logoutUser);
// auth_router.post('/google/auth', googleAuth);

export default auth_router;