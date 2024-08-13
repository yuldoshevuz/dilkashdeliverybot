import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

const Category = sequelize.define("category", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    }
});

export default Category;