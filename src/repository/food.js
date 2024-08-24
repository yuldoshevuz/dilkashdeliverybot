import prisma from "../config/prisma.client.js";
import Model from "./index.js";

class Food extends Model {
    constructor() {
        super(prisma.food);
    }
    
    selectFoods(language) {
        return {
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
        }
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
        return this.getOne({ deleted: false, ...where }, language);
    }

    async getOne(where = {}, language) {
        const food = await this.model.findFirst({
            select: this.selectFoods(language),
            where
        })

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
        const foods = await this.model.findMany({
            select: this.selectFoods(language),
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
            await this.model.update({
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