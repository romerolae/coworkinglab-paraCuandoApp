const express = require('express')
const router = express.Router()
const passport = require('../libs/passport')
const {
  checkRole,
  checkAdmin,
} = require('../middlewares/userChecker.middleware')

const tagsControllers = require('../controllers/tags.controller')

router
  .route('/')
  .get(
    passport.authenticate('jwt', { session: false }),
    tagsControllers.getTags
  )
  .post(
    passport.authenticate('jwt', { session: false }),
    checkRole,
    checkAdmin,
    tagsControllers.postTag
  )

router
  .route('/:id')
  .get(
    passport.authenticate('jwt', { session: false }),
    tagsControllers.getTagById
  )
  .put(
    passport.authenticate('jwt', { session: false }),
    checkRole,
    checkAdmin,
    tagsControllers.putTagById
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    checkRole,
    checkAdmin,
    tagsControllers.deleteTagById
  )

module.exports = router
