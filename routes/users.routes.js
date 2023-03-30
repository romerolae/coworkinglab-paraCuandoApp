const express = require('express')
const router = express.Router()
const passport = require('../libs/passport')
const {
  checkRole,
  checkAdmin,
  checkSameUser,
} = require('../middlewares/userChecker.middleware')
const { multerUsersPhotos } = require('../middlewares/multer.middleware')

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

router.post(
  '/:id/add-image',
  passport.authenticate('jwt', { session: false }),
  checkSameUser,
  multerUsersPhotos.single('image'),
  userControllers.postUserImage
)

router.delete(
  '/:id/remove-image',
  passport.authenticate('jwt', { session: false }),
  checkSameUser,
  checkRole,
  userControllers.deleteUserImage
)

module.exports = router
