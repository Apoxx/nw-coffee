// Generated by CoffeeScript 1.7.1
(function() {
  var CoffeeScript, Module, binary, child_process, ext, findExtension, fork, helpers, loadFile, path, _i, _len, _ref;

  CoffeeScript = require('coffee-script');

  child_process = require('child_process');

  helpers = CoffeeScript.helpers;

  path = require('path');

  fs = require('fs');

  compileFile = function(filename) {
    var answer, err, raw, stripped;

    raw = fs.readFileSync(filename, 'utf8');
    stripped = raw.charCodeAt(0) === 0xFEFF ? raw.substring(1) : raw;
    try {
      answer = CoffeeScript.compile(stripped, {
        filename: filename,
        sourceMap: true,
        inline: true,
        literate: helpers.isLiterate(filename)
      });
    } catch (_error) {
      err = _error;
      throw helpers.updateSyntaxError(err, stripped, filename);
    }
    answer.js = "" + answer.js + "\n//# sourceMappingURL=data:application/json;base64," + (window.btoa(window.unescape(encodeURIComponent(answer.v3SourceMap)))) + "\n//# sourceURL=" + filename;
    return answer.js;
  };

  loadFile = function(module, filename) {
    var answer;
    answer = compileFile(filename);
    return module._compile(answer, filename);
  };

  if (require.extensions) {
    _ref = CoffeeScript.FILE_EXTENSIONS;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      ext = _ref[_i];
      require.extensions[ext] = loadFile;
    }
    Module = require('module');
    findExtension = function(filename) {
      var curExtension, extensions;
      extensions = path.basename(filename).split('.');
      if (extensions[0] === '') {
        extensions.shift();
      }
      while (extensions.shift()) {
        curExtension = '.' + extensions.join('.');
        if (Module._extensions[curExtension]) {
          return curExtension;
        }
      }
      return '.js';
    };
    Module.prototype.load = function(filename) {
      var extension;
      this.filename = filename;
      this.paths = Module._nodeModulePaths(path.dirname(filename));
      extension = findExtension(filename);
      Module._extensions[extension](this, filename);
      return this.loaded = true;
    };
  }

  if (child_process) {
    fork = child_process.fork;
    var splited = require.resolve('coffee-script').split(path.sep);
    splited = splited.splice(0, splited.length - 3);
    splited.push("bin","coffee");
    binary = splited.join(path.sep);
    child_process.fork = function(path, args, options) {
      if (helpers.isCoffee(path)) {
        if (!Array.isArray(args)) {
          options = args || {};
          args = [];
        }
        args = [path].concat(args);
        path = binary;
      }
      return fork(path, args, options);
    };
  }

  module.exports = function(entry){
    var dataurl = require("dataurl");
    var watchify = require('watchify');
    var w = watchify({extensions : ['.coffee']});
    w.add(entry);
    var opts = {
      insertGlobals : false,
      detectGlobals : false,
      debug: true
    };
    w.transform('coffeeify');  
    var stream = dataurl.stream({mimetype : "text/javascript"});
    var encodedBundle = "";
    stream.on('data', function(data){
      encodedBundle += data;
    });
    stream.on('end', function(){
      var doc = global.window.document;
      var script = doc.createElement("script");
      script.type = "text/javascript";
      script.src = encodedBundle;
      doc.body.appendChild(script);
    });
    w.on('update', function(){
      global.window.location.reload();
    });
    stream.write("global.requireNode = window.requireNode = require;");
    w.bundle(opts, function(err){
      if(err)
        console.log(err.toString());
    }).pipe(stream);
  };
}).call(this);