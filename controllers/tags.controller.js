const TagsService = require('../services/tags.service')
const {
  getPagination,
  getPagingData,
  CustomError,
} = require('../utils/helpers')
const { uploadFile, deleteFile } = require('../libs/awsS3')

const tagsService = new TagsService()

const getTags = async (req, res, next) => {
  try {
    let query = req.query
    let { page, size } = query

    const { limit, offset } = getPagination(page, size, '10')
    query.limit = limit
    query.offset = offset
    let users = await tagsService.findAndCount(query)
    const results = getPagingData(users, page, limit)
    return res.status(200).json({ results: results })
  } catch (error) {
    next(error)
  }
}

const postTag = async (req, res, next) => {
  try {
    const tag = req.body
    await tagsService.createTag(tag)
    return res.status(201).json({ message: 'Tag Added' })
  } catch (error) {
    next(error)
  }
}

const getTagById = async (req, res, next) => {
  try {
    const { id } = req.params
    const tag = await tagsService.getTagOr404(id)
    return res.status(200).json({ results: tag })
  } catch (error) {
    next(error)
  }
}

const putTagById = async (req, res, next) => {
  const id = req.params.id
  const obj = req.body
  try {
    await tagsService.updateTagById(id, obj)
    return res.json({ message: 'Successfully updated' })
  } catch (error) {
    next(error)
  }
}

const deleteTagById = async (req, res, next) => {
  const id = req.params.id
  try {
    let tag = await tagsService.removeTag(id)
    return res.json({ results: tag, message: 'Tag removed' })
  } catch (error) {
    next(error)
  }
}

const postTagsImage = async (request, response, next) => {
  const userId = request.params.id
  const file = request.file
  try {
    if (!request.isSameUser)
      throw new CustomError('User not authorized', 403, 'Forbidden')
    if (file) {
      await tagsService.getTag(userId)

      let fileKey = `public/tags/images/image-${userId}`
      if (file.mimetype == 'image/png') {
        fileKey = `public/tags/images/image-${userId}.png`
      }

      if (file.mimetype == 'image/jpg') {
        fileKey = `public/tags/images/image-${userId}.jpg`
      }

      if (file.mimetype == 'image/jpeg') {
        fileKey = `public/tags/images/image-${userId}.jpeg`
      }

      await uploadFile(file, fileKey)

      let bucketURL = process.env.AWS_DOMAIN + fileKey

      let newTagImage = await tagsService.updateTagById(userId, {
        image_url: bucketURL,
      })

      //At the end of everything, clean the server from the images
      try {
        await unlinkFile(file.path)
      } catch (error) {
        //
      }
      return response.status(201).json({
        results: {
          message: 'Image Added',
        },
      })
    } else {
      throw new CustomError('Image was not received', 400, 'Bad Request')
    }
  } catch (error) {
    if (file) {
      await unlinkFile(file.path)
    }
    return next(error)
  }
}

const deleteTagsImage = async (request, response, next) => {
  const userId = request.params.id

  try {
    if (!request.isSameUser) {
      if (request.role !== 2)
        throw new CustomError('Not authorized User', 403, 'Forbidden')
    }
    const { image_url } = await tagsService.getTag(userId)
    if (!image_url) {
      return response.status(404).json({ message: 'Image not found' })
    }
    let awsDomain = process.env.AWS_DOMAIN
    const imageKey = image_url.replace(awsDomain, '')
    await deleteFile(imageKey)
    await tagsService.updateTagById(userId, { image_url: null })
    return response.status(200).json({ message: 'Image Removed' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getTags,
  postTag,
  getTagById,
  putTagById,
  deleteTagById,
  postTagsImage,
  deleteTagsImage,
}
