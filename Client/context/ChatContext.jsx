import { createContext, useContext , useEffect, useState} from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

const ChatContext = createContext(null);

export const useChat = ()=>{
    return useContext(ChatContext);
}

const ChatProvider = ({ children })=>{

    const [messages , setMessages ] = useState([])
    const [users, setUsers ] = useState([]);
    const [selctedUser, setSelectedUser ] = useState(null);
    const [unseenMessages, setUnseenMessages ] = useState({});

    const {socket, axios} = useContext(AuthContext);

    //function to get all user for side bar
    const getUsers = async ()=>{
        try {
           const {data} = await axios.get("/api/messages/users")

           if(data.success){
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages)
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //function to get message for the selected user
    const getMessages = async (userId)=>{
        try {
            const {data} = await axios.get(`/api/messages/${userId}`);
            if(data.success){
                setMessages(data.messages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //funtion to send message to selected user
    const sendMessage = async (messageData)=>{
        try {
            const {data} = await axios.post(`/api/messages/send/${selctedUser._id}`, messageData);
            if(data.success){
                setMessages((prevMessages)=> [...prevMessages, data.newMessage]);
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // function to subcribe new message for selcted user
    const subscribeNewMessage = ()=>{
        if(!socket) return;
        socket.on("newMessage", (newMessage)=>{
            if(selctedUser && newMessage.senderId === selctedUser._id){
                newMessage.seen = true;
                setMessages((prevMessages)=> [...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            }
            else{
                setUnseenMessages((prevUnseenMessages)=>({
                    ...prevUnseenMessages,
                    [newMessage.senderId]: 
                    prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }
        })
    }

    //functin to unsubcribe from messages
    const unsubscribeNewMessage = ()=>{
        if(socket) socket.off("newMessage");
    }

    useEffect(()=>{
        subscribeNewMessage();
        return ()=> unsubscribeNewMessage();
    }, [socket, selctedUser]);

    const value = {
        messages,
        users,
        selctedUser,
        getUsers,
        setMessages,
        sendMessage,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}
export default ChatProvider;