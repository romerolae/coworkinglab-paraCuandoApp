const express = require('express')
const router = express.Router()
const passport = require('../libs/passport')

const publicationsTypesController = require('../controllers/publicationsTypes.controller')

router
  .route('/')
  .get(
    passport.authenticate('jwt', { session: false }),
    publicationsTypesController.getPublicationsTypes
  )

router
  .route('/:id')
  .get(
    passport.authenticate('jwt', { session: false }),
    publicationsTypesController.getPublicationTypeById
  )
  .put(
    passport.authenticate('jwt', { session: false }),
    publicationsTypesController.putPublicationTypeById
  )

module.exports = router
