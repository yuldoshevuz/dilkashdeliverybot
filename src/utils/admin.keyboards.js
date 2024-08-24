import { Markup } from "telegraf";
import { buttons } from "./keyboards.js";
import { getOrderStatusAndCompare } from "../helpers/index.js";

export const adminButtons = {
    orders: {
        uz: "🛵 Buyurtmalar",
        en: "🛵 Orders",
        ru: "🛵 Заказы"
    },
    menu: {
        uz: "🥘 Menyu",
        en: "🥘 Menu",
        ru: "🥘 Меню"
    },
    foods: {
        uz: "🍲 Ta'omlar",
        en: "🍲 Foods",
        ru: "🍲 Еда"
    },
    addFood: {
        uz: "➕ Ovqat qo'shish",
        en: "➕ Add food",
        ru: "➕ Добавить блюдо"
    },
    delete: {
        uz: "🗑️ O'chirish",
        en: "🗑️ Delete",
        ru: "🗑️ Удалить"
    },
    changePrice: {
        uz: "💰 Narxini o'zgartirish",
        en: "💰 Change Price",
        ru: "💰 Изменить цену"
    },
    previous: "⬅️",
    next: "➡️",
    categoriesMenu: {
        uz: "🍱 Kategoriyalar",
        en: "🍱 Categories",
        ru: "🍱 Категории"
    },
    categories: {
        uz: "🍟 Kategoriyalar",
        en: "🍟 Categories",
        ru: "🍟 Категории"
    },
    addCategory: {
        uz: "➕ Kategoriya qo'shish",
        en: "➕ Add category",
        ru: "➕ Добавить категорию"
    },
    next: {
        uz: "➡️ Keyingisi",
        en: "➡️ Next",
        ru: "➡️ Далее"
    },
    changeOrderStatus: {
        uz: "♻️ Buyurtma holatini o'zgartirish",
        en: "♻️ Change order status",
        ru: "♻️ Изменить статус заказа"
    },
    viewBookings: {
        uz: "📅 Band qilingan joylar",
        en: "📅 Bookings",
        ru: "📅 Забронировано"
    },
    backToAdminMenu: {
        uz: "🏠 Admin menyuga qaytish",
        en: "🏠 Back to Admin Menu",
        ru: "🏠 Вернуться в меню администратора"
    },
    viewReports: {
        uz: "📊 Hisobotlar",
        en: "📊 Reports",
        ru: "📊 Отчеты"
    }
};

export const adminMainMenuKeyboard = (lang) => Markup.keyboard([
    [ Markup.button.text(adminButtons.orders[lang]), Markup.button.text(adminButtons.viewReports[lang]) ],
    [ Markup.button.text(adminButtons.menu[lang]), Markup.button.text(adminButtons.categoriesMenu[lang]) ],
    [ Markup.button.text(adminButtons.viewBookings[lang]) ],
    [ Markup.button.text(buttons.backToMainMenu[lang]) ]
]).resize();

// Ovqatlar menyusi
export const adminMenuKeyboard = (lang) => Markup.keyboard([
    [ Markup.button.text(adminButtons.foods[lang]) ],
    [ Markup.button.text(adminButtons.addFood[lang]), Markup.button.text(adminButtons.delete[lang]) ],
    [ Markup.button.text(adminButtons.backToAdminMenu[lang]) ]
]).resize();

export const backToAdminMenuKeyboard = (lang) => Markup.keyboard([
    [ Markup.button.text(adminButtons.backToAdminMenu[lang]) ]
]).resize();

export const orderKeyboard = (lang, orderId) => Markup.inlineKeyboard([
    [ Markup.button.callback(adminButtons.changeOrderStatus[lang], `orderSettings:${orderId}:change`) ],
    [ Markup.button.callback(buttons.location[lang], `orderSettings:${orderId}:location`) ]
]);

export const deliveryLocationKeyboard = (lang, latitude, longitude) => Markup.inlineKeyboard([
    [
        Markup.button.url(buttons.googleMaps[lang], `https://maps.google.com/maps?q=${latitude},${longitude}&ll=${latitude},${longitude}&z=16`),
        Markup.button.url(buttons.yandexMaps[lang], `https://yandex.com/maps/?ll=${longitude},${latitude}&z=16`)
    ]
])

export const changeOrderStatusKeyboard = (lang, currentStatus, orderId) => Markup.inlineKeyboard([
    [
        Markup.button.callback(getOrderStatusAndCompare(currentStatus, "pending", lang), `changeOrderStatus:${orderId}:pending`),
        Markup.button.callback(getOrderStatusAndCompare(currentStatus, "process", lang), `changeOrderStatus:${orderId}:process`)
    ],
    [
        Markup.button.callback(getOrderStatusAndCompare(currentStatus,"canceled", lang), `changeOrderStatus:${orderId}:canceled`),
        Markup.button.callback(getOrderStatusAndCompare(currentStatus,"completed", lang), `changeOrderStatus:${orderId}:completed`)
    ],
    [ Markup.button.callback(buttons.back[lang], `changeOrderStatus:${orderId}:back`) ]
]);

export const adminFoodsKeyboard = (foods, lang, add) => {
    const keyboards = [[]];

    for (const food of foods) {
        const lastItem = keyboards[ keyboards.length - 1 ];
        const button = Markup.button.text(food.title);

        if (lastItem.length < 2) {
            lastItem.push(button);
        } else {
            keyboards.push([ button ]);
        }
    }

    add && keyboards.unshift([ Markup.button.text(adminButtons.addFood[lang]) ]);
    keyboards.push([ Markup.button.text(buttons.back[lang]) ]);
    return Markup.keyboard(keyboards).resize();
}

export const adminCategoryKeyboard = (lang) => Markup.keyboard([
    [ Markup.button.text(adminButtons.categories[lang]) ],
    [ Markup.button.text(adminButtons.addCategory[lang]), Markup.button.text(adminButtons.delete[lang]) ],
    [ Markup.button.text(adminButtons.backToAdminMenu[lang]) ]
]).resize();

export const adminCategoriesKeyboard = (categories, lang) => {
    const keyboards = [[]]

    for (const category of categories) {
        const lastItem = keyboards[ keyboards.length - 1 ];
        const button = Markup.button.text(category.title);

        if (lastItem.length < 2) {
            lastItem.push(button);
        } else {
            keyboards.push([ button ]);
        }
    }

    keyboards.push([ Markup.button.text(buttons.back[lang]) ]);
    return Markup.keyboard(keyboards).resize();
};

export const adminCategorySettings = (lang, id) => Markup.inlineKeyboard([
    [ Markup.button.callback(adminButtons.foods[lang], `viewFoods:${id}`) ],
    [ Markup.button.callback(adminButtons.addFood[lang], `addFood:${id}`), Markup.button.callback(adminButtons.delete[lang], `deleteCategory:${id}`) ],
    [ Markup.button.callback(adminButtons.backToAdminMenu[lang], `back:admin`) ]
]);

export const adminFoodSettings = (lang, id) => Markup.inlineKeyboard([
    [ Markup.button.callback(adminButtons.changePrice[lang], `changePrice:${id}`), Markup.button.callback(adminButtons.delete[lang], `deleteFood:${id}`) ],
    [ Markup.button.callback(adminButtons.backToAdminMenu[lang], `back:admin`) ]
]);

export const adminNextOrCancelKeyboard = (lang) => Markup.keyboard([
    [ Markup.button.text(adminButtons.next[lang]) ],
    [ Markup.button.text(buttons.cancel[lang]) ]
]).resize();