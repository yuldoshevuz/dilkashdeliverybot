import { WizardScene } from "telegraf/scenes";
import i18n from "../config/i18n.config.js";
import { confirmOrBackKeyboard, paymentMethodKeyboard } from "../utils/keyboards.js";
import repository from "../repository/repository.js";
import { sendNewOrderNotification } from "../helpers/index.js";

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
                    ctx.session.paymentMethod = data;

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
    },
    async (ctx) => {
        try {
            if (ctx.callbackQuery) {
                ctx.answerCbQuery();
                const [ cursor, data ] = ctx.callbackQuery.data.split(":");
                const { user, lang } = ctx.session;

                if (cursor === "confirm") {
                    if (data === "back") {
                        await ctx.editMessageText(
                            i18n.t("selectPaymentMethod"), {
                            ...paymentMethodKeyboard(lang)
                        });
                        return ctx.wizard.back();
                    }

                    if (data === "confirm") {
                        const cart = await repository.cart.findMy(user.id);
                        const newOrder = await repository.order.create({
                            cart,
                            location: user.location,
                            paymentMethod: ctx.session.paymentMethod,
                            userId: user.id
                        });
    
                        await sendNewOrderNotification(newOrder.id, newOrder.user);
    
                        delete ctx.session.paymentMethod;
                        await repository.cart.clear(user.id);
    
                        await ctx.replyWithHTML(i18n.t("ordered", {
                            orderNumber: newOrder.orderNumber
                        }));
    
                        return ctx.scene.enter("start", { home: true });
                    }
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
        console.error(error);
    }
})

export default orderScene;