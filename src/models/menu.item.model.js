import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import Category from "./category.model.js";
import Restaurant from "./restaurant.model.js";

const MenuItem = sequelize.define("menuItem", {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	price: {
		type: DataTypes.FLOAT,
		allowNull: false,
	},
	description: {
		type: DataTypes.STRING,
	},
	categoryId: {
		type: DataTypes.UUID,
		references: {
			model: Category,
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
});

Restaurant.hasMany(MenuItem, { foreignKey: "restaurantId" });
MenuItem.belongsTo(Restaurant, { foreignKey: "restaurantId" });

export default MenuItem;