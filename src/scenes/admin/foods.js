import { BaseScene } from "telegraf/scenes";
import i18n from "../../config/i18n.config.js";
import { adminButtons, adminFoodSettingsKeyboard, adminFoodsKeyboard } from "../../utils/admin.keyboards.js";
import repository from "../../repository/repository.js";
import { backInlineKeyboard, buttons } from "../../utils/keyboards.js";
import { convertMediaGroup } from "../../helpers/index.js";

const adminFoodsScene = new BaseScene("admin:foods");

async function getFoodDetails(food, lang) {
    const [category, mediaGroup] = await Promise.all([
        repository.category.findById(food.categoryId, lang),
        convertMediaGroup(food.images),
    ]);

    return { category, mediaGroup };
}

adminFoodsScene.enter(async (ctx) => {
    try {
        const { categoryId } = ctx.scene.state;
        const foods = categoryId
            ? await repository.food.findAll(ctx.session.lang, { categoryId })
            : await repository.food.findAll(ctx.session.lang);

        await ctx.replyWithHTML(
            i18n.t("selectOptions"),
            adminFoodsKeyboard(foods, ctx.session.lang)
        );
    } catch (error) {
        console.error(error);
    }
});

adminFoodsScene.hears(async (button, ctx) => {
    const { lang, foodId } = ctx.session;

    if (button === buttons.back[lang]) {
        return ctx.scene.enter("admin:menu");
    }
    if (button === adminButtons.addFood[lang]) {
        const { categoryId } = ctx.scene.state;
        return ctx.scene.enter("admin:addFood", { categoryId });
    }
    if (foodId) {
        if (isNaN(button)) {
            return ctx.reply(i18n.t("enterFoodPrice") + ", 25.000");
        }

        await repository.food.updateById(foodId, { price: +button });
        delete ctx.session.foodId;
        return ctx.scene.reenter();
    }

    const food = await repository.food.findByName(button, lang);
    if (!food) {
        return ctx.reply(i18n.t("noFoods"));
    }

    const { category, mediaGroup } = await getFoodDetails(food, lang);

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
});

adminFoodsScene.action(async (callbackData, ctx) => {
    try {
        ctx.answerCbQuery();
        const [cursor, data] = callbackData.split(":");

        if (cursor === "back" && data === "admin") {
            return ctx.scene.enter("admin");
        }
        if (cursor === "deleteFood") {
            await repository.food.deleteById(data);
            await ctx.deleteMessage();
            return ctx.scene.enter("admin:menu");
        }
        if (cursor === "changePrice") {
            await ctx.editMessageText(
                i18n.t("enterNewPrice"),
                backInlineKeyboard(ctx.session.lang, "foods")
            );
            return (ctx.session.foodId = data);
        }
        if (cursor === "foods" && data === "back") {
            const food = await repository.food.findById(ctx.session.foodId, ctx.session.lang);
            const { category } = await getFoodDetails(food, ctx.session.lang);

            delete ctx.session.foodId;

            await ctx.editMessageText(
                i18n.t("foodDetailsAdmin", {
                    title: food.title,
                    categoryName: category.title,
                    composition: food.composition,
                    price: food.price,
                    imagesCount: food.images.length,
                }),
                {
                    ...adminFoodSettingsKeyboard(ctx.session.lang, food.id),
                    parse_mode: "HTML",
                }
            );
        }
    } catch (error) {
        console.error(error);
    }
});

export default adminFoodsScene;