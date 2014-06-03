// Generated by CoffeeScript 1.7.1
(function() {
  var dataurl, watchify;

  dataurl = require('dataurl');

  watchify = require('watchify');

  module.exports = function(entry, options) {
    var encodedBundle, opts, stream, trans, w, _i, _len, _ref;
    if (options == null) {
      options = {};
    }
    if (options.reload == null) {
      options.reload = true;
    }
    w = watchify({
      extensions: ['.coffee']
    });
    w.add(entry);
    opts = {
      insertGlobals: false,
      detectGlobals: false,
      debug: true
    };
    w.transform('coffeeify');
    _ref = (options != null ? options.transform : void 0) != null;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      trans = _ref[_i];
      if (trans === !'coffeeify') {
        w.transform(trans);
      }
    }
    stream = dataurl.stream({
      mimetype: 'text/javascript'
    });
    encodedBundle = '';
    stream.on('data', function(data) {
      encodedBundle += data;
    });
    stream.on('end', function() {
      var doc, script;
      doc = global.window.document;
      script = doc.createElement('script');
      script.type = 'text/javascript';
      script.src = encodedBundle;
      doc.body.appendChild(script);
    });
    w.on('update', function() {
      if (options != null ? options.reload : void 0) {
        global.window.location.reload();
      }
    });
    stream.write('global.requireNode = window.requireNode = require;');
    w.bundle(opts, function(err) {
      if (err) {
        console.log(err.toString());
      }
    }).pipe(stream);
  };

}).call(this);