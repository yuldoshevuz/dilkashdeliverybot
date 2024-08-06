import { initializeDatabase, sequelize } from "./db.config.js"

// Database connection async function
const connectDB = async () => {
    try {
        await sequelize.authenticate()
        await initializeDatabase()
        console.log("Connection has been established successfully.")
    } catch (error) {
        console.error("Unable to connect to the database:", error)
    }
}

export default connectDB