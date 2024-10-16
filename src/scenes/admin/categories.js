import { BaseScene } from "telegraf/scenes";
import i18n from "../../config/i18n.config.js";
import { adminButtons, adminCategoriesKeyboard, adminCategorySettingsKeyboard } from "../../utils/admin.keyboards.js";
import repository from "../../repository/repository.js";
import { buttons } from "../../utils/keyboards.js";
import { convertMediaGroup } from "../../helpers/index.js";

const adminCategoriesScene = new BaseScene("admin:categories");

adminCategoriesScene.enter(async (ctx) => {
    try {
        const categories = await repository.category.findAll(ctx.session.lang);

        if (!categories?.length) {
            await ctx.reply(i18n.t("noCategories"));
        }

        await ctx.replyWithHTML(i18n.t("selectOptions"),
            adminCategoriesKeyboard(categories, ctx.session.lang)
        );
    } catch (error) {
        console.error(error)
    }
});

adminCategoriesScene.hears(async (button, ctx) => {
    try {
        const lang = ctx.session.lang;
    
        if (button === buttons.back[lang]) {
            return await ctx.scene.enter("admin:menu");
        } else if (button === adminButtons.addCategory[lang]) {
            return await ctx.scene.enter("admin:addCategory");
        }
        
        await ctx.scene.enter("admin:category", { title: button });
    } catch (error) {
        console.error(error);        
    }
});

adminCategoriesScene.action(async (callbackData, ctx) => {
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

export default adminCategoriesScene;