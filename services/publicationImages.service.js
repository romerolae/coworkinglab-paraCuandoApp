const models = require('../database/models')
const { CustomError } = require('../utils/helpers')

class PublicationImagesService {
  constructor() {}

  async getAvailableImageOrders(publication_id) {
    let availableValues = [1, 2, 3]

    let images = await models.PublicationsImages.findAll({
      attributes: { exclude: ['created_at', 'updated_at'] },
      where: { publication_id },
      raw: true,
    })

    if (!images) return availableValues
    if (images.length == 0) return availableValues
    if (images.length >= availableValues.length)
      throw new CustomError(
        'Not available spots for images for this publication. First, remove a image',
        409,
        'No Spots Available'
      )

    let existedOrders = images.map((image) => image['order'])

    let availableSpots = availableValues.filter(
      (spot) => !existedOrders.includes(spot)
    )

    return availableSpots
  }

  async createImage(publication_id, image_url, order) {
    const transaction = await models.sequelize.transaction()

    try {
      let newImage = await models.PublicationsImages.create(
        { publication_id, image_url, order },
        { transaction }
      )
      await transaction.commit()
      return newImage
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
  async getImageOr404(publication_id, order) {
    const publicationImage = await models.PublicationsImages.findOne({
      where: { publication_id, order: parseInt(order) },
    })
    if (!publicationImage)
      throw new CustomError(
        'Not Found Publication Image with this order',
        404,
        'Not Found'
      )
    return publicationImage
  }

  async removeImage(publication_id, order) {
    const transaction = await models.sequelize.transaction()
    try {
      let publication = await models.PublicationsImages.findOne(
        {
          where: { publication_id, order: parseInt(order) },
        },
        { transaction }
      )

      await publication.destroy({ transaction })
      await transaction.commit()

      return publication
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}

module.exports = PublicationImagesService
