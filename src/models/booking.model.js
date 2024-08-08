import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import User from "./user.model.js";

const Booking = sequelize.define("Booking", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    customerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: "id",
        },
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    numberOfPeople: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 2,
            max: 16,
        }
    },
    customerName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contactNumber: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

export default Booking;