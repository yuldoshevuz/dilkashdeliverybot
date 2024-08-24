import i18n from "../config/i18n.config.js";
import { compareWorkTimeAndCurrent } from "../helpers/index.js"

const isWorkTime = async (ctx, next) => {
    const currentIsWorkTime = compareWorkTimeAndCurrent();

    if (!currentIsWorkTime) {
        const warningMsg = i18n.t("workTimeOff")

        if (ctx.message) {
            await ctx.reply(warningMsg);
        } else if (ctx.callbackQuery) {
            await ctx.answerCbQuery(warningMsg, { show_alert: true });
        }
        return;
    }

    next();
}

export default isWorkTime;