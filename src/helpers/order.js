import environments from "../config/environments.js";
import i18n from "../config/i18n.config.js";
import bot from "../core/bot.js";
import repository from "../repository/repository.js";
import parseHtml from "./parse.html.js";

export const makeCartText = (cart, deliveryCost) => {
    const foodDetails = cart.items.map(({ food: { title, price }, quantity }) => (
        i18n.t("cartItemText", {
            title,
            price,
            quantity
        })
    ));

    return i18n.t("cartText", {
        cartItems: foodDetails.join("\n"),
        totalQuantity: cart.totalQuantity,
        deliveryCost,
        totalPrice: cart.totalPrice + deliveryCost,
    });
};

export const getOrderStatus = (status, lang) =>
    i18n.t(`orderStatuses.${status}`, { lng: lang });

export const getOrderStatusNoSmile = (status, lang) =>
    getOrderStatus(status, lang).slice(2);

export const getOrderStatusAndCompare = (currentStatus, status, lang) => {
    return currentStatus === status?
        getOrderStatus(status, lang) :
        getOrderStatusNoSmile(status, lang);
}
export const getPaymentMethod = (paymentMethod, lang) =>
    i18n.t(`paymentMethods.${paymentMethod}`, { lng: lang });

export const formatDateTime = (date) =>
    date.toLocaleString("uz");

export const makeOrderItemsText = (orderItems, lang) =>
    orderItems.map(({ food: { title, price }, quantity }) =>
    i18n.t("cartItemText", {
        title,
        price,
        quantity,
        lng: lang
}));

export const makeOrderText = (order, customer, lang) => {
    const {
        orderNumber,
        createdAt,
        location: { address },
        deliveryCost,
        totalAmount,
        paymentMethod,
        status,
        orderItems
    } = order;

    const { firstName, lastName, username, phoneNumber } = customer;

    const orderItemsText = makeOrderItemsText(orderItems, lang).join("\n")

    const orderDetails = i18n.t("orderDetails", {
        orderNumber,
        orderTime: formatDateTime(createdAt),
        customerName: parseHtml(`${firstName} ${lastName || ""}`),
        customerUsername: username && `@${username}` || "mavjud emas",
        customerPhone: phoneNumber,
        address,
        orderItems: orderItemsText,
        productTotal: totalAmount - deliveryCost,
        deliveryCost,
        paymentMethod: getPaymentMethod(paymentMethod, lang),
        totalAmount: totalAmount,
        orderStatus: getOrderStatus(status, lang),
        lng: lang
    });

    return orderDetails;
};

export const makeNewOrderNotificationText = (order, customer, lang) => {
    const orderDetils = makeOrderText(order, customer, lang);
    const newOrderText = i18n.t("newOrder", { lng: lang });

    return `${newOrderText}\n\n${orderDetils}`;
};

export const sendNewOrderNotification = async (orderId, customer) => {
    try {
        const admins = await repository.user.findAdmins();

        for (const admin of admins) {
            const adminLang = admin?.language;
            const order = await repository.order.findById(orderId, adminLang);
            const notificationMessage = makeNewOrderNotificationText(order, customer, adminLang);

            await bot.telegram.sendMessage(Number(admin.chatId),
                notificationMessage, {
                parse_mode: "HTML"
            });
        }
    } catch (error) {
        console.error(error);   
    }
}

export const getOrderNumber = (orderCode) => {
    if (typeof orderCode !== 'string') {
        throw new TypeError('Expected a string as orderCode');
    }

    const regex = /^#(\d+)$/;
    const match = orderCode.match(regex);

    if (!match) {
        return null;
    }

    return parseInt(match[1], 10);
};