import { createContext, useEffect, useState } from "react";
import axios from "axios"
import toast from "react-hot-toast";
import {io} from "socket.io-client"

const backendUrl = import.meta.env.VITE_BACKEND_URL
axios.defaults.baseURL = backendUrl;


export const AuthContext = createContext(null);

export const AuthProvider = ({ children })=>{

    const [token , setToken ] = useState(localStorage.getItem("token"))
    const [authUser , setauthUser ] = useState(null)
    const [OnelineUser , setOnelineUser ] = useState([])
    const [socket , setSocket ] = useState(null)
    const [loading , setLoading ] = useState(true)

//Checking if is Authenticated or not if so , set the user data and connect the socket 
    
const checkauth = async () =>{
        try {
            const {data} = await axios.get("/api/auth/check")
            if(data.success){
                setauthUser(data.user)
                connectScoket(data.user)
            }
        } catch (error) {
            // Only show error if user has a token but it's invalid
            if(token){
                toast.error(error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    //Login function to handle user authentication and socket connection

    const login = async (state, credentials)=>{
        try {
            const {data} = await axios.post(`/api/auth/${state}`, credentials);
            if(data.success){
                setauthUser(data.userData);
                connectScoket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token" , data.token)
                toast.success(data.message)
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //Logout Function
    const logout = async ()=>{
        localStorage.removeItem("token");
        setToken(null);
        setauthUser(null);
        setOnelineUser([]);
        axios.defaults.headers.common["token"] = null;
        toast.success("Logged Out successfully")
        socket.disconnect();
    }

    //Update prfile function to handle

    const updateProfile = async (body)=>{
        try {
            const {data} = await axios.put("/api/auth/update-profile", body);
            if(data.success){
                setauthUser(data.user);
                toast.success("Profile updated Successfully");
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //connect socket function to handle socket connection and online user updated
    const connectScoket = (userData) =>{
        if(!userData || socket?.connected) return;
        const newScoket = io(backendUrl, {
            query: {
                userId: userData._id,
            }
        });
        newScoket.connect();
        setSocket(newScoket);

        newScoket.on("getOnlineUsers", (userIds)=>{
            setOnelineUser(userIds);
        })
    }

    
    useEffect(()=>{
        if(token){
            axios.defaults.headers.common["token"] = token;
            
        }
        checkauth();
    }, [])
    const value = {
        axios,
        authUser,
        OnelineUser,
        socket,
        login,
        logout,
        updateProfile,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}