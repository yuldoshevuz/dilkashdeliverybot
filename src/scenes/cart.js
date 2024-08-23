import { BaseScene } from "telegraf/scenes";
import repository from "../repository/repository.js";
import i18n from "../config/i18n.config.js";
import { backKeyboard, buttons, orderOrCancelKeyboard } from "../utils/keyboards.js";
import { makeCartText } from "../helpers/order.js";
import environments from "../config/environments.js";

const cartScene = new BaseScene("cart");

cartScene.enter(async (ctx) => {
    try {
        const user = ctx.session.user;
        const lang = ctx.session.lang;

        const { cursor, back } = ctx.scene.state;
        
        const cart = await repository.cart.findMy(user.id, lang);
        
        if (!cart?.items.length) {
            await ctx.reply(i18n.t("cartIsEmpty"));
            return await ctx.scene.enter("menu", { cursor });
        }

        const cartText = makeCartText(cart, environments.DELIVERY_COST);
        
        if (back) {
            return await ctx.editMessageText(cartText, {
                ...orderOrCancelKeyboard(lang),
                parse_mode: "HTML"
            });
        }

        await ctx.reply(buttons.basket[lang], {
            reply_markup: { remove_keyboard: true }
        });
        await ctx.replyWithHTML(cartText,
            orderOrCancelKeyboard(lang)
        );
    } catch (error) {
        console.error(error);
        
    }
});

cartScene.action(async (data, ctx) => {
    try {
        ctx.answerCbQuery();

        if (data === "clearCart") {
            await repository.cart.clear(ctx.session.user.id);
            return await ctx.scene.enter("menu");
        }

        if (data === "order") {
            return await ctx.scene.enter("order");
        }

        if (data === "back") {
            return await ctx.scene.enter("menu");
        }
    } catch (error) {
        console.error(error);
    }
});

export default cartScene;