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

const putUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const { body } = req

    // Verify if the user trying to edit is the same as the user being edited
    if (req.user.id !== id) {
      return res.status(401).json({ error: 'Unauthorized' })
    } else {
      let user = await usersService.updateUser(id, body)
    }

    // Non-editable fields
    const nonEditableFields = [
      'token',
      'email_verified',
      'password',
      'email',
      'username',
    ]

    // Editable fields
    const editableFields = [
      'first_name',
      'last_name',
      'country_id',
      'code_phone',
      'phone',
      'interests',
    ]
    // Check if any non-editable fields are being edited
    const invalidFields = Object.keys(body).filter((field) =>
      nonEditableFields.includes(field)
    )
    if (invalidFields.length > 0) {
      return res.status(400).json({
        error: `The following fields are not editable: ${invalidFields.join(
          ', '
        )}`,
      })
    }

    // Check if any invalid fields are being edited
    const validFields = Object.keys(body).filter((field) =>
      editableFields.includes(field)
    )
    if (validFields.length === 0) {
      return res.status(400).json({
        error: 'You must provide at least one valid field to edit',
      })
    }
    return res.json({ message: 'Success Update' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getUsers,
  getUserById,
  putUser,
}
