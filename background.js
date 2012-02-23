var interval;
var origin = "";
var running = true;

chrome.tabs.onUpdated.addListener(function() {
    play();
});

function play() {
    chrome.tabs.executeScript(null, { file: "jquery-1.7.1.min.js" }, function() {
        if (running){
            chrome.browserAction.setIcon({path:"play.png"});
            chrome.tabs.executeScript(null, {code:"try{clearInterval(interval)}catch(e){}"});
            running = false;
        }
        else{
            chrome.browserAction.setIcon({path:"stop.png"});
            chrome.tabs.executeScript(null,
                {code:"function get_source(){url=window.url;domain=location.protocol+'//'+location.hostname+(location.port?':'+location.port:'');$.ajax({url:url,async:false,cache:false,dataType:'text',success:function(a){source=a}});css_src=source.match(/(href=(\"|\'))[^http].+(\.css)/g);$.each(css_src,function(a,b){css_src[a]=css_src[a].replace(/href=(\"|\')/,domain)});js_src=source.match(/(src=(\"|\'))[^http].+(\.js)/g);$.each(js_src,function(a,b){js_src[a]=js_src[a].replace(/src=(\"|\')/,domain)});$.each(css_src,function(a,b){$.ajax({url:b,async:false,cache:false,dataType:'text',success:function(a){source+=a}})});$.each(js_src,function(a,b){$.ajax({url:b,async:false,cache:false,dataType:'text',success:function(a){source+=a}})});return source}var origin=get_source();interval=setInterval(function(){source=get_source();if(origin!=source){origin=source;history.go(0)}},1e3)"});
            running = true;
        }
    });
}

chrome.browserAction.onClicked.addListener(play);
play();

/*
function get_source(){
    url = window.url;
    domain = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
    // get html data
    $.ajax({
        url: url,
        async:false,
        cache:false,
        dataType:"text",
        success: function(data) {
            source = data;
        }
    });
    // get css uri's
    css_src = source.match(/(href=(\"|\'))[^http].+(\.css)/g);
    $.each(css_src, function(i,v){
        css_src[i]=css_src[i].replace(/href=(\"|\')/,domain);
    });
    // get js uri's
    js_src = source.match(/(src=(\"|\'))[^http].+(\.js)/g);
    $.each(js_src, function(i,v){
        js_src[i]=js_src[i].replace(/src=(\"|\')/,domain);
    });
    // get css data
    $.each(css_src, function(i,uri){
        $.ajax({
            url: uri,
            async:false,
            cache:false,
            dataType:"text",
            success: function(data) {
                source += data;
            }
        });
    });
    // get js data
    $.each(js_src, function(i,uri){
        $.ajax({
            url: uri,
            async:false,
            cache:false,
            dataType:"text",
            success: function(data) {
                source += data;
            }
        });
    });
    
    return source;
}

var origin = get_source()
interval = setInterval(function(){
    source = get_source();
    
    if (origin != source){
        origin = source;
        history.go(0);
    }
},1000);
// compress with http://jscompress.com/
*/