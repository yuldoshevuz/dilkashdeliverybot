import i18n from "../config/i18n.config.js";
import prisma from "../config/prisma.client.js";
import bot from "../core/bot.js";
import repository from "../repository/repository.js";

const sendMessageToAll = async (ctx, messageText) => {
    try {
        const activeUsers = await repository.user.findAll({ active: true });
        let sendedCount = 0;

        const sendMessageTasks = activeUsers.map(async (user) => {
            try {
                await bot.telegram.sendMessage(
                    Number(user.chatId),
                    messageText,
                    { parse_mode: "HTML" }
                );
                sendedCount++;
            } catch (error) {
                await repository.user.updateById(user.id, { active: false });
            }
        });

        await Promise.all(sendMessageTasks);

        return sendedCount;
    } catch (error) {
        console.error("Error in sendMessageToAll:", error);
        if (ctx && ctx.reply) {
            await ctx.reply(i18n.t("errorText"));
        }
        throw new Error("Failed to send messages to all users");
    }
};

export default sendMessageToAll;