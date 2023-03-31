const PublicationsTypesService = require('../services/publicationsTypes.service')
const { getPagination } = require('../utils/helpers')

const publicationsTypesService = new PublicationsTypesService()

const getPublicationsTypes = async (req, res, next) => {
  const result = {
    results: {},
  }
  const { publicationsTypesPerPage, currentPage } = {
    publicationsTypesPerPage: 10,
    currentPage: 1,
  }
  const { limit, offset } = getPagination(currentPage, publicationsTypesPerPage)

  try {
    const publicationsTypes = await publicationsTypesService.findAndCount({
      ...req.query,
      limit,
      offset,
    })
    result.results.count = publicationsTypes.count
    result.results.totalPages = Math.ceil(
      publicationsTypes.count / publicationsTypesPerPage
    )
    result.results.currentPage = currentPage
    result.results.results = publicationsTypes.rows
    return res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

const getPublicationTypeById = async (req, res, next) => {
  const id = req.params.id
  const result = { result: {} }
  try {
    result.result = await publicationsTypesService.getPublicationTypeById(id)
    return res.json(result)
  } catch (error) {
    next(error)
  }
}

const putPublicationTypeById = async (req, res, next) => {
  const id = req.params.id
  const obj = req.body
  try {
    await publicationsTypesService.updatePublicationTypeById(id, obj)
    return res.json({ message: 'Success Update' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getPublicationTypeById,
  putPublicationTypeById,
  getPublicationsTypes,
}
