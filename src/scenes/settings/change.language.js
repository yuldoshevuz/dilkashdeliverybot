import { BaseScene } from "telegraf/scenes";
import { buttons, cancelKeyboard, changeLangKeyboard } from "../../utils/keyboards.js";
import reposotory from "../../reposotory/reposotory.js";
import i18n from "../../config/i18n.config.js";

const changeLanguageScene = new BaseScene("changeLanguage");

changeLanguageScene.enter(async (ctx) => {
    const lang = ctx.session.lang;

    await ctx.reply(
        buttons.change_language[lang],
        cancelKeyboard(lang)
    );
    await ctx.reply(
        i18n.t("changeLanguage"),
        changeLangKeyboard()
    );
})

changeLanguageScene.action(async (callbackData, ctx) => {
    try {
        ctx.answerCbQuery();
        const [ cursor, data ] = callbackData.split(":");

        if (cursor === "language") {
            const userId = ctx.session.user.id;

            await reposotory.user.updateById(userId, { language: data });
            await i18n.changeLanguage(data);
            await ctx.deleteMessage();

            ctx.session.lang = data;
            await ctx.scene.enter("start", { home: true });
        }
    } catch (error) {
        console.error(error);
    }
});

changeLanguageScene.hears(async (button, ctx) => {
    const lang = ctx.session.lang;

    if (button === buttons.cancel[lang]) {
        return await ctx.scene.enter("settings");
    }
});

export default changeLanguageScene;