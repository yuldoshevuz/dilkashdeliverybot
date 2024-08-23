import { BaseScene } from "telegraf/scenes";
import i18n from "../../config/i18n.config.js";
import { adminCategoriesKeyboard, adminCategorySettings } from "../../utils/admin.keyboards.js";
import repository from "../../repository/repository.js";
import { buttons } from "../../utils/keyboards.js";
import { convertMediaGroup } from "../../helpers/index.js";

const adminCategories = new BaseScene("admin:categories");

adminCategories.enter(async (ctx) => {
    try {
        const categories = await repository.category.findAll(ctx.session.lang);

        await ctx.replyWithHTML(i18n.t("selectOptions"),
            adminCategoriesKeyboard(categories, ctx.session.lang)
        );
    } catch (error) {
        console.error(error)
    }
});

adminCategories.hears(async (button, ctx) => {
    const { lang } = ctx.session;

    if (button === buttons.back[lang]) {
        return await ctx.scene.enter("admin:menuCategory");
    }
    
    const category = await repository.category.findByName(button, lang);
    if (category) {
        const mediaGroup = convertMediaGroup(category.images);       

        await ctx.replyWithMediaGroup(mediaGroup);
        await ctx.replyWithHTML(
            i18n.t("categoryDetails", {
                title: category.title,
                foodCount: category.foods.length,
                imagesCount: category.images.length
            }),
            adminCategorySettings(lang, category.id)
        );
    }
});

adminCategories.action(async (callbackData, ctx) => {
    try {
        ctx.answerCbQuery();
        const [ cursor, data ] = callbackData.split(":")

        if (cursor === "back" && data === "admin") {
            return ctx.scene.enter("admin");
        }

        if (cursor === "deleteCategory") {
            await repository.category.deleteById(data);
            await ctx.deleteMessage();
            return await ctx.scene.reenter();
        }

        if (cursor === "addFood") {
            return await ctx.scene.enter("admin:addFood", {
                categoryId: data
            });
        } else if (cursor === "viewFoods") {
            return await ctx.scene.enter("admin:foods", {
                categoryId: data
            });
        }

    } catch (error) {
        console.error(error);
        
    }
});

export default adminCategories;