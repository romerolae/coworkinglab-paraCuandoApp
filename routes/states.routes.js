const express = require('express')
const router = express.Router()
const passport = require('../libs/passport')

const statesController = require('../controllers/states.controller')

router
  .route('/')
  .get(
    passport.authenticate('jwt', { session: false }),
    statesController.getStates
  )

module.exports = router
