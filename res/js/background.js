var setting = {'status': 'on'};
var referal = {
    'Linode': 'https://www.linode.com/?r=68549ab9042343ab7a86da0a65d6a75c84209c23',
    'Vultr': 'http://www.vultr.com/?ref=6877248',
    'Digital Ocean': 'https://www.digitalocean.com/?refcode=1bfd2d1c9960',
};

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

function isLocalIP(ip) {
	return ip === '127.0.0.1' || ip === '::1';
}

function isPrivateIP(ip) {
   var parts = ip.split('.');
   return parts[0] === '10' || 
      (parts[0] === '172' && (parseInt(parts[1], 10) >= 16 && parseInt(parts[1], 10) <= 31)) || 
      (parts[0] === '192' && parts[1] === '168');
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
		var ip = request.data;
		var location = '';
		if (isLocalIP(ip)) {
			location = '本地';
		} else if (isPrivateIP(ip)) {
			location = '内网';
		} else {
			http_ajax('https://ip.ohrz.net/?ip=' + ip, 'GET', false, function (data) {
				if (data.success) {
					var content = data.content.trim();
					if (!content) {
						return;
					}
					for (var keyword in referal) {
						location = content.replace(keyword, '<a href="' + referal[keyword] + '">' + keyword + '</a>');
					}
				}
			});
		}
        sendResponse({'location': '<br>' + location});
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
