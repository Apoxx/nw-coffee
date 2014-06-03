CoffeeScript  = require 'coffee-script'
path          = require 'path'
child_process = require 'child_process'
helpers       = CoffeeScript.helpers

compileFile = (filename) ->
    raw = fs.readFileSync filename, 'utf8'
    stripped = if raw.charCodeAt(0) is 0xFEFF then raw.substring 1 else raw
    try
      answer = compile(stripped, {filename, sourceMap: yes, inline: yes, literate: helpers.isLiterate filename})
    catch err      
      throw helpers.updateSyntaxError err, stripped, filename

    '' + answer.js + '\n//# sourceMappingURL=data:application/json;base64,' + (window.btoa(window.unescape(encodeURIComponent(answer.v3SourceMap)))) + '\n//# sourceURL=' + filename


loadFile = (module, filename) ->
  answer = CoffeeScript._compileFile filename, false
  module._compile answer, filename 

if require.extensions
  for ext in CoffeeScript.FILE_EXTENSIONS
    require.extensions[ext] = loadFile    
  
  Module = require 'module'

  findExtension = (filename) ->
    extensions = path.basename(filename).split '.'
    
    extensions.shift() if extensions[0] is ''
    
    while extensions.shift()
      curExtension = '.' + extensions.join '.'
      return curExtension if Module._extensions[curExtension]
    '.js'

  Module::load = (filename) ->
    @filename = filename
    @paths = Module._nodeModulePaths path.dirname filename
    extension = findExtension filename
    Module._extensions[extension](this, filename)
    @loaded = true

 if child_process
   {fork} = child_process
   splited = require.resolve('coffee-script').split path.sep
   splited = splited.splice 0, splited.length - 3
   splited.push 'bin','coffee'
   binary = splited.join path.sep
   child_process.fork = (path, args, options) ->
     if helpers.isCoffee path
       unless Array.isArray args
         options = args or {}
         args = []
       args = [path].concat args
       path = binary
     fork path, args, options