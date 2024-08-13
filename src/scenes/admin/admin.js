import { BaseScene } from "telegraf/scenes";
import i18n from "../../config/i18n.config.js";
import { adminButtons, adminMainMenuKeyboard } from "../../utils/admin.keyboards.js";
import { buttons } from "../../utils/keyboards.js";

const adminScene = new BaseScene("admin");

adminScene.enter(async (ctx) => {
    await ctx.replyWithHTML(`<b>${i18n.t("welcomeAdmin")}</b>`, 
        adminMainMenuKeyboard(ctx.session.lang)
    );
});

adminScene.hears(async (button, ctx) => {
    try {
        const { lang } = ctx.session;

        if (button === adminButtons.menu[lang]) {
            return await ctx.scene.enter("admin:menuFood");
        } else if (button === adminButtons.categories_menu[lang]) {
            return await ctx.scene.enter("admin:menuCategory");
        } else if (button === buttons.back_to_main_menu[lang]) {
            return await ctx.scene.enter("start");
        }
    } catch (error) {
        console.log(error)
    }
});

export default adminScene;