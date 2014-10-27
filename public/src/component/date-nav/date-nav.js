steal('can',
  './date-nav.stache!',

  './date-nav.less!',
  'can/map/define',
  function (can, template) {

  var ViewModel = can.Map.extend({
    define: {

    },
    goBackOneDay: function () {
      var newSlug = this.attr('date')
        .subtract(1, 'days')
        .format(this.attr('dateSlugFormat'));
      console.log(newSlug)
      this.attr('dateSlug', newSlug);
    },
    goForwardOneDay: function () {
      var newSlug = this.attr('date')
        .add(1, 'days')
        .format(this.attr('dateSlugFormat'));
      this.attr('dateSlug', newSlug);
    }
  });

  return can.Component.extend({
    tag: 'app-date-nav',
    template: template,
    scope: ViewModel,
    events: {
      inserted: function () {

      }
    },
    helpers: {
      formatDate: function (date) {
        // TODO: Find out why I have to call this
        var m = date();
        // Monday, Oct. 27th, 2014
        return m.format('dddd, MMM. Do, YYYY');
      }
    }
  });

});