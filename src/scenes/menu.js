import { WizardScene } from "telegraf/scenes";
import repository from "../repository/repository.js";
import i18n from "../config/i18n.config.js";
import { addCartKeyboard, buttons, categoriesKeyboard, foodsKeyboard } from "../utils/keyboards.js";
import { convertMediaGroup } from "../helpers/index.js";

const menuScene = new WizardScene("menu",
    async (ctx) => {
        try {
            if (ctx.message?.text) {
                const text = ctx.message.text;
                const lang = ctx.session.lang;

                if (text === buttons.back[lang]) {
                    return await ctx.scene.enter("start", { home: true });
                } else if (text === buttons.cart[lang]) {
                    return await ctx.scene.enter("cart", { cursor: ctx.wizard.cursor });
                }

                const category = await repository.category.findByName(text, lang);

                if (!category) {
                    return await ctx.reply(i18n.t("noCategories"));
                }

                if (!category.foods.length) {
                    return await ctx.reply(i18n.t("noFoods"));
                }

                await ctx.reply(
                    i18n.t("selectOptions"),
                    foodsKeyboard(category.foods, lang)
                );
                await ctx.replyWithMediaGroup(
                    convertMediaGroup(category.images)
                );
                
                return ctx.wizard.next();
            }
        } catch (error) {
            console.error(error);
        }
    },
    async (ctx) => {
        try {
            if (ctx.message?.text) {
                const text = ctx.message.text;
                const lang = ctx.session.lang;

                if (text === buttons.back[lang]) {
                    const categories = await repository.category.findAll(lang);

                    await ctx.reply(i18n.t("selectCategories"),
                        categoriesKeyboard(categories, lang)
                    );
                    return ctx.wizard.back();
                } else if (text === buttons.cart[lang]) {
                    return await ctx.scene.enter("cart", { cursor: ctx.wizard.cursor });
                }

                const food = await repository.food.findByName(text, lang);

                if (!food) {
                    return await ctx.reply(i18n.t("noFoods"));
                }

                const cartItem = await repository.cartItem.findByFoodID(food.id, lang);
                
                await ctx.replyWithMediaGroup(convertMediaGroup(food.images));

                await ctx.replyWithHTML(
                    i18n.t("foodDetails", food),
                    addCartKeyboard(cartItem?.quantity || 0, food.id, lang)
                );             
            }

            if (ctx.callbackQuery) {
                const [ cursor, foodId, quantity ] = ctx.callbackQuery.data.split(":")

                const user = ctx.session.user;
                const lang = ctx.session.lang;

                if (cursor === "increment") {
                    await ctx.editMessageReplyMarkup(
                        addCartKeyboard(+quantity + 1, foodId, lang).reply_markup
                    );

                    return await ctx.answerCbQuery(
                        i18n.t("showQuantity", {
                            quantity: "+1"
                        }),
                    );
                }
                
                if (cursor === "decrement" && +quantity > 0) {
                    await ctx.editMessageReplyMarkup(
                        addCartKeyboard(+quantity - 1, foodId, lang).reply_markup
                    );

                    return await ctx.answerCbQuery(
                        i18n.t("showQuantity", {
                            quantity: "-1"
                        })
                    );
                }

                if (cursor === "quantity") {
                    return await ctx.answerCbQuery(
                        i18n.t("showQuantity", {
                            quantity
                        })
                    );
                }

                if (cursor === "addCart" && +quantity > 0) {
                    const cart = await repository.cart.new(user.id);
                    await repository.cartItem.new({
                        foodId,
                        cartId: cart.id,
                        quantity: +quantity
                    });

                    return await ctx.answerCbQuery(
                        i18n.t("addedToCart"),
                        { show_alert: true }
                    );
                }

                await ctx.answerCbQuery();
                
            }
        } catch (error) {
            console.error(error);
            
        }
    }
);

menuScene.enter(async (ctx) => {
    try {
        const lang = ctx.session.lang;
        const categories = await repository.category.findAll(lang);

        if (!categories.length) {
            await ctx.reply(i18n.t("noFoods"));
            return await ctx.scene.enter("start", {}, true);
        }
        
        const { cursor } = ctx.scene.state;

        if (cursor === 0 || cursor) {
            return ctx.wizard.cursor = cursor;
        }

        await ctx.reply(i18n.t("selectCategories"),
            categoriesKeyboard(categories, lang)
        );
    } catch (error) {
        console.error(error);
    }
});

export default menuScene;