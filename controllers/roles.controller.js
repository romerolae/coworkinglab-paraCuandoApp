const RolesService = require('../services/roles.service')
const { getPagination, getPagingData } = require('../utils/helpers')

const rolesService = new RolesService()

const getRoles = async (req, res, next) => {
  try {
    let query = req.query
    let { page, size } = query

    const { limit, offset } = getPagination(page, size, '10')
    query.limit = limit
    query.offset = offset
    let users = await rolesService.findAndCount(query)
    const results = getPagingData(users, page, limit)
    return res.status(200).json({ results: results })
  } catch (error) {
    next(error)
  }
}

module.exports = { getRoles }
