import Booking from "./booking.model.js";
import Category from "./category.model.js";
import Food from "./food.model.js";
import Image from "./image.model.js";
import OrderItem from "./order.item.model.js";
import Order from "./order.model.js";
import User from "./user.model.js";

// Relationships
Category.hasMany(Food, { foreignKey: "categoryId" });
Food.belongsTo(Category, { foreignKey: "categoryId" });

User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Booking, { foreignKey: "customerId" });
Booking.belongsTo(User, { foreignKey: "customerId" });

Order.hasMany(OrderItem, { foreignKey: "orderId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

Food.hasMany(OrderItem, { foreignKey: "foodId" });
OrderItem.belongsTo(Food, { foreignKey: "foodId" });

Food.hasMany(Image, { foreignKey: "foodId" });
Image.belongsTo(Food, { foreignKey: "foodId" });

Category.hasMany(Image, { foreignKey: "categoryId" });
Image.belongsTo(Category, { foreignKey: "categoryId" });

const models = {
    User,
    Category,
    Food,
    Order,
    OrderItem,
    Booking
}

export default models