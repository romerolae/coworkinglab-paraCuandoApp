const express = require('express')
const router = express.Router()
const passport = require('../libs/passport')

const citiesController = require('../controllers/cities.controller')

router
  .route('/')
  .get(
    passport.authenticate('jwt', { session: false }),
    citiesController.getCities
  )

module.exports = router
