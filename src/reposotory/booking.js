import prisma from "../config/prisma.client.js";
import Model from "./index.js";

class Booking extends Model {
    constructor() {
        super(prisma.booking);
    }
}

export default Booking;