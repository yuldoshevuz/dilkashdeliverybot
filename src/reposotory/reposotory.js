import Booking from "./booking.js";
import CartItem from "./cart.item.js";
import Cart from "./cart.js";
import Category from "./category.js";
import Food from "./food.js";
import User from "./user.js";

const reposotory = {
    user: new User(),
    category: new Category(),
    food: new Food(),
    booking: new Booking(),
    cart: new Cart(),
    cartItem: new CartItem()
}

export default reposotory;