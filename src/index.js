import { session } from "telegraf"
import bot from "./core/bot.js";
import { stage } from "./scenes/index.js";
import connectDB from "./config/connect.db.js";
import i18nInitilization from "./middlewares/i18n.middleware.js";
import i18n from "./config/i18n.config.js";
import isAuth from "./middlewares/auth.middleware.js";

bot.use(session());
bot.use(stage.middleware());
bot.use(isAuth);
bot.use(i18nInitilization);

bot.start(async (ctx) => ctx.scene.enter("start", { home: false }));

connectDB()