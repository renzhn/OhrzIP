var ipDom = null;
function tag(type, id, innerHTML) {
    var el = document.createElement(type);
    el.id = id;
    el.innerHTML = innerHTML;
    return el;
}

function isLocal (ip) {
    if (!ip) return false;
    if (ip === 'localhost') return true;

    ip = ip.split('.').map(function(oct) { return parseInt(oct, 10); });
    // 127.0.0.1 - 127.255.255.255
    if (ip[0] === 127) return true;
    // 10.0.0.0 - 10.255.255.255
    if (ip[0] === 10) return true;
    // 172.16.0.0 - 172.31.255.255
    if (ip[0] === 172 && ip[1] >= 16 && ip[1] <= 31) return true;
    // 192.168.0.0 - 192.168.255.255
    if (ip[0] === 192 && ip[1] === 168) return true;

    return false;
}

function requestIPLocation(ip) {
    if (isLocal(ip)) {
        return;
    }
    chrome.extension.sendMessage({'get': 'location', 'data': ip}, function (response) {
        if (response && response.location && ipDom) {
            ipDom.innerHTML = ipDom.innerHTML + response.location;
        }
    });
}

chrome.extension.sendMessage({'get': 'ip'}, function (response) {
    var ip = 'null';
    if (response && response.ip) {
        ip = response.ip;
    }
    var html = "<span id='chrome_the_website_close' onclick='this.parentNode.parentNode.removeChild(this.parentNode); return false;'>X</span>";
    html += '服务器IP ' + ip;
    ipDom = tag('div', 'chrome_the_website_ip', html);
    document.body.appendChild(ipDom);
    requestIPLocation(ip);
});
