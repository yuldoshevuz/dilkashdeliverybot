import models from "../models/index.js";
import BaseRepo from "./base.repo.js";

class UserRepo extends BaseRepo {
    constructor() {
        super(models.User)
    };

    async findByChatId(chatId) {
        return await this.findOne({ chatId });
    };

    async addLocation(chatId, location) {
        const userData = await models.User.findOne({ where: { chatId } });
        const currentLocations = userData.locations;
        
        currentLocations.push(location);

        const updatedUser = await this.update({ chatId }, { locations: currentLocations });
        return updatedUser
    };
}

export default new UserRepo();