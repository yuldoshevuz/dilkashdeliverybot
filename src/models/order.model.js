import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import User from "./user.model.js";

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
    totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("pending", "process", "canceled", "completed"),
        allowNull: false,
        defaultValue: "pending",
    }
});

export default Order;