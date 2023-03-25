const express = require('express')
const router = express.Router()
const passport = require('../libs/passport')

const rolesController = require('../controllers/roles.controller')

router
  .route('/')
  .get(
    passport.authenticate('jwt', { session: false }),
    rolesController.getRoles
  )

module.exports = router
