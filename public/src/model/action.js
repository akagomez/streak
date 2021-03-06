steal(
  'can',
  'moment',
  'later',
  'lodash',
  'src/model/elasticsearch.js',
  'src/utils/constants.js',
  'src/utils/remove-time-from-moment.js',

  'can/map/define',
  'can/map/sort',
function (can, moment, later, _, ElasticsearchModel, constants,
    removeTimeFromMoment) {

  var ActionModel = ElasticsearchModel.extend({
    type: 'action',
    shortName: 'ActionModel'
  }, {
    define: {
      title: {
        serialize: true,
        type: 'string'
      }
    }
  });

  ActionModel.List = ActionModel.List.extend({
    comparator: function (a, b) {
      a = moment(a.attr('relativeDate')).unix();
      b = moment(b.attr('relativeDate')).unix();
      return a > b ? -1 : 0; // Desc
    }
  });

  return ActionModel;
});