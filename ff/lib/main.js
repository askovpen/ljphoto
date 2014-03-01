var pageMod = require("sdk/page-mod");
var data = require("sdk/self").data;
pageMod.PageMod({
    include: "http://ru-auto.livejournal.com/*",
    contentScriptWhen: 'end',
    contentScriptFile: data.url('js/script.js')
});
