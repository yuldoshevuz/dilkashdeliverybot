import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import Category from "./category.model.js";
import Food from "./food.model.js";

const Image = sequelize.define("image", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    categoryId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            key: "id",
            model: Category
        },
        onDelete: "CASCADE"
    },
    foodId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            key: "id",
            model: Food
        },
        onDelete: "CASCADE"
    }
})

export default Image