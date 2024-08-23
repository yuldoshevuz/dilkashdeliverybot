import { BaseScene } from "telegraf/scenes";
import repository from "../../repository/repository.js";
import i18n from "../../config/i18n.config.js";
import { formatDateTime } from "../../helpers/order.js";

const adminViewReport = new BaseScene("admin:viewReport");

adminViewReport.enter(async (ctx) => {
    try {
        const pendingMsg = await ctx.reply("⏳");

        const activeUsers = await repository.user.activeCount();
        const totalOrders = await repository.order.count();
        const deliveredOrders = await repository.order.deliveredCount();
        const canceledOrders = await repository.order.canceledCount();
        const otherOrders = await repository.order.othersCount();
        const todayOrders = await repository.order.todayCount();

        await ctx.deleteMessage(pendingMsg.message_id);

        await ctx.replyWithHTML(
            i18n.t("report", {
                activeUsers,
                totalOrders,
                deliveredOrders,
                canceledOrders,
                otherOrders,
                todayOrders,
                lastUpdated: formatDateTime(new Date())
            })
        );

        await ctx.scene.enter("admin", {}, true);
    } catch (error) {
        console.error(error);    
    }
})

export default adminViewReport;