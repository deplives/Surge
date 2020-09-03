/*
天气预报 = type=cron,cronexp=00 6-21/3 * * *,script-path=https://raw.githubusercontent.com/deplives/Surge/master/Script/weather.js,script-update-interval=0
*/
let basicurl = {
    url: "https://api.heweather.net/s6/weather/hourly?lang=cn&unit=m&location=auto_ip&key=e1ee803d766d47a9b9a634d5a8409b93",
    headers: {},
};

$task.fetch(basicurl).then(response => {
    var obj = JSON.parse(response.body);
    var title = obj.HeWeather6[0].basic.location + "未来三小时天气";
    var subtitle = "更新时间: " + obj.HeWeather6[0].update.loc;
    var hourly1 = obj.HeWeather6[0].hourly[0].time + "\t" + obj.HeWeather6[0].hourly[0].cond_txt + " | " + obj.HeWeather6[0].hourly[0].tmp + "℃" + " | " + obj.HeWeather6[0].hourly[0].wind_dir + " " + obj.HeWeather6[0].hourly[0].wind_sc + "级" + " | " + "降水概率: " + obj.HeWeather6[0].hourly[0].pop + "%"
    var hourly2 = obj.HeWeather6[0].hourly[1].time + "\t" + obj.HeWeather6[0].hourly[1].cond_txt + " | " + obj.HeWeather6[0].hourly[1].tmp + "℃" + " | " + obj.HeWeather6[0].hourly[1].wind_dir + " " + obj.HeWeather6[0].hourly[1].wind_sc + "级" + " | " + "降水概率: " + obj.HeWeather6[0].hourly[1].pop + "%"
    var hourly3 = obj.HeWeather6[0].hourly[2].time + "\t" + obj.HeWeather6[0].hourly[2].cond_txt + " | " + obj.HeWeather6[0].hourly[2].tmp + "℃" + " | " + obj.HeWeather6[0].hourly[2].wind_dir + " " + obj.HeWeather6[0].hourly[2].wind_sc + "级" + " | " + "降水概率: " + obj.HeWeather6[0].hourly[2].pop + "%"
    var hourly = [hourly1, hourly2, hourly3].join("\n")

    let wmation = [title, subtitle, hourly];
    console.log("天气信息查询成功")
    $notify(wmation[0], wmation[1], wmation[2]);
}, reason => {
    console.log("天气接口请求失败")
    $notify(tel + '天气接口请求失败', reason.error);
});