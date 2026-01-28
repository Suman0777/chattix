import express from "express"
import "dotenv/config"
import cors from "cors"
import http from "http"
import { connectDB } from "./lib/db.js"
import userRouter from "./routes/userRoutes.js"
import messageRouter from "./routes/messageRoute.js"
import { Server } from "socket.io"

//Create The EXpress Server
const app = express();
const server = http.createServer(app);

//Initallizer socket.io server
export const io = new Server(server, {
    cors: {origin: "*"}
})

//Store online user
export const userSocketMap = {}; // {userID: socketId}


//soiket.io connecttion handdler
io.on("connection", (socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("User Connected" , userId);

    if(userId) userSocketMap[userId] = socket.id;

    // emmit
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect" , ()=>{
        console.log("User Dissconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

//Create the Middle Ware
app.use(express.json({limit: "4mb"}));
app.use(cors());


//route setup
app.use("/api/status", (req, res)=> res.send("Server is Live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

//Mongobd 
await connectDB();

if(process.env.NODE_ENV !== "production"){
    
    const PORT = process.env.PORT || 5400;
    server.listen(PORT, ()=>{
    console.log(`The Server is live on ${PORT}`)
})
}

export default server;