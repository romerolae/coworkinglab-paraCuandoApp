const express = require('express')
const routesUser = require('./users.routes')
const routesPublicationsTypes = require('./publicationsTypes.routes')

//const isAuthenticatedByPassportJwt = require('../libs/passport')

const routesAuth = require('./auth.routes')

function routerModels(app) {
  const router = express.Router()

  app.use('/api/v1', router)
  router.use('/auth', routesAuth)
  router.use('/users', routesUser)
  router.use('/publications-types', routesPublicationsTypes)
}
module.exports = routerModels
