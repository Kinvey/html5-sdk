(function(root) {
  root.AddBookView = Backbone.Layout.extend({
    template: 'books/add.html',
    className: 'modal fade',

    events: {
      'click #save': 'save'
    },

    bindings: {
      '#title': 'title',
      '#author': 'author',
      '#isbn': 'isbn',
      '#summary': 'summary'
    },

    show: function() {
      this.render();
      this.$el.modal({
        backdrop: 'static',
        keyboard: false,
        show: true
      });
    },

    close: function() {
      this.$el.modal('hide');
    },

    save: function() {
      var that = this;
      return this.model.save().then(function() {
        that.close();
      });
    }
  });
})(window, window._, window.$, window.Backbone, window.Kinvey);
