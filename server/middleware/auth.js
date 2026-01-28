import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async(req, res , next)=>{
    try {
        const token = req.headers.token;
        console.log("Token:", token);

        if(!token){
            return res.json({success: false, message: "No token provided"});
        }

        const decode = jwt.verify(token,process.env.JWT_SECRET)

        const user = await User.findById(decode.userId).select("-password");

        if(!user) return res.json({
            success: false, 
            message: "User Not found"
        })

        req.user = user;
        next();
    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: "Authantication Denaied"
        })
    }
}