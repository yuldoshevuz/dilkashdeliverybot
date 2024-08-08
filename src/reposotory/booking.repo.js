import models from "../models/index.js";
import BaseRepo from "./base.repo.js";

class BookingRepo extends BaseRepo {
    constructor() {
        super(models.Booking);
    };
}

export default new BookingRepo();