// make a calendar class
// with optional year month date

function Calendar(jquery, dateString) {
  this.$ = jquery;
  var date = dateString ? new Date(dateString) : new Date();
  this.currentMonth = date.getMonth() + 1;
  this.currentDate = date.getDate();
  this.currentYear = date.getFullYear();
  
  date.setDate(1);
  this.firstDay = date.getDay();
  if (/4|6|9|11/.test(this.currentMonth + '')) {
    this.daysInCurMonth = 30;
  } else if (/2/.test(this.currentMonth + '')){
    this.daysInCurMonth = (this.currentYear%4==0 && this.currentYear%100!=0 || this.currentYear%400==0) ? 29 : 28;
  } else {
    this.daysInCurMonth = 31;
  }
}

Calendar.prototype.makeCalendarMatirx = function() {
  var amount = this.daysInCurMonth;
  var curDay = this.firstDay;
  var matrix = [[]];
  for (var i = 1; i <= amount; i++) {
    //use curDay as index
    var mostRecentWeek = matrix[matrix.length-1];
    if (mostRecentWeek.length === 7) {
      matrix.push([]);
      mostRecentWeek = matrix[matrix.length-1];
    }
    mostRecentWeek[curDay] = {day: curDay, date: i, fullStr: this.currentYear + '-' + this.currentMonth + '-' + i};
    curDay = (++curDay)%7;
  }
  return matrix;
};


//make calendar view
//add methods to go to next month or previous month
//
//make calendar view: need to make banner for displaying month add button to go to next or previous month
//    make row for Sun Mon, Tue....
//

Calendar.prototype.makeBanner = function() {
  //just need to make a row and return it
  var $bannerRow = this.$('<tr/>');
  var $previousMonth = this.$('<button><</button>');
  var $nextMonth = this.$('<button>></button>');
  var $thisMonth = this.$('<h3>' + this.currentMonth + '</h3>');
  $bannerRow.append([$previousMonth, $thisMonth, $nextMonth]);
  return $bannerRow;
};

Calendar.prototype.makeWeekDayLabelRow = function() {
  var $weekLabelRow = this.$('<tr/>');
  var weekLabelStr = ["Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat"].reduce(function (longStr, dayStr) {
    return longStr + '<td>' + dayStr + '</td>';
  }, '');
  $weekLabelRow.html(weekLabelStr);
  return $weekLabelRow;
};

Calendar.prototype.makeDateCell = function(date) {
  //each date obj has the follow{data: 3, fullStr: 'string'}
  //let date be the content and full str be the data-fullDate
  if (date === undefined) {
    return this.$('<td/>');
  } else {
    var $td = this.$('<td class="calendarDate" data-fullDate="'+ date.fullStr +'">'+ date.date +'</td>');
    return $td;
  }
};

Calendar.prototype.drawCalendarView = function() {
  var banner = this.makeBanner();
  var weekDayLabel = this.makeWeekDayLabelRow();
  var datesMatrix = this.makeCalendarMatirx();
  //loop through each row from 0 to 6
  var self = this;
  var allDates = datesMatrix.map(function(row){
    var oneWeek = [];
    for (var i = 0; i < row.length; i++){
      oneWeek.push(self.makeDateCell(row[i]));
    }
    var $tr = self.$('<tr/>');
    $tr.append(oneWeek);
    return $tr;
  });

  var $table = this.$('<table/>');
  $table.append(banner, weekDayLabel, allDates);
  return $table;
};


module.exports = Calendar;
