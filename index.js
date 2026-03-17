const express = require("express");
const { connectToDB } = require("./config/db")
const cors = require("cors");
const dotenv = require("dotenv");
const socketIo = require('socket.io');

dotenv.config();

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const userRoutes = require("./routes/userRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
app.use(express.json());
app.use(cors());
connectToDB()
// routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/menu", menuRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use((req,res,next)=>{
    req.io = io;
    next()
});

app.get("/",(req,res)=>{
    res.status(200).send("Hiii")  // ✅ SAHI: res object pe status method use karo
})
app.listen(process.env.PORT, () => {
    console.log("Server running on port " + process.env.PORT);
});