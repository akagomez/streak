steal(
  'can',
  './form.stache!',
  'src/model/state.js',
  'src/model/todo.js',
  './form.less!',
  'can/map/define',
function (can, template, state, TodoModel) {

  var ViewModel = can.Map.extend({
    define: {
    },

    createTodo: function (context, el, ev) {

      // Don't submit the form
      ev.preventDefault();

      // Get the todo input
      var input = el.find('[name="title"]');

      // Get the todo title
      var title = input.val();

      // Title required
      if (! title) {
        return;
      }

      // Create a todo model
      var todoModel = new TodoModel({
        userId: state.attr('user').attr('_id'),
        title: title,
        relativeDate: state.attr('date'),
        createdAt: new Date().toISOString()
      });

      // Add the todo to the beginning of the todo list
      // TODO: Don't rely on unshift. Sort Todo.List by created date/time.
      // NOTE: I should be able to add a model to the list with any
      // createdAt time and have it inserted in the right place.
      this.attr('todos').unshift(todoModel);

      // Persist the model to the server
      todoModel.save();

      // Empty the input
      input.val('').trigger('change');


    }
  });

  return can.Component.extend({
    tag: 'app-form',
    template: template,
    scope: ViewModel,
    events: {

    }
  });
});