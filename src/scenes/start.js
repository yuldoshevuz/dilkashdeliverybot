import { BaseScene } from "telegraf/scenes";
import { startKeyboard } from "../utils/keyboards.js";
import i18n from "../config/i18n.config.js";
const startScene = new BaseScene("start")

startScene.enter(async (ctx) => {
    await ctx.reply(i18n.t("selectOptions"),
        startKeyboard(ctx.session.lang)
    );
});

startScene.hears(/^📅 (Joy band qilish|Book table|Забронировать стол)$/, async (ctx) => ctx.scene.enter("booking"));

export default startScene;