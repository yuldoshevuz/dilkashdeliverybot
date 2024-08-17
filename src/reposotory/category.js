import prisma from "../config/prisma.client.js";
import Food from "./food.js";
import Model from "./index.js";

class Category extends Model {
    constructor() {
        super(prisma.category);
    }

    formatCategory(category) {
        return category && {
            id: category.id,
            title: category.translations[0].title,
            images: category.images.map((image) => image.url),
            foods: category.foods.map((food) => new Food().formatFood(food))
        } || null;
    }

    async findAll(language, where = {}) {
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                translations: {
                    select: {
                        title: true,
                        language: true
                    },
                    where: { language }
                },
                images: {
                    select: { url: true }
                },
                foods: {
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
                    }
                }
            },
            where
        })

        const formatted = categories.map((category) => this.formatCategory(category));
        return formatted;
    }

    async findOne(where = {}, language) {
        const category = await prisma.category.findFirst({
            select: {
                id: true,
                translations: {
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
                    where: {
                        translations: { some: { language } }
                    }
                }
            },
            where
        });
        
        return this.formatCategory(category);
    }

    async findById(id, language) {
        return await this.findOne({ id }, language);
    }

    async findByName(title, language) {
        return await this
            .findOne({ translations: { some: { title, language } } }, language);
    }

    async create({ title, images }) {
        const newCategory = await prisma.category.create({
            data: {
                translations: {
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
            await prisma.categoryTranslation.deleteMany({ where: { categoryId: id } });
            await prisma.food.deleteMany({ where: { categoryId: id } });
            await super.deleteById(id);

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}

export default Category;