import * as dotenv from "dotenv"
dotenv.config()

const {
    BOT_TOKEN,
    DB_URI,
    ERROR_CHANNEL,
    SERVER_URL,
    PORT
} = process.env

const environments = {
    BOT_TOKEN,
    DB_URI,
    ERROR_CHANNEL,
    SERVER_URL,
    PORT: PORT || 5000
}

export default environments