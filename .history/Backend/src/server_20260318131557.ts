import 'dotenv/config.js'

import express, { Express, Request, Response, NextFunction } from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import session from 'express-session'
import MongoDBStore from 'connect-mongodb-session'
import rateLimit from 'express-rate-limit'
import chalk from 'chalk'
import httpStatus from 'http-status'

import connectDB from './config/db.js'
import routes from './routes/index.js'
import errorHandler from './middlewares/error.middleware.js'

// __dirname fix for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Init app
const app: Express = express()

// Rate limiter
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 50,
  message: 'Too many requests, please try again later',
})

// Start server after DB connection
connectDB().then((dbStatus: string) => {
  // Session store
  const MongoStore = MongoDBStore(session)
  const store = new MongoStore({
    uri: process.env.MONGO_URI as string,
    collection: 'sessions',
  })

  // 🔹 Middlewares
  app.use(helmet())
  app.use(morgan('dev'))
  app.use(limiter)

  app.use(bodyParser.json({ limit: '10mb' }))
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cookieParser())

  // 🔹 CORS
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    })
  )

  // 🔹 Session
  app.use(
    session({
      secret: process.env.SESSION_SECRET as string,
      resave: false,
      saveUninitialized: false,
      store,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      },
    })
  )

  // 🔹 Static Files
  app.use('/public', express.static(path.join(__dirname, 'public')))

  // 🔹 EJS Setup
  app.set('view engine', 'ejs')
  app.set('views', path.join(__dirname, 'views'))

  // 🔹 Routes
  app.use('/api', routes)

  // 🔹 EJS Routes Example
  app.get('/', (req: Request, res: Response) => {
    res.render('index', { title: 'Home Page' })
  })

  // 🔹 404 Handler
  app.use('*', (req: Request, res: Response) => {
    res.status(httpStatus.NOT_FOUND).render('error', {
      message: 'Page Not Found',
    })
  })

  // 🔹 Global Error Handler
  app.use(errorHandler)

  // Start server
  const server = app.listen(process.env.PORT || 5000, () => {
    const port = server.address()?.port

    console.log(chalk.cyan.bold('********************************'))
    console.log(chalk.green.bold('🚀 Server Started Successfully'))
    console.log(chalk.yellow.bold(`Port: ${port}`))
    console.log(chalk.yellow.bold(`Database: ${dbStatus}`))
    console.log(chalk.cyan.bold('********************************'))
  })
})

export default app
