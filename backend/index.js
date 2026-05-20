import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import connectDB from "./DB/connect.js";
import cookieParser from "cookie-parser";

configDotenv();

const app = express();
const PORT = process.env.PORT || 5000;

var corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
    credentials: true
}


connectDB().then(() => {
    console.log("MongoDB Connected")
    app.listen(PORT, () => {
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