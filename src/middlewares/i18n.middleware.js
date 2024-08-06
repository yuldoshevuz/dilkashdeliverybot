import i18n from "../config/i18n.config.js";

const i18nInitilization = async (ctx, next) => {
    const userData = await ctx.session.user
    
    ctx.lang = userData.language || "uz";
    i18n.changeLanguage(ctx.lang);
    next();
}

export default i18nInitilization