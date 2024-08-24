import prisma from "../config/prisma.client.js";
import Model from "./index.js";

class Food extends Model {
    constructor() {
        super(prisma.food);
        this.model = prisma.food
    }
    
    formatFood(food) {
        return food && {
            id: food.id,
            title: food.i18n[0].title,
            composition: food.i18n[0].composition,
            images: food.images.map((image) => image.url),
            price: food.price,
            categoryId: food.categoryId
        } || null;
    }

    async findOne(where = {}, language) {
        const food = await prisma.food.findFirst({
            select: {
                id: true,
                i18n: {
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
            where: { deleted: false, ...where }
        });

        return this.formatFood(food);
    }

    async findById(id, language) {
        return await this.findOne({ id }, language)
    }

    async findByName(title, language) {
        return await this
            .findOne({ i18n: { some: { title, language } } }, language);
    }

    async findAll(language, where = {}) {
        const foods = await prisma.food.findMany({
            select: {
                id: true,
                i18n: {
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
            where: { deleted: false, ...where }
        })

        const formatted = foods.map((food) => this.formatFood(food));
        return formatted;
    }

    async create({ title, composition, images, price, categoryId }) {
        const newFood = await this.model.create({
            data: {
                i18n: {
                    createMany: {
                        data: [
                            {
                                title: title.uz,
                                composition: composition.uz,
                                language: "uz"
                            },
                            {
                                title: title.en,
                                composition: composition.en,
                                language: "en"
                            },
                            {
                                title: title.ru,
                                composition: composition.ru,
                                language: "ru"
                            }
                        ]
                    }
                },
                images: {
                    createMany: {
                        data: images.map((image) => ({ url: image }))
                    }
                },
                price,
                categoryId
            }
        });

        return await this.findById(newFood.id);
    }

    async deleteById(id) {
        try {
            await prisma.food.update({
                data: { deleted: true },
                where: { id, deleted: false }
            });

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}

export default Food;