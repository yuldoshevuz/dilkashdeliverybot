import { BaseScene } from "telegraf/scenes";
import i18n from "../../config/i18n.config.js";
import {  } from "../../utils/keyboards.js";
import { adminButtons, backToAdminMenuKeyboard, changeOrderStatusKeyboard, orderKeyboard } from "../../utils/admin.keyboards.js";
import { getOrderNumber, getOrderStatus, makeOrderText } from "../../helpers/order.js";
import repository from "../../repository/repository.js";

const adminViewOrdersScene = new BaseScene("admin:viewOrders");

adminViewOrdersScene.enter(async (ctx) => {
    await ctx.reply(i18n.t("enterOrderNumber"),
        backToAdminMenuKeyboard(ctx.session.lang)
    );
});

adminViewOrdersScene.hears(async (text, ctx) => {
    try {
        const lang = ctx.session.lang;

        if (text === adminButtons.back_to_admin_menu[lang]) {
            return await ctx.scene.enter("admin");
        }

        const orderNumber = getOrderNumber(text);

        if (!orderNumber) {
            return await ctx.reply(
                i18n.t("enterOrderNumber")
            );
        }

        const order = await repository.order.findByNumber(orderNumber, lang);

        if (!order) {
            return await ctx.reply(
                i18n.t("dataNotFound")
            );
        }

        const orderDetails = makeOrderText(order, order.user, lang);

        await ctx.replyWithHTML(orderDetails,
            orderKeyboard(lang, order.id)
        );
    } catch (error) {
        console.error(error);        
    }
})

adminViewOrdersScene.action(async (callbackData, ctx) => {
    try {
        const [ cursor, orderId, status ] = callbackData.split(":");
        const lang = ctx.session.lang;

        if (cursor === "changeOrderStatus") {
            const order = await repository.order.findById(orderId, lang);
            const changeAccess = order.status === "pending" || order.status === "process";

            if (status === "back") {
                ctx.answerCbQuery();
                return await ctx.editMessageReplyMarkup(
                    orderKeyboard(lang, orderId).reply_markup
                );
            }

            if (status === "change" && !changeAccess || !changeAccess) {
                return await ctx.answerCbQuery(i18n.t("cannotChangeStatus"), {
                    show_alert: true
                });
            }


            if (status === "change" && changeAccess) {
                ctx.answerCbQuery();
                return await ctx.editMessageReplyMarkup(
                    changeOrderStatusKeyboard(lang, order.status, orderId).reply_markup
                );
            }


            const statusText = getOrderStatus(status, lang);

            if (status === order.status) {
                return await ctx.answerCbQuery(statusText);
            }

            const updatedOrder = await repository.order.changeStatus(orderId, status, lang);
        
            const orderDetails = makeOrderText(updatedOrder, updatedOrder.user, lang);

            if (status === "canceled" || status === "completed") {
                await ctx.editMessageText(orderDetails, {
                    ...orderKeyboard(lang, orderId),
                    parse_mode: "HTML"
                });
                return await ctx.answerCbQuery(
                    statusText, {
                    show_alert: true
                });
            }

            await ctx.editMessageText(orderDetails, {
                ...changeOrderStatusKeyboard(lang, status, orderId),
                parse_mode: "HTML"
            });

            await ctx.answerCbQuery(
                statusText, {
                show_alert: true
            });
        }

    } catch (error) {
        console.error(error);
        await ctx.answerCbQuery(i18n.t("errorChangingStatus"), {
            show_alert: true
        });
    }
})

export default adminViewOrdersScene;