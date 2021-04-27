/*
微信广告 = type=http-request,script-path=https://raw.githubusercontent.com/deplives/Surge/master/Script/WeChat.js,pattern=^https://mp\.weixin\.qq\.com/mp/getappmsgad
*/

var data = {
    body: "{}",
    headers: {
        "Content-Type": "application/json"
    }
};

console.log("[微信广告] 运行成功");
$done({response: data});
