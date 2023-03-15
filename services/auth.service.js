const models = require('../database/models')
const UsersService = require('../services/users.service');

const { comparePassword } = require('../libs/bcrypt');
const jwt = require('jsonwebtoken');
const { CustomError } = require('../utils/helpers');

const usersService = new UsersService();

class AuthService {
  constructor() {}

  async checkUsersCredentials(email, password) {
    let user = await usersService.findUserByEmailOr404(email);
    let verifyPassword = comparePassword(password, user.password);
    return user;
  }

  async createRecoveryToken(email) {
    let user = await usersService.findUserByEmailOr404(email);
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET_WORD,
      { expiresIn: '900s' }  //15 minutes
    );
    return { user, token };
  }

  async changePassword({ id, exp }, newPassword, token) {
    await usersService.verifiedTokenUser(id, token, exp);
    let updatedUser = await usersService.updatePassword(id, newPassword);
    return updatedUser;
  }

  async userToken(id) {
    let user = await models.Users.scope('view_me').findOne(
      {
        where: {id},
        include: [{
          model: models.Profiles,
          as: 'profiles'
        }]
      },   
      { raw: true }
    )
    if (!user) throw new CustomError('Not found User', 404, 'Not Found')
    return user
  }
}

module.exports = AuthService;
