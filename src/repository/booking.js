import prisma from "../config/prisma.client.js";
import Model from "./index.js";

class Booking extends Model {
    constructor() {
        super(prisma.booking);
    }

    async findAllActive(where = {}) {
        return await prisma.booking.findMany({
            orderBy: { endTime: "asc" },
            where: {
                endTime: { gt: new Date() },
                ...where
            }
        });
    }
}

export default Booking;