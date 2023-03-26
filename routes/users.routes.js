const express = require('express')
const router = express.Router()
const passport = require('../libs/passport')
const {
  checkRole,
  checkAdmin,
  checkSameUser,
} = require('../middlewares/userChecker.middleware')

const userControllers = require('../controllers/users.controller')

router
  .route('/')
  .get(
    passport.authenticate('jwt', { session: false }),
    checkRole,
    checkAdmin,
    userControllers.getUsers
  )

router
  .route('/:id')
  .get(
    passport.authenticate('jwt', { session: false }),
    checkRole,
    checkSameUser,
    userControllers.getUserById
  )
  .put(
    passport.authenticate('jwt', { session: false }),
    checkSameUser,
    userControllers.putUser
  )

router.get(
  '/:id/votes',
  passport.authenticate('jwt', { session: false }),
  userControllers.getUserVotes
)

router.get(
  '/:id/publications',
  passport.authenticate('jwt', { session: false }),
  userControllers.getUserPublications
)

module.exports = router
