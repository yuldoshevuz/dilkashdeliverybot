import Category from "./category.model.js";
import MenuItem from "./menu.item.model.js";
import OrderItem from "./order.item.model.js";
import Order from "./order.model.js";
import Restaurant from "./restaurant.model.js";
import User from "./user.model.js";

// Relationships
Category.hasMany(MenuItem, { foreignKey: "categoryId" });
MenuItem.belongsTo(Category, { foreignKey: "categoryId" });

Restaurant.hasMany(MenuItem, { foreignKey: "restaurantId" });
MenuItem.belongsTo(Restaurant, { foreignKey: "restaurantId" });

User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

Restaurant.hasMany(Order, { foreignKey: "restaurantId" });
Order.belongsTo(Restaurant, { foreignKey: "restaurantId" });

Order.hasMany(OrderItem, { foreignKey: "orderId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

MenuItem.hasMany(OrderItem, { foreignKey: "menuItemId" });
OrderItem.belongsTo(MenuItem, { foreignKey: "menuItemId" });

const models = {
    User,
    Category,
    MenuItem,
    Restaurant,
    Order,
    OrderItem
}

export default models