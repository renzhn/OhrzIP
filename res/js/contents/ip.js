var ipDom = null;
function tag(type, id, innerHTML) {
    var el = document.createElement(type);
    el.setAttribute("x-ms-format-detection", "none");
    el.id = id;
    el.innerHTML = innerHTML;
    return el;
}

function requestIPLocation(ip) {
    browser.runtime.sendMessage({'get': 'location', 'data': ip}, function (response) {
        if (response && response.location && ipDom) {
            ipDom.innerHTML = ipDom.innerHTML + response.location;
        }
    });
}

browser.runtime.sendMessage({'get': 'ip'}, function (response) {
    var ip = 'null';
    if (response && response.ip) {
        ip = response.ip;
    }
    if (ip === 'null' || !ip) {
        return;
    }
    var html = "<span id='ohrz_ip_extension_close' onclick='this.parentNode.parentNode.removeChild(this.parentNode); return false;'>X</span>";
    html += '服务器IP ' + ip;
    ipDom = tag('div', 'ohrz_ip_extension', html);
    document.body.appendChild(ipDom);
    requestIPLocation(ip);
});
