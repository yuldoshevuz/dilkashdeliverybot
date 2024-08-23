import i18n from "../config/i18n.config.js";
import bot from "../core/bot.js";
import repository from "../repository/repository.js";
const sendMessageToAdmin = async (messageKey, messageData) => {
    try {
        const admins = await repository.user.findAdmins();

        for (const admin of admins) {
            const adminLang = admin?.language;
            const message = i18n.t(messageKey, {
                lng: adminLang,
                ...messageData
            });
            await bot.telegram.sendMessage(Number(admin.chatId),
                message, {
                parse_mode: "HTML"
            });
        }
    } catch (error) {
        console.error(error);
    }
};

export default sendMessageToAdmin;
