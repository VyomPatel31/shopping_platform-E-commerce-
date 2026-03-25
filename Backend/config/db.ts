import mongoose from "mongoose"
import chalk from "chalk"

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.NODE_ENV === "test"
        ? process.env.MONGO_URI_TEST
        : process.env.MONGO_URI

    const conn = await mongoose.connect(mongoURI!, {
      autoIndex: true,
    })

    console.log(chalk.green.bold("✅ MongoDB Connected"))
    console.log(chalk.yellow(`Host: ${conn.connection.host}`))
    console.log(chalk.yellow(`Database: ${conn.connection.name}`))

    return "Connected"
  } catch (error: any) {
    console.log(chalk.red.bold("❌ MongoDB Connection Failed"))
    console.error(error.message)

    process.exit(1) // stop server if DB fails
  }
}

export default connectDB