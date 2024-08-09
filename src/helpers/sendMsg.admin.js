import environments from "../config/environments.js";
import i18n from "../config/i18n.config.js";
import bot from "../core/bot.js";
import userRepo from "../reposotory/user.repo.js";

const sendMessageToAdmin = async (messageKey, messageData) => {
    try {
        const users = await userRepo.findAll({ where: { isAdmin: true } }) || [];
        const admins = [...users];
        
        if (environments.ADMINS.length) {
            for (const adminId of environments.ADMINS) {
                const admin = await userRepo.findByChatId(+adminId);
                admins.push(admin);
            }
        }

        for (const admin of admins) {
            // Adminning tilini aniqlash
            const adminLang = admin.language;

            // Xabarni adminning tiliga tarjima qilish
            const message = i18n.t(messageKey, {
                lng: adminLang,
                ...messageData
            });

            // Adminga xabar yuborish
            await bot.telegram.sendMessage(admin.chatId, message, { parse_mode: "HTML" });
        }
    } catch (error) {
        console.log(error);
    }
};

export default sendMessageToAdmin;
