import { WizardScene } from "telegraf/scenes";
import { buttons, cancelKeyboard, rateInlineKeyboard } from "../utils/keyboards.js";
import i18n from "../config/i18n.config.js";
import { phoneValidation, sendMessageToAdmin, parseHtml } from "../helpers/index.js";

const rateScene = new WizardScene(
    "rate",
    async (ctx) => {
        try {
            if (ctx.callbackQuery) {
                ctx.answerCbQuery()
                const [ cursor, data ] = ctx.callbackQuery.data.split(":");

                if (cursor === "rateService") {
                    ctx.session.rating = { service: data };

                    await ctx.editMessageText(i18n.t("rateFoods"), {
                        ...rateInlineKeyboard("rateFoods")
                    })
                    return ctx.wizard.next();
                }
            }

            if (ctx.message) {
                await ctx.deleteMessage();
            }
        } catch (error) {
            console.error(error)
        }
    },
    async (ctx) => {
        try {
            if (ctx.callbackQuery) {
                ctx.answerCbQuery()
                const [ cursor, data ] = ctx.callbackQuery.data.split(":");

                if (cursor === "rateFoods") {
                    ctx.session.rating.foods = data;

                    await ctx.editMessageText(i18n.t("rateComment"))
                    return ctx.wizard.next();
                }
            }

            if (ctx.message) {
                await ctx.deleteMessage();
            }
        } catch (error) {
            console.error(error)
        }
    },
    async (ctx) => {
        try {
            if (ctx.message?.text) {
                ctx.session.rating.comment = parseHtml(ctx.message.text);

                await ctx.reply(i18n.t("rateContact"))
                return ctx.wizard.next();
            }

            if (ctx.message && !ctx.message.text) {
                await ctx.deleteMessage();
            }
        } catch (error) {
            console.error(error)
        }
    },
    async (ctx) => {
        try {
            if (ctx.message?.text) {
                const contactNumber = ctx.message?.text;

                if (!phoneValidation(contactNumber)) {
                    await ctx.reply(i18n.t("invalidPhone"));
                    return;
                }

                await sendMessageToAdmin("ratedMessage", {
                    firstName: parseHtml(ctx.from.first_name),
                    contactNumber,
                    ...ctx.session.rating
                });

                delete ctx.session.rating;

                await ctx.reply(i18n.t("rateAccepted"));
                await ctx.scene.leave();
                await ctx.scene.enter("start", { home: true });
            }

            if (ctx.message && !ctx.message.text) {
                await ctx.deleteMessage();
            }
        } catch (error) {
            console.error(error)
        }
    }
);

rateScene.enter(async (ctx) => {
    try {
        await ctx.reply(buttons.rateUs[ctx.session.lang],
            cancelKeyboard(ctx.session.lang)
        );
        await ctx.reply(i18n.t("rateService"), 
            rateInlineKeyboard("rateService")
        );
    } catch (error) {
        console.error(error);
    }
});

rateScene.hears(async (button, ctx) => {
    try {
        const { lang } = ctx.session;
        
        if (button === buttons.cancel[lang] || button === "/start") {
            delete ctx.session?.rating;
            return await ctx.scene.enter("start", { home: true });
        }
    } catch (error) {
        console.error(error)
    }
})
export default rateScene;