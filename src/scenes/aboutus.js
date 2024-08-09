import { BaseScene } from "telegraf/scenes";
import { backInlineKeyboard, backMainKeyboard, buttons, aboutUsKeyboard, ourLocationsKeyboard } from "../utils/keyboards.js";
import i18n from "../config/i18n.config.js";

const aboutusScene = new BaseScene("aboutus")

aboutusScene.enter(async (ctx) => {
    const { lang } = ctx.session;

    await ctx.reply(buttons.abousUs[lang],
        backMainKeyboard(lang)
    );
    await ctx.replyWithPhoto("https://t.me/botcontents/167", {
        caption: i18n.t("aboutUsText"),
        parse_mode: "HTML",
        ...aboutUsKeyboard(lang)
    });
    ctx.session.locationSended = false;
});

aboutusScene.hears(async (button, ctx) => {
    try {
        const { lang } = ctx.session;

        if (button === buttons.back_to_main_menu[lang]) {
            return await ctx.scene.enter("start", { home: true });
        }
    } catch (error) {
        console.log(error)
    }
});

aboutusScene.action(async (callbackData, ctx) => {
    try {
        ctx.answerCbQuery();
        const [ cursor, data ] = callbackData.split(":");

        if (cursor === "ourLocation" && !ctx.session.locationSended) {
            const [ latitude, longitude ] = data.split("-");

            await ctx.sendLocation(+latitude, +longitude,
                ourLocationsKeyboard(ctx.session.lang)
            );
            ctx.session.locationSended = true;
            return;
        }

        if (data === "back") {
            if (cursor === "socialMedia" || cursor === "startJob") {
                await ctx.editMessageCaption(i18n.t("aboutUsText"), {
                    ...aboutUsKeyboard(ctx.session.lang),
                    parse_mode: "HTML"
                });
                return;
            }
        }
        if (cursor === "socialMedia") {
            await ctx.editMessageCaption(i18n.t("socialMediaText"), {
                ...backInlineKeyboard(ctx.session.lang, "socialMedia"),
                parse_mode: "HTML"
            });
            return;
        }
        if (cursor === "startJob") {
            await ctx.editMessageCaption(i18n.t("startJobMessage"), {
                ...backInlineKeyboard(ctx.session.lang, "startJob"),
                parse_mode: "HTML"
            });
            return;
        }
    } catch (error) {
        console.log(error)
    }
})

export default aboutusScene;