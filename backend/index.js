import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import connectDB from "./DB/connect.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

configDotenv();

const app = express();
const PORT = process.env.PORT || 5000;
const server = createServer(app);

const io = new Server(server);

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});


var corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
    credentials: true
};


connectDB().then(() => {
    console.log("MongoDB Connected")
    server.listen(PORT, () => {
        console.log(`Starting Server on ${PORT}`)
    })
})
    .catch(e => {
        console.log(e.message)
        process.exit(1)
    })


app.use(cors(corsOptions))

app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(cookieParser())

app.get("/", (req, res) => {
    res.send("Chat app backend running");
});