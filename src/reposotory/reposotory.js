import Category from "./category.js";
import Food from "./food.js";
import User from "./user.js";

const reposotory = {
    user: new User(),
    category: new Category(),
    food: new Food()
}

export default reposotory;