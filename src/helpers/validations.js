const phoneRegex = /^(\+998)((2|5)0|(3|5|7|8){2}|(9[013-57-9]))\d{7}$/;

export const phoneValidation = (phone) => phoneRegex.test(phone)