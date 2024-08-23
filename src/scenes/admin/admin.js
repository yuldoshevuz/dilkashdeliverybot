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

        switch (button) {
            case buttons.backToMainMenu[lang]:
                return await ctx.scene.enter("start", { home: true });
            case adminButtons.menu[lang]:
                return await ctx.scene.enter("admin:menuFood");
            case adminButtons.categoriesMenu[lang]:
                return await ctx.scene.enter("admin:menuCategory");
            case adminButtons.viewBookings[lang]:
                return await ctx.scene.enter("admin:viewBooking");
            case adminButtons.orders[lang]:
                return await ctx.scene.enter("admin:viewOrders");
            case adminButtons.viewReports[lang]:
                return await ctx.scene.enter("admin:viewReport");        
            default:
                break;
        }
    } catch (error) {
        console.error(error)
    }
});

export default adminScene;