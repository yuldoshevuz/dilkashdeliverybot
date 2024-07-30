import { session } from "telegraf"
import connectDB from "./config/db.js";
import bot from "./core/bot.js";

bot.use(session())

connectDB()