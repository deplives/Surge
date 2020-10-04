/*
微博开屏广告 = type=http-response,requires-body=true,script-path=https://raw.githubusercontent.com/deplives/Surge/master/Script/weibo-launch.js,pattern=^https?://(sdk|wb)app\.uve\.weibo\.com(/interface/sdk/sdkad.php|/wbapplua/wbpullad.lua)
*/

const sdkad = "/interface/sdk/sdkad.php";
const wbpullad = "/wbapplua/wbpullad.lua";

const url = $request.url;
var body = $response.body;

if (url.indexOf(sdkad) != -1) {
    let re = /\{.*\}/;
    body = body.match(re);
    var obj = JSON.parse(body);
    if (obj.background_delay_display_time) obj.background_delay_display_time = 60 * 60 * 24 * 365;
    if (obj.show_push_splash_ad) obj.show_push_splash_ad = false;
    if (obj.ads) obj.ads = [];
    body = JSON.stringify(obj) + 'OK';
}

if (url.indexOf(wbpullad) != -1) {
    var obj = JSON.parse(body);
    if (obj.cached_ad && obj.cached_ad.ads) obj.cached_ad.ads = [];
    body = JSON.stringify(obj);
}

console.log("微博去开屏广告")
$done({ body });