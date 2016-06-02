var url = window.location.host;

function tag(type, id, className, innerHTML) {
    var el = document.createElement(type);
    el.id = id;
    el.className = className;
    el.innerHTML = innerHTML;
    return el;
}

chrome.extension.sendMessage({'get': 'status'}, function(response) {
    if ('off' !== response.status) {
        // 开启状态
        chrome.extension.sendMessage({'get': 'ip'}, function(response) {
            var ip = 'null';
            if (response && response.ip) {
                ip = response.ip;
            }
            var dom = tag('div', 'chrome_the_website_ip', 'chrome_the_website_ip_right', ip)
            document.body.appendChild(dom);
            dom.onmouseover = function() {
                if (dom.className === 'chrome_the_website_ip_right') {
                    dom.className = 'chrome_the_website_ip_left';
                }
                else {
                    dom.className = 'chrome_the_website_ip_right';
                }
            };
        });
    }
});
