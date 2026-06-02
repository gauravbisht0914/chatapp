import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import connectDB from "./DB/connect.js";
import cookieParser from "cookie-parser";
import { socketConnection } from "./socket/socket.js";
import { createServer } from "http";
import { Server } from "socket.io";
import userRouter from "./routes/user.routes.js";
import dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);
configDotenv();

export const app = express();
const PORT = process.env.PORT || 5000;

export const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

socketConnection(io);

var corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
  credentials: true,
};

connectDB()
  .then(() => {
    console.log("MongoDB Connected");
    server.listen(PORT, () => {
      console.log(`Starting Server on ${PORT}`);
    });
  })
  .catch((e) => {
    console.log(e.message);
    process.exit(1);
  });

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", userRouter);

app.get("/", (req, res) => {
  res.send("Chat app backend running");
});
