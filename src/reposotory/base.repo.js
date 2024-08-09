class BaseRepo {
    constructor(model) {
        this.model = model;
    }

    async findAll(options = {}) {
        return await this.model.findAll({ ...options, raw: true });
    }

    async findById(id) {
        return await this.model.findByPk(id, { raw: true }) || null;
    }

    async findOne(where) {
        return await this.model.findOne({ where, raw: true }) || null;
    }

    async create(values) {
        const newRecord = await this.model.create(values);
        return await this.findById(newRecord.id);
    }

    async update(where, values) {
        const [updatedCount] = await this.model.update(values, { where });
        if (updatedCount === 0) return null;
        return await this.findOne(where) || null;
    }

    async updateById(id, values) {
        const [updatedCount] = await this.model.update(values, { where: { id } });
        if (updatedCount === 0) return null;
        return await this.findById(id) || null;
    }

    async delete(where) {
        const deletedCount = await this.model.destroy({ where });
        return deletedCount > 0;
    }

    async deleteById(id) {
        const deletedCount = await this.model.destroy({ where: { id } });
        return deletedCount > 0;
    }
}

export default BaseRepo;