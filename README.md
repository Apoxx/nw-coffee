nw-coffee
=========

A module that let you use coffeescript easily with node-webkit.

### How to use

```html
 <script type="text/javascript">
    require("nw-coffee")("./src/app.coffee");
 </script>
```

`./src/app.coffee` is the entry point of your app. From here you can use `require()` to import commonjs modules in the webkit context and `requireNode()` to import modules in the node context.

This module uses browserify and coffeeify under the hood to import modules in webkit.

All the operations are made on the fly when you reload node-webkit. You should thus not keep this in production but pre-compile files instead.

Sourcemaps are enabled (sometimes it does not show after startup but it works after a refresh).
