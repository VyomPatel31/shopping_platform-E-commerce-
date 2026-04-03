import 'dotenv/config'

import express, { Request, Response, NextFunction } from 'express'
import session from 'express-session'
import MongoDBStore from 'connect-mongodb-session'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import httpStatus from 'http-status'
import chalk from 'chalk'

import connectDB from './config/db.js'
import routes from './api/routes/index.js'
import errorHandler from './api/middlewares/error.middleware.js'

// __dirname fix for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// 🔹 Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com", process.env.BACKEND_URL || "http://localhost:5000"],
      connectSrc: ["'self'", process.env.BACKEND_URL || "http://localhost:5000"],
    },
  },
}))
app.use(cors(
  {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  }
))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Serve uploaded product images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`, req.body)
  next()
})

// 🔹 Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000,
  message: 'Too many requests, please try again later',
})
app.use('/api', limiter)

// Start server after DB connection
connectDB().then((dbStatus: string) => {
  // Session store
  const MongoStore = MongoDBStore(session)
  const store = new MongoStore({
    uri: process.env.MONGO_URI!,
    collection: 'sessions',
  })

  // 🔹 Session
  app.use(
    session({
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      store,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      },
    })
  )

  // 🔹 View Engine
  app.set('view engine', 'ejs')
  app.set('views', path.join(__dirname, 'views'))

  // 🔹 Routes
  //@ts-ignore
  app.use('/api', routes)

  // 🔹 EJS Routes Example
  app.get('/', (req, res) => {
    res.render('index', { databaseStatus: dbStatus })
  })

  // 🔹 Global Error Handler
  app.use(errorHandler)

  // Start server
  const PORT = process.env.PORT || 5000
  const server = app.listen(PORT, () => {
    console.log(chalk.cyan.bold('********************************'))
    console.log(chalk.green.bold('🚀 Server Started Successfully'))
    console.log(chalk.yellow.bold(`Port: ${PORT}`))
    console.log(chalk.yellow.bold(`Database: ${dbStatus}`))
    console.log(chalk.cyan.bold('********************************'))
  })
})

export default app 
