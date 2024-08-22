import { BaseScene } from "telegraf/scenes";
import reposotory from "../reposotory/reposotory.js";
import i18n from "../config/i18n.config.js";
import { backKeyboard, buttons, orderOrCancelKeyboard } from "../utils/keyboards.js";
import { makeCartText } from "../helpers/order.js";

const cartScene = new BaseScene("cart");

cartScene.enter(async (ctx) => {
    try {
        const user = ctx.session.user;
        const lang = ctx.session.lang;

        const { cursor, back } = ctx.scene.state;
        
        const cart = await reposotory.cart.findMy(user.id, lang);
        
        if (!cart || !cart.items.length) {
            await ctx.reply(i18n.t("cartIsEmpty"));
            return await ctx.scene.enter("menu", { cursor });
        }

        const cartText = makeCartText(cart, 5000);
        
        if (back) {
            return await ctx.editMessageText(cartText, {
                ...orderOrCancelKeyboard(lang),
                parse_mode: "HTML"
            });
        }
        
        await ctx.reply(buttons.basket[lang],
            backKeyboard(lang)
        );
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
            await reposotory.cart.clear(ctx.session.user.id);
            return await ctx.scene.enter("menu");
        }

        if (data === "order") {
            return await ctx.scene.enter("order");
        }
    } catch (error) {
        console.error(error);
    }
})

cartScene.hears(async (button, ctx) => {
    try {
        const lang = ctx.session.lang;

        if (button === buttons.back[lang]) {
            return await ctx.scene.enter("menu");
        }
    } catch (error) {
        console.error(error);
    }
});

export default cartScene;