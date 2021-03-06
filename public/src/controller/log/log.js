steal(
  'can',
  'lodash',
  './log.stache!',
  'src/model/state.js',
  'src/model/action.js',
  'src/utils/constants.js',

  './log.less!',
  'src/component/date-nav',
  'src/component/form',
  'src/component/actions',
  'can/map/define',
  'can/list/promise',
function (can, _, template, state, ActionModel, constants) {

  var ViewModel = can.Map.extend({
    define: {
      actions: {
        Type: ActionModel.List
      },
      actionsGroupedByDate: {
        Type: can.Map,
        value: {}
      }
    }
  });

  return can.Component.extend({
    tag: 'log-controller',
    template: template,
    scope: ViewModel,
    events: {

      inserted: function () {
        var self = this;
        var userId = state.attr('user').attr('_id');

        // This should never happen.
        if (! userId) {
          throw "Cannot get a action list without a user id.";
        }

        // Initialize
        this.loadActions();
      },

      loadActions: function () {
        var userId = state.attr('user').attr('_id');

        // Get all the actions for this user
        // TODO: Move this to the state model
        // TODO: Find out if the state model is the best place to put this
        var allActionsDfd = ActionModel.findAll({
          // size: 3,
          size: 100,
          query: {
            match: {
              userId: userId
            }
          },
          sort: {
            createdAt: 'desc'
          }
        });

        // Handle a failed findAll
        allActionsDfd.fail(function () {
          state.alert('danger', 'Blast',
            'There was an error getting your actions. Cross your fingers ' +
            'and try again.');
        });

        // list.replace(dfd) fires a bunch of "add" events that aren't batched
        // and thus sorting churns.
        allActionsDfd.done(function (actions) {
          can.batch.start();
          state.attr('actions').replace(actions);
          can.batch.stop();
        });
      },

      '{scope.actions} add': function (actions, ev, oldVal) {
        if (ev.batchNum) {
          if (ev.batchNum === this._lastActionLengthBatchNum) {
            return;
          } else {
            this._lastActionLengthBatchNum = ev.batchNum;
          }
        }

        this.groupActions();
      },

      '{scope} date': 'groupActions',

      groupActions: function () {
        var actions = this.scope.attr('actions');
        var groupedActions = this.scope.attr('actionsGroupedByDate');
        var viewedDateTimestamp = this.scope.attr('date').unix();

        var groupComparator = function (a, b) {
          a = moment(a.attr('createdAt')).unix();
          b = moment(b.attr('createdAt')).unix();
          return a === b ? 0 : a > b ? -1 : 1; // Desc
        }

        actions.each(function (action) {
          var relativeDate = moment(action.attr('relativeDate'));
          var relativeDateTimestamp = relativeDate.unix();
          var relativeDateSlug =
            relativeDate.format(constants.dateSlugFormat);
          var group = groupedActions.attr(relativeDateSlug);

          // Create the list if it doesn't exist
          if (! group) {
            group = new ActionModel.List();
            group.attr('comparator', groupComparator);
            groupedActions.attr(relativeDateSlug, group);
          }

          // Hide or show based on viewed date
          group.attr('isHidden', relativeDateTimestamp > viewedDateTimestamp);

          // Only add the action if it's not already in the list.
          // Don't worry about removing items. That's handled by
          // bubbling/destroy
          if (group.indexOf(action) === -1) {
            group.push(action);
          }
        });
        window.actionsGroupedByDate = groupedActions;
        this.scope.attr('actionsGroupedByDate', groupedActions);
      }
    }
  });
});