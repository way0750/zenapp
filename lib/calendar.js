// make a calendar class
// with optional year month date

function Calendar(jquery, dateObj) {
  this.$ = jquery;
  this.dateObj = dateObj && dateObj.constructor === Date ? dateObj: new Date();
  // console.log(dateObj.constructor === Date);
  this.curMonthEnglish = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][this.dateObj.getMonth()];
  this.curMonthNumber = this.dateObj.getMonth() + 1;

  this.currentDate = this.dateObj.getDate();
  this.currentYear = this.dateObj.getFullYear();

  this.dateObj.setDate(1);
  this.firstDay = this.dateObj.getDay();
  if (/4|6|9|11/.test(this.curMonthNumber + '')) {
    this.daysInCurMonth = 30;
  } else if (/2/.test(this.curMonthNumber + '')){
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
    var month = '0'+this.curMonthNumber;
    month = month.length > 2 ? month.slice(1) : month;
    var date = i > 9 ? i : '0' + i;
    mostRecentWeek[curDay] = {day: curDay, date: i, fullStr: this.currentYear + '-' + month + '-' + date};
    curDay = (++curDay)%7;
  }
  return matrix;
};

Calendar.prototype.makeBanner = function() {
  var $bannerRow = this.$('<tr/>');
  var $previousMonth = this.$('<button class="calendarChangeMonth previousMonth"><</button>');
  var $nextMonth = this.$('<button class="calendarChangeMonth nextMonth">></button>');
  var $thisMonth = this.$('<h3 class="calendarCurrentMonth">' + this.currentYear + ': '+this.curMonthEnglish + '</h3>');
  $bannerRow.append([$previousMonth, $thisMonth, $nextMonth]);
  return $bannerRow;
};

Calendar.prototype.makeWeekDayLabelRow = function() {
  var $weekLabelRow = this.$('<tr class="weekDayLabel"/>');
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

Calendar.prototype.newMonth = function(amountToChange) {
  this.dateObj.setMonth(this.dateObj.getMonth() + amountToChange);

  //switch all attributes to new month;
  Calendar.call(this, this.$, this.dateObj);
};

module.exports = Calendar;
