(function(root, _, $) {
  root.Page = root.Component.extend({
    fetchTemplate: function(path) {
      // Mark this function as asynchronous
      var done = this.async();

      // Fetch via jQuery's GET
      $.get(path, function(contents) {
        // Compile
        done(_.template(contents));
      }, 'text');
    }
  });
})(window, window._, window.$, window.Backbone);
