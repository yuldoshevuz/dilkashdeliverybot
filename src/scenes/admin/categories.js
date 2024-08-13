import { BaseScene } from "telegraf/scenes";
import i18n from "../../config/i18n.config.js";
import { adminCategoriesKeyboard, adminCategorySettings } from "../../utils/admin.keyboards.js";
import reposotory from "../../reposotory/reposotory.js";
import { buttons } from "../../utils/keyboards.js";
import convertMediaGroup from "../../helpers/convert.media.group.js";

const adminCategories = new BaseScene("admin:categories");

adminCategories.enter(async (ctx) => {
    try {
        const categories = await reposotory.category.findAll(ctx.session.lang);

        await ctx.replyWithHTML(i18n.t("selectOptions"),
            adminCategoriesKeyboard(categories, ctx.session.lang)
        );
    } catch (error) {
        console.log(error)
    }
})

adminCategories.hears(async (button, ctx) => {
    const { lang } = ctx.session;

    if (button === buttons.back[lang]) {
        return await ctx.scene.enter("admin:menuCategory");
    }
    
    const category = await reposotory.category.findByName(button, lang);

    console.log(category);
    

    if (category) {
        const mediaGroup = convertMediaGroup(category.images)

        await ctx.replyWithMediaGroup(mediaGroup);
        await ctx.replyWithHTML(
            i18n.t("categoryDetails", {
                title: category.title,
                foodCount: category.foods.length,
                imagesCount: category.images.length
            }),
            adminCategorySettings(lang, category.id));
    }
})

export default adminCategories;