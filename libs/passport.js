// const passportJWT = require('../middlewares/auth.middleware')

const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const passport = require('passport')
require('dotenv').config()

const UsersService = require('../services/users.service')
const usersService = new UsersService() 

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  secretOrKey: process.env.JWT_SECRET_WORD
}

passport.use(
  new JwtStrategy(options, (tokenDecoded, done) => {
    usersService.getAuthUserOr404(tokenDecoded.id)
      .then((user) => {
        if (user) {
          return done(null, tokenDecoded)
        } else {
          return done(null, false)
        }
      })
      .catch((err) => {
        return done(err, false)
      })
  })
)

module.exports = passport
