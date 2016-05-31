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
            var location = false
            if (response && response.ip) {
                ip = response.ip;
            }
            if (response && response.location) {
                ip = ip + '<br />' + response.location;
            }
            var dom = tag('div', 'chrome_trace_count', 'chrome_trace_count_right', ip)
            document.body.appendChild(dom);
            dom.onmouseover = function() {
                if (dom.className === 'chrome_trace_count_right') {
                    dom.className = 'chrome_trace_count_left';
                }
                else {
                    dom.className = 'chrome_trace_count_right';
                }
            };
        });
    }
});
