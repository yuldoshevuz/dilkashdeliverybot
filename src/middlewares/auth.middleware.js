import repository from "../repository/repository.js";

const isAuth = async (ctx, next) => {
    let user = await repository.user.findByChatId(ctx.from?.id);
    if (!user) {
        const { id, first_name, last_name, username } = ctx.from;

        user = await repository.user.create({
            chatId: id,
            firstName: first_name,
            lastName: last_name,
            username
        });
    }

    if (!user.language) {
        ctx.scene.enter("auth");
        return;
    }

    if (!user.active) {
        user = await repository.user
            .updateById(user.id, { active: true });
    }

    ctx.session.user = user;
    await next();
}

export default isAuth;