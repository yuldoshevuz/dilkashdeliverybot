import bot from "./core/bot.js"
import "./index.js"

bot.launch(() => {
    console.log("Bot launched", new Date())
})