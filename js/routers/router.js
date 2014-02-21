var Workspace = Backbone.Route.extend({
  // Use of the splat to set up a default route
  routes: {
    '*filter': 'setFilter'
  },

  setFilter: function(){
    window.app.Stodos.trigger('filter');
  },
});

app.StodoRouter = new Workspace();
Backbone.History.start();