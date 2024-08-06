import userRepo from "../reposotory/user.repo.js";

const isAuth = async (ctx, next) => {
    let userExists = await userRepo.findByChatId(ctx.from.id)

    if (!userExists) {
        const { id, first_name, last_name } = ctx.from;

        userExists = await userRepo.create({
            chatId: id,
            firstName: first_name,
            lastName: last_name
        })
    }

    if (!userExists.language) {
        ctx.scene.enter("auth");
        return;
    }

    if (!userExists.active) {
        userExists.active = true;
        await userExists.save();
    }

    ctx.session.user = userExists;
    await next();
}

export default isAuth;