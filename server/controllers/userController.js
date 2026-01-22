// SignUp new User
import bcrypt from "bcryptjs"
import User from "../models/User.js";
import { generateToken } from "../lib/util.js";

export const signup = async ()=>{
    const {fullName, email, password, bio} = req.body;

    try{
        if(!fullName || !email || !password || !bio){
            return res.json({success: false, message: "Missing detail"})
        }
        const user = await User.findOne({email});

        if(user){
            return res.json({success: false, message: "Account already exists"})
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = await User.create({
            fullName, email, password: hashedPassword, bio
        });

        const token = generateToken(newUser._id)

        res.json({success:true, userData: newUser, token, message: "Account has been created"})
    }catch(error){
        console.log(error.message)
        res.json({
            success: false,
            message: error.message
        })
    }
}


//controller to login a user
export const login = async(req, res)=>{
    try {
        const { email, password} = req.body;
        const userData = await User.findOne({email});

        const ispassCorrect = await bcrypt.compare(password, userData.password);

        if(!ispassCorrect){
            return res.json({success: false, message: "Invalid credentails"});
        }

        const token = generateToken(userData._id)

        res.json({success: true, userData, token, message: "Login Successfully"});

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "User not Created"
        })
    }
}

//Cheacking the authentication of USer

export const checkAuth = (req, res)=>{
    res.json({
        success: true,
        user: req.user
    })
}
