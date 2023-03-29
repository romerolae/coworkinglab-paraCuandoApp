const PublicationsService = require('../services/publications.service')
const uuid = require('uuid')
const { getPagination, CustomError } = require('../utils/helpers')
const PublicationImagesService = require('../services/publicationImages.service')
const { uploadFile, deleteFile } = require('../libs/awsS3')

const publicationsService = new PublicationsService()
const publicationImagesService = new PublicationImagesService()

const getPublications = async (req, res, next) => {
  const result = {
    results: {},
  }
  const { publicationsPerPage, currentPage } = {
    publicationsPerPage: 10,
    currentPage: 1,
  }
  const { limit, offset } = getPagination(currentPage, publicationsPerPage)

  try {
    const publications = await publicationsService.findAndCount({
      ...req.query,
      limit,
      offset,
    })
    result.results.count = publications.count
    result.results.totalPages = Math.ceil(
      publications.count / publicationsPerPage
    )
    result.results.CurrentPage = currentPage
    result.results.results = publications.rows
    return res.json(result)
  } catch (error) {
    next(error)
  }
}

const postPublication = async (req, res, next) => {
  const data = req.body
  const tag_ids = data.tags

  try {
    if (!data.title)
      throw new CustomError('Not found title', 400, 'Required parameter')
    if (!data.publication_type_id)
      throw new CustomError(
        'Not found publication type id',
        400,
        'Required parameter'
      )
    if (data.tags <= 0 || !data.tags)
      throw new CustomError('Not found tags id', 400, 'Required parameter')

    const publication = await publicationsService.createPublication(
      { ...data, id: uuid.v4(), user_id: req.user.id, city_id: 1 },
      tag_ids
    )

    if (!publication)
      throw new CustomError('Not publication created', 400, 'Contact admin')

    return res
      .status(201)
      .json({ message: 'Publication created', publication_id: publication.id })
  } catch (error) {
    next(error)
  }
}

const getPublicationById = async (req, res, next) => {
  const publicationId = req.params.id
  try {
    const publication = await publicationsService.findById(publicationId)
    return res.json(publication)
  } catch (error) {
    next(error)
  }
}

const deletePublication = async (req, res, next) => {
  const isSameUser = req.isSameUser
  const role = req.userRole
  const id = req.params.id

  try {
    if (isSameUser || role === 2) {
      await publicationsService.delete(id)
      return res.json({ message: 'Publication removed' })
    } else {
      throw new CustomError('Not authorized user', 403, 'Forbbiden')
    }
  } catch (error) {
    next(error)
  }
}

const addVote = async (req, res, next) => {
  const isSameUser = req.isSameUser
  const publicationId = req.params.id
  const userId = req.user.id

  try {
    if (!isSameUser) {
      await publicationsService.addAndDelete(publicationId, userId)
      return res.json({ message: 'Add-delete Vote' })
    } else {
      throw new CustomError('Not authorized user', 403, 'Forbbiden')
    }
  } catch (error) {
    next(error)
  }
}

const uploadImagePublication = async (request, response, next) => {
  const publicationID = request.params.id
  const files = request.files
  try {
    if (files.length < 1)
      throw new CustomError('No images received', 400, 'Bad Request')

    let imagesKeys = []
    let imagesErrors = []

    let openSpots = await publicationImagesService.getAvailableImageOrders(
      publicationID
    )

    await Promise.all(
      openSpots.map(async (spot, index) => {
        try {
          /* In case Open Spots > Images Posted */
          if (!files[index]) return

          let fileKey = `public/publications/images/image-${publicationID}-${spot}`

          if (files[index].mimetype == 'image/png') {
            fileKey = `public/publications/images/image-${publicationID}-${spot}.png`
          }

          if (files[index].mimetype == 'image/jpg') {
            fileKey = `public/publications/images/image-${publicationID}-${spot}.jpg`
          }

          if (files[index].mimetype == 'image/jpeg') {
            fileKey = `public/publications/images/image-${publicationID}-${spot}.jpeg`
          }

          await uploadFile(files[index], fileKey)

          let bucketURL = process.env.AWS_DOMAIN + fileKey

          let newImagePublication = await publicationImagesService.createImage(
            publicationID,
            bucketURL,
            spot
          )

          imagesKeys.push(bucketURL)
        } catch (error) {
          imagesErrors.push(error.message)
        }
      })
    )

    //At the end of everything, clean the server from the images
    await Promise.all(
      files.map(async (file) => {
        try {
          await unlinkFile(file.path)
        } catch (error) {
          //
        }
      })
    )

    return response.status(200).json({
      results: {
        message: `Count of uploaded images: ${imagesKeys.length} `,
        imagesUploaded: imagesKeys,
        imageErrors: imagesErrors,
      },
    })
  } catch (error) {
    if (files) {
      await Promise.all(
        files.map(async (file) => {
          try {
            await unlinkFile(file.path)
          } catch (error) {
            //
          }
        })
      )
    }
    return next(error)
  }
}

const removePublicationImage = async (request, response, next) => {
  const publicationID = request.params.id
  const order = request.params.order
  try {
    let { image_url } = await publicationImagesService.getImageOr404(
      publicationID,
      order
    )
    let awsDomain = process.env.AWS_DOMAIN
    const imageKey = image_url.replace(awsDomain, '')
    await deleteFile(imageKey)
    let publicationImage = await publicationImagesService.removeImage(
      publicationID,
      order
    )

    return response
      .status(200)
      .json({ message: 'Removed', image: publicationImage })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  deletePublication,
  addVote,
  getPublications,
  postPublication,
  getPublicationById,
  uploadImagePublication,
  removePublicationImage,
}
