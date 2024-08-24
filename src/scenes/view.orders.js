import { BaseScene } from "telegraf/scenes";
import repository from "../repository/repository.js";
import i18n from "../config/i18n.config.js";
import { getOrderNumber, makeMyOrdersText, makeOrderText } from "../helpers/index.js";
import { backMainKeyboard, buttons } from "../utils/keyboards.js";

const viewMyOrders = new BaseScene("viewMyOrders");

viewMyOrders.enter(async (ctx) => {
    const { user, lang } = ctx.session;

    const pendingMsg = await ctx.reply("⏳");

    const myOrders = await repository.order.findMyAll(user.id);

    await ctx.deleteMessage(pendingMsg.message_id);

    if (!myOrders.length) {
        await ctx.reply(i18n.t("noOrders"));
        return ctx.scene.enter("start", {}, true);
    }

    const myOrderDetails = makeMyOrdersText(myOrders, lang);

    for (const detailsText of myOrderDetails) {
        await ctx.replyWithHTML(detailsText);
    }
    await ctx.reply(
        i18n.t("enterYourOrderNumber"),
        backMainKeyboard(lang)
    );
})

viewMyOrders.hears(async (text, ctx) => {
    try {
        const { lang, user } = ctx.session;

        if (text === buttons.backToMainMenu[lang]) {
            return await ctx.scene.enter("start", { home: true });
        }

        const orderNumber = getOrderNumber(text);

        if (!orderNumber) {
            return ctx.reply(i18n.t("enterOrderNumber"));
        }

        const order = await repository.order.findMy(orderNumber, user.id, lang);

        if (!order) {
            return ctx.reply(i18n.t("dataNotFound"));
        }

        const orderDetails = makeOrderText(order, order.user, lang);

        await ctx.replyWithHTML(orderDetails);
    } catch (error) {
        console.error(error);        
    }
})

export default viewMyOrders;