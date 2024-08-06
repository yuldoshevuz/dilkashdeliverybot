import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import User from "./user.model.js";
import Restaurant from "./restaurant.model.js";

const Order = sequelize.define("order", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: "id",
        },
        allowNull: false,
    },
    restaurantId: {
        type: DataTypes.UUID,
        references: {
            model: Restaurant,
            key: "id",
        },
        allowNull: false,
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("pending", "completed", "canceled"),
        allowNull: false,
        defaultValue: "pending",
    }
});

export default Order;