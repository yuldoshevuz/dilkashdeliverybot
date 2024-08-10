import { BaseScene } from "telegraf/scenes";
import { buttons, startKeyboard } from "../utils/keyboards.js";
import i18n from "../config/i18n.config.js";
const startScene = new BaseScene("start")

startScene.enter(async (ctx) => {
    const { home } = ctx.scene.state;

    if (!home) {
        await ctx.replyWithPhoto("https://t.me/botcontents/165", {
            caption: i18n.t("welcomeText"),
            parse_mode: "HTML"
        });
        return await ctx.replyWithHTML(
            i18n.t("selectOptions"),
            startKeyboard(ctx.session.lang)
        );
    }
    
    await ctx.reply(i18n.t("homeMessage"),
        startKeyboard(ctx.session.lang)
    );
});

startScene.hears(async (button, ctx) => {
    try {
        const { lang } = ctx.session;

        if (button === buttons.reservation[lang]){
            return await ctx.scene.enter("booking");
        } else if (button === buttons.rate_us[lang]) {
            return await ctx.scene.enter("rate");
        } else if (button === buttons.settings[lang]) {
            return await ctx.scene.enter("settings");
        } else if (button === buttons.abousUs[lang]) {
            return await ctx.scene.enter("aboutus");
        }
    } catch (error) {
        console.log(error)
    }
});

export default startScene;