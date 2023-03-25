const express = require('express')
const router = express.Router()
const passport = require('../libs/passport')
const {
  checkRole,
  checkAdmin,
} = require('../middlewares/userChecker.middleware')

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
    checkRole,
    checkAdmin,
    publicationsTypesController.putPublicationTypeById
  )

module.exports = router
