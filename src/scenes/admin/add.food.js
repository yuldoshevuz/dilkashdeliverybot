import { WizardScene } from "telegraf/scenes";
import Category from "../../reposotory/category.js";

const adminAddFood = new WizardScene("admin:addFood",
    async (ctx) => {
        try {
            const language = ctx.session.lang;
            const categories = await new Category().findAll({ language });

            console.log(categories);
        } catch (error) {
            console.log(error)
        }
    }
);

adminAddFood.enter(async (ctx) => {
    try {
        
    } catch (error) {
        console.log(error)
    }
});

export default adminAddFood;