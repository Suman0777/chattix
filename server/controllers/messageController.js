

// Get all users except the logged in user

import Message from "../models/message.js";
import User from "../models/User.js";

export const getUserForSideBar = async (req, res)=>{
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: userId}}).select("-password");

        //Count number of messages not seen
        const unseenMessages = {}
        const promises = filteredUsers.map(async (user)=>{
            const messages =await Message.find({senderId: user._id, receiverId: userId, seen: false})
            if(messages.length > 0) {
                unseenMessages[user._id] = messages.length;

            }
        })
        await Promise.all(promises);
        res.json({
            success: true,
            user: filteredUsers,
            unseenMessages
        })
    } catch (error) {
        console.log(error.messages);
        res.json({
            success: false,
            message: error.message
        })
    }
}



// get all messages for Selected User

export const getMessage = async (req, res)=>{
    try {
        const {id: selectedUserId} = req.params
    } catch (error) {
            console.log(error.messages);
        res.json({
            success: false,
            message: error.message
        })
    }
}