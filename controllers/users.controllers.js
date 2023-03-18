const { literal } = require('sequelize')
const UsersService = require('../services/users.service')
const { getPagination, getPagingData} = require('../utils/helpers')

const usersService = new UsersService

const getUsers = async (req, res, next) =>{
  try {
    let query = req.query
    let { page, size} = query 

    const { limit, offset } = getPagination(page, size, '10')
    query.limit = limit
    query.offset = offset
    let users = await usersService.findAndCount(query)
    const results = getPagingData(users, page, limit)
    return res.status(200).json({results: results})
  }catch(error){
    next(error)
  }

}

const getUserById = async (req, res, next) =>{
  try{
    let id = req.params
    let user = await usersService.getAuthUserOr404(id)
    return res.json({results: user})
  }catch(error){
    next(error)
  }
}

const addUser = async (req, res, next) =>{
  try{
    let { body } = req
    let user = await usersService.createAuthUser(body)
    return res.status(201).json({results: user})
  }catch(error){
    next(error)
  }
}

const updateUser = async (req, res, next) =>{
  try{
    let { id } = req.params
    let { name } = req.body
    let user = await usersService.updateUser(id, {name})
    return res.json({results: user})
  }catch(error){
    next(error)
  }
}


module.exports = {
  getUsers,
  getUserById,
  addUser,
  updateUser
}