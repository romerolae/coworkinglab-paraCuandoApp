const TagsService = require('../services/tags.service')
const { getPagination, getPagingData } = require('../utils/helpers')

const tagsService = new TagsService()

const getTags = async (req, res, next) => {
  try {
    let query = req.query
    let { page, size } = query

    const { limit, offset } = getPagination(page, size, '10')
    query.limit = limit
    query.offset = offset
    let users = await tagsService.findAndCount(query)
    const results = getPagingData(users, page, limit)
    return res.status(200).json({ results: results })
  } catch (error) {
    next(error)
  }
}

const postTag = async (req, res, next) => {
  try {
    const tag = req.body
    await tagsService.createTag(tag)
    return res.status(201).json({ message: 'Tag Added' })
  } catch (error) {
    next(error)
  }
}

const getTagById = async (req, res, next) => {
  try {
    const { id } = req.params
    const tag = await tagsService.getTagOr404(id)
    return res.status(200).json(tag)
  } catch (error) {
    next(error)
  }
}

const putTagById = async (req, res, next) => {
  const id = req.params.id
  const obj = req.body
  try {
    await tagsService.updateTagById(id, obj)
    return res.json({ message: 'Successfully updated' })
  } catch (error) {
    next(error)
  }
}

const deleteTagById = async (req, res, next) => {
  const id = req.params.id
  try {
    await tagsService.removeTag(id)
    return res.json({ message: 'Tag removed' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getTags,
  postTag,
  getTagById,
  putTagById,
  deleteTagById,
}
