const express = require('express')
const routesUser = require('./users.routes')
const routesPublicationsTypes = require('./publicationsTypes.routes')
const routesCountries = require('./countries.routes')
const routesStates = require('./states.routes')
const routesCities = require('./cities.routes')
const routesRoles = require('./roles.routes')
const routesTags = require('./tags.routes')
const routesPublications = require('./publications.routes')

//const isAuthenticatedByPassportJwt = require('../libs/passport')

const routesAuth = require('./auth.routes')

function routerModels(app) {
  const router = express.Router()

  app.use('/api/v1', router)
  router.use('/auth', routesAuth)
  router.use('/users', routesUser)
  router.use('/publications-types', routesPublicationsTypes)
  router.use('/countries', routesCountries)
  router.use('/states', routesStates)
  router.use('/cities', routesCities)
  router.use('/roles', routesRoles)
  router.use('/tags', routesTags)
  router.use('/publications', routesPublications)
}
module.exports = routerModels
