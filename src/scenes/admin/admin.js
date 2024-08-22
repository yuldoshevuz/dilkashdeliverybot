import { BaseScene } from "telegraf/scenes";
import i18n from "../../config/i18n.config.js";
import { adminButtons, adminMainMenuKeyboard } from "../../utils/admin.keyboards.js";
import { buttons } from "../../utils/keyboards.js";
import reposotory from "../../reposotory/reposotory.js";
import { formatBookingDetails } from "../../helpers/date.js";

const adminScene = new BaseScene("admin");

adminScene.enter(async (ctx) => {
    await ctx.replyWithHTML(`<b>${i18n.t("welcomeAdmin")}</b>`, 
        adminMainMenuKeyboard(ctx.session.lang)
    );
});

adminScene.hears(async (button, ctx) => {
    try {
        const { lang } = ctx.session;

        if (button === buttons.back_to_main_menu[lang]) {
            return await ctx.scene.enter("start");
        } else if (button === adminButtons.menu[lang]) {
            return await ctx.scene.enter("admin:menuFood");
        } else if (button === adminButtons.categories_menu[lang]) {
            return await ctx.scene.enter("admin:menuCategory");
        } else if (button === adminButtons.view_bookings[lang]) {
            const bookings = await reposotory.booking.findAllActive();
            if (!bookings.length) {
                return await ctx.reply(i18n.t("noBooking"));
            }

            for (const booking of bookings) {
                const bookingDetails = formatBookingDetails({
                    ...booking,
                    bookingDate: booking.startTime
                });

                await ctx.replyWithHTML(
                    i18n.t("bookingMessage", {
                        ...bookingDetails,
                        timeRange: `${bookingDetails.startTime} - ${bookingDetails.endTime}`
                    })
                );
            }
        }
    } catch (error) {
        console.error(error)
    }
});

export default adminScene;