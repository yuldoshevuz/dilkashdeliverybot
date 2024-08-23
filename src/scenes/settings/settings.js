import { BaseScene } from "telegraf/scenes";
import { buttons, settingsKeyboard } from "../../utils/keyboards.js";

const settingsScene = new BaseScene("settings");

settingsScene.enter(async (ctx) => {
    try {
        await ctx.reply(buttons.settings[ctx.session.lang],
            settingsKeyboard(ctx.session.lang)
        );
    } catch (error) {
        console.error(error);
    }
});

settingsScene.hears(async (button, ctx) => {
    try {
        const lang = ctx.session.lang;

        if (button === buttons.back[lang] || button === "/start") {
            return await ctx.scene.enter("start", { home: true });
        } else if (button === buttons.changeLanguage[lang]) {
            return await ctx.scene.enter("changeLanguage");
        } else if (button === buttons.changeAddress[lang]) {
            return await ctx.scene.enter("changeLocation");
        }
    } catch (error) {
        console.error(error)
    }
});

export default settingsScene;