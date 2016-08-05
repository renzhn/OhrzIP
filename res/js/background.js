var setting = {'status': 'on'};

function saveSetting() {
    browser.storage.local.set({'status': setting['status']}, function () {});
}

function setStatus(status) {
    if (status !== 'off') {
        browser.browserAction.setBadgeText({'text': 'on'});
        browser.browserAction.setBadgeBackgroundColor({'color': '#14892c'});
    } else {
        browser.browserAction.setBadgeText({'text': 'off'});
        browser.browserAction.setBadgeBackgroundColor({'color': '#d04437'});
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
browser.webRequest.onCompleted.addListener(onCompletedFunc, {urls: ['<all_urls>'], types: ['main_frame']}, []);
browser.browserAction.onClicked.addListener(toggleOnOff);

// 回复状态
browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    // 请求设置状态
    if ('ip' === message.get) {
        var ip = 'null';
        if (currentIPList[sender.tab.url]) {
            ip = currentIPList[sender.tab.url];
            delete currentIPList[sender.tab.url];
        }
        sendResponse({'ip': ip});
    } else if ('location' === message.get) {
        var location = '';
        http_ajax('http://www.cz88.net/ip/index.aspx?ip=' + message.data, 'GET', false, function (data) {
            if (data.success) {
                try {
                    var addr = data.content.match(/id="InputIPAddrMessage">(.*?)</);
                    if (addr) {
                        location += '<br />[' + addr[1] + ']';
                    }
                    if (setting['status'] === 'on') {
                        var myIp = data.content.match(/id="cz_ip">(.*?)</);
                        if (myIp) {
                            location += '<br />我的IP ' + myIp[1];
                        }
                        var myAddr = data.content.match(/id="cz_addr">(.*?)</);
                        if (myAddr) {
                            location += '<br />[' + myAddr[1] + ']';
                        }
                    }
                } catch (exception) {
                    console.log(exception);
                }
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

browser.storage.local.get(['status'], function (data) {
    if ('off' === data['status']) {
        setting['status'] = 'off';
    }
    setStatus(setting['status']);
});
