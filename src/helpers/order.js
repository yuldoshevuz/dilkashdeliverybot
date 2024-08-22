import i18n from "../config/i18n.config.js";

export const makeCartText = (cart, deliveryPrice) => {
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
        deliveryPrice,
        totalPrice: cart.totalPrice + deliveryPrice,
    });
}