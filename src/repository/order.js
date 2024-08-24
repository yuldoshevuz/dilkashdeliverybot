import environments from "../config/environments.js";
import prisma from "../config/prisma.client.js";
import Model from "./index.js";
import repository from "./repository.js";

class Order extends Model {
    constructor() {
        super(prisma.order);
    }

    get orderSelectFields() {
        return {
            id: true,
            orderNumber: true,
            status: true,
            userId: true,
            user: {
                select: {
                    id: true,
                    chatId: true,
                    firstName: true,
                    lastName: true,
                    username: true,
                    phoneNumber: true,
                    location: true,
                    language: true,
                    active: true
                }
            },
            location: true,
            paymentMethod: true,
            orderItems: {
                select: {
                    id: true,
                    orderId: true,
                    foodId: true,
                    quantity: true,
                    price: true,
                    total: true
                }
            },
            deliveryCost: true,
            totalAmount: true,
            createdAt: true,
            updatedAt: true
        };
    }

    async findAll(where) {
        return await this.model.findMany({
            select: this.orderSelectFields,
            where
        });
    }

    async findOne(where, lang) {
        const order = await this.model.findFirst({
            select: this.orderSelectFields,
            where
        });

        if (!order) return null;

        const itemsWithFoods = await Promise.all(
            order.orderItems.map(async ({ foodId, ...rest }) => {
                const food = await repository.food.getOne({ id: foodId }, lang);
                return { ...rest, food };
            })
        );

        return { ...order, orderItems: itemsWithFoods };
    }

    async findMy(orderNumber, userId, lang) {
        return await this.findOne({ orderNumber, userId }, lang);
    }

    async findById(id, lang) {
        return await this.findOne({ id }, lang);
    }

    async findByNumber(orderNumber, lang) {
        return await this.findOne({ orderNumber }, lang);
    }

    async findMyAll(userId) {
        return await this.model.findMany({
            select: {
                id: true,
                orderNumber: true,
                status: true,
                createdAt: true
            },
            orderBy: { orderNumber: "asc" },
            where: { userId }
        });
    }

    async count(where = {}) {
        return await this.model.count({ where });
    }
    
    async deliveredCount() {
        return await this.count({ status: "completed" });
    }

    async canceledCount() {
        return await this.count({ status: "canceled" });
    }

    async othersCount() {
        return await this.count({
            status: { in: [ "pending", "process" ] }
        });
    }

    async todayCount() {
        const startOfDay = new Date();
        const endOfDay = new Date();
    
        startOfDay.setHours(9, 0, 0, 0);
        endOfDay.setHours(22, 0, 59, 999);

        return await this.count({
            createdAt: {
                gte: startOfDay,
                lte: endOfDay
            }
        });
    }

    async create({ paymentMethod, location, userId, cart }) {
        const orderItems = cart.items.map(({ food, quantity, price, total }) => ({
            foodId: food.id,
            quantity,
            price,
            total
        }));

        const newOrder = await this.model.create({
            data: {
                userId,
                location,
                paymentMethod,
                orderItems: {
                    createMany: { data: orderItems }
                },
                deliveryCost: environments.DELIVERY_COST,
                totalAmount: cart.totalPrice + environments.DELIVERY_COST,
            }
        });

        return await this.findById(newOrder.id, "uz");
    }

    async changeStatus(id, newStatus, lang) {
        const updatedOrder = await this.model.update({
            data: { status: newStatus },
            where: { id }
        });

        return await this.findById(updatedOrder.id, lang);
    }
}

export default Order;