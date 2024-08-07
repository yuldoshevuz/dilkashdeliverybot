import environments from "../config/environments.js";
import userRepo from "../reposotory/user.repo.js";

const isAdmin = async (ctx, next) => {
    try {
        const user = ctx.session.user || await userRepo.findByChatId(ctx.from.id);
        const admins = environments.ADMINS.find(id => +id === ctx.from.id);

        if (user && (user.isAdmin || admins)) {
            ctx.session.user = user;
            return next();
        }
        await ctx.replyWithHTML(`<b>${ctx.from.id}</b>`);
    } catch (error) {
        console.log(error);
    }
};

export default isAdmin