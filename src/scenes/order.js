import { WizardScene } from "telegraf/scenes";
import i18n from "../config/i18n.config.js";
import { confirmOrBackKeyboard, paymentMethodKeyboard } from "../utils/keyboards.js";

const orderScene = new WizardScene("order",
    async (ctx) => {
        try {
            if (ctx.callbackQuery) {
                ctx.answerCbQuery();
                const [ cursor, data ] = ctx.callbackQuery.data.split(":");
                const { user, lang } = ctx.session;

                if (cursor === "back" && data === "cart") {
                    return await ctx.scene.enter("cart", { back: true });
                }
                
                if (cursor === "payment") {
                    ctx.session.order = { paymentMethod: data };

                    await ctx.editMessageText(
                        i18n.t("orderAddressInfo", {
                            address: user.location.address
                        }), {
                        ...confirmOrBackKeyboard(lang),
                        parse_mode: "HTML"
                    });

                    return ctx.wizard.next();
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
);

orderScene.enter(async (ctx) => {
    try {
        await ctx.editMessageText(
            i18n.t("selectPaymentMethod"), {
            ...paymentMethodKeyboard(ctx.session.lang)
        });
    } catch (error) {
        console.log(error);
    }
})

export default orderScene;