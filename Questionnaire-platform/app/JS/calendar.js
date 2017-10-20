define(function() {
    // 从日历组件中搬过来的
    'use strict';
    function calendar(id, period, inputNum) {
        this.id = id;
        this.dateInfo = {
            month : Number((new Date()).getMonth()),
            year : Number((new Date()).getFullYear()),
            getTheMonth : ["January", "February", "March", "April", "May", "June", "July"
            ,"August", "September", "October", "November", "December"],
            getWeekString : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
        };
        this.getDaysOfMonth = [31, this.febDays(this.dateInfo.year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        this.period = period;
        this.container = undefined;
        this.inputNum = inputNum;
        this.choice1 = undefined;
        this.choice2 = undefined;
   };
   
   calendar.prototype = {
       
       // 初始化dom操作
       init: function() {
           var cal = document.getElementsByClassName("calendar" + this.id)[0];
           var inputs = "";
           
           cal.innerHTML = 
	       '<div class="container">' +
           '<div class="cal-head"><div></div><select>' +
		   '<option value="2016">2016</option>' +
		   '<option value="2017">2017</option>' +
		   '<option value="2018">2018</option>' +
		   '<option value="2019">2019</option>' +
	       '<option value="2020">2020</option>' +
		   '</select>' +
		   '<select>' +
		   '<option value="0">JAN</option>' +
		   '<option value="1">FEB</option>' +
		   '<option value="2">MAR</option>' +
		   '<option value="3">APR</option>' +
		   '<option value="4">MAY</option>' +
		   '<option value="5">JUN</option>' +
		   '<option value="6">JUL</option>' +
		   '<option value="7">AUG</option>' +
		   '<option value="8">SEP</option>' +
		   '<option value="9">OCT</option>' +
		   '<option value="10">NOV</option>' +
		   '<option value="11">DEC</option>' +
		   '</select>' +
		   '<div></div>' +
		   '</div>' +
		   '<table>' +
           '</table>' +
           '</div>';
           this.container = cal.getElementsByClassName("container")[0];

           this.display(this.dateInfo.month, this.dateInfo.year);
           this.select();
           this.arrow();
           this.refresh();
           this.showCal();
       },
       
       // 初始化
       initC: function() {
           this.init();
           this.container.innerHTML = "";
       },
       
       //　返回这个月一号星期几
       firstDayOfMonth: function(mon, year){
           // ie不兼容这个
           console.log((new Date("May 25, 2004")))
           return (new Date(this.dateInfo.getTheMonth[mon] + " 1, " + year)).getDay();
           // return (new Date(year + ", " + (mon + 1) + ", " + 1)).getDay();
       },
       
       // 返回二月份的天数
       febDays: function(year) {
           if ((year%4 === 0 && year%100 !== 0)||(year%400 === 0)) {
               return 29;
           } else {
               return 28;
           }
       },
       
       // 渲染日历的dom
       display: function (mon, year) {
           var ihtml = this.container.getElementsByTagName("table")[0];
           var eachLines = "",
               wholeMonth = "",
               weekDay = this.firstDayOfMonth(Number(mon), Number(year)),
               daysNum = this.getDaysOfMonth[mon];
           
           // 根据选择框来确定当前的时间 
           var selectYear = this.container.getElementsByTagName("select")[0];
           var selectMon = this.container.getElementsByTagName("select")[1];
           if (selectMon.value !== mon) {
               selectMon.selectedIndex = mon;
           }
           if (selectYear.selectedIndex !== Number(year - 2016)) {
               selectYear.selectedIndex = Number(year - 2016);
           }
           // 空格

           if (weekDay !== 7 && !isNaN(weekDay)) {
               for (var i = 0; i < weekDay; i++) {
                   eachLines += "<td></td>";
               }
           } else {
               weekDay = 0;
           }
           
           // 日期
           for (var j = 1; j < daysNum + 1; j++) {
               eachLines += "<td>" + j + "</td>"; 
               weekDay++;
               if (weekDay === 7 || j === daysNum) {
                   wholeMonth = wholeMonth + "<tr>" + eachLines + "</tr>";
                   eachLines = "";
                   weekDay = 0;
               }
           }
        
           ihtml.innerHTML = '<tr><th>Su</th><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th></tr>' + wholeMonth;
           
           this.select();
           this.arrow();
           this.refresh();
           this.showCal();
       },
       
       // 两个选择框
       select: function() {
           var that = this;
           var selectYear = this.container.getElementsByTagName("select")[0];
           var selectMon = this.container.getElementsByTagName("select")[1];
           var year = selectYear.value, mon = selectMon.selectedIndex;
           selectYear.onclick = function() {
               year = selectYear.value;
               that.display(mon, year);
           }
           selectMon.onclick = function() {
               mon = selectMon.value;
               that.display(mon, year);
           }
       },
       
       // 左右箭头
       arrow: function () {
           var that = this;
           var left = this.container.getElementsByClassName("cal-head")[0].getElementsByTagName("div")[0];
           var right = this.container.getElementsByClassName("cal-head")[0].getElementsByTagName("div")[1];
           var selectYear = this.container.getElementsByTagName("select")[0];
           var selectMon = this.container.getElementsByTagName("select")[1];
           var year = selectYear.value, mon = selectMon.selectedIndex;
           // 按向左
           left.onclick = function() {
               if (selectMon.selectedIndex === 0) {
                   if (selectYear.selectedIndex === 0) {
                       console.log("Out of range");
                   } else {
                       selectMon.selectedIndex = 11;
                       mon = 11;
                       selectYear.selectedIndex--;
                       year--;
                  }
              } else {
                  selectMon.selectedIndex--;
                  mon = selectMon.selectedIndex;
              }
              that.display(mon, year);
          }
          // 按向右
          right.onclick = function() {
              if (selectMon.selectedIndex === 11) {
                  if (selectYear.selectedIndex === 4) {
                      console.log("Out of range");
                  } else {
                      selectMon.selectedIndex = 0;
                      mon = 0;
                      selectYear.selectedIndex++;
                      year++;
                  }
              } else {
                  selectMon.selectedIndex++;
                  mon = selectMon.selectedIndex;
              }
              that.display(mon, year);
           }
       },
       
       refresh: function() {
           var that = this;
           var tds = this.container.getElementsByTagName("td");
           var now = new Date();
           
           now = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0));
           
           console.log(now);
           
           var selectYear = this.container.getElementsByTagName("select")[0].value;
           var selectMon = this.container.getElementsByTagName("select")[1].selectedIndex;
           for (var i = 0, len = tds.length; i < len; i++) {
               if (tds[i].innerHTML !== "" && 
               (new Date(that.dateInfo.getTheMonth[selectMon] + " " + (tds[i].innerHTML) + ", " + selectYear)) >= now
               /*(new Date(selectYear + ", " + (selectMon + 1) + ", " + Number(tds[i].innerHTML))) >= now */)  {
                // 绑定点击返回事件，经过时的色彩变化
                   tds[i].onmouseover = (function(i) {
                       return function() {
                           tds[i].className = "active";
                       };
                   })(i);
                   tds[i].onmouseout = (function(i) {
                       return function() {
                           tds[i].className = "";
                       };
                   })(i);
                   // 点击日期时候的变化
                   tds[i].onclick = (function(i) {
                       var clickDate = ((new Date(that.dateInfo.getTheMonth[selectMon] + " " + (tds[i].innerHTML) + ", " + selectYear)));
                       return function() {
                           that.choice1 = clickDate;
                           that.chosen(clickDate);
                       }
                   })(i);
               } 
               if ((new Date(that.dateInfo.getTheMonth[selectMon] + " " + (tds[i].innerHTML) + ", " + selectYear)) < now){
                   // 绑定类，颜色变化
                   tds[i].className = "nonactive";
               } else {
                   // 空的，没有变化
               }
           }
       },
      
      // 点下日期时候的回调（一个日期的情况）
       chosen: function(d) {
           var cal = document.getElementsByClassName("calendar" + this.id)[0];
           var inputCal = document.getElementById("new-build-qn-foot").getElementsByTagName("input")[0];
           var content = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
           inputCal.value = content;
           if (this.inputNum !== 2) {
               this.container.innerHTML = "";
           } 
       },
      
       // 输入框和按钮
       showCal: function() {
           var that = this;
           
           var cal = document.getElementsByClassName("calendar" + this.id)[0];
           var inputCal = document.getElementById("new-build-qn-foot").getElementsByTagName("input")[0];
          
           inputCal.onclick = function() {
               that.clear();
               if (that.container.innerHTML === "") {
                   that.init();
               } else {
                   that.container.innerHTML = "";
               } 
           }
       },
       
       // 清除掉所有记录
       clear: function() {
           var tds = this.container.getElementsByTagName("td");
           for (var i = 0; i < tds.length; i++) {
               tds[i].className = "";
           }
           if (this.choice1) {
               this.choice1 = undefined;
           } 
           if (this.choice2) {
               this.choice2 = undefined;
           }
       }
    };
    
    return {
        calendar: calendar
    }
});