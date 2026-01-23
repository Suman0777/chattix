import express from "express"
import "dotenv/config"
import cors from "cors"
import http from "http"
import { env } from "process"
import { connectDB } from "./lib/db.js"
import userRouter from "./routes/userRoutes.js"
//Create The EXpress Server
const app = express();
const server = http.createServer(app);

//Create the Middle Ware
app.use(express.json({limit: "4mb"}));
app.use(cors());


//route setup
app.use("/api/status", (req, res)=> res.send("Server is Live"));
app.use("/api/auth", userRouter);

//Mongobd 
await connectDB();

const PORT = process.env.PORT || 5400;


server.listen(PORT, ()=>{
    console.log(`The Server is live on ${PORT}`)
})
