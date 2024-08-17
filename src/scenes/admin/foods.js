import { BaseScene } from "telegraf/scenes";
import i18n from "../../config/i18n.config.js";
import { adminButtons, adminFoodSettings, adminFoodsKeyboard } from "../../utils/admin.keyboards.js";
import reposotory from "../../reposotory/reposotory.js";
import { backInlineKeyboard, buttons } from "../../utils/keyboards.js";
import convertMediaGroup from "../../helpers/convert.media.group.js";

const adminFoodsScene = new BaseScene("admin:foods");

adminFoodsScene.enter(async (ctx) => {
    try {
        const { categoryId } = ctx.scene.state;
        let foods;

        if (categoryId) {
            foods = await reposotory.food.findAll(ctx.session.lang, { categoryId });
        } else {
            foods = await reposotory.food.findAll(ctx.session.lang);
        }
 
        await ctx.replyWithHTML(
            i18n.t("selectOptions"),
            adminFoodsKeyboard(foods, ctx.session.lang, true)
        );
    } catch (error) {
        console.log(error)
    }
})

adminFoodsScene.hears(async (button, ctx) => {
    const { lang, foodId } = ctx.session;

    if (button === buttons.back[lang]) {
        return await ctx.scene.enter("admin:menuFood");
    } else if (button === adminButtons.add_food[lang]) {
        const { categoryId } = ctx.scene.state
        return await ctx.scene.enter("admin:addFood", { categoryId });
    }

    if (foodId) {
        if (isNaN(button)) {
            return await ctx.reply(i18n.t("enterFoodPrice") + ", 25.000");
        }

        await reposotory.food.updateById(
            ctx.session.foodId,
            { price: +button }
        );

        delete ctx.session.foodId;
        return await ctx.scene.reenter();
    }
    
    const food = await reposotory.food.findByName(button, lang);
    const category = await reposotory.category.findById(food.categoryId, lang)

    if (food) {
        const mediaGroup = convertMediaGroup(food.images)

        await ctx.replyWithMediaGroup(mediaGroup);
        await ctx.replyWithHTML(
            i18n.t("foodDetails", {
                title: food.title,
                categoryName: category.title,
                composition: food.composition,
                price: food.price,
                imagesCount: food.images.length
            }),
            adminFoodSettings(lang, food.id)
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
            await reposotory.food.deleteById(data);
            await ctx.deleteMessage();
            return await ctx.scene.enter("admin:menuFood");
        }

        if (cursor === "changePrice") {
            await ctx.editMessageText(
                i18n.t("enterNewPrice"),
                backInlineKeyboard(ctx.session.lang, "foods")
            )
            return ctx.session.foodId = data;
        }

        if (cursor === "foods" && data === "back") {
            const food = await reposotory.food
                .findById(ctx.session.foodId, ctx.session.lang);
            const category = await reposotory.category
                .findById(food.categoryId, ctx.session.lang);

            delete ctx.session.foodId;

            await ctx.editMessageText(
                i18n.t("foodDetails", {
                    title: food.title,
                    categoryName: category.title,
                    composition: food.composition,
                    price: food.price,
                    imagesCount: food.images.length
                }),
                {
                    ...adminFoodSettings(ctx.session.lang, food.id),
                    parse_mode: "HTML"
                }
            )
        }

    } catch (error) {
        console.log(error);
        
    }
})

export default adminFoodsScene;