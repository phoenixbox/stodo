var app = app || {};

app.AppView = Backbone.View.extend({
  el : '#todoapp',

  statusTemplate: _.template( $('#stats-template').html() ),

  initialize: function() {
    // Cache the DOM elements - found relative to el
    this.allCheckbox = this.$('#toggle-all')[0];
    this.$input = this.$('#new-todo');
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');

    // Event Bindings
    this.listenTo(app.Stodos, 'add', this.addOne);
    this.listenTo(app.Stodos, 'reset', this.addAll);
  },

  // Append new list view items on fired of the add event
  addOne: function(){
    var view = new app.StodoView({model: stodo});
    $('#todo-list').append( view.render().el );
  },

  // Bulk operation addition to the list on fire of a reset event
  addAll:function(){
    this.$('#todo-list').html('');
    // Can use this because listenTo() implicitly set the callback context to the view on bind creation
    app.Stodos.each(this.addOne, this);
  }

});