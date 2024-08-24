import { BaseScene } from "telegraf/scenes";
import i18n from "../../config/i18n.config.js";
import { adminButtons, backToAdminMenuKeyboard } from "../../utils/admin.keyboards.js";
import sendMessageToAll from "../../helpers/send.message.js";
import { parseHtml } from "../../helpers/index.js";
import { confirmOrBackKeyboard } from "../../utils/keyboards.js";

const sendMessageScene = new BaseScene("admin:newMessage");

sendMessageScene.enter(async (ctx) => {
    await ctx.reply(i18n.t("enterMessageText"),
        backToAdminMenuKeyboard(ctx.session.lang)
    );
});

sendMessageScene.hears(async (messageText, ctx) => {
    try {
        const lang = ctx.session.lang;

        if (messageText === adminButtons.backToAdminMenu[lang]) {
            delete ctx.session.messageText;
            return ctx.scene.enter("admin");
        }
        
        ctx.session.messageText = parseHtml(messageText);

        await ctx.reply(parseHtml(messageText));
        await ctx.reply(i18n.t("confirmMessage"),
            confirmOrBackKeyboard(lang)
        );
    } catch (error) {
        console.error(error);
        await ctx.reply(i18n.t("enterMessageText"));
    }
});

sendMessageScene.action(async (callbackData, ctx) => {
    try {
        ctx.answerCbQuery();
        const [ cursor, data ] = callbackData.split(":");

        if (cursor === "confirm") {
            if (data === "back") {
                await ctx.deleteMessage();
                return await ctx.scene.reenter();
            }

            const { messageText } = ctx.session;

            if (data === "confirm" && messageText) {
                const pendingMsg = await ctx.reply("⏳");
                const sendedCount = await sendMessageToAll(ctx, messageText);

                await ctx.deleteMessage(pendingMsg.message_id);
                delete ctx.session.messageText;

                await ctx.replyWithHTML(i18n.t("messageSent", {
                    count: sendedCount
                }));
                return await ctx.scene.enter("admin");
            }
        }
    } catch (error) {
        console.error(error);
        
    }
})

export default sendMessageScene;