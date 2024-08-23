import prisma from "../config/prisma.client.js";
import Model from "./index.js";

class OrderItem extends Model {
    constructor() {
        super(prisma.orderItem);
    }
}

export default OrderItem;