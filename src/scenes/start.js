import { BaseScene } from "telegraf/scenes";
import { buttons, startKeyboard } from "../utils/keyboards.js";
import i18n from "../config/i18n.config.js";
import isAdmin from "../middlewares/admin.middleware.js";
const startScene = new BaseScene("start")

startScene.enter(async (ctx) => {
    const { home } = ctx.scene.state;

    if (!home) {
        await ctx.replyWithPhoto("https://t.me/botcontents/165", {
            caption: i18n.t("welcomeText"),
            parse_mode: "HTML"
        });
        return await ctx.replyWithHTML(
            `<b>${i18n.t("selectOptions")}</b>`,
            startKeyboard(ctx.session.lang)
        );
    }
    
    await ctx.reply(i18n.t("homeMessage"),
        startKeyboard(ctx.session.lang)
    );
});

startScene.command("admin", isAdmin, async (ctx) => ctx.scene.enter("admin"));

startScene.hears(async (button, ctx) => {
    try {
        const { lang } = ctx.session;

        switch (button) {
            case buttons.menu[lang]:
                return await ctx.scene.enter("menu");
            case buttons.myOrders[lang]:
                return await ctx.scene.enter("viewMyOrders");
            case buttons.reservation[lang]:
                return await ctx.scene.enter("booking");
            case buttons.rateUs[lang]:
                return await ctx.scene.enter("rate");
            case buttons.settings[lang]:
                return await ctx.scene.enter("settings");
            case buttons.abousUs[lang]:
                return await ctx.scene.enter("aboutus");    
            default:
                break;
        }
    } catch (error) {
        console.error(error)
    }
});

export default startScene;