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

    markSelectedDateOnCal: function (fullDate) {
      if (this.curSelectedDate) {
        this.curSelectedDate.removeClass('selectedDate');
      }
      this.curSelectedDate = this.$('.calendar [data-fulldate='+fullDate+']');
      this.curSelectedDate.addClass('selectedDate');
    },

    updateMainAppView: function (data) {
      //saving this in case the nav bar has yet been activated
      this.dataForNavBarReady = data;
      // console.log('server data:', data.date);
      this.markSelectedDateOnCal(data.date);

      var thumbNail = this.$('.thumbNail');
      var largerNASAPic = this.$('.largerNASAPic');
      var videoPlayer = this.$('.videoPlayer');
      var thisIsAYoutubeVideo = /www\.youtube\.com\/embed/.test(data.url);

      if (thisIsAYoutubeVideo) {
        //http://img.youtube.com/vi/1vqlZiUYwKc/0.jpg
        var youtubeVideoID = data.url.match(/[^\/]+(?=\?)/)[0];
        thumbNail.attr({src: "http://img.youtube.com/vi/" + youtubeVideoID + "/0.jpg"});
        videoPlayer.attr({src: data.url});
        largerNASAPic.toggle(false);
        videoPlayer.toggle(true);
      } else {
        thumbNail.attr({src: data.url});
        largerNASAPic.attr({src: data.url});
        largerNASAPic.toggle(true);
        videoPlayer.toggle(false);
      }

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
        var apiKey = "";
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
