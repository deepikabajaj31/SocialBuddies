const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./Routes/userRoutes");
const postRouter = require("./Routes/postRoutes");
const socket = require("socket.io");

const cors = require("cors");
dotenv.config();
app.use(cors());
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB).then(() => {
      console.log("Db connected successfully");
    });
    const server = app.listen(5000, () => {
      console.log("Server is listening on port");
    });

    const io = socket(server, {
      cors: {
        origin: 'https://socialbuddies-f3e87.web.app',
        credentials: true,
      }
    })
    global.onlineUsers = new Map();
    io.on("connection", (socket) => {
      global.chatsocket = socket;
      socket.on("addUser", (id) => {
        onlineUsers.set(id, socket.id);
      })

      socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
          socket.to(sendUserSocket).emit("msg-recieve", data.message);
        }
      })
    })
  } catch (error) {
    console.log("Not connected", error);
  }
};
start();