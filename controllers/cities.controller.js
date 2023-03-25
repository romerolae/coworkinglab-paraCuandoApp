const CitiesService = require('../services/cities.service')
const { getPagination, getPagingData } = require('../utils/helpers')

const citiesService = new CitiesService()

const getCities = async (req, res, next) => {
  try {
    let query = req.query
    let { page, size } = query

    const { limit, offset } = getPagination(page, size, '10')
    query.limit = limit
    query.offset = offset
    let users = await citiesService.findAndCount(query)
    const results = getPagingData(users, page, limit)
    return res.status(200).json({ results: results })
  } catch (error) {
    next(error)
  }
}

module.exports = { getCities }
