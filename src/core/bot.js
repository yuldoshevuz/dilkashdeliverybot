import { Telegraf } from "telegraf"
import environments from "../config/environments.js"

const bot = new Telegraf(environments.BOT_TOKEN)

export default bot