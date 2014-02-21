var app = app || {};

var StodoList = Backbone.Collection.extend({
  model: app.Stodo,

  localStorage: new Backbone.LocalStorage('stodos-backbone'),

  completed: function(){
    return this.filter(function(stodo){
      return stodo.get('completed');
    });
  },
  // Apply defines the context of this within the functions scope
  remaining: function(){
    return this.without.apply( this, this.completed() );
  },

  nextOrder: function(){
    if (!this.length){
      return 1;
    }
    return this.last().get('order')+1;
  },

  comparator: function(){
    return stodo.get('order');
  },
});

app.Stodos = new StodoList();