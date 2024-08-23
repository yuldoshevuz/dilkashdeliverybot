import { BaseScene } from "telegraf/scenes";
import repository from "../../repository/repository.js";
import { formatBookingDetails } from "../../helpers/date.js";
import i18n from "../../config/i18n.config.js";

const adminViewBooking = new BaseScene("admin:viewBooking");

adminViewBooking.enter(async (ctx) => {
    try {
        const bookings = await repository.booking.findAllActive();
        if (!bookings.length) {
            await ctx.reply(i18n.t("noBooking"));
            return await ctx.scene.enter("admin", {}, true);
        }

        for (const booking of bookings) {
            const { startTime, endTime, ...rest } = formatBookingDetails({
                ...booking,
                bookingDate: booking.startTime
            });

            await ctx.replyWithHTML(
                i18n.t("bookingMessage", {
                    ...rest,
                    timeRange: `${startTime} - ${endTime}`
                })
            );

            await ctx.scene.enter("admin", {}, true);
        }
    } catch (error) {
        console.error(error);    
    }
})

export default adminViewBooking;