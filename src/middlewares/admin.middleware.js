import repository from "../repository/repository.js";

const isAdmin = async (ctx, next) => {
    try {
        const admins = await repository.user.findAdmins();     
        const userIsAdmin = admins.find((user) => Number(user?.chatId) === ctx.from.id);
        if (userIsAdmin) {
            return next();
        }
        
        await ctx.replyWithHTML(`<b>${ctx.from.id}</b>`);
    } catch (error) {
        console.error(error);
    }
};

export default isAdmin