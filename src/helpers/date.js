const months = {
    uz: [ "yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr" ],
    en: [ "january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december" ],
    ru: [ "января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря" ]
};

export const timeSlots = [
    { start: 9, end: 10.5 },
    { start: 11, end: 12.5 },
    { start: 13, end: 14.5 },
    { start: 15, end: 16.5 },
    { start: 17, end: 18.5 },
    { start: 19, end: 20.5 },
    { start: 21, end: 22 }
];


export const getDate = (daysAhead, lang) => {
    const date = new Date();
    date.setDate(date.getDate() + daysAhead);
    const day = date.getDate();
    const month = date.getMonth();

    switch (lang) {
        case "uz":
            return {
                text: `${day}-${months.uz[month]}`,
                data: `${day}:${month}`
            };
        case "en":
            return {
                text: `${months.en[month]} ${day}`,
                data: `${day}:${month}`
            };
        case "ru":
            return {
                text: `${day} ${months.ru[month]}`,
                data: `${day}:${month}`
            };
        default:
            return {
                text: `${day}-${months.uz[month]}`,
                data: `${day}:${month}`
            }; // Default fallback
    }
};

export const isToday = (selectedDate) => {
    const today = new Date();
    const date = new Date(selectedDate)

    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
}

export const formatTime = (decimalHours) => {
    const hours = Math.floor(decimalHours);
    const minutes = (decimalHours % 1) * 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const formatBookingDetails = (bookingDetails) => {
    const bookingDate = new Date(bookingDetails.bookingDate).toLocaleDateString("uz");
    const startTime = bookingDetails.startTime.toLocaleTimeString("uz").slice(0, 5);
    const endTime = bookingDetails.endTime.toLocaleTimeString("uz").slice(0, 5);
    const { customerName } = bookingDetails;
    const { numberOfPeople } = bookingDetails;
    const { contactNumber } = bookingDetails;

    return { bookingDate, startTime, endTime, customerName, numberOfPeople, contactNumber };
};