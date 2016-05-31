var setting = {'status': 'on'};


function saveSetting() {
	chrome.storage.local.set({'status': setting['status']}, function() {}); // 保存到本地
}


function setStatus(status) {
	if (status !== 'off') {
		chrome.browserAction.setBadgeText({'text': 'on'});
		chrome.browserAction.setBadgeBackgroundColor({'color': '#14892c'});

		// 开始监听
		currentIPList = {};
		chrome.webRequest.onCompleted.addListener(onCompletedFunc , { urls: [], types: [] }, []);
	}
	else {
		chrome.browserAction.setBadgeText({'text': 'off'});
		chrome.browserAction.setBadgeBackgroundColor({'color': '#d04437'});

		// 清楚监听
		currentIPList = {};
		chrome.webRequest.onCompleted.removeListener(onCompletedFunc);
	}
	saveSetting();
}

function toggleOnOff(tab) {
	if (setting['status'] === 'on') {
		setting['status'] = 'off';
		
	}
	else {
		setting['status'] = 'on';
	}
	setStatus(setting['status']);
}

// 监听点击事件
chrome.browserAction.onClicked.addListener(toggleOnOff);

// 回复状态
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	// 请求设置状态
	if ('status' === request.get) {
		sendResponse(setting);
	}
	else if ('ip' === request.get) {
		var ip = 'null';
		if (currentIPList[sender.tab.url]) {
			ip = currentIPList[sender.tab.url];
		}
		fetchIpLocation(ip, function(location) {
			sendResponse({'ip': ip, 'location': location});
		});
	}
});

// 缓存IP，每次用完就清空
var currentIPList	= {};

function onCompletedFunc(info) {
	currentIPList[ info.url ] = info.ip;
	return;
}


function fetchIpLocation(ip, callback) {
	http_ajax('http://ip.taobao.com/service/getIpInfo.php?ip=' + ip, 'GET', false, function(data) {
		if (true === data.success) {
			data = JSON.parse(data.content);
			if (0 == data.code) {
				data = data.data;
				data = data['country'] + ' ' + data['area'] + ' ' + data['region'] + ' ' + data['city'] + ' ' + data['isp'];
			}
			else {
				data = false;
			}
		}
		else {
			data = false;
		}
		callback(data);
	});
}
// 加载配置
chrome.storage.local.get(['status'], function(data) {
	if ('off' === data['status']) {
		setting['status'] = 'off';
	}
	// 读取配置成功之后，显示图标
	setStatus(setting['status']);
});