var pageMod = require("sdk/page-mod");
var data = require("sdk/self").data;
var ActionButton = require('sdk/ui/button/action');
var panels = require("sdk/panel");
var status={};
var sxhr=require("sdk/net/xhr");
var button = ActionButton({
	id: "my-button",
	label: "my button",
	icon: {
		"16": "./icons/icon16.png",
		"32": "./icons/icon32.png",
		"64": "./icons/icon64.png"
	},
	onClick: handleChange
});
var panel = panels.Panel({
	contentURL: data.url("popup.html"),
	contentScriptFile: data.url("js/popup.js")
});
panel.port.on("getStatus",getStatus);
panel.port.on("getHStatus",checklogin);
function handleChange(state) {
	console.log(state);
	panel.show({
		width: 260,
		height: 100,
		position: button
	});
}
pageMod.PageMod({
	include: "http://ru-auto.livejournal.com/*",
	contentScriptWhen: 'ready',
	contentScriptFile: [data.url('js/jquery.min.js'),data.url('js/jquery.colorbox-min.js'),data.url('js/jquery.popover-1.1.2.js'),data.url('js/script.js')],
	contentStyleFile: [data.url('css/colorbox.css'),data.url('css/popover.css'),data.url('css/my.css')],
	onAttach: function(worker) {
		worker.port.emit("setStatus",status);
	}
});
function getStatus(){
	if (Object.keys(status).length<1){
		checklogin();
	} else {
		panel.port.emit("setStatus",status);
	}
}
function checklogin() {
		var xhr = sxhr.XMLHttpRequest();
		xhr.open('GET', 'http://skovpen.org/ra/checklogin.php',true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status==200){
					var res=JSON.parse(xhr.responseText);
//					console.log(res);
					status=res;
					panel.port.emit('setStatus',status);
				}
			}
		};
		xhr.send();

}
