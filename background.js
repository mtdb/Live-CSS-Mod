var tabId = undefined;
var running = false;

var def_get_source = "function get_source(){ \
    var url=location.href; \
    if (location.protocol == 'file:') \
        return; \
    else \
        var domain=location.protocol+'\/\/'+location.hostname+(location.port?':'+location.port:''); \
    $.ajax({url:url,async:false,cache:false,dataType:'text',success:function(data){source=data}}); \
    var css_src=source.match(/(href=(\"|\'))(?!http).+(\\.css)/g); \
    if (css_src!=null){ \
        $.each(css_src,function(){ \
            var path=this.replace(/href=(\"|\')\\/?/,domain+'/'); \
            $.ajax({url:path,async:false,cache:false,dataType:'text',success:function(data){source+=data}})});} \
    var js_src=source.match(/(src=(\"|\'))(?!http).+(\\.js)/g); \
    if (js_src!=null){ \
        $.each(js_src,function(a,path){ \
            var path=this.replace(/src=(\"|\')\\/?/,domain+'/'); \
            $.ajax({url:path,async:false,cache:false,dataType:'text',success:function(data){source+=data}})});} \
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
