import dotenv from "dotenv";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js"

const app= express();

// DB
connectDB();

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())