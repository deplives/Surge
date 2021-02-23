/*
微信广告 = type=http-request,script-path=https://raw.githubusercontent.com/deplives/Surge/master/Script/WeChat.js,pattern=^https://mp\.weixin\.qq\.com/mp/getappmsgad
*/

var data = {
    body: "{}",
    headers: {
        "Content-Type": "application/json"
    }
};

console.log("wechat 脚本成功运行")
$done({response: data});
