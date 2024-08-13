import prisma from "../config/prisma.client.js";

class Model {
    constructor(model) {
        this.model = model;
    }

    async findAll(where = {}) {
        return await this.model.findMany({ where });
    }

    async findById(id) {
        return await this.model.findUnique({ where: { id } });
    }

    async findOne(where) {
        return await this.model.findUnique({ where });
    }

    async create(data) {
        return await this.model.create({ data });
    }

    async update(where = {}, newData) {
        return await this.model.update({ where, data: newData });
    }

    async updateById(id, newDate) {
        return await this.update({ id }, newDate);
    }

    async delete(where = {}) {
        return await this.model.delete({ where });
    }

    async deleteById(id) {
        return await this.delete({ id });
    }
}

export default Model;