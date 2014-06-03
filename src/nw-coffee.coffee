if not global.requireNode?
  require './node-compiler'
  module.exports = require './browser-compiler'