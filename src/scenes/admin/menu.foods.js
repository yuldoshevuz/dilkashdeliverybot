import { BaseScene } from "telegraf/scenes";
import i18n from "../../config/i18n.config.js";
import { adminButtons, adminMainMenuKeyboard, adminMenuKeyboard } from "../../utils/admin.keyboards.js";
import Food from "../../reposotory/food.js";
import Category from "../../reposotory/category.js";

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
            const foods = await new Food().findAll({ language: lang });

            console.log(foods);
        } else if (button === adminButtons.add_food[lang]) {
            const categories = await new Category().findAll({ language: lang });
            if (!categories.length) {
                return await ctx.reply(i18n.t("noCategories"));
            }
            return ctx.scene.enter("admin:addFood");
        } else if (button === adminButtons.add_category[lang]) {
            return ctx.scene.enter("admin:addCategory");
        } else if (button === adminButtons.back_to_admin_menu[lang]) {
            return ctx.scene.enter("admin");
        }
    } catch (error) {
        console.log(error)
    }
})

export default adminMenuScene;