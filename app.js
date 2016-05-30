(function() {
  var Calendar = require('calendar');
  var cal = new Calendar(this.$);
  return {
    events: {
      'app.activated': "this.initalGet",
      'getNASAPic.done': "this.updateMainAppView",
      'getNASAPic.fail': 'this.showError',
      'click .calendarDate': 'this.pickDate',
      'click .calendarChangeMonth' : 'this.changeMonth',
      'click .thumbNail': 'this.toggleModal'
    },

    calendar: cal,

    calendarHTML: cal.drawCalendarView().prop('outerHTML'),

    toggleModal: function () {
      this.$('#myModal').modal();
    },

    playLoadingGif: function (play) {
      //activate the hidden loading gif
      var loadingGif = this.$('.loadingGif');
      if (play) {
        loadingGif.removeClass('hideLoadingGif');
      } else {
        loadingGif.addClass('hideLoadingGif');
      }
    },

    changeMonth: function (event) {
      //check and see if should change to next or previous
      //make sure to change calendar and calendarHTML too
      var $ele = this.$(event.target);
      if ($ele.hasClass('previousMonth')) {
        this.calendar.newMonth(-1);
      } else if ($ele.hasClass('nextMonth')) {
        this.calendar.newMonth(1);
      }

      this.calendarHTML = this.calendar.drawCalendarView().prop('outerHTML');

      var currentCalendar = this.$('.calendar');
      currentCalendar.empty();
      currentCalendar.html(this.calendarHTML);

    },

    pickDate: function (event) {
      var picOnThisDate = this.$(event.target).data("fulldate");
      this.ajax('getNASAPic', {date: picOnThisDate});
    },

    updateMainAppView: function (data) {
      this.$('.thumbNail').attr({src: data.url});
      this.$('.largerNASAPic').attr({src: data.url});
      this.$('.myModalLabel').text(data.title);
      this.playLoadingGif(false);
    },

    showError: function (data) {
      // console.log('got this as failure data: ', data);
      // data.cal = this.calendarHTML;
      // this.switchTo('showError', data);
    },

    requests: {
      getNASAPic: function (option) {
        this.playLoadingGif(true);
        var baseURL = 'https://api.nasa.gov/planetary/apod?';
        var apiKey = "api_key=8tKXFJvk4bzxmNizdRyj62p8ouqTEIo4LCoJO7FP";
        var params = "";
        if (option) {
          Object.keys(option).forEach(function(key) {
            params += "&" + key + "=" + option[key];
          });
        }
        var url = baseURL + apiKey + params;
        return {
          url: url,
          type: 'GET',
          dataType: 'json'
        };
      }
    },

    initalGet: function () {
      this.switchTo('mainAppView', {cal: this.calendarHTML});
      this.ajax('getNASAPic', {});
    },
    
  };

}());
