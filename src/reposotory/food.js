import prisma from "../config/prisma.client.js";
import Model from "./index.js";

class Food extends Model {
    constructor() {
        super(prisma.food);
        this.model = prisma.food
    }
    
    formatFood(food) {({
        id: food.id,
        title: food.translations[0].title,
        composition: food.translations[0].composition,
        images: food.images.map((image) => image.url),
        price: food.price,
    })}

    async findOne(where = {}, language) {
        const food = await prisma.food.findUnique({
            select: {
                id: true,
                translations: {
                    select: {
                        title: true,
                        composition: true,
                        language: true
                    },
                    where: { language }
                },
                images: {
                    select: { url: true }
                },
                price: true,
                categoryId: true
            },
            where
        });

        return this.formatFood(food);
    }

    async findById(id, language) {
        return await this.findOne({ id }, language)
    }

    async findAll(where = {}, language) {
        const foods = await prisma.food.findMany({
            select: {
                id: true,
                translations: {
                    select: {
                        title: true,
                        composition: true,
                        language: true
                    },
                    where: { language }
                },
                images: {
                    select: { url: true }
                },
                price: true,
                categoryId: true
            },
            where
        })

        const formatted = foods.map((food) => this.formatFood(food));
        return formatted;
    }

    async create(title, composition, images, price) {
        // const exampleFood = await this.model.create({
        //     data: {
        //         translations: {
        //             createMany: {
        //                 data: [
        //                     {
        //                         title: "Americano",
        //                         composition: "Sut, qahva, suv ...",
        //                         language: "uz"
        //                     },
        //                     {
        //                         title: "Americano",
        //                         composition: "Milk, coffee, water ...",
        //                         language: "en"
        //                     },
        //                     {
        //                         title: "Американо",
        //                         composition: "Молоко, кофе, вода ...",
        //                         language: "ru"
        //                     }
        //                 ]
        //             }
        //         },
        //         images: {
        //             createMany: {
        //                 data: [
        //                     { url: "http://example.com/coffee1.jpg" },
        //                     { url: "http://exapmle.com/coffee2.jpg" },
        //                     { url: "http://exapmle.com/coffee3.jpg" }
        //                 ]
        //             }
        //         },
        //         price: 25000
        //     }
        // });
    }
}

export default Food;