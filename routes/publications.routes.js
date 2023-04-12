const express = require('express')
const passport = require('../libs/passport')
const router = express.Router()
const {
  checkRole,
  checkSameUser,
  checkPublicationOwner,
} = require('../middlewares/userChecker.middleware')
const {
  getPublications,
  getPublicationById,
  postPublication,
  deletePublication,
  addVote,
  uploadImagePublication,
  removePublicationImage,
} = require('../controllers/publications.controller')
const { multerPublicationsPhotos } = require('../middlewares/multer.middleware')

router.get(
  '/',
  passport.authenticate(['jwt', 'anonymous'], {session: false}),
  getPublications)

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  postPublication
)

router.get(
  '/:id',
  passport.authenticate(['jwt', 'anonymous'], {session: false}),
  getPublicationById)

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkRole,
  checkPublicationOwner,
  deletePublication
)

router.post(
  '/:id/vote',
  passport.authenticate('jwt', { session: false }),
  addVote
)

router.post(
  '/:id/add-image',
  passport.authenticate('jwt', { session: false }),
  checkPublicationOwner,
  checkRole,
  multerPublicationsPhotos.array('image', 3),
  uploadImagePublication
)

router.delete(
  '/:id/remove-image/:order',
  passport.authenticate('jwt', { session: false }),
  checkPublicationOwner,
  checkRole,
  removePublicationImage
)

module.exports = router
