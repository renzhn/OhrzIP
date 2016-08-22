var setting = {'status': 'on'};

function saveSetting() {
    chrome.storage.local.set({'status': setting['status']}, function () {});
}

function setStatus(status) {
    if (status !== 'off') {
        chrome.browserAction.setBadgeText({'text': 'on'});
        chrome.browserAction.setBadgeBackgroundColor({'color': '#14892c'});
    } else {
        chrome.browserAction.setBadgeText({'text': 'off'});
        chrome.browserAction.setBadgeBackgroundColor({'color': '#d04437'});
    }
    saveSetting();
}

function toggleOnOff(tab) {
    if (setting['status'] === 'on') {
        setting['status'] = 'off';
    } else {
        setting['status'] = 'on';
    }
    setStatus(setting['status']);
}

// 监听事件
chrome.webRequest.onCompleted.addListener(onCompletedFunc, {urls: [], types: ['main_frame']}, []);
chrome.browserAction.onClicked.addListener(toggleOnOff);

// 回复状态
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // 请求设置状态
    if ('ip' === request.get && setting['status'] === 'on') {
        var ip = 'null';
        if (currentIPList[sender.tab.url]) {
            ip = currentIPList[sender.tab.url];
            delete currentIPList[sender.tab.url];
        }
        sendResponse({'ip': ip});
    } else if ('location' === request.get) {
        var location = '';
        http_ajax('http://ip.ohrz.net/?ip=' + request.data, 'GET', false, function (data) {
            if (data.success) {
                location += '<br />[' + data.content + ']';
            }
        });
        sendResponse({'location': location});
    }
});

var currentIPList = {};

function onCompletedFunc(info) {
    currentIPList[info.url] = info.ip;
    return;
}

chrome.storage.local.get(['status'], function (data) {
    if ('off' === data['status']) {
        setting['status'] = 'off';
    }
    setStatus(setting['status']);
});
