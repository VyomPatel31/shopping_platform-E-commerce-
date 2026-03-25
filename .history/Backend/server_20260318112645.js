import dotenv from "dotenv";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import init from "./config/db.js"

dotenv.config();

const app= express();

// DB
init().then((dbStatus) => {
  const mongoDBSession = ConnectMongoDBSession(expressSession)
  const store = new mongoDBSession({
    uri:
      process.env.NODE_ENV === 'test'
        ? process.env.MONGO_URI_TEST
        : process.env.MONGO_URI,
    collection: 'Sessions',
  })

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
    console.log(`server is running on the port ${PORT}`);
})