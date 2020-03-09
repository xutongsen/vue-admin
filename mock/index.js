const user = require('./user')
const search = require('./remote-search')
const article = require('./article')
const mocks = [
  ...user,
  ...search,
  ...article
]
module.exports = mocks

