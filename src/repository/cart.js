import prisma from "../config/prisma.client.js";
import Model from "./index.js";
import repository from "./repository.js";

class Cart extends Model {
    constructor() {
        super(prisma.cart);
    }

    async findMy(userId, lang) {
        const cart = await this.model.findFirst({
            select: {
                id: true,
                userId: true,
                items: {
                    select: {
                        id: true,
                        quantity: true,
                        foodId: true
                    }
                }
            },
            where: { userId }
        });

        if (!cart) {
            return null;
        }

        const itemsOfCart = await Promise.all(cart.items.map(async({ id, foodId, quantity }) => {
            const food = await repository.food.findById(foodId, lang);
            const total = food.price * quantity;

            return { id, food, quantity, total };
        }));

        const totalPrice = itemsOfCart.reduce((acc, current) => acc + current.total, 0);
        const totalQuantity = itemsOfCart.reduce((acc, current) => acc + current.quantity, 0);

        return { ...cart, items: itemsOfCart, totalPrice, totalQuantity };
    }

    async clear(userId) {
        try {
            const cart = await this.findMy(userId, "uz");
            await prisma.cartItem.deleteMany({
                where: { cartId: cart.id }
            });
    
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async new(userId) {
        return await this.model.upsert({
            where: { userId },
            create: { userId },
            update: {}
        });
    }
}

export default Cart;