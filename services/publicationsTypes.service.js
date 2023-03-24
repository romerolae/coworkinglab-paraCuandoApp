const models = require('../database/models')
const { Op } = require('sequelize')
const { CustomError } = require('../utils/helpers')

class PublicationsTypesService {
  constructor() {}

  async findAndCount(query) {
    const options = {
      where: {},
    }

    const { limit, offset } = query
    if (limit && offset) {
      options.limit = limit
      options.offset = offset
    }

    const { id } = query
    if (id) {
      options.where.id = id
    }

    const { name } = query
    if (name) {
      options.where.name = { [Op.iLike]: `%${name}%` }
    }

    const { description } = query
    if (description) {
      options.where.description = { [Op.iLike]: `%${description}%` }
    }

    const { created_at } = query
    if (created_at) {
      options.where.created_at = { [Op.iLike]: `%${created_at}%` }
    }

    options.distinct = true

    const publicationsTypes = await models.PublicationsTypes.findAndCountAll(
      options
    )
    return publicationsTypes
  }

  async getPublicationTypeById(id) {
    const result = await models.PublicationsTypes.findOne({ where: { id } })
    if (!result)
      throw new CustomError('Not found Publication type', 404, 'Not Found')
    return result
  }

  async updatePublicationTypeById(id, obj) {
    const transaction = await models.sequelize.transaction()
    try {
      await models.PublicationsTypes.update(obj, { where: { id } })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}

module.exports = PublicationsTypesService
