/*
微信广告 = type=http-request,script-path=https://raw.githubusercontent.com/deplives/Surge/master/Script/WeChat.js,pattern=^https://mp\.weixin\.qq\.com/mp/getappmsgad
*/

var data = {
    body: "{}",
    headers: {
        "Content-Type": "application/json"
    }
};

$done({response: data});
