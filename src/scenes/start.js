import { BaseScene } from "telegraf/scenes";
import { backInlineKeyboard, buttons, locationSocialMediaKeyboard, ourLocationsKeyboard, startKeyboard } from "../utils/keyboards.js";
import i18n from "../config/i18n.config.js";
const startScene = new BaseScene("start")

startScene.enter(async (ctx) => {
    await ctx.reply(i18n.t("selectOptions"),
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
            return await ctx.scene.enter("settings")
        } else if (button === buttons.location_contact[lang]) {
            await ctx.replyWithPhoto("https://t.me/botcontents/167", {
                caption: i18n.t("locationContactText"),
                parse_mode: "HTML",
                ...locationSocialMediaKeyboard(ctx.session.lang)
            });
            ctx.session.locationSended = false;
        }
    } catch (error) {
        console.log(error)
    }
});

startScene.action(async (callbackData, ctx) => {
    try {
        ctx.answerCbQuery();
        const [ cursor, latitude, longitude ] = callbackData.split(":");
        const [ , data ] = callbackData.split(":");


        if (cursor === "ourLocation" && !ctx.session.locationSended) {
            await ctx.sendLocation(+latitude, +longitude,
                ourLocationsKeyboard(ctx.session.lang)
            );
            ctx.session.locationSended = true;
            return;
        }

        if (cursor === "socialMedia") {
            if(data === "back") {
                await ctx.editMessageCaption(i18n.t("locationContactText"), {
                    ...locationSocialMediaKeyboard(ctx.session.lang),
                    parse_mode: "HTML"
                });
                return;
            }

            await ctx.editMessageCaption(i18n.t("socialMediaText"), {
                ...backInlineKeyboard(ctx.session.lang, "socialMedia"),
                parse_mode: "HTML"
            });
            return;
        }
    } catch (error) {
        console.log(error)
    }
})

export default startScene;