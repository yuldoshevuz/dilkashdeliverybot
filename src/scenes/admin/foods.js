import { BaseScene } from "telegraf/scenes";
import i18n from "../../config/i18n.config.js";
import { adminButtons, adminFoodSettingsKeyboard, adminFoodsKeyboard } from "../../utils/admin.keyboards.js";
import repository from "../../repository/repository.js";
import { backInlineKeyboard, buttons } from "../../utils/keyboards.js";
import { convertMediaGroup } from "../../helpers/index.js";

const adminFoodsScene = new BaseScene("admin:foods");

adminFoodsScene.enter(async (ctx) => {
    try {
        const { categoryId, adding } = ctx.scene.state;
        const lang = ctx.session.lang;

        const foods = categoryId
            ? await repository.food.findAll(ctx.session.lang, { categoryId })
            : await repository.food.findAll(ctx.session.lang);

        if (!foods.length) {
            if (categoryId) {
                await ctx.answerCbQuery(i18n.t("noFoods"), {
                    show_alert: true
                });
            }
            await ctx.reply(i18n.t("noFoods"));
        }

        await ctx.replyWithHTML(
            i18n.t("selectOptions"),
            adminFoodsKeyboard(foods, lang, adding)
        );
    } catch (error) {
        console.error(error);
    }
});

adminFoodsScene.hears(async (button, ctx) => {
    const { lang } = ctx.session;

    if (button === buttons.back[lang]) {
        return ctx.scene.enter("admin:menu");
    }
    if (button === adminButtons.addFood[lang]) {
        const { categoryId } = ctx.scene.state;
        return ctx.scene.enter("admin:addFood", { categoryId });
    }

    await ctx.scene.enter("admin:food", { title: button });
});

export default adminFoodsScene;