const StatesService = require('../services/states.service')
const { getPagination, getPagingData } = require('../utils/helpers')

const statesService = new StatesService()

const getStates = async (req, res, next) => {
  try {
    let query = req.query
    let { page, size } = query

    const { limit, offset } = getPagination(page, size, '10')
    query.limit = limit
    query.offset = offset
    let users = await statesService.findAndCount(query)
    const results = getPagingData(users, page, limit)
    return res.status(200).json({ results: results })
  } catch (error) {
    next(error)
  }
}

module.exports = { getStates }
