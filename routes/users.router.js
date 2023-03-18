const express = require('express');
const router = express.Router();

const userControllers = require('../controllers/users.controllers');

router.route('/').get(userControllers.getUsers).post(userControllers.addUser);

router
  .route('/:id')
  .get(userControllers.getUserById)
  .put(userControllers.updateUser);

module.exports = router;
