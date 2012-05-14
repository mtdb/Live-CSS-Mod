var tabId = undefined;
var running = false;

var def_get_source = "function get_source(){ \
            url=location.href; \
            if (location.protocol == 'file:') \
                domain=location.href.replace(/\\/[^\\/]+\\.html/,''); \
            else \
                domain=location.protocol+'\/\/'+location.hostname+(location.port?':'+location.port:''); \
            $.ajax({url:url,async:false,cache:false,dataType:'text',success:function(a){source=a}}); \
            css_src=source.match(/(href=(\"|\'))[^http].+(\.css)/g); \
            if (css_src!=null){ \
                $.each(css_src,function(a,b){css_src[a]=css_src[a].replace(/href=(\"|\')\\/?/,domain+'/')}); \
                $.each(css_src,function(a,b){ \
                    $.ajax({url:b,async:false,cache:false,dataType:'text',success:function(a){source+=a}})});} \
            js_src=source.match(/(src=(\"|\'))[^http].+(\.js)/g); \
            if (js_src!=null){ \
                $.each(js_src,function(a,b){js_src[a]=js_src[a].replace(/src=(\"|\')\\/?/,domain+'/')}); \
                $.each(js_src,function(a,b){ \
                    $.ajax({url:b,async:false,cache:false,dataType:'text',success:function(a){source+=a}})});} \
            return source \
        }";

var code = def_get_source +
            "var origin=get_source(); \
            try{clearInterval(interval)}catch(e){} \
            interval=setInterval(function(){ \
                source=get_source(); \
                if(origin!=source){origin=source;window.location.reload()} \
            },2000)";

chrome.tabs.onUpdated.addListener(function() {
    if (running){
        chrome.tabs.executeScript(tabId, { file: "jquery-1.7.1.min.js" }, function() {
            chrome.tabs.executeScript(tabId,
                {code:code});
        });
    }
    else{
        chrome.browserAction.setIcon({path:"play.png"});
    }
});

chrome.browserAction.onClicked.addListener(function() {
    chrome.windows.getCurrent(function(win) {
        chrome.tabs.getSelected(win.id, actionClicked);
    });
});

function actionClicked(tab) {
    if (running){
        chrome.browserAction.setIcon({path:"play.png"});
        chrome.tabs.executeScript(tabId, {code:"try{clearInterval(interval)}catch(e){}"});
        running = false;
    }
    else{
        tabId = tab.id;
        chrome.browserAction.setIcon({path:"stop.png"});
        chrome.tabs.executeScript(tabId, { file: "jquery-1.7.1.min.js" }, function() {
            chrome.tabs.executeScript(tabId,
                {code:code});
        });
        running = true;
    }
}
