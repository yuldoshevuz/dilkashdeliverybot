import axios from "axios";
import randomUserAgent from "random-useragent";
import bot from "../core/bot.js";
import i18n from "../config/i18n.config.js";
import repository from "../repository/repository.js";

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

export const parseHtml = (html) =>
    html.replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const convertMediaGroup = (images) => images?.map((image) => ({
    type: "photo",
    media: image
})) || [];

export const phoneValidation = (phone) =>{
    const phoneRegex = /^(\+998)((2|5)0|(3|5|7|8){2}|(9[013-57-9]))\d{7}$/;
    return phoneRegex.test(phone);
}

export const splitArrayChunk = (chunkSize, array) => {
    if (typeof chunkSize !== "number" || chunkSize <= 0) {
        throw new TypeError("Property chunkSize must be a positive number");
    }

    if (!Array.isArray(array)) {
        throw new TypeError("Property array must be an array");
    }

    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }

    return result;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const fetchLocationAddress = async (latitude, longitude) => {
    const maxAttempts = 10;
    let attempts = 0;

    while(attempts < maxAttempts) {
        const userAgent = randomUserAgent.getRandom();
        const response = await axios.get("https://nominatim.openstreetmap.org/reverse.php", {
            params: {
                lat: latitude,
                lon: longitude,
                zoom: 18,
                format: "jsonv2"
            },
            headers: { "User-Agent": userAgent }
        }).catch(() => null);
        
        const locationData = response?.data;

        if (locationData && locationData.display_name) {
            return {
                address: locationData.display_name,
                latitude,
                longitude
            }
        }

        attempts++
        await sleep(500);
    }

    return null;
}

export const getImageUrl = async (photo) => {
    try {
        if (photo) {
            const lastItem = photo[ photo.length - 1 ];
            const imageLink = await bot.telegram.getFileLink(lastItem.file_id);
    
            if (imageLink?.href) {
                return imageLink.href;
            }
        }
    } catch (error) {
        return null;
    }

    return null;
}

export const sendMessageToAdmin = async (messageKey, messageData) => {
    try {
        const admins = await repository.user.findAdmins();

        for (const admin of admins) {
            const adminLang = admin?.language;
            const message = i18n.t(messageKey, {
                lng: adminLang,
                ...messageData
            });
            await bot.telegram.sendMessage(Number(admin.chatId),
                message, {
                parse_mode: "HTML"
            });
        }
    } catch (error) {
        console.error(error);
    }
};


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


export const makeOrderItemsText = (orderItems, lang) =>
    orderItems.map(({ food: { title, price }, quantity }) =>
    i18n.t("cartItemText", {
        title,
        price,
        quantity,
        lng: lang
}));

export const makeMyOrdersText = (orders, lang) => {
    const yourOrdersText = i18n.t("myOrders", { lng: lang });
    const chunkedOrders = splitArrayChunk(10, orders);
    
    return chunkedOrders.map((chunk, index) => {
        const detailsText = chunk.map(({ orderNumber, status, createdAt }) => 
            i18n.t("myOrderDetails", {
                orderNumber,
                orderTime: formatDateTime(createdAt),
                orderStatus: getOrderStatus(status, lang),
                lng: lang
            })
        ).join("\n➖➖➖➖➖➖\n");

        return index === 0 ? yourOrdersText + detailsText : detailsText;
    });
};

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

export const compareWorkTimeAndCurrent = () => {
    const current = new Date();
    const startWork = new Date();
    const endWork = new Date();

    startWork.setHours(9, 0, 0, 0);
    endWork.setHours(22, 0, 0, 0);

    return current >= startWork && current < endWork;
}