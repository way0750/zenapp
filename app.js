(function() {
  var Calendar = require('calendar');
  var cal = new Calendar(this.$, '2016/01/29');
  return {
    events: {
      // 'app.activated': "this.getData",
      'app.activated': "this.drawCalendar",
      'getNASAPic.done': "this.showThumbNail",
      'getNASAPic.fail': 'this.showError',
    },

    drawCalendar: function () {
      var header = this.$('#header');
      var $cal = cal.drawCalendarView();
      header.append($cal);
      console.log($cal);
    },

    showThumbNail: function (data) {
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
        return {
          url: url,
          type: 'GET',
          dataType: 'json'
        };
      }
    },

    getData: function (option) {
      this.ajax('getNASAPic', {});
    },
    

  };

}());
