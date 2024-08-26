import { BaseScene } from "telegraf/scenes";
import repository from "../../repository/repository.js";
import { adminCategorySettingsKeyboard } from "../../utils/admin.keyboards.js";
import { convertMediaGroup } from "../../helpers/index.js";
import i18n from "../../config/i18n.config.js";

const adminCategoryScene = new BaseScene("admin:category");

adminCategoryScene.enter(async (ctx) => {
    try {
        const { title } = ctx.scene.state;
        const lang = ctx.session.lang;

        const pendingMsg = await ctx.reply("⏳", {
            reply_markup: { remove_keyboard: true }
        });

        const category = await repository.category.findByName(title, lang);
        
        if (!category) {
            await ctx.deleteMessage(pendingMsg.message_id);
            await ctx.reply(i18n.t("noCategories"));
            return await ctx.scene.enter("admin:categories");
        }
        
        const mediaGroup = convertMediaGroup(category.images);       
    
        await ctx.deleteMessage(pendingMsg.message_id);

        await ctx.replyWithMediaGroup(mediaGroup);
        await ctx.replyWithHTML(
            i18n.t("categoryDetails", {
                title: category.title,
                foodCount: category.foods.length,
                imagesCount: category.images.length
            }),
            adminCategorySettingsKeyboard(lang, category.id)
        );
    } catch (error) {
        console.error(error);
    }
});

adminCategoryScene.action(async (callbackData, ctx) => {
    try {
        const [ cursor, data ] = callbackData.split(":");
        
        if (cursor === "viewFoods") {
            return await ctx.scene.enter("admin:foods", {
                categoryId: data,
                adding: false
            });
        }
        
        ctx.answerCbQuery();

        if (cursor === "back" && data === "admin") {
            return ctx.scene.enter("admin:categories");
        }

        if (cursor === "deleteCategory") {
            await repository.category.deleteById(data);
            await ctx.deleteMessage();
            return await ctx.scene.enter("admin:categories")
        }

        if (cursor === "addFood") {
            return await ctx.scene.enter("admin:addFood", {
                categoryId: data
            });
        }
        
    } catch (error) {
        console.error(error);
    }
});

export default adminCategoryScene;