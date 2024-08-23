import { WizardScene } from "telegraf/scenes";
import i18n from "../../config/i18n.config.js";
import { buttons, confirmOrBackKeyboard, sendLocationOrBackKeyboard } from "../../utils/keyboards.js";
import { fetchLocationAddress } from "../../helpers/index.js";
import repository from "../../repository/repository.js";

const changeLocationScene = new WizardScene("changeLocation",
    async (ctx) => {
        try {
            if (ctx.message?.location) {
                const { latitude, longitude } = ctx.message.location;

                const waiting = await ctx.reply("⏳", {
                    reply_markup: { remove_keyboard: true }
                });

                const addressLocation = await fetchLocationAddress(latitude, longitude);
                
                ctx.session.location = addressLocation;

                await ctx.deleteMessage(waiting.message_id);
                await ctx.replyWithHTML(
                    i18n.t("confirmAddress", {
                        address: addressLocation.address
                    }),
                    confirmOrBackKeyboard(ctx.session.lang)
                );

                return ctx.wizard.next();
            }

            if (ctx.message?.text) {
                const text = ctx.message.text;
                const lang = ctx.session.lang;

                if (text === buttons.back[lang]) {
                    return await ctx.scene.enter("settings");
                }
            }
        } catch (error) {
            console.error(error);
        }
    },
    async (ctx) => {
        try {
            if (ctx.callbackQuery) {
                ctx.answerCbQuery();
                const [ cursor, data ] = ctx.callbackQuery.data.split(":");
                const { user, lang, location } = ctx.session;

                if (cursor === "confirm") {
                    if (data === "back") {
                        await ctx.deleteMessage();
                        return await ctx.scene.reenter();
                    }

                    if (data === "confirm") {
                        await repository.user.updateById(user.id, { location });
                        await ctx.deleteMessage();

                        delete ctx.session.location;

                        return await ctx.scene.enter("start", { home: true });
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
);

changeLocationScene.enter(async (ctx) => {
    try {
        const { lang, user } = ctx.session;

        await ctx.replyWithHTML(
            i18n.t("locationInfoAndChange", {
                address: user.location.address
            }),
            sendLocationOrBackKeyboard(lang)
        );
    } catch (error) {
        console.error(error);
    }
});

changeLocationScene.start(async (ctx) => delete ctx.session.location );

export default changeLocationScene;