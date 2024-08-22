import { BaseScene } from "telegraf/scenes";
import i18n from "../../config/i18n.config.js";
import reposotory from "../../reposotory/reposotory.js";
import { buttons } from "../../utils/keyboards.js";
import { adminCategoriesKeyboard } from "../../utils/admin.keyboards.js";

const adminDeleteCategoryScene = new BaseScene("admin:deleteCategory");

adminDeleteCategoryScene.enter(async (ctx) => {
    try {
        const categories = await reposotory.category.findAll(ctx.session.lang);

        await ctx.replyWithHTML(i18n.t("selectOptions"),
            adminCategoriesKeyboard(categories, ctx.session.lang)
        );
    } catch (error) {
        console.error(error)
    }
})

adminDeleteCategoryScene.hears(async (button, ctx) => {
    const { lang } = ctx.session;

    if (button === buttons.back[lang]) {
        return await ctx.scene.enter("admin:menuCategory");
    }
    
    const category = await reposotory.category.findByName(button, lang);
    if (category) {
        await reposotory.category.deleteById(category.id);
        return await ctx.scene.enter("admin:menuCategory")
    }
})

export default adminDeleteCategoryScene;