import * as dotenv from "dotenv"
dotenv.config()

const {
    BOT_TOKEN,
    ERROR_CHANNEL,
    SERVER_URL,
    PORT,
    ADMINS,
    CONTENTS_CHANNEL,
    CONTENTS_CHATID
} = process.env

const environments = {
    BOT_TOKEN,
    PORT: PORT || 5000,
    ERROR_CHANNEL,
    SERVER_URL,
    ADMINS: ADMINS ? ADMINS.split(",") : [],
    CONTENTS_CHANNEL,
    CONTENTS_CHATID,
    DELIVERY_COST: 5000
}

export default environments