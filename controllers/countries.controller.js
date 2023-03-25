const CountriesService = require('../services/countries.service')
const { getPagination, getPagingData } = require('../utils/helpers')

const countriesService = new CountriesService()

const getCountries = async (req, res, next) => {
  try {
    let query = req.query
    let { page, size } = query

    const { limit, offset } = getPagination(page, size, '10')
    query.limit = limit
    query.offset = offset
    let users = await countriesService.findAndCount(query)
    const results = getPagingData(users, page, limit)
    return res.status(200).json({ results: results })
  } catch (error) {
    next(error)
  }
}

module.exports = { getCountries }
