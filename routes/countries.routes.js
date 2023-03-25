const express = require('express')
const router = express.Router()
const passport = require('../libs/passport')

const countriesController = require('../controllers/countries.controller')

router
  .route('/')
  .get(
    passport.authenticate('jwt', { session: false }),
    countriesController.getCountries
  )

module.exports = router
