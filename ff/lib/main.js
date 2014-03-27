var pageMod = require("sdk/page-mod");
var data = require("sdk/self").data;
pageMod.PageMod({
    include: "http://ru-auto.livejournal.com/*",
    contentScriptWhen: 'ready',
    contentScriptFile: data.url('js/script.js')
});
