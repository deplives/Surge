/*
微博开屏广告 = type=http-response,requires-body=true,max-size=false,script-path=https://raw.githubusercontent.com/deplives/Surge/master/Script/Weibo-Launch.js,pattern=^https?://(sdk|wb)app\.uve\.weibo\.com(/interface/sdk/sdkad.php|/wbapplua/wbpullad.lua)
*/


const path_sdkad = "/interface/sdk/sdkad.php";
const path_wbpullad = "/wbapplua/wbpullad.lua";

const url = $request.url;
var body = $response.body;

if (url.indexOf(path_sdkad) != -1) {
    let re = /\{.*\}/;
    body = body.match(re);
    var obj = JSON.parse(body);
    if (obj.background_delay_display_time) obj.background_delay_display_time = 60 * 60 * 24 * 365;
    if (obj.show_push_splash_ad) obj.show_push_splash_ad = false;
    if (obj.ads) obj.ads = [];
    body = JSON.stringify(obj) + 'OK';
}

if (url.indexOf(path_wbpullad) != -1) {
    var obj = JSON.parse(body);
    if (obj.cached_ad && obj.cached_ad.ads) obj.cached_ad.ads = [];
    body = JSON.stringify(obj);
}

console.log("微博去开屏广告")
$done({body});
