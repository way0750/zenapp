(function() {
  var Calendar = require('calendar');
  var cal = new Calendar(this.$);
  return {
    events: {
      'app.activated': "this.getData",
      'getNASAPic.done': "this.showThumbNail",
      'getNASAPic.fail': 'this.showError',
      'click .calendarDate': 'this.pickDate'
    },

    calendar: cal,

    calendarHTML: cal.drawCalendarView().prop('outerHTML'),

    pickDate: function (event) {
      var value = this.$(event.target).data("fulldate");
      this.ajax('getNASAPic', {date: value});
    },

    showThumbNail: function (data) {
      console.log('got this as successful data: ', data);
      data.cal = this.calendarHTML;
      this.switchTo('showThumbNail', data);
    },

    showError: function (data) {
      console.log('got this as failure data: ', data);
      data.cal = this.calendarHTML;
      this.switchTo('showError', data);
    },

    requests: {
      getNASAPic: function (option) {
        var baseURL = 'https://api.nasa.gov/planetary/apod?';
        var apiKey = "api_key=8tKXFJvk4bzxmNizdRyj62p8ouqTEIo4LCoJO7FP";
        var params = "";
        if (option) {
          Object.keys(option).forEach(function(key) {
            params += "&" + key + "=" + option[key];
          });
        }
        var url = baseURL + apiKey + params;
        console.log('got requested right here at:\n\n',url);
        return {
          url: url,
          type: 'GET',
          dataType: 'json'
        };
      }
    },

    getData: function () {
      this.ajax('getNASAPic', {});
    },
    
  };

}());
