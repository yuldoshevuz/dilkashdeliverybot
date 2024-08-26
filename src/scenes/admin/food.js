import { WizardScene } from "telegraf/scenes";
import repository from "../../repository/repository.js";
import i18n from "../../config/i18n.config.js";
import { adminFoodSettingsKeyboard, adminMainMenuKeyboard } from "../../utils/admin.keyboards.js";
import { backInlineKeyboard } from "../../utils/keyboards.js";
import { convertMediaGroup } from "../../helpers/index.js";

const adminFoodScene = new WizardScene("admin:food",
    async (ctx) => {
        try {
            if (ctx.callbackQuery) {
                ctx.answerCbQuery();
                const [ cursor, data ] = ctx.callbackQuery.data.split(":");
                const lang = ctx.session.lang;

                if (cursor === "back" && data === "admin") {
                    return ctx.scene.enter("admin:foods");
                }
        
                if (cursor === "changePrice") {
                    await ctx.editMessageText(
                        i18n.t("enterNewPrice"),
                        backInlineKeyboard(lang, data)
                    );
                    
                    ctx.session.foodId = data;
                    return ctx.wizard.next();
                }
        
                if (cursor === "deleteFood") {
                    await repository.food.deleteById(data);
                    await ctx.deleteMessage();
                    return ctx.scene.enter("admin:foods");
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
                const [ cursor, data ] = ctx.callbackQuery.data.split(":")
                const lang = ctx.session.lang;

                if (data === "back") {
                    delete ctx.session.foodId;

                    const food = await repository.food.findById(cursor, lang);
                    
                    if (!food) {
                        return;
                    }

                    const category = await repository.category.findById(food.categoryId, lang);
        
                    await ctx.editMessageText(
                        i18n.t("foodDetailsAdmin", {
                            title: food.title,
                            categoryName: category.title,
                            composition: food.composition,
                            price: food.price,
                            imagesCount: food.images.length,
                        }), {
                        ...adminFoodSettingsKeyboard(lang, food.id),
                        parse_mode: "HTML"
                    });
                    return ctx.wizard.back();
                }
            }

            if (ctx.message?.text) {
                const newPrice = ctx.message.text;
                const { lang, foodId } = ctx.session;

                if (isNaN(newPrice)) {
                    return ctx.reply(i18n.t("enterFoodPrice"),
                        backInlineKeyboard(lang, foodId)
                    );
                }
    
                const updated = await repository.food.updateById(foodId, { price: +newPrice });
                return ctx.scene.enter("admin:food", { title: updated.title });
            }
            
        } catch (error) {
            console.error(error);
        }
    }
);

adminFoodScene.enter(async (ctx) => {
    try {
        const { title } = ctx.scene.state;
        const lang = ctx.session.lang;

        const pendingMsg = await ctx.reply("⏳", {
            reply_markup: { remove_keyboard: true }
        });

        const food = await repository.food.findByName(title, lang);
    
        if (!food) {
            await ctx.deleteMessage(pendingMsg.message_id);
            await ctx.reply(i18n.t("noFoods"));
            return await ctx.scene.enter("admin:foods");
        }
    
        const { category, mediaGroup } = await getFoodDetails(food, lang);

        await ctx.deleteMessage(pendingMsg.message_id);

        await ctx.replyWithMediaGroup(mediaGroup);
        await ctx.replyWithHTML(
            i18n.t("foodDetailsAdmin", {
                title: food.title,
                categoryName: category.title,
                composition: food.composition,
                price: food.price,
                imagesCount: food.images.length,
            }),
            adminFoodSettingsKeyboard(lang, food.id)
        );
    } catch (error) {
        console.error(error);
    }

});

async function getFoodDetails(food, lang) {
    const [category, mediaGroup] = await Promise.all([
        repository.category.findById(food.categoryId, lang),
        convertMediaGroup(food.images),
    ]);

    return { category, mediaGroup };
}

export default adminFoodScene;