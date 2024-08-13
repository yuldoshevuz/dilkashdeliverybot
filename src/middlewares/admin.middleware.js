import reposotory from "../reposotory/reposotory.js";

const isAdmin = async (ctx, next) => {
    try {
        const admins = await reposotory.user.findAdmins();     
        const userIsAdmin = admins.find((user) => Number(user?.chatId) === ctx.from.id);
        if (userIsAdmin) {
            return next();
        }
        
        await ctx.replyWithHTML(`<b>${ctx.from.id}</b>`);
    } catch (error) {
        console.log(error);
    }
};

export default isAdmin