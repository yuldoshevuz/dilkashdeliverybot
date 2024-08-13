import environments from "../config/environments.js";
import prisma from "../config/prisma.client.js";
import Model from "./index.js";

class User extends Model {
    constructor() {
        super(prisma.user);
    }

    async findByChatId(chatId) {
        return await this.findOne({ chatId });
    }

    async findAdmins() {
        const adminUsers = await this.findAll({ isAdmin: true });
        const admins = [ ...adminUsers ];

        if (environments.ADMINS?.length) {
            for (const chatId of environments.ADMINS) {
                const admin = await this.findByChatId(BigInt(chatId));

                admins.push(admin);
            }
        }

        return admins;
    }
}

export default User;