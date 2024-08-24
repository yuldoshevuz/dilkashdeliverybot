import { BaseScene } from "telegraf/scenes";
import i18n from "../../config/i18n.config.js";
import { adminButtons, backToAdminMenuKeyboard, changeOrderStatusKeyboard, deliveryLocationKeyboard, orderKeyboard } from "../../utils/admin.keyboards.js";
import { getOrderNumber, getOrderStatus, makeOrderText } from "../../helpers/index.js";
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

        if (text === adminButtons.backToAdminMenu[lang]) {
            return ctx.scene.enter("admin");
        }

        const orderNumber = getOrderNumber(text);

        if (!orderNumber) {
            return ctx.reply(i18n.t("enterOrderNumber"));
        }

        const order = await repository.order.findByNumber(orderNumber, lang);

        if (!order) {
            return ctx.reply(i18n.t("dataNotFound"));
        }

        const orderDetails = makeOrderText(order, order.user, lang);

        await ctx.replyWithHTML(orderDetails, orderKeyboard(lang, order.id));
        ctx.session.locationSended = false;
    } catch (error) {
        console.error(error);        
    }
});

adminViewOrdersScene.action(async (callbackData, ctx) => {
    try {
        const [cursor, orderId, data] = callbackData.split(":");
        const lang = ctx.session.lang;

        if (cursor === "orderSettings") {
            await handleOrderSettings(ctx, orderId, data, lang);
        } else if (cursor === "changeOrderStatus") {
            await handleChangeOrderStatus(ctx, orderId, data, lang);
        }

    } catch (error) {
        console.error(error);
        await ctx.answerCbQuery(i18n.t("errorChangingStatus"), { show_alert: true });
    }
});

async function handleOrderSettings(ctx, orderId, data, lang) {
    const order = await repository.order.findById(orderId, lang);
    const changeAccess = ["pending", "process"].includes(order.status);

    if (data === "location" && !ctx.session.locationSended) {
        const { latitude, longitude } = order.location;

        await ctx.replyWithLocation(latitude, longitude, deliveryLocationKeyboard(lang, latitude, longitude));
        await ctx.answerCbQuery(i18n.t("deliveryLocation"), { show_alert: true });
        ctx.session.locationSended = true;
        return;
    }

    if (data === "change") {
        if (changeAccess) {
            await ctx.editMessageReplyMarkup(
                changeOrderStatusKeyboard(lang, order.status, orderId)
                .reply_markup
            );
            ctx.answerCbQuery();
        } else {
            await ctx.answerCbQuery(i18n.t("cannotChangeStatus"), {
                show_alert: true
            });
        }
    } else {
        ctx.answerCbQuery();
    }
}

async function handleChangeOrderStatus(ctx, orderId, status, lang) {
    const order = await repository.order.findById(orderId, lang);
    const changeAccess = ["pending", "process"].includes(order.status);
    const statusText = getOrderStatus(status, lang);

    if (status === "back") {
        await ctx.editMessageReplyMarkup(
            orderKeyboard(lang, orderId).reply_markup
        );
        ctx.answerCbQuery();
        return;
    }

    if (!changeAccess) {
        await ctx.answerCbQuery(i18n.t("cannotChangeStatus"), {
            show_alert: true
        });
        return;
    }

    if (status === order.status) {
        await ctx.answerCbQuery(statusText);
        return;
    }

    const updatedOrder = await repository.order.changeStatus(orderId, status, lang);
    const orderDetails = makeOrderText(updatedOrder, updatedOrder.user, lang);

    if (["canceled", "completed"].includes(status)) {
        await ctx.editMessageText(orderDetails, {
            ...orderKeyboard(lang, orderId),
            parse_mode: "HTML"
        });
    } else {
        await ctx.editMessageText(orderDetails, {
            ...changeOrderStatusKeyboard(lang, status, orderId),
            parse_mode: "HTML"
        });
    }

    await ctx.answerCbQuery(statusText, {
        show_alert: true
    });
}

export default adminViewOrdersScene;
