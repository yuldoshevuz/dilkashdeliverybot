import { WizardScene } from "telegraf/scenes";
import i18n from "../../config/i18n.config.js";
import { buttons, cancelKeyboard } from "../../utils/keyboards.js";
import getImageUrl from "../../helpers/getImageUrl.js";
import environments from "../../config/environments.js";
import reposotory from "../../reposotory/reposotory.js";

const adminaddCategory = new WizardScene("admin:addCategory",
    async (ctx) => {
        try {
            if (ctx.message.text) {
                ctx.session.category = { uz: ctx.message.text };
                const language = i18n.t("en");

                await ctx.reply(
                    i18n.t("enterCategoryName", { language }),
                    cancelKeyboard(ctx.session.lang)
                );
                return ctx.wizard.next();
            }

            if (ctx.message && !ctx.message.text) {
                await ctx.deleteMessage();
            }
        } catch (error) {
            console.log(error)
        }
    },
    async (ctx) => {
        try {
            if (ctx.message.text) {
                ctx.session.category.en = ctx.message.text;
                const language = i18n.t("ru");

                await ctx.reply(
                    i18n.t("enterCategoryName", { language }),
                    cancelKeyboard(ctx.session.lang)
                );
                return ctx.wizard.next();
            }

            if (ctx.message && !ctx.message.text) {
                await ctx.deleteMessage();
            }
        } catch (error) {
            console.log(error)
        }
    },
    async (ctx) => {
        try {
            if (ctx.message.text) {
                ctx.session.category.ru = ctx.message.text;

                await ctx.reply(
                    i18n.t("sendCategoryImage"),
                    cancelKeyboard(ctx.session.lang)
                );
                return ctx.wizard.next();
            }

            if (ctx.message && !ctx.message.text) {
                await ctx.deleteMessage();
            }
        } catch (error) {
            console.log(error)
        }
    },
    async (ctx) => {
        try {
            
            if (ctx.message.photo) {

                console.log(ctx.message.photo);

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

                const images = [ imageLink ];

                console.log(imageLink);
                console.log(images);
                

                // await reposotory.category
                //     .create(
                //         ctx.session.category,
                //         imageLink
                //     );

                // await ctx.scene.leave();
                // await ctx.scene.enter("admin:categories");
            }

            if (ctx.message && !ctx.message.photo) {
                await ctx.deleteMessage();
            }
        } catch (error) {
            console.log(error)
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
        console.log(error)
    }
});

adminaddCategory.hears(async (button, ctx) => {
    try {
        const { lang } = ctx.session;
        
        if (button === buttons.cancel[lang]) {
            delete ctx.session.category;
            return await ctx.scene.enter("admin:menuCategory");
        }
    } catch (error) {
        console.log(error)
    }
})

export default adminaddCategory;