import mongoose from 'mongoose'
import chalk from 'chalk'

const connectDB = async (): Promise<string> => {
  try {
    const mongoURI: string =
      process.env.NODE_ENV === 'test'
        ? (process.env.MONGO_URI_TEST as string)
        : (process.env.MONGO_URI as string)

    const conn = await mongoose.connect(mongoURI, {
      autoIndex: true,
    })

    console.log(chalk.green.bold('✅ MongoDB Connected'))
    console.log(chalk.yellow(`Host: ${conn.connection.host}`))
    console.log(chalk.yellow(`Database: ${conn.connection.name}`))

    return 'Connected'
  } catch (error) {
    console.log(chalk.red.bold('❌ MongoDB Connection Failed'))
    const err = error as Error
    console.error(err.message)

    process.exit(1) // stop server if DB fails
  }
}

export default connectDB
