import Booking from "./booking.js";
import CartItem from "./cart.item.js";
import Cart from "./cart.js";
import Category from "./category.js";
import Food from "./food.js";
import OrderItem from "./order.item.js";
import Order from "./order.js";
import User from "./user.js";

const repository = {
    user: new User(),
    category: new Category(),
    food: new Food(),
    booking: new Booking(),
    cart: new Cart(),
    cartItem: new CartItem(),
    order: new Order(),
    orderItem: new OrderItem()
}

export default repository;