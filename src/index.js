import { session } from "telegraf"
import connectDB from "./config/db.js";
import bot from "./core/bot.js";
import { stage } from "./scenes/index.js";

bot.use(session())
bot.use(stage.middleware())

connectDB()