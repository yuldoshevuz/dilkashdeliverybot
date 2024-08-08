import { Sequelize } from "sequelize";
import environments from "./environments.js";

export const sequelize = new Sequelize({
    dialect: "postgres",
    host: environments.DB_HOST,
    port: environments.DB_PORT,
    username: environments.DB_USER,
    password: environments.DB_PASSWORD,
    database: environments.DB_NAME,
    logging: false
})

export const initializeDatabase = async () => {
    try {
        await sequelize.sync({ force: true, alter: true });
        console.log("Database synchronized");
    } catch (error) {
        console.error("Error synchronizing the database:", error);
    }
};