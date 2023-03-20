const express = require('express');
const router = express.Router();
const passportJwt = require('../routes/auth.routes')


const userControllers = require('../controllers/users.controller');

router.route('/').get(userControllers.getUsers).post(userControllers.addUser);

router
  .route('/:id')
  .get(passportJwt, userControllers.getUserById)
  .put(passportJwt, userControllers.putUser);

module.exports = router;
