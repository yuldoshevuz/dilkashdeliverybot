import * as dotenv from "dotenv"
dotenv.config()

const {
    BOT_TOKEN,
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    DB_PORT,
    ERROR_CHANNEL,
    SERVER_URL,
    PORT

} = process.env

const environments = {
    BOT_TOKEN,
    PORT: PORT || 5000,
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    DB_PORT,
    ERROR_CHANNEL,
    SERVER_URL,
}

export default environments