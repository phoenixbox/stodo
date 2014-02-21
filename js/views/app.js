var app = app || {};

app.AppView = Backbone.View.extend({
  el : '#todoapp',

  statsTemplate: _.template( $('#stats-template').html() ),

  events: {
    'keypress #new-todo': 'createOnEnter',
    'click #clear-completed': 'clearCompleted',
    'click #toggle-all': 'toggleAllComplete',
  },

  initialize: function() {
    // Cache the DOM elements - found relative to el
    this.allCheckbox = this.$('#toggle-all')[0];
    this.$input = this.$('#new-todo');
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');

    // Event Bindings
    this.listenTo(app.Stodos, 'add', this.addOne);
    this.listenTo(app.Stodos, 'reset', this.addAll);

    this.listenTo(app.Stodos, 'change:completed', this.filterOne);
    this.listenTo(app.Stodos, 'filter', this.filterAll);
    this.listenTo(app.Stodos, 'all', this.render);

    // Load items which may be in LocalStorage
    app.Stodos.fetch();
  },

  render: function(){
    var completed = app.Stodos.completed().length;
    var remaining = app.Stodos.remaining().length;

    if (app.Stodos.length) {
      this.$main.show();
      this.$footer.show();

      this.$footer.html(this.statsTemplate({
        completed: completed,
        remaining: remaining
      }));

      this.$('#filters li a')
      .removeClass('selected')
      .filter('[href="#/' + ( app.StodoFilter || '' ) + '"]')
      .addClass('selected');
    } else {
      this.$main.hide();
      this.$footer.hide();
    }

    this.allCheckbox.checked = !remaining;
  },

  // Append new list view items on fired of the add event
  addOne: function(stodo){
    var view = new app.StodoView({model: stodo});
    $('#todo-list').append( view.render().el );
  },

  // Bulk operation addition to the list on fire of a reset event
  addAll:function(){
    this.$('#todo-list').html('');
    // Can use this because listenTo() implicitly set the callback context to the view on bind creation
    app.Stodos.each(this.addOne, this);
  },

  filterOne: function (stodo) {
    stodo.trigger('visible');
  },

  filterAll: function() {
    app.Stodos.each(this.filterOne, this);
  },

  newAttributes: function() {
    return {
      title: this.$input.val().trim(),
      order: app.Stodos.nextOrder(),
      completed: false
    }
  },

  createOnEnter: function(event) {
    if (event.which !== ENTER_KEY || !this.$input.val().trim() ) {
      return;
    }
    app.Stodos.create( this.newAttributes() ) ;
    this.$input.val('');
  },

  clearCompleted: function() {
    _.invoke(app.Stodos.completed(), 'destroy');
    return false;
  },

  toggleAllComplete: function() {
    var completed = this.allCheckbox.checked;

    app.Stodos.each(function(stodo){
      stodo.save({
        'completed': completed
      });
    });
  }
});