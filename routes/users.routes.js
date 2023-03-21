const express = require('express')
const router = express.Router()
const passport = require('../libs/passport')

const userControllers = require('../controllers/users.controller')

router
  .route('/')
  .get(
    passport.authenticate('jwt', { session: false }),
    userControllers.getUsers
  )

router
  .route('/:id')
  .get(
    passport.authenticate('jwt', { session: false }),
    userControllers.getUserById
  )
  .put(
    passport.authenticate('jwt', { session: false }),
    userControllers.putUser
  )

module.exports = router
