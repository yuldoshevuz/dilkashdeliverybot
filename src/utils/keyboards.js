import { Markup } from 'telegraf';
import { formatTime, getDate, isToday, timeSlots } from '../helpers/date.js';

export const buttons = {
    sendContact: {
        uz: "📱 Kontakt yuborish",
        en: "📱 Send contact",
        ru: "📱 Отправить контакт"
    },
    backToMainMenu: {
        uz: "🏠 Bosh menuga qaytish",
        en: "🏠 Back to main menu",
        ru: "🏠 Вернуться в главное меню"
    },
    sendLocation: {
        uz: "📍 Joylashuvimni yuborish",
        en: "📍 Send my location",
        ru: "📍 Отправить мое местоположение"
    },
    menu: {
        uz: "🥘 Ta'omlar menyusi",
        en: "🥘 Food menu",
        ru: "🥘 Меню еды"
    },
    reservation: {
        uz: "📅 Joy band qilish",
        en: "📅 Book a Table",
        ru: "📅 Забронировать стол"
    },
    settings: {
        uz: "⚙️ Sozlamalar",
        en: "⚙️ Settings",
        ru: "⚙️ Настройки"
    },
    rate_us: {
        uz: "🌟 Baholash",
        en: "🌟 Rate Us",
        ru: "🌟 Оценить"
    },
    location: {
        uz: "📍 Joylashuv",
        en: "📍 Location",
        ru: "📍 Локация"
    },
    googleMaps: {
        uz: "Google Xarita",
        en: "Google Maps",
        ru: "Google Карта"
    },
    yandexMaps: {
        uz: "Yandex Joylashuv",
        en: "Yandex Location",
        ru: "Яндекс Карта"
    },
    connect: {
        uz: "🌐 Ijtimoiy tarmoqlar",
        en: "🌐 Social networks",
        ru: "🌐 Соцсети"
    },
    abousUs: {
        uz: "📋 Biz haqimizda",
        en: "📋 About us",
        ru: "📋 О нас"
    },
    startJob: {
        uz: "🔍 Ishga ariza yuborish",
        en: "🔍 Apply for a Job",
        ru: "🔍 Подать заявку на работу"
    },
    back: {
        uz: "⬅️ Ortga",
        en: "⬅️ Back",
        ru: "⬅️ Назад"
    },
    changeLanguage: {
        uz: "🌐 Tilni o'zgartirish",
        en: "🌐 Change language",
        ru: "🌐 Изменить язык"
    },
    changeAddress: {
        uz: "📍 Manzilni o'zgartirish",
        en: "📍 Change Address",
        ru: "📍 Изменить адрес"
    },
    yes: {
        uz: "✅ Ha",
        en: "✅ Yes",
        ru: "✅ Да"
    },
    no: {
        uz: "❌ Yo'q",
        en: "❌ No",
        ru: "❌ Нет"
    },
    addToCart: {
        uz: "🛒 Savatga qo'shish",
        en: "🛒 Add to basket",
        ru: "🛒 Добавить в корзину"
    },
    cart: {
        uz: "🛒 Savat",
        en: "🛒 Basket",
        ru: "🛒 Корзина"
    },
    order: {
        uz: "🚚 Buyurtma berish",
        en: "🚚 Order meal",
        ru: "🚚 Заказать еду"
    },
    clearCart: {
        uz: "🗑️ Savatni tozalash",
        en: "🗑️ Clear basket",
        ru: "🗑️ Очистить корзину"
    },
    cash_payment: {
        uz: "💵 Naqd pul",
        en: "💵 Cash payment",
        ru: "💵 Наличные"
    },
    confirm: {
        uz: "✅ Tasdiqlash",
        en: "✅ Confirm",
        ru: "✅ Подтвердить"
    },
    cancel: {
        uz: "🚫 Bekor qilish",
        en: "🚫 Cancel",
        ru: "🚫 Отменить"
    }
};

export const startKeyboard = (lang) => Markup.keyboard([
    [Markup.button.text(buttons.menu[lang]), Markup.button.text(buttons.reservation[lang])],
    [Markup.button.text(buttons.rate_us[lang]), Markup.button.text(buttons.settings[lang])],
    [Markup.button.text(buttons.abousUs[lang])]
]).resize();

export const contactKeyboard = (lang) => Markup.keyboard([
    [Markup.button.contactRequest(buttons.sendContact[lang])]
]).resize();

export const sendLocationKeyboard = (lang) => Markup.keyboard([
    [Markup.button.locationRequest(buttons.sendLocation[lang])]
]).resize();

export const settingsKeyboard = (lang) => Markup.keyboard([
    [ Markup.button.text(buttons.changeLanguage[lang]) ],
    [ Markup.button.text(buttons.changeAddress[lang]) ],
    [ Markup.button.text(buttons.back[lang]) ]
]).resize();

export const backKeyboard = (lang) =>
    Markup.keyboard([Markup.button.text(buttons.back[lang])
]).resize();

export const backInlineKeyboard = (lang, cursor) =>
    Markup.inlineKeyboard([ Markup.button.callback(buttons.back[lang], `${cursor}:back`) ])

export const backMainKeyboard = (lang) =>
    Markup.keyboard([Markup.button.text(buttons.backToMainMenu[lang])
]).resize();

export const cancelKeyboard = (lang) =>
    Markup.keyboard([Markup.button.text(buttons.cancel[lang])
]).resize();

export const categoriesKeyboard = (categories, lang) => {
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

    keyboards.unshift([ Markup.button.text(buttons.cart[lang]) ]);
    keyboards.push([ Markup.button.text(buttons.back[lang]) ]);
    return Markup.keyboard(keyboards).resize();
};

export const foodsKeyboard = (foods, lang) => {
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

    keyboards.unshift([ Markup.button.text(buttons.cart[lang]) ]);
    keyboards.push([ Markup.button.text(buttons.back[lang]) ]);
    return Markup.keyboard(keyboards).resize();
}

export const addCartKeyboard = (quantity, foodId, lang) => Markup.inlineKeyboard([
    [
        Markup.button.callback("➖", `decrement:${foodId}:${quantity}`),
        Markup.button.callback(quantity, `quantity:${foodId}:${quantity}`),
        Markup.button.callback("➕", `increment:${foodId}:${quantity}`),
    ],
    [ Markup.button.callback(buttons.addToCart[lang], `addCart:${foodId}:${quantity}`) ]
]);

export const orderOrCancelKeyboard = (lang) => Markup.inlineKeyboard([
    [ Markup.button.callback(buttons.clearCart[lang], "clearCart") ],
    [ Markup.button.callback(buttons.order[lang], "order") ],
    [ Markup.button.callback(buttons.back[lang], "back") ]

]);

export const paymentMethodKeyboard = (lang) => Markup.inlineKeyboard([
    [ Markup.button.callback("🔵 Click", "payment:click"), Markup.button.callback("🟢 Payme", "payment:payme") ],
    [ Markup.button.callback(buttons.cash_payment[lang], "payment:cash") ],
    [ Markup.button.callback(buttons.back[lang], "back:cart") ]
]);

export const selectBookingDateKeyboard = (lang) => {
    const count = 7;
    const keyboards = [[]];

    for (let i = 0; i < count; i++) {
        const lastIndex = keyboards[keyboards.length - 1]
        const keyboard = Markup.button.callback(getDate(i, lang).text, `selectBookTableDate:${getDate(i, lang).data}`)

        if (lastIndex.length < 2) {
            lastIndex.push(keyboard);
        } else {
            keyboards.push([keyboard]);
        }
    };

    return Markup.inlineKeyboard(keyboards);
};

export const selectBookingTimeKeyboard = (lang, selectedDate) => {
    const now = new Date();
    const currentHour = now.getHours();

    const keyboardButtons = timeSlots
        .filter((slot) => {
            return isToday(selectedDate) ? slot.start > currentHour : true
        })
        .map((slot) => {
            const startTime = formatTime(slot.start);
            const endTime = formatTime(slot.end);
            const label = `${startTime}-${endTime}`;

            return Markup.button.callback(label, `selectBookTableTime-${label}`);
        });


    keyboardButtons.push(
        Markup.button.callback(buttons.back[lang], "selectBookTableTime-back")
    );

    const keyboards = [[]];
    
    for (const button of keyboardButtons) {
        const lastItem = keyboards[ keyboards.length - 1 ];
        
        if (lastItem.length < 2) {
            lastItem.push(button);
        } else {
            keyboards.push([ button ]);
        }
    };

    return Markup.inlineKeyboard(keyboards);
};

export const selectPeopleCount = (lang) => {
    const count = 17;
    const keyboards = [[]];

    for (let i = 2; i < count; i++) {
        const keyboard = Markup.button.callback(i, `numberOfPeople:${i}`);
        const lastItem = keyboards[ keyboards.length - 1 ];

        if (lastItem.length < 3) {
            lastItem.push(keyboard);
        } else {
            keyboards.push([ keyboard ]);
        }
    }
    
    keyboards.push([
        Markup.button.callback(buttons.back[lang], "numberOfPeople:back")
    ]);

    return Markup.inlineKeyboard(keyboards);
}

export const confirmOrBackKeyboard = (lang) => Markup.inlineKeyboard([
    [ Markup.button.callback(buttons.confirm[lang], "confirm:confirm") ],
    [ Markup.button.callback(buttons.back[lang], "confirm:back") ]
])

export const rateInlineKeyboard = (cursor) => Markup.inlineKeyboard([
    [ Markup.button.callback("⭐️", `${cursor}:⭐️`) ],
    [ Markup.button.callback("⭐️⭐️", `${cursor}:⭐️⭐️`) ],
    [ Markup.button.callback("⭐️⭐️⭐️", `${cursor}:⭐️⭐️⭐️`) ],
    [ Markup.button.callback("⭐️⭐️⭐️⭐️", `${cursor}:⭐️⭐️⭐️⭐️`) ],
    [ Markup.button.callback("⭐️⭐️⭐️⭐️⭐️", `${cursor}:⭐️⭐️⭐️⭐️⭐️`) ]
]);

export const aboutUsKeyboard = (lang) => Markup.inlineKeyboard([
    [ Markup.button.callback(buttons.location[lang], "ourLocation:40.8604382-69.5878348"), Markup.button.callback(buttons.connect[lang], "socialMedia") ],
    [ Markup.button.callback(buttons.startJob[lang], "startJob") ]
]);

export const ourLocationsKeyboard = (lang) => Markup.inlineKeyboard([
    [
        Markup.button.url(buttons.googleMaps[lang],"https://maps.app.goo.gl/16PpHxidcEWf5uzj9"),
        Markup.button.url(buttons.yandexMaps[lang], "https://yandex.ru/maps/-/CDcwb2o9")
    ]
])

export const changeLangKeyboard = () => Markup.inlineKeyboard([
    [Markup.button.callback("🇺🇿 O'zbekcha", "language:uz")],
    [Markup.button.callback("🇬🇧 English", "language:en")],
    [Markup.button.callback("🇷🇺 Русский", "language:ru")]
]);

export const sendLocationOrBackKeyboard = (lang) => Markup.keyboard([
    [ Markup.button.locationRequest(buttons.sendLocation[lang]) ],
    [ Markup.button.text(buttons.back[lang]) ]
]).resize();