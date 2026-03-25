import dotenv from "dotenv";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js"

dotenv.config();

const app= express();

// DB
connectDB();

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Static
app.use(express.static("src/public"))

// EJS Setup
app.set("view engine", "ejs")
app.set("views", path.join(process.cwd(), "src/views"))

import viewRoutes from "./routes/view.routes.js"
app.use("/", viewRoutes)

const PORT= process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log()
})