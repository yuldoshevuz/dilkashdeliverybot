import { session } from "telegraf"
import bot from "./core/bot.js";
import { stage } from "./scenes/index.js";
import i18nInitilization from "./middlewares/i18n.middleware.js";
import isAuth from "./middlewares/auth.middleware.js";
import isAdmin from "./middlewares/admin.middleware.js";

bot.use(session());
bot.use(stage.middleware());
bot.use(isAuth);
bot.use(i18nInitilization);

bot.start(async (ctx) => ctx.scene.enter("start", { home: false }));
bot.command("admin", isAuth, isAdmin, async (ctx) => ctx.scene.enter("admin"))