import i18n from "../config/i18n.config.js";

const i18nInitilization = async (ctx, next) => {
    const userData = await ctx.session.user
    
    ctx.session.lang = userData.language || "uz";
    i18n.changeLanguage(ctx.session.lang);
    next();
}

export default i18nInitilization