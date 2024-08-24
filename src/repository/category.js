import prisma from "../config/prisma.client.js";
import Food from "./food.js";
import Model from "./index.js";

class Category extends Model {
    constructor() {
        super(prisma.category);
    }

    selectCategory(language) {
        return {
            id: true,
            i18n: {
                select: {
                    title: true,
                    language: true
                },
                where: { language }
            },
            images: {
                select: {
                    url: true
                }
            },
            foods: {
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
                where: {
                    deleted: false,
                    i18n: { some: { language } }
                }
            }
        };
    }

    formatCategory(category) {
        return category && {
            id: category.id,
            title: category.i18n[0].title,
            images: category.images.map((image) => image.url),
            foods: category.foods.map((food) => new Food().formatFood(food))
        } || null;
    }

    async findAll(language, where = {}) {
        const categories = await this.model.findMany({
            select: this.selectCategory(language),
            where: { deleted: false, ...where }
        })

        const formatted = categories.map((category) => this.formatCategory(category));
        return formatted;
    }

    async findOne(where = {}, language) {
        const category = await this.model.findFirst({
            select: this.selectCategory(language),
            where: { deleted: false, ...where }
        });
        
        return this.formatCategory(category);
    }

    async findById(id, language) {
        return await this.findOne({ id }, language);
    }

    async findByName(title, language) {
        return await this
            .findOne({ i18n: { some: { title, language } } }, language);
    }

    async create({ title, images }) {
        const newCategory = await this.model.create({
            data: {
                i18n: {
                    createMany: {
                        data: [
                            { title: title.uz, language: "uz" },
                            { title: title.en, language: "en" },
                            { title: title.ru, language: "ru" }
                        ]
                    }
                },
                images: {
                    createMany: {
                        data: images.map((image) => ({ url: image }))
                    }
                }
            }
        });

        return await this.findById(newCategory.id);
    }

    async deleteById(id) {
        try {
            await this.model.update({
                data: { deleted: true },
                where: { id, deleted: false }
            });

            await prisma.food.updateMany({
                data: { deleted: true },
                where: { categoryId: id, deleted: false }
            });

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}

export default Category;