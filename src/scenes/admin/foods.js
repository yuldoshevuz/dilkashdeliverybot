import { BaseScene } from "telegraf/scenes";
import i18n from "../../config/i18n.config.js";
import { adminButtons, adminFoodSettingsKeyboard, adminFoodsKeyboard } from "../../utils/admin.keyboards.js";
import repository from "../../repository/repository.js";
import { backInlineKeyboard, buttons } from "../../utils/keyboards.js";
import { convertMediaGroup } from "../../helpers/index.js";

const adminFoodsScene = new BaseScene("admin:foods");

adminFoodsScene.enter(async (ctx) => {
    try {
        const { categoryId } = ctx.scene.state;
        let foods;

        if (categoryId) {
            foods = await repository.food.findAll(ctx.session.lang, { categoryId });
        } else {
            foods = await repository.food.findAll(ctx.session.lang);
        }
 
        await ctx.replyWithHTML(
            i18n.t("selectOptions"),
            adminFoodsKeyboard(foods, ctx.session.lang)
        );
    } catch (error) {
        console.error(error)
    }
})

adminFoodsScene.hears(async (button, ctx) => {
    const { lang, foodId } = ctx.session;

    if (button === buttons.back[lang]) {
        return await ctx.scene.enter("admin:menu");
    } else if (button === adminButtons.addFood[lang]) {
        const { categoryId } = ctx.scene.state
        return await ctx.scene.enter("admin:addFood", { categoryId });
    }

    if (foodId) {
        if (isNaN(button)) {
            return await ctx.reply(i18n.t("enterFoodPrice") + ", 25.000");
        }

        await repository.food.updateById(
            ctx.session.foodId,
            { price: +button }
        );

        delete ctx.session.foodId;
        return await ctx.scene.reenter();
    }
    
    const food = await repository.food.findByName(button, lang);
    const category = await repository.category.findById(food.categoryId, lang)

    if (food) {
        const mediaGroup = convertMediaGroup(food.images)

        await ctx.replyWithMediaGroup(mediaGroup);
        await ctx.replyWithHTML(
            i18n.t("foodDetailsAdmin", {
                title: food.title,
                categoryName: category.title,
                composition: food.composition,
                price: food.price,
                imagesCount: food.images.length
            }),
            adminFoodSettingsKeyboard(lang, food.id)
        );
    }
})

adminFoodsScene.action(async (callbackData, ctx) => {
    try {
        ctx.answerCbQuery();
        const [ cursor, data ] = callbackData.split(":")

        if (cursor === "back" && data === "admin") {
            return ctx.scene.enter("admin");
        }

        if (cursor === "deleteFood") {
            await repository.food.deleteById(data);
            await ctx.deleteMessage();
            return await ctx.scene.enter("admin:menu");
        }

        if (cursor === "changePrice") {
            await ctx.editMessageText(
                i18n.t("enterNewPrice"),
                backInlineKeyboard(ctx.session.lang, "foods")
            )
            return ctx.session.foodId = data;
        }

        if (cursor === "foods" && data === "back") {
            const food = await repository.food
                .findById(ctx.session.foodId, ctx.session.lang);
            const category = await repository.category
                .findById(food.categoryId, ctx.session.lang);

            delete ctx.session.foodId;

            await ctx.editMessageText(
                i18n.t("foodDetailsAdmin", {
                    title: food.title,
                    categoryName: category.title,
                    composition: food.composition,
                    price: food.price,
                    imagesCount: food.images.length
                }),
                {
                    ...adminFoodSettingsKeyboard(ctx.session.lang, food.id),
                    parse_mode: "HTML"
                }
            )
        }

    } catch (error) {
        console.error(error);
        
    }
})

export default adminFoodsScene;