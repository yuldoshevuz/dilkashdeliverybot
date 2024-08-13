import reposotory from "../reposotory/reposotory.js";

const isAuth = async (ctx, next) => {
    let user = await reposotory.user.findByChatId(ctx.from?.id);
    if (!user) {
        const { id, first_name, last_name } = ctx.from;

        user = await reposotory.user.create({
            chatId: id,
            firstName: first_name,
            lastName: last_name
        });
    }

    if (!user.language) {
        ctx.scene.enter("auth");
        return;
    }

    if (!user.active) {
        user = await reposotory.user
            .updateById(user.id, { active: true });
    }

    ctx.session.user = user;
    await next();
}

export default isAuth;