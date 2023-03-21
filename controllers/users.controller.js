const UsersService = require('../services/users.service')
const ProfilesService = require('../services/profiles.service')
const { getPagination, getPagingData } = require('../utils/helpers')

const usersService = new UsersService()
const profilesService = new ProfilesService()

const getUsers = async (req, res, next) => {
  let userId = req.user.id
  let userProfile = await profilesService.findProfileByUserID(userId)
  if (userProfile.role_id === 2) {
    try {
      let query = req.query
      let { page, size } = query

      const { limit, offset } = getPagination(page, size, '10')
      query.limit = limit
      query.offset = offset
      let users = await usersService.findAndCount(query)
      const results = getPagingData(users, page, limit)
      return res.status(200).json({ results: results })
    } catch (error) {
      next(error)
    }
  } else {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

const getUserById = async (req, res, next) => {
  try {
    let { id } = req.params
    let userId = req.user.id
    let userProfile = await profilesService.findProfileByUserID(userId)
    const sameOrAdmin = 1
    if (userId === id || userProfile.role_id === 2) {
      let user = await usersService.getUser(id, sameOrAdmin)
      return res.json({ results: user })
    } else {
      let user = await usersService.getUser(id)
      return res.json({ results: user })
    }
  } catch (error) {
    next(error)
  }
}

const addUser = async (req, res, next) => {
  try {
    let { body } = req
    let user = await usersService.createAuthUser(body)
    return res.status(201).json({ results: user })
  } catch (error) {
    next(error)
  }
}

const putUser = async (req, res, next) => {
  try {
    let { id } = req.params
    let { body } = req
    let user = await usersService.updateUser(id, body)
    return res.json({ results: user })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getUsers,
  getUserById,
  addUser,
  putUser,
}
