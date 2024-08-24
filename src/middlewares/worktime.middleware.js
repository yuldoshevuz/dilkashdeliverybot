import i18n from "../config/i18n.config.js";
import { compareWorkTimeAndCurrent } from "../helpers/index.js";
import { buttons } from "../utils/keyboards.js";

const isWorkTime = async (ctx, next) => {
    if (compareWorkTimeAndCurrent()) {
        return next();
    }

    const warningMsg = i18n.t("workTimeOff");
    const lang = ctx.session?.lang;
    const ignoredTexts = [buttons.cancel[lang], buttons.back[lang]];

    if (ctx.message) {
        const messageText = ctx.message.text;

        if (ignoredTexts.includes(messageText)) {
            return next();
        }

        await ctx.reply(warningMsg);
    } else if (ctx.callbackQuery) {
        const data = ctx.callbackQuery.data;

        if (/back|cancel/.test(data)) {
            return next();
        }

        await ctx.answerCbQuery(warningMsg, { show_alert: true });
    }
};

export default isWorkTime;