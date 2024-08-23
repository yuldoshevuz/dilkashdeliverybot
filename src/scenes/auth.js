import { WizardScene } from "telegraf/scenes";
import i18n from "../config/i18n.config.js";
import { changeLangKeyboard, contactKeyboard, sendLocationKeyboard } from "../utils/keyboards.js";
import isAuth from "../middlewares/auth.middleware.js";
import { fetchLocationAddress } from "../helpers/index.js";
import repository from "../repository/repository.js";

const authScene = new WizardScene(
    "auth",
    async (ctx) => {
        try {
            if (ctx.callbackQuery) {
                ctx.answerCbQuery();
                const [cursor, data] = ctx.callbackQuery.data.split(":");

                if (cursor === "language") {
                    ctx.session.lang = data;
                    await i18n.changeLanguage(data);
                    
                    await ctx.deleteMessage();
                    await ctx.replyWithPhoto("https://t.me/botcontents/165", {
                        caption: i18n.t("welcomeText"),
                        parse_mode: "HTML"
                    });
                    await ctx.replyWithHTML(i18n.t("sendMeContactBot"),
                        contactKeyboard(data)
                    );
                    
                    return ctx.wizard.next();
                }
            } else if (ctx.message) {
                await ctx.deleteMessage();
            }
        } catch (error) {
            console.error(error);
        }
    },
    async (ctx) => {
        try {
            const contact = ctx.message?.contact;
            const chatId = ctx.from.id;

            if (contact && contact.user_id === chatId) {
                ctx.session.phoneNumber = contact.phone_number;
                await ctx.reply(i18n.t("sendLocation"), sendLocationKeyboard(ctx.session.lang));
                return ctx.wizard.next();
            }

            await ctx.replyWithHTML(i18n.t("sendMeContactBot"), contactKeyboard(ctx.session.lang));
        } catch (error) {
            console.error(error);
        }
    },
    async (ctx) => {
        try {
            const location = ctx.message?.location;

            if (location) {
                const addressLocation = await fetchLocationAddress(location.latitude, location.longitude);

                if (!addressLocation) {
                    await ctx.replyWithHTML(`<b>${i18n.t("errorLocating")}</b>`,
                        sendLocationKeyboard(ctx.session.lang)
                    );
                    return;
                }

                const chatId = ctx.from.id;

                const newUser = await repository.user
                    .update({ chatId }, {
                        language: ctx.session.lang,
                        phoneNumber: ctx.session.phoneNumber,
                        location: addressLocation,
                        active: true
                    });

                delete ctx.session.lang;
                delete ctx.session.phoneNumber;

                ctx.session.user = newUser;
                ctx.session.lang = newUser.language;

                ctx.scene.enter("start", { home: true });
            }
        } catch (error) {
            console.error(error);
        }
    }
);

authScene.start(isAuth, ctx => ctx.scene.enter('start'));

authScene.enter(async (ctx) => {
    try {
        await ctx.replyWithHTML(`<b>${i18n.t("changeLanguage")}</b>`,
            changeLangKeyboard()
        );
    } catch (error) {
        console.error(error);
    }
});

export default authScene;