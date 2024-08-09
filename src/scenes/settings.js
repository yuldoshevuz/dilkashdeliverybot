import { BaseScene } from "telegraf/scenes";
import i18n from "../config/i18n.config.js";
import { buttons, cancelKeyboard, changeLangKeyboard, settingsKeyboard } from "../utils/keyboards.js";
import userRepo from "../reposotory/user.repo.js";

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
        const { lang } = ctx.session;

        if (button === buttons.change_language[lang]) {
            await ctx.reply(buttons.change_language[lang],
                cancelKeyboard(ctx.session.lang)
            );
            await ctx.reply(i18n.t("changeLanguage"),
                changeLangKeyboard()
            );
        } else if (button === buttons.back[lang] || button === "/start") {
            return await ctx.scene.enter("start", { home: true });
        } else if (button === buttons.cancel[lang]) {
            return await ctx.scene.reenter();
        }
    } catch (error) {
        console.log(error)
    }
})

settingsScene.action(async (callbackData, ctx) => {
    try {
        ctx.answerCbQuery();
        const [ cursor, data ] = callbackData.split(":");

        if (cursor === "language") {
            const userId = ctx.session.user.id;

            await userRepo.updateById(userId, { language: data });
            await i18n.changeLanguage(data);
            await ctx.deleteMessage();

            ctx.session.lang = data;
            await ctx.scene.enter("start", { home: true });
        }
    } catch (error) {
        console.log(error)
    }
})

export default settingsScene;