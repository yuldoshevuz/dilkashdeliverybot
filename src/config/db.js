import mongoose from "mongoose"
import environments from "./environments.js"

const connectDB = async () => {
    try {
        await mongoose.connect(environments.DB_URI)
        console.log("DB connected successfully")
    } catch (error) {
        console.log(error)
    }
}

export default connectDB