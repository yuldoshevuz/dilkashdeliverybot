import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import Order from "./order.model.js";
import MenuItem from "./menu.item.model.js";

const OrderItem = sequelize.define("orderItem", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    orderId: {
        type: DataTypes.UUID,
        references: {
            model: Order,
            key: "id",
        },
        allowNull: false,
    },
    menuItemId: {
        type: DataTypes.UUID,
        references: {
            model: MenuItem,
            key: "id",
        },
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    }
});

export default OrderItem;