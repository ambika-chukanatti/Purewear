import jwt from "jsonwebtoken";

const verifyToken = (req,res,next) => {
    console.log(req.cookies);
    const token = req.cookies.access_token;
    if(!token){
        return res.status(401).json({ success: false, message: "Access denied. No token provided."})
    }

    jwt.verify(token, process.env.JWT_KEY, (err, decoded)=> {
        if (err) {
            return res.status(401).json({ success: false, message: "Token expired. Please log in again." });
          } 
        req.user = decoded;
        next();
    });
}

export default verifyToken;