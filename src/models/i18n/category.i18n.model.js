import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.config.js";
import Category from "../category.model.js";

const CategoryTranslation = sequelize.define("category_i18n", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    language: {
        type: DataTypes.ENUM("uz", "en", "ru"),
        allowNull: true
    },
    categoryId: {
        type: DataTypes.UUID,
        references: {
            model: Category,
            key: "id"
        },
        onDelete: "CASCADE"
    }
}, { freezeTableName: true });

export default CategoryTranslation;