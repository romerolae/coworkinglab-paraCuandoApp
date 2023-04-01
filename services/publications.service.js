const models = require('../database/models')
const { Op, cast, literal, fn, col } = require('sequelize')
const { CustomError } = require('../utils/helpers')

class PublicationsService {
  constructor() {}

  async findAndCount(query) {
    const options = {
      where: {},
      include: [
        {
          model: models.Users.scope('view_public'),
          as: 'user',
        },
        {
          model: models.PublicationTypes,
          as: 'publication_type',
        },
        {
          model: models.PublicationsImages,
          as: 'images',
        },
        {
          model: models.Tags,
          as: 'tags',
          attributes: { exclude: ['publications_tags'] },
        },
      ],
      attributes: {
        include: [
          [
            cast(
              literal(
                `(SELECT COUNT(*) FROM "votes" 
						WHERE "votes"."publication_id" = "Publications"."id")`
              ),
              'integer'
            ),
            'votes_count',
          ],
        ],
      },
    }

    const { limit, offset } = query
    if (limit && offset) {
      options.limit = limit
      options.offset = offset
    }

    const { tag_id } = query
    if (tag_id) {
      const publication_id = await models.PublicationsTags.findAll({
        where: { tag_id },
        attributes: { exclude: ['id'] },
      })
      const ids = publication_id.map((pub) => pub.publication_id) // armo el array con las ids que tiene el tag buscado
      options.where.id = { [Op.in]: ids }
    }

    const { publication_type_id } = query
    if (publication_type_id) {
      options.where.publication_type_id = publication_type_id
    }

    const { title } = query
    if (title) {
      options.where.title = { [Op.iLike]: `%${title}%` }
    }

    const { content } = query
    if (content) {
      options.where.content = { [Op.iLike]: `%${content}%` }
    }

    const { description } = query
    if (description) {
      options.where.description = { [Op.iLike]: `%${description}%` }
    }

    options.distinct = true

    const publications = await models.Publications.findAndCountAll(options)

    return publications
  }

  async findById(id) {
    const result = await models.Publications.findByPk(id, {
      include: [
        {
          model: models.Users.scope('view_public'),
          as: 'user',
        },
        {
          model: models.Cities.scope,
          as: 'city',
        },
        {
          model: models.PublicationTypes,
          as: 'publication_type',
        },
        {
          model: models.PublicationsImages,
          as: 'images',
        },
      ],
      attributes: {
        include: [
          [
            cast(
              literal(
                `(SELECT COUNT(*) FROM "votes" 
                WHERE "votes"."publication_id" = "Publications"."id")`
              ),
              'integer'
            ),
            'votes_count',
          ],
        ],
      },
    })
    if (!result)
      throw new CustomError(
        'Not found Publication',
        400,
        'Publication not registered'
      )
    return result
  }

  async createPublication(data, tag_ids) {
    const transaction = await models.sequelize.transaction()
    try {
      const newPublication = await models.Publications.create(
        {
          id: data.id,
          title: data.title,
          description: data.description,
          content: data.content,
          city_id: data.city_id,
          reference_link: data.reference_link,
          user_id: data.user_id,
          publication_type_id: data.publication_type_id,
        },
        { transaction }
      )

      if (tag_ids && tag_ids.length > 0) {
        let arrayTags = tag_ids.split(',')
        let findedTags = await models.Tags.findAll({
          where: { id: arrayTags },
          attributes: ['id'],
          raw: true,
        })

        if (findedTags.length > 0) {
          let tags_ids = await Promise.all(findedTags.map((tag) => tag.id))
          await newPublication.setTags(tags_ids, { transaction })
        } else {
          throw new Error('Tag not found')
        }
      }

      await transaction.commit()
      return newPublication
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async delete(id) {
    const transaction = await models.sequelize.transaction()
    try {
      const publication = await models.Publications.findByPk(id)
      const publicationImage = await models.PublicationsImages.findOne({
        where: {
          publication_id: id,
        },
      })
      if (!publication)
        throw new CustomError('Not found publication', 404, 'Not Found')
      if (publicationImage.image_url)
        throw new CustomError(
          'Publication Image is on Cloud, must be deleted first',
          400,
          'Bad Request'
        )
      try {
        await models.PublicationsTags.destroy(
          { where: { publication_id: id } },
          { transaction }
        )
      } catch (error) {
        await transaction.rollback()
        throw error
      }
      try {
        await models.Votes.destroy(
          { where: { publication_id: id } },
          { transaction }
        )
      } catch (error) {
        await transaction.rollback()
        throw error
      }

      await publication.destroy({ transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async addAndDelete(publicationId, userId) {
    const transaction = await models.sequelize.transaction()
    try {
      const vote = await models.Votes.findOne({
        where: { user_id: userId, publication_id: publicationId },
      })
      if (vote) {
        const deleteVote = await models.Votes.destroy(
          { where: { user_id: userId, publication_id: publicationId } },
          { transaction }
        )
        await transaction.commit()

        return deleteVote
      } else {
        const newVote = await models.Votes.create(
          { user_id: userId, publication_id: publicationId },
          { transaction }
        )
        await transaction.commit()

        return newVote
      }
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}

module.exports = PublicationsService
