import { BaseScene } from "telegraf/scenes";
import i18n from "../../config/i18n.config.js";
import { adminButtons, adminCategoryKeyboard } from "../../utils/admin.keyboards.js";
import Category from "../../reposotory/category.js";
import reposotory from "../../reposotory/reposotory.js";

const adminCategoryScene = new BaseScene("admin:menuCategory");

adminCategoryScene.enter(async (ctx) => {
    try {
        await ctx.replyWithHTML(
            i18n.t("selectOptions"),
            adminCategoryKeyboard(ctx.session.lang)
        );
    } catch (error) {
        console.error(error)
    }
});

adminCategoryScene.hears(async (button, ctx) => {
    try {
        const { lang } = ctx.session

        if (button === adminButtons.categories[lang]) {
            const categories = await reposotory.category.findAll(lang);
            if (!categories?.length) {
                return ctx.reply(i18n.t("noCategories"));
            }
            return ctx.scene.enter("admin:categories");
        } else if (button === adminButtons.add_category[lang]) {
            return ctx.scene.enter("admin:addCategory");
        } else if (button === adminButtons.delete[lang]) {
            const categories = await reposotory.category.findAll(lang);
            if (!categories?.length) {
                return await  ctx.reply(i18n.t("noCategories"));
            }
            return await ctx.scene.enter("admin:deleteCategory");
        } else if (button === adminButtons.back_to_admin_menu[lang]) {
            return await ctx.scene.enter("admin");
        }
    } catch (error) {
        console.error(error)
    }
});

export default adminCategoryScene;