import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.config.js";
import Food from "../food.model.js";

const FoodTranslation = sequelize.define("food_i18n", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	composition: {
        type: DataTypes.STRING,
        allowNull: false
    },
    language: {
        type: DataTypes.ENUM("uz", "en", "ru"),
        allowNull: true
    },
    foodId: {
        type: DataTypes.UUID,
        references: {
            model: Food,
            key: "id"
        },
        onDelete: "CASCADE"
    }
}, { freezeTableName: true });

export default FoodTranslation;