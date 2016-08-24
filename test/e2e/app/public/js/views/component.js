(function(root, _, $, Backbone) {
  var components = {};

  // Create Component Class
  root.Component = Backbone.Layout.extend({
    // Allow function templates to pass through.
    fetchTemplate: function(template) {
      return template;
    },

    renderTemplate: function(template, data) {
      return template(data);
    },

    afterRender: function() {
      if (this.model && this.model instanceof Backbone.Model) {
        this.stickit();
      }
    },

    serialize: function() {
      return this.dataset;
    }
  }, {
    register: function(identifier, ctor) {
      // Allow a manual override of the selector to use.
      identifier = identifier || ctor.prototype.selector;

      if (!identifier) {
        throw new Error('Invalid component selector');
      }

      if (components[identifier]) {
        throw new Error('Component is already registered');
      }

      // Shim the element for older browsers.
      if (identifier.slice(0, 1).match(/[A-Za-z]/)) {
        document.createElement(identifier);
      }

      var instances = [];

      // Cache this component into the existing list.
      components[identifier] = { ctor: ctor, instances: instances };

      return ctor;
    },

    unregister: function(identifier) {
      delete components[identifier];
    },

    activate: function($el, instances) {
      var Ctor = this;

      // Convert all attributes on the Element into View properties.
      var attrs = _.reduce($el[0].attributes, function(attrs, attr) {
        var name = attr.name;

        // Optionally consume data attributes.
        if (attr.name.indexOf('data-') === 0) {
          name = attr.name.slice(5);
        }

        attrs[name] = attr.value;

        return attrs;
      }, {});

      // Associate the element as well.
      attrs.el = $el;

      // Create a new Component.
      var component = new Ctor(attrs);

      // Trigger the standard `createdCallback`.
      if (typeof component.createdCallback === 'function') {
        component.createdCallback();
      }

      // Add to the internal cache.
      instances.push(component);

      // Render and apply to the Document.
      component.render();
    },

    activateAll: function(component) {
      var el = component ? component.el : document.body;

      _.each(components, function(current, selector) {
        $(el).find(selector).each(function() {
          root.Component.activate.call(current.ctor, $(this), current.instances);
        });
      });
    }
  });

  // Activate all components on DOM ready.
  $(root.Component.activateAll);

  // Override the constructor
  var LayoutConstructor = Backbone.Layout;
  Backbone.Layout.prototype.constructor = function() {
    // Call super
    LayoutConstructor.apply(this, arguments);

    // Attach the dataset
    this.dataset = this.$el.data();

    // Activate new components found after rendering
    this.listenTo(this, 'afterRender', function() {
      root.Component.activateAll(this);
    });
  };
  Backbone.Layout = Backbone.Layout.prototype.constructor;

  // Copy over the extend function
  Backbone.Layout.extend = LayoutConstructor.extend;

  // Copy over the prototype
  Backbone.Layout.prototype = LayoutConstructor.prototype;
})(window, window._, window.$, window.Backbone);
