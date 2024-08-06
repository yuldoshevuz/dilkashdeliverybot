import { Markup } from 'telegraf';

// Tugmalarni yaratish
const buttons = {
    resume_sending: {
        uz: "↗️ Botga o'tish.",
        en: "↗️ Switch to bot.",
        ru: "↗️ Перейти на бот."
    },
    send_contact: {
        uz: "📞 Kontakt yuborish",
        en: "📞 Send contact",
        ru: "📞 Отправить контакт"
    },
    back_to_main_menu: {
        uz: "🔙 Bosh menuga qaytish",
        en: "🔙 Back to Main Menu",
        ru: "🔙 Вернуться в главное меню"
    },
    send_location: {
        uz: "📍 Joylashuvimni yuborish",
        en: "📍 Send my location",
        ru: "📍 Отправить мое местоположение"
    },
    my_locations: {
        uz: "📍Mening geolokatsiyalarim",
        en: "My Locations",
        ru: "Мои геолокации"
    },
    menu_text: {
        uz: "🍴Menyu",
        en: "🍴Menu",
        ru: "🍴Меню"
    },
    book_table: {
        uz: "🪑Joy band qilish",
        en: "🪑Book Table",
        ru: "🪑Забронировать стол"
    },
    settings_text: {
        uz: "⚙ Sozlamalar",
        en: "⚙ Settings",
        ru: "⚙ Настройки"
    },
    rate_me: {
        uz: "🌟Bizga baho bering",
        en: "🌟 Rate me",
        ru: "🌟 Оценить меня"
    },
    location_contact: {
        uz: "📍Lokatsiya/👤Kontaktlar",
        en: "📍Locations /👤Contacts",
        ru: "📍Локации/👤Контакты"
    },
    social_media: {
        uz: "📲Ijtimoiy tarmoqlar",
        en: "📲Our Social Media",
        ru: "📲Социальные сети"
    },
    back_button: {
        uz: "🔙Orqaga",
        en: "🔙Back",
        ru: "🔙Назад"
    },
    manual: {
        uz: "🗂Qo'llanma",
        en: "🗂Manual",
        ru: "🗂Руководство"
    },
    resume: {
        uz: "📑Resume yuborish",
        en: "📑Send resume",
        ru: "📑Отправить резюме"
    },
    go_delivery: {
        uz: "Tog'ora - Buyurtma uchun",
        en: "Togora for order",
        ru: "Togora for order"
    },
    phone_delivery: {
        uz: "📞Buyurtma qilish",
        en: "📞Order",
        ru: "📞Доставка"
    },
    back_button_name: {
        uz: "🔙Orqaga",
        en: "🔙Back",
        ru: "🔙Назад"
    },
    change_language_text: {
        uz: "Tilni o'zgartirish",
        en: "Change Language",
        ru: "Изменить язык"
    },
    yes_word: {
        uz: "✅Ha",
        en: "✅Yes",
        ru: "✅Да"
    },
    no_word: {
        uz: "❌Yo'q",
        en: "❌No",
        ru: "❌Нет"
    },
    save_to_basket: {
        uz: "📥Savatga qo'shish",
        en: "📥Add to Basket",
        ru: "📥Добавить в корзину"
    },
    basket_button: {
        uz: "📥Savat",
        en: "📥Basket",
        ru: "📥Корзина"
    },
    booking_meal: {
        uz: "🚖Buyurtma berish",
        en: "🚖Order Meal",
        ru: "🚖Заказать еду"
    },
    clear_basket: {
        uz: "🗑Savatni tozalash",
        en: "🗑Clear Basket",
        ru: "🗑Очистить корзину"
    },
    time_delivery: {
        uz: "🕒Yetkazib berish vaqti",
        en: "🕒Delivery Time",
        ru: "🕒Время доставки"
    },
    cash_payment: {
        uz: "💵Naqd pul",
        en: "💵Cash Payment",
        ru: "💵Наличные"
    },
    conformation: {
        uz: "✅Tasdiqlash",
        en: "✅Confirm",
        ru: "✅Подтвердить"
    },
    cancel: {
        uz: "❌Bekor qilish",
        en: "❌Cancel",
        ru: "❌Отменить"
    }
};

// Asosiy menyu tugmalari
export const startKeyboard = (lang) => Markup.keyboard([
    [Markup.button.text(buttons.menu_text[lang]), Markup.button.text(buttons.book_table[lang])],
    [Markup.button.text(buttons.rate_me[lang]), Markup.button.text(buttons.settings_text[lang])],
    [Markup.button.text(buttons.location_contact[lang]), Markup.button.text(buttons.social_media[lang])],
    [Markup.button.text(buttons.manual[lang]), Markup.button.text(buttons.resume[lang])]
]).resize();

// Boshqa tugmalar uchun misollar
export const contactKeyboard = (lang) => Markup.keyboard([
    [ Markup.button.contactRequest(buttons.send_contact[lang]) ]
]).resize()

export const locationKeyboard = (lang) => Markup.keyboard([
    [ Markup.button.locationRequest(buttons.send_location[lang]) ]
]).resize();

// export const contactKeyboard = (lang) => Markup.keyboard([
//     [Markup.button.text(buttons.send_contact[lang]), Markup.button.text(buttons.send_location[lang])],
//     [Markup.button.text(buttons.my_locations[lang]), Markup.button.text(buttons.back_to_main_menu[lang])]
// ]);

export const basketKeyboard = (lang) => Markup.keyboard([
    [Markup.button.text(buttons.save_to_basket[lang]), Markup.button.text(buttons.clear_basket[lang])],
    [Markup.button.text(buttons.basket_button[lang]), Markup.button.text(buttons.back_button[lang])]
]).resize();

export const bookingKeyboard = (lang) => Markup.keyboard([
    [Markup.button.text(buttons.booking_meal[lang]), Markup.button.text(buttons.time_delivery[lang])],
    [Markup.button.text(buttons.cash_payment[lang]), Markup.button.text(buttons.conformation[lang])],
    [Markup.button.text(buttons.cancel[lang]), Markup.button.text(buttons.back_button[lang])]
]).resize();

export const changeLangKeyboard = () => Markup.inlineKeyboard([
    [ Markup.button.callback("🇺🇿 O'zbekcha", "language:uz") ],
    [ Markup.button.callback("🇬🇧 English", "language:en") ],
    [ Markup.button.callback("🇷🇺 Русский", "language:ru") ]
])