import { Markup } from 'telegraf';

// Tugmalarni yaratish
const buttons = {
    switch_to_bot: {
        uz: "🔗 Botga o'tish",
        en: "🔗 Switch to bot",
        ru: "🔗 Перейти на бот" 
    },
    send_contact: {
        uz: "📱 Kontakt yuborish",
        en: "📱 Send contact",
        ru: "📱 Отправить контакт"
    },
    back_to_main_menu: {
        uz: "🏠 Bosh menuga qaytish",
        en: "🏠 Back to main menu",
        ru: "🏠 Вернуться в главное меню"
    },
    send_location: {
        uz: "📍 Joylashuvimni yuborish",
        en: "📍 Send my location",
        ru: "📍 Отправить мое местоположение"
    },
    my_locations: {
        uz: "🗺️ Mening joylashuvlarim",
        en: "🗺️ My locations",
        ru: "🗺️ Мои геолокации"
    },
    menu: {
        uz: "📜 Menyu",
        en: "📜 Menu",
        ru: "📜 Меню"
    },
    book_table: {
        uz: "📅 Joy band qilish",
        en: "📅 Book table",
        ru: "📅 Забронировать стол"
    },
    settings: {
        uz: "⚙️ Sozlamalar",
        en: "⚙️ Settings",
        ru: "⚙️ Настройки"
    },
    rate_us: {
        uz: "⭐ Bizga baho bering",
        en: "⭐ Rate us",
        ru: "⭐ Оценить нас"
    },
    location_contact: {
        uz: "📍 Joylashuv/📞 Kontaktlar",
        en: "📍 Locations /📞 Contacts",
        ru: "📍 Локации/📞 Контакты"
    },
    social_media: {
        uz: "🌐 Ijtimoiy tarmoqlar",
        en: "🌐 Our social media",
        ru: "🌐 Социальные сети"
    },
    back: {
        uz: "⬅️ Orqaga",
        en: "⬅️ Back",
        ru: "⬅️ Назад"
    },
    manual: {
        uz: "📖 Qo'llanma",
        en: "📖 Manual",
        ru: "📖 Руководство"
    },
    send_resume: {
        uz: "📄 Resume yuborish",
        en: "📄 Send resume",
        ru: "📄 Отправить резюме"
    },
    order_togora: {
        uz: "🍲 Tog'ora - Buyurtma uchun",
        en: "🍲 Togora for order",
        ru: "🍲 Togora for order"
    },
    order_phone: {
        uz: "📞 Buyurtma qilish",
        en: "📞 Order",
        ru: "📞 Заказать"
    },
    change_language: {
        uz: "🌐 Tilni o'zgartirish",
        en: "🌐 Change language",
        ru: "🌐 Изменить язык"
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
    add_to_basket: {
        uz: "🛒 Savatga qo'shish",
        en: "🛒 Add to basket",
        ru: "🛒 Добавить в корзину"
    },
    basket: {
        uz: "🛒 Savat",
        en: "🛒 Basket",
        ru: "🛒 Корзина"
    },
    order_meal: {
        uz: "🍽️ Buyurtma berish",
        en: "🍽️ Order meal",
        ru: "🍽️ Заказать еду"
    },
    clear_basket: {
        uz: "🗑️ Savatni tozalash",
        en: "🗑️ Clear basket",
        ru: "🗑️ Очистить корзину"
    },
    delivery_time: {
        uz: "⏰ Yetkazib berish vaqti",
        en: "⏰ Delivery time",
        ru: "⏰ Время доставки"
    },
    cash_payment: {
        uz: "💵 Naqd pul",
        en: "💵 Cash payment",
        ru: "💵 Наличные"
    },
    confirm: {
        uz: "✔️ Tasdiqlash",
        en: "✔️ Confirm",
        ru: "✔️ Подтвердить"
    },
    cancel: {
        uz: "❌ Bekor qilish",
        en: "❌ Cancel",
        ru: "❌ Отменить"
    }
};

// Asosiy menyu tugmalari
export const startKeyboard = (lang) => Markup.keyboard([
    [Markup.button.text(buttons.menu[lang]), Markup.button.text(buttons.book_table[lang])],
    [Markup.button.text(buttons.rate_us[lang]), Markup.button.text(buttons.settings[lang])],
    [Markup.button.text(buttons.location_contact[lang]), Markup.button.text(buttons.social_media[lang])],
    [Markup.button.text(buttons.manual[lang]), Markup.button.text(buttons.send_resume[lang])]
]).resize();

// Boshqa tugmalar uchun misollar
export const contactKeyboard = (lang) => Markup.keyboard([
    [Markup.button.contactRequest(buttons.send_contact[lang])]
]).resize();

export const locationKeyboard = (lang) => Markup.keyboard([
    [Markup.button.locationRequest(buttons.send_location[lang])]
]).resize();

export const basketKeyboard = (lang) => Markup.keyboard([
    [Markup.button.text(buttons.add_to_basket[lang]), Markup.button.text(buttons.clear_basket[lang])],
    [Markup.button.text(buttons.basket[lang]), Markup.button.text(buttons.back[lang])]
]).resize();

export const bookingKeyboard = (lang) => Markup.keyboard([
    [Markup.button.text(buttons.order_meal[lang]), Markup.button.text(buttons.delivery_time[lang])],
    [Markup.button.text(buttons.cash_payment[lang]), Markup.button.text(buttons.confirm[lang])],
    [Markup.button.text(buttons.cancel[lang]), Markup.button.text(buttons.back[lang])]
]).resize();

export const changeLangKeyboard = () => Markup.inlineKeyboard([
    [Markup.button.callback("🇺🇿 O'zbekcha", "language:uz")],
    [Markup.button.callback("🇬🇧 English", "language:en")],
    [Markup.button.callback("🇷🇺 Русский", "language:ru")]
]);