import { WizardScene } from "telegraf/scenes";
import i18n from "../../config/i18n.config.js";
import { buttons, cancelKeyboard } from "../../utils/keyboards.js";
import getImageUrl from "../../helpers/getImageUrl.js";
import environments from "../../config/environments.js";
import repository from "../../repository/repository.js";
import { adminButtons, adminNextOrCancelKeyboard } from "../../utils/admin.keyboards.js";

const adminaddCategory = new WizardScene("admin:addCategory",
    async (ctx) => {
        try {
            if (ctx.message.text) {
                const text = ctx.message.text;
                const lang = ctx.session.lang;

                if (text === buttons.cancel[lang]) {
                    delete ctx.session.category;
                    return await ctx.scene.enter("admin:menuCategory");
                }

                ctx.session.category = { uz: text, images: [] };
                const language = i18n.t("en");

                await ctx.reply(
                    i18n.t("enterCategoryName", { language }),
                    cancelKeyboard(lang)
                );
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
            if (ctx.message.text) {
                const text = ctx.message.text;
                const lang = ctx.session.lang;

                if (text === buttons.cancel[lang]) {
                    delete ctx.session.category;
                    return await ctx.scene.enter("admin:menuCategory");
                }

                ctx.session.category.en = text;
                const language = i18n.t("ru");

                await ctx.reply(
                    i18n.t("enterCategoryName", { language }),
                    cancelKeyboard(lang)
                );
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
            if (ctx.message.text) {
                const text = ctx.message.text;
                const lang = ctx.session.lang;

                if (text === buttons.cancel[lang]) {
                    delete ctx.session.category;
                    return await ctx.scene.enter("admin:menuCategory");
                }
                
                ctx.session.category.ru = text;

                await ctx.reply(
                    i18n.t("sendCategoryImage"),
                    adminNextOrCancelKeyboard(lang)
                );
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
            if (ctx.message.photo) {
                const imageUrl = await getImageUrl(ctx.message.photo);
                let msgId;

                while(true) {
                    const msgDetails = await ctx.telegram
                        .sendPhoto(environments.CONTENTS_CHATID, { url: imageUrl })
                        .catch(() => null);

                    if (msgDetails && msgDetails.message_id) {
                        msgId = msgDetails.message_id;
                        break;
                    }
                }

                const imageLink = `${environments.CONTENTS_CHANNEL}/${msgId}`;

                if (ctx.session.category.images.length > 10) {
                    return await ctx.reply(i18n.t("cannotUploadLotsPhoto"))
                }

                ctx.session.category.images.push(imageLink);
            }

            if (ctx.message.text) {
                const text = ctx.message.text;
                const lang = ctx.session.lang;

                if (text === buttons.cancel[lang]) {
                    delete ctx.session.category;
                    return await ctx.scene.enter("admin:menuCategory");
                }

                if (text === adminButtons.next[lang]) {
                    const { images, uz, en, ru } = ctx.session.category;
                    
                    if (images?.length < 1) {
                        return await ctx.reply(i18n.t("must1Image"));
                    } else if (images?.length > 10) {
                        return await ctx.reply(i18n.t("cannotUploadLotsPhoto"));
                    }

                    const data = { title: { uz, en, ru }, images };

                    await repository.category.create(data);

                    await ctx.scene.leave();
                    await ctx.scene.enter("admin:categories");
                }
            }
        } catch (error) {
            console.error(error)
        }
    }
);

adminaddCategory.enter(async (ctx) => {
    try {
        const language = i18n.t("uz")

        await ctx.reply(
            i18n.t("enterCategoryName", { language }),
            cancelKeyboard(ctx.session.lang)
        );
    } catch (error) {
        console.error(error)
    }
});

export default adminaddCategory;