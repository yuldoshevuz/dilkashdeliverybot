import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import Order from "./order.model.js";
import Food from "./food.model.js";

const OrderItem = sequelize.define("order_item", {
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
        onDelete: "CASCADE"
    },
    foodId: {
        type: DataTypes.UUID,
        references: {
            model: Food,
            key: "id",
        },
        allowNull: false,
        onDelete: "CASCADE"
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