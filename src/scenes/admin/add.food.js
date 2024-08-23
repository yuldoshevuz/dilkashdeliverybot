import { WizardScene } from "telegraf/scenes";
import i18n from "../../config/i18n.config.js";
import { buttons, cancelKeyboard } from "../../utils/keyboards.js";
import { adminButtons, adminCategoriesKeyboard, adminNextOrCancelKeyboard } from "../../utils/admin.keyboards.js";
import repository from "../../repository/repository.js";
import { getImageUrl } from "../../helpers/index.js";
import environments from "../../config/environments.js";

const adminAddFood = new WizardScene("admin:addFood",
    async (ctx) => {
        try {
            if (ctx.message.text) {
                const text = ctx.message.text;
                const lang = ctx.session.lang;

                if (text === buttons.cancel[lang]) {
                    delete ctx.session.food;
                    return await ctx.scene.enter("admin:menuFood");
                }

                ctx.session.food = {
                    title: { uz: text },
                    images: []
                };
                const language = i18n.t("en");

                await ctx.reply(
                    i18n.t("enterFoodName", { language }),
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
                    delete ctx.session.food;
                    return await ctx.scene.enter("admin:menuFood");
                }

                ctx.session.food.title.en = text;
                const language = i18n.t("ru");

                await ctx.reply(
                    i18n.t("enterFoodName", { language }),
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
                    delete ctx.session.food;
                    return await ctx.scene.enter("admin:menuFood");
                }

                ctx.session.food.title.ru = text;
                const language = i18n.t("uz");
                const composition = i18n.t("uzCom")

                await ctx.reply(
                    i18n.t("enterFoodComposition", { language, composition }),
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
                    delete ctx.session.food;
                    return await ctx.scene.enter("admin:menuFood");
                }

                ctx.session.food.composition = { uz: text };
                const language = i18n.t("en");
                const composition = i18n.t("enCom")

                await ctx.reply(
                    i18n.t("enterFoodComposition", { language, composition }),
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
                    delete ctx.session.food;
                    return await ctx.scene.enter("admin:menuFood");
                }

                ctx.session.food.composition.en = text;
                const language = i18n.t("ru");
                const composition = i18n.t("ruCom")

                await ctx.reply(
                    i18n.t("enterFoodComposition", { language,   composition }),
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
                    delete ctx.session.food;
                    return await ctx.scene.enter("admin:menuFood");
                }

                ctx.session.food.composition.ru = text;
                const { categoryId } = ctx.scene.state;

                if (categoryId) {
                    ctx.session.food.categoryId = categoryId;
                    ctx.wizard.cursor++;

                    await ctx.reply(
                        i18n.t("enterFoodPrice"),
                        cancelKeyboard(lang)
                    );
                    return ctx.wizard.next();
                }

                const categories = await repository.category
                    .findAll(lang);

                await ctx.reply(
                    i18n.t("whichCategory"),
                    adminCategoriesKeyboard(categories, lang)
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
                    delete ctx.session.food;
                    return await ctx.scene.enter("admin:menuFood");
                }

                if (text === buttons.back[lang]) {
                    return await ctx.scene.enter("admin:menuFood");
                }

                const category = await repository.category
                    .findByName(text, lang);

                if (!category) {
                    return await ctx.reply(i18n.t("noCategories"))
                }

                ctx.session.food.categoryId = category.id;

                await ctx.reply(
                    i18n.t("enterFoodPrice"),
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
                    delete ctx.session.food;
                    return await ctx.scene.enter("admin:menuFood");
                }

                if (isNaN(text)) {
                    return await ctx.reply(i18n.t("enterFoodPrice") + ", 25.000");
                }
                
                ctx.session.food.price = +text;

                await ctx.reply(
                    i18n.t("sendFoodImages"),
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

                if (ctx.session.food.images.length > 10) {
                    return await ctx.reply(i18n.t("cannotUploadLotsPhoto"))
                }

                ctx.session.food.images.push(imageLink);
            }

            if (ctx.message.text) {
                const text = ctx.message.text;
                const lang = ctx.session.lang;

                if (text === buttons.cancel[lang]) {
                    delete ctx.session.food;
                    return await ctx.scene.enter("admin:menuFood");
                }

                if (text === adminButtons.next[lang]) {
                    const { images, title, composition, categoryId, price } = ctx.session.food;
                    
                    if (images?.length < 1) {
                        return await ctx.reply(i18n.t("must1Image"));
                    } else if (images?.length > 10) {
                        return await ctx.reply(i18n.t("cannotUploadLotsPhoto"));
                    }

                    const data = { title, composition, categoryId, price, images };

                    await repository.food.create(data);

                    await ctx.scene.leave();
                    await ctx.scene.enter("admin:foods");
                }
            }
        } catch (error) {
            console.error(error)
        }
    }
);

adminAddFood.enter(async (ctx) => {
    try {
        const language = i18n.t("uz");

        await ctx.reply(
            i18n.t("enterFoodName", { language }),
            cancelKeyboard(ctx.session.lang)
        );
    } catch (error) {
        console.error(error)
    }
});

export default adminAddFood;