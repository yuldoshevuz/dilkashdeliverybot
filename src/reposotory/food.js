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
            title: food.translations[0].title,
            composition: food.translations[0].composition,
            images: food.images.map((image) => image.url),
            price: food.price,
            categoryId: food.categoryId
        } || null;
    }

    async findOne(where = {}, language) {
        const food = await prisma.food.findFirst({
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

    async findByName(title, language) {
        return await this
            .findOne({ translations: { some: { title, language } } }, language);
    }

    async findAll(language, where = {}) {
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

    async create({ title, composition, images, price, categoryId }) {
        const newFood = await this.model.create({
            data: {
                translations: {
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
            await prisma.foodTranslation.deleteMany({ where: { foodId: id } });
            await prisma.image.deleteMany({ where: { foodId: id } });
            await prisma.orderItem.deleteMany({ where: { foodId: id } });
            await super.deleteById(id);

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}

export default Food;