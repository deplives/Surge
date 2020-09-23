/*
薪资日 = type=cron,cronexp=00 10 * * *,script-path=https://raw.githubusercontent.com/deplives/Surge/master/Script/payday.js,script-update-interval=0
*/
var TargetDate = 10

function Today() {
    var now = new Date();
    var nowYear = now.getFullYear();
    var nowMonth = now.getMonth();
    var nowDate = now.getDate();
    newdate = new Date(nowYear, nowMonth, nowDate);
    nowMonth = doHandleMonth(nowMonth + 1);
    nowDate = doHandleMonth(nowDate);
    return nowYear + "-" + nowMonth + "-" + nowDate;
}

function NextDay() {
    today = Today();
    n = new Date().setDate(TargetDate);
    next = new Date(n)
    if (DiffDay(today, next) > 0) {
        var nextYear = next.getFullYear();
        var nextMonth = doHandleMonth(next.getMonth() + 1);
        var nextDate = next.getDate();
        return nextYear + "-" + nextMonth + "-" + nextDate;
    }
    if (DiffDay(today, next) < 0) {
        var nextYear = next.getFullYear();
        var nextMonth = doHandleMonth(next.getMonth() + 2);
        var nextDate = next.getDate();
        return nextYear + "-" + nextMonth + "-" + nextDate;
    }
    else {
        return Today()
    }
}

function doHandleMonth(month) {
    if (month.toString().length == 1) {
        month = "0" + month;
    }
    return month;
}

function getWeek(dayValue) {
    var day = new Date(Date.parse(dayValue.replace(/-/g, '/')));
    var today = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    return today[day.getDay()];
}

function DiffDay(startDay, endDay) {
    var sDay = new Date(startDay);
    var eDay = new Date(endDay);
    return (eDay - sDay) / (1000 * 60 * 60 * 24);
}



title = "倒数日";
subtitle = Today();
if (DiffDay(Today(), NextDay()) == 0) {
    detail = "今天就要发工资啦🤪"
}
else {
    detail = "🔜 距离下一个薪资日 " + NextDay() + "(" + getWeek(NextDay()) + ")" + " 还有 " + DiffDay(Today(), NextDay()) + " 天";
}

$notification.post(title, subtitle, detail);

console.log("薪资日脚本成功运行")
$done({});