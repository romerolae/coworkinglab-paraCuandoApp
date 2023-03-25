const AuthService = require('../services/auth.service')
const { CustomError } = require('../utils/helpers')

const authService = new AuthService()

const checkRole = async (req, res, next) => {
  const id = req.user.id
  const { profiles } = await authService.userToken(id)
  if (!profiles) throw new CustomError('Not found User', 404, 'Not Found')
  req.userRole = profiles[0].role_id // aqui esta el número de rol
  next()
}

const checkAdmin = async (req, res, next) => {
  //console.log(req.userRole);
  if (req.userRole === 2) {
    next()
  } else {
    const error = new CustomError('User not authorized', 403, 'Forbbiden')
    next(error)
  }
}

const checkSameUser = async (req, res, next) => {
  const id = req.params.id
  const userId = req.user.id
  if (id === userId) {
    req.isSameUser = true
    next()
  } else {
    req.isSameUser = false
    next()
  }
}

module.exports = {
  checkRole,
  checkAdmin,
  checkSameUser,
}
