import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import connectDB from "./DB/connect.js";
import cookieParser from "cookie-parser";
import { socketConnection } from "./socket/socket.js";
import { createServer } from "http";
import { Server } from "socket.io";
import userRouter from "./routes/user.routes.js";
import messagesRouter from "./routes/messages.routes.js";
import dns from "dns";
import User from "./models/user.model.js";
import jwt from "jsonwebtoken";
import { configCloudinary } from "./utils/cloudinary.js";


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

io.use(async (socket, next) => {
  const token = socket.handshake.headers.cookie
    ? socket.handshake.headers.cookie.split("=")[1]
    : null;
    console.log(token)
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("_id username");

    socket.user = {
      _id: user._id.toString(),
      username: user.username,
    };
  }
  next();
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
      configCloudinary()
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
app.use("/api/messages", messagesRouter);

app.get("/", (req, res) => {
  res.send("Chat app backend running");
});
