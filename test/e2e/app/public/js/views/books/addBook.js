(function(root) {
  root.AddBookView = {
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
  };
})(window, window.$, window.Kinvey);
