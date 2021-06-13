/*
代理模式自动切换 = type=event,event-name=network-changed,script-path=https://raw.githubusercontent.com/deplives/Surge/master/Script/AutoProxy.js
*/
const WIFI_DONT_NEED_PROXYS = ['正在搜索5G'];

if (wifiChanged()) {
    if (WIFI_DONT_NEED_PROXYS.includes($network.wifi.ssid)) {
        $surge.setOutboundMode('direct');
        $notification.post(
            'Surge',
            `Wi-Fi ${$network.wifi.ssid}`,
            '将使用直连模式'
        );
    } else {
        $surge.setSelectGroupPolicy('Final-select', 'Group');
        $surge.setOutboundMode('rule');
        $notification.post(
            'Surge',
            `Wi-Fi ${$network.wifi.ssid}`,
            '将使用代理模式'
        );
    }
}

function wifiChanged() {
    const currentWifiSSid = $persistentStore.read('current_wifi_ssid');
    const changed = currentWifiSSid !== $network.wifi.ssid;
    if (changed) {
        $persistentStore.write($network.wifi.ssid, 'current_wifi_ssid');
    }
    return changed;
}

$done();