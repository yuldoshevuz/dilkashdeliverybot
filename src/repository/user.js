import environments from "../config/environments.js";
import prisma from "../config/prisma.client.js";
import bot from "../core/bot.js";
import Model from "./index.js";

class User extends Model {
    constructor() {
        super(prisma.user);
    }

    async findByChatId(chatId) {
        return await this.findOne({ chatId: BigInt(chatId) });
    }

    async activeCount() {
        const users = await this.findAll({ active: true });
        const activeUsers = []

        for (const user of users) {
            const action = await bot.telegram
                .sendChatAction(Number(user.chatId), "typing")
                .catch(() => false);
            
            if (action) {
                activeUsers.push(user);
            } else {
                await this.updateById(user.id, { active: false });
            }
        }

        return activeUsers.length;
    }

    async findAdmins() {
        const adminUsers = await this.findAll({ isAdmin: true });
        const admins = [ ...adminUsers ];

        if (environments.ADMINS?.length) {
            for (const chatId of environments.ADMINS) {
                const admin = await this.findByChatId(chatId);

                admin && admins.push(admin);
            }
        }

        return admins;
    }
}

export default User;