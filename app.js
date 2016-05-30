(function() {
  var Calendar = require('calendar');
  var cal = new Calendar(this.$, '2016/01/29');
  return {
    events: {
      'app.activated': "this.getData",
      'getNASAPic.done': "this.showThumbNail",
      'getNASAPic.fail': 'this.showError',
      'click .calendarDate': 'this.pickDate'
    },

    pickDate: function (event) {
      var value = this.$(event.target).data("fulldate");
      this.ajax('getNASAPic', {date: value});
    },

    showThumbNail: function (data) {
      data.cal = cal.drawCalendarView().prop('outerHTML');
      this.switchTo('showThumbNail', data);
    },

    showError: function (data) {
      console.log(JSON.stringify(data, null, '  '));
      this.switchTo('showError', {});
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
        console.log(url);
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
