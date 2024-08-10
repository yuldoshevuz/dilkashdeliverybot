import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import Category from "./category.model.js";

const Food = sequelize.define("food", {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	title: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	composition: {
        type: DataTypes.STRING,
        allowNull: false
    },
	price: {
		type: DataTypes.FLOAT,
		allowNull: false,
	},
	language: {
        type: DataTypes.ENUM("en", "uz", "ru"),
        allowNull: true
    },
	categoryId: {
		type: DataTypes.UUID,
		references: {
			model: Category,
			key: "id",
		},
		allowNull: false,
	}
});

export default Food;