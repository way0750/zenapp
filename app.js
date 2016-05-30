(function() {
  var Calendar = require('calendar');
  var calendar = new Calendar(this.$);
  return {
    events: {
      'app.activated': "this.drawMainView",
      'pane.activated': "this.navBarReady",
      'getNASAPic.done': "this.updateMainAppView",
      'getNASAPic.fail': 'this.showError',
      'click .calendarDate': 'this.pickDate',
      'click .calendarChangeMonth' : 'this.changeMonth',
      'click .thumbNail': 'this.toggleModal'
    },

    //this is need for pane get activated because http request might come back before nav bar even is ready
    navBarReady: function () {
      this.updateMainAppView(this.dataForNavBarReady);
    },

    calendar: calendar,

    calendarHTML: calendar.drawCalendarView().prop('outerHTML'),

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
      var dateEle = this.$(event.target);
      this.ajax('getNASAPic', {date: dateEle.data("fulldate")});
    },

    updateMainAppView: function (data) {
      //saving this in case the nav bar has yet been activated
      this.dataForNavBarReady = data;
      // console.log('server data:', data.date);
      if (this.curSelectedDate) {
        this.curSelectedDate.removeClass('selectedDate');
      }
      this.curSelectedDate = this.$('.calendar [data-fulldate='+data.date+']');
      this.curSelectedDate.addClass('selectedDate');
      
      this.$('.thumbNail').attr({src: data.url});
      this.$('.largerNASAPic').attr({src: data.url});
      this.$('.myModalLabel').text(data.title);
      this.$('.explanation').text(data.explanation);
      this.playLoadingGif(false);
    },

    showError: function (data) {
      var explanation = JSON.parse(data.responseText).msg;
      var obj = {
        explanation: explanation,
        url: this.assetURL("error.jpeg"),
        title: 'nothing found, pick another date'
      };
      this.updateMainAppView(obj);
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

    drawMainView: function () {
      this.switchTo('mainAppView', {calendar: this.calendarHTML});
      this.ajax('getNASAPic', {});
    },
    
  };

}());
