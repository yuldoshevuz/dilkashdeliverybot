import { BaseScene } from "telegraf/scenes";
import i18n from "../../config/i18n.config.js";
import repository from "../../repository/repository.js";
import { buttons } from "../../utils/keyboards.js";
import { adminFoodsKeyboard } from "../../utils/admin.keyboards.js";

const adminDeleteFoodScene = new BaseScene("admin:deleteFood");

adminDeleteFoodScene.enter(async (ctx) => {
    try {
        const foods = await repository.food.findAll(ctx.session.lang);

        await ctx.replyWithHTML(i18n.t("selectOptions"),
            adminFoodsKeyboard(foods, ctx.session.lang)
        );
    } catch (error) {
        console.error(error)
    }
})

adminDeleteFoodScene.hears(async (button, ctx) => {
    const { lang } = ctx.session;

    if (button === buttons.back[lang]) {
        return await ctx.scene.enter("admin:menuFood");
    }
    
    const food = await repository.food.findByName(button, lang);
    if (food) {
        await repository.food.deleteById(food.id);
        return await ctx.scene.enter("admin:menuFood");
    }
})

export default adminDeleteFoodScene;