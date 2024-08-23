import { BaseScene } from "telegraf/scenes";
import i18n from "../../config/i18n.config.js";
import { adminButtons, adminMenuKeyboard } from "../../utils/admin.keyboards.js";
import repository from "../../repository/repository.js";

const adminMenuScene = new BaseScene("admin:menuFood");

adminMenuScene.enter(async (ctx) => {
    await ctx.replyWithHTML(i18n.t("selectOptions"), 
        adminMenuKeyboard(ctx.session.lang)
    );
});

adminMenuScene.hears(async (button, ctx) => {
    try {
        const { lang } = ctx.session;

        if (button === adminButtons.foods[lang]) {
            const foods = await repository.food.findAll(lang);

            if (!foods?.length) {
                return ctx.reply(i18n.t("noFoods"));
            }

            return await ctx.scene.enter("admin:foods");
        } else if (button === adminButtons.addFood[lang]) {
            const categories = await repository.category.findAll(lang);
            if (!categories.length) {
                return ctx.reply(i18n.t("noCategories"));
            }
            return await ctx.scene.enter("admin:addFood");
        } else if (button === adminButtons.delete[lang]) {
            const foods = await repository.food.findAll(lang);
            if (!foods?.length) {
                return ctx.reply(i18n.t("noFoods"));
            }
            return await ctx.scene.enter("admin:deleteFood");
        } else if (button === adminButtons.backToAdminMenu[lang]) {
            return await ctx.scene.enter("admin");
        }
    } catch (error) {
        console.error(error)
    }
})

export default adminMenuScene;