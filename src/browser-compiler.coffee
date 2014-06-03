dataurl       = require 'dataurl'
watchify      = require 'watchify'

module.exports = (entry, options) ->
  options ?= {}
  options.reload ?= true
  w = watchify(extensions: ['.coffee'])
  w.add entry
  opts =
    insertGlobals: false
    detectGlobals: false
    debug: true
  
  w.transform 'coffeeify'
  w.transform trans for trans in options?.transform? when trans is not 'coffeeify'

  stream = dataurl.stream(mimetype: 'text/javascript')
  encodedBundle = ''
  stream.on 'data', (data) ->
    encodedBundle += data
    return

  stream.on 'end', ->
    doc = global.window.document
    script = doc.createElement('script')
    script.type = 'text/javascript'
    script.src = encodedBundle
    doc.body.appendChild script
    return

  w.on 'update', ->
    global.window.location.reload() if options?.reload
    return

  stream.write 'global.requireNode = window.requireNode = require;'
  w.bundle(opts, (err) ->
    console.log err.toString() if err
    return
  ).pipe stream
  return