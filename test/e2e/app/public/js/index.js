(function(root, _, $, Backbone, Kinvey) {
  // Init Kinvey
  Kinvey.init({
    appKey: 'kid_HkTD2CJc',
    appSecret: 'cd7f658ed0a548dd8dfadf5a1787568b'
  });

  // Create a router
  new root.Router();

  // Start the Backbone history
  Backbone.history.start({ pushState: true, root: '/' });
})(window, window._, window.$, window.Backbone, window.Kinvey);
