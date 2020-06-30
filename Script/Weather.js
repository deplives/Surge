let isQuantumultX = $task != undefined;
let isSurge = $httpClient != undefined;

var $task = isQuantumultX ? $task : {};
var $httpClient = isSurge ? $httpClient : {};

var $prefs = isQuantumultX ? $prefs : {};
var $persistentStore = isSurge ? $persistentStore : {};

var $notify = isQuantumultX ? $notify : {};
var $notification = isSurge ? $notification : {};

if (isQuantumultX) {
    var errorInfo = {
        error: ''
    };
    $httpClient = {
        get: (url, cb) => {
            var urlObj;
            if (typeof (url) == 'string') {
                urlObj = {
                    url: url
                }
            } else {
                urlObj = url;
            }
            $task.fetch(urlObj).then(response => {
                cb(undefined, response, response.body)
            }, reason => {
                errorInfo.error = reason.error;
                cb(errorInfo, response, '')
            })
        },
        post: (url, cb) => {
            var urlObj;
            if (typeof (url) == 'string') {
                urlObj = {
                    url: url
                }
            } else {
                urlObj = url;
            }
            url.method = 'POST';
            $task.fetch(urlObj).then(response => {
                cb(undefined, response, response.body)
            }, reason => {
                errorInfo.error = reason.error;
                cb(errorInfo, response, '')
            })
        }
    }
}
if (isSurge) {
    $task = {
        fetch: url => {
            return new Promise((resolve, reject) => {
                if (url.method == 'POST') {
                    $httpClient.post(url, (error, response, data) => {
                        if (response) {
                            response.body = data;
                            resolve(response, {
                                error: error
                            });
                        } else {
                            resolve(null, {
                                error: error
                            })
                        }
                    })
                } else {
                    $httpClient.get(url, (error, response, data) => {
                        if (response) {
                            response.body = data;
                            resolve(response, {
                                error: error
                            });
                        } else {
                            resolve(null, {
                                error: error
                            })
                        }
                    })
                }
            })

        }
    }
}

if (isQuantumultX) {
    $persistentStore = {
        read: key => {
            return $prefs.valueForKey(key);
        },
        write: (val, key) => {
            return $prefs.setValueForKey(val, key);
        }
    }
}
if (isSurge) {
    $prefs = {
        valueForKey: key => {
            return $persistentStore.read(key);
        },
        setValueForKey: (val, key) => {
            return $persistentStore.write(val, key);
        }
    }
}

if (isQuantumultX) {
    $notification = {
        post: (title, subTitle, detail) => {
            $notify(title, subTitle, detail);
        }
    }
}
if (isSurge) {
    $notify = function (title, subTitle, detail) {
        $notification.post(title, subTitle, detail);
    }
}


const weaapi = "https://api.heweather.net/s6/weather/hourly?lang=cn&unit=m&location=auto_ip&key=e1ee803d766d47a9b9a634d5a8409b93"
$httpClient.get(weaapi, function (error, response, data) {
    if (error) {
        console.log(error);
        $done();
    } else {
        var obj = JSON.parse(data);

        var title = obj.HeWeather6[0].basic.location + "未来三小时天气";
        var subtitle = "更新时间: " + obj.HeWeather6[0].update.loc;
        var hourly1 = obj.HeWeather6[0].hourly[0].time + "\t" + obj.HeWeather6[0].hourly[0].cond_txt + " | " + obj.HeWeather6[0].hourly[0].tmp + "℃" + " | " + obj.HeWeather6[0].hourly[0].wind_dir + " " + obj.HeWeather6[0].hourly[0].wind_sc + "级" + " | " + "降水概率: " + obj.HeWeather6[0].hourly[0].pop + "%"
        var hourly2 = obj.HeWeather6[0].hourly[1].time + "\t" + obj.HeWeather6[0].hourly[1].cond_txt + " | " + obj.HeWeather6[0].hourly[1].tmp + "℃" + " | " + obj.HeWeather6[0].hourly[1].wind_dir + " " + obj.HeWeather6[0].hourly[1].wind_sc + "级" + " | " + "降水概率: " + obj.HeWeather6[0].hourly[1].pop + "%"
        var hourly3 = obj.HeWeather6[0].hourly[2].time + "\t" + obj.HeWeather6[0].hourly[2].cond_txt + " | " + obj.HeWeather6[0].hourly[2].tmp + "℃" + " | " + obj.HeWeather6[0].hourly[2].wind_dir + " " + obj.HeWeather6[0].hourly[2].wind_sc + "级" + " | " + "降水概率: " + obj.HeWeather6[0].hourly[2].pop + "%"
        var hourly = [hourly1, hourly2, hourly3].join("\n")

        let wmation = [title, subtitle, hourly];
        $notification.post(wmation[0], wmation[1], wmation[2]);
        $done();
    }
}
);