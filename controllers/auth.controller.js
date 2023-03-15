const AuthService = require('../services/auth.service')
const UsersService = require('../services/users.service')
const { CustomError } = require('../utils/helpers')
const jwt = require('jsonwebtoken')
const sender = require('../libs/nodemailer')
require('dotenv').config()

const authService = new AuthService()
const usersService = new UsersService()

const logIn = async (request, response, next) => {
    
  try {
    
    const { email, password } = request.body    
    const user = await authService.checkUsersCredentials(email, password)
    
    const token = jwt.sign({
      id: user.id,
      email: user.email,
    }, process.env.JWT_SECRET_WORD,
    { expiresIn: '24h' })

    return response.status(200).json({
      message: 'Correct Credentials',
      token
    })
  }
  catch (error) {
    next(error)
  }
}

const signUp = async (request, response, next) => {
  try {
    let { body } = request;
    let errors = []
    let user = await usersService.createAuthUser(body);
    try {
      await sender.sendMail({
        from: process.env.MAIL_SEND,
        to: user.email,
        subject: `Success SignUp! ${user.firstName} `,
        html: `<h1>Welcome to: ${process.env.DOMAIN}`,
        text: 'Welcome Again!',
      })
    } catch (error) {
      errors.push({errorName:'Error Sending Email', message:'Something went wrong with the Sender Email'})
    }
    return response
      .status(201)
      .json({
        results: 'Success Sign Up',
        errors
      });
  } catch (error) {
    next(error);
  }
};


const forgetPassword = async (request, response, next) => {
  const { email } = request.body
  try {
    let userAndToken = await authService.createRecoveryToken(email)
    let user = await usersService.setTokenUser(userAndToken.user.id, userAndToken.token)
    
    try {
      await sender.sendMail({
        from: process.env.MAIL_SEND,
        to: user.email,
        subject: 'Restore Password',
        html: `<span>${process.env.PASSWORD_RESET_DOMAIN}api/v1/auth/change-password/${userAndToken.token}</span>`
      })
    } catch (error) {
      throw new CustomError('Error Sending the Recovery email', 500, 'Application Error')
    }
    return response.status(200).json({ results: { message: 'Email sended!, check your inbox' } })
  } catch (error) {
    next(error)
  }
}

const restorePassword = async (request, response, next) => {
  const { password } = request.body
  try {
    let tokenInfo
    try {
      tokenInfo = JSON.parse(atob((request.params.token).split('.')[1]))
    } catch (error) {
      throw new CustomError('Something went wrong deserializing the token', 401, 'Unauthorized')
    }
    await authService.changePassword(tokenInfo, password, request.params.token)
    response.status(200).json({results: {message: 'update success'} })
  } catch (error) {
    next(error)
  }
}

const userToken = async (request, response, next) => {
  try {    
    let id = request.user.id
    let user = await authService.userToken(id)
    return response.json({results:user})    
  } catch (error) {
    next(error)
  }
}


module.exports = {
  logIn,
  signUp,
  forgetPassword,
  restorePassword,
  userToken
}