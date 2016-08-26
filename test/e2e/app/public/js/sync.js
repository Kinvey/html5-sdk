(function(root, _, $, Backbone, Kinvey) {
  // Use the fastest possible means to execute a task in a future turn of the
  // event loop. Borrowed from [q](http://documentup.com/kriskowal/q/).
  var nextTick;
  if('function' === typeof root.setImmediate) {// IE10, Node.js 0.9+.
    nextTick = root.setImmediate;
  }
  else if('undefined' !== typeof process && process.nextTick) {// Node.js <0.9.
    nextTick = process.nextTick;
  }
  else {// Most browsers.
    nextTick = function(fn) {
      root.setTimeout(fn, 0);
    };
  }

  // Wraps asynchronous callbacks so they get called when a promise fulfills or
  // rejects. The `success` and `error` properties are extracted from `options`
  // at run-time, allowing intermediate process to alter the callbacks.
  var wrapCallbacks = function(promise, options) {
    promise.then(function(value) {
      if(options.success) {// Invoke the success handler.
        options.success(value);
      }
    }, function(reason) {
      if(options.error) {// Invoke the error handler.
        options.error(reason);
      }
    }).then(null, function(err) {
      // If an exception occurs, the promise would normally catch it. Since we
      // are using asynchronous callbacks, exceptions should be thrown all the
      // way.
      nextTick(function() {
        throw err;
      });
    });
    return promise;
  };

  Backbone.sync = function(method, model, options) {
    var query = model.query;
    var url = _.result(model, 'url');
    var data = model.toJSON(options);
    var promise;

    if (!url) {
      var error = new Error('Model must contain a url.');
      return Kinvey.Promise.reject(error);
    }

    // Strip the leading slash
    if (url.indexOf('/') === 0) {
      url = url.substr(1);
    }

    // Extract the collection and entity id from the url
    var segments = url.split('/');
    var collection = segments[0];
    var id = segments[1] || data._id || undefined;
    var namespace = Kinvey.DataStore.collection(collection, model.dataStoreType);

    if (collection === 'users') {
      namespace = Kinvey.User;
    } else if (collection === 'files') {
      namespace = Kinvey.Files;
    }

    // Translate Backbone methods to Kinvey methods
    var methodMap = {
      read: id ? namespace.findById : namespace.find,
      create: namespace.create,
      update: namespace.update,
      delete: id ? namespace.removeById : namespace.remove,
      clear: namespace.clear,
      pull: namespace.pull,
      push: namespace.push,
      sync: namespace.sync
    };

    // Create args
    var args = [undefined, options];
    if (query) {
      args = [query, options];
    } else if (method === 'read' || method === 'delete') {
      args = [id, options];
    } else if (method === 'create' || method === 'update') {
      args = [data, options];
    }

    // Invoke Kinvey Fundtion
    if (method === 'read') {
       var stream = methodMap[method].apply(namespace, args);
       wrapCallbacks(stream.toPromise(), options);
       return stream;
    }

    // Invoke Kinvey Fundtion
    return wrapCallbacks(methodMap[method].apply(namespace, args), options);
  };
})(window, window._, window.$, window.Backbone, window.Kinvey);
