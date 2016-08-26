(function(root, _, $, Backbone, Kinvey) {
  var wrapError = function(model, options) {
    var error = options.error;
    options.error = function(resp) {
      if (error) error.call(options.context, model, resp, options);
      model.trigger('error', model, resp, options);
    };
  };

  root.Books = Backbone.Collection.extend({
    url: '/Books',
    model: root.Book,
    dataStoreType: Kinvey.DataStoreType.Sync,
    comparator: 'title',

    pull: function(options) {
      options = _.extend({ parse: true }, options);
      var success = options.success;
      var collection = this;
      options.success = function(resp) {
        var method = options.reset ? 'reset' : 'set';
        collection[method](resp, options);
        if (success) success.call(options.context, collection, resp, options);
        collection.trigger('sync', collection, resp, options);
      };
      wrapError(this, options);
      return this.sync('pull', this, options);
    },

    clear: function(options) {
      options = _.extend({}, options);
      var success = options.success;
      var collection = this;
      options.success = function(resp) {
        collection.reset([], options);
        if (success) success.call(options.context, collection, resp, options);
      };
      wrapError(this, options);
      return this.sync('clear', this, options);
    }
  });
})(window, window._, window.$, window.Backbone, window.Kinvey);
