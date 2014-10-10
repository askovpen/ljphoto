{
	"background": {
		"scripts": ["js/bg.js"]
	},
	"browser_action": {
		"default_icon": "icons/icon19.png",
		"default_popup": "popup.html",
		"default_title": "test"
	},
	"content_scripts": [{
		"css":["css/popover.css","css/my.css","css/colorbox.css"],
		"js": [ "js/jquery.min.js","js/jquery.popover-1.1.2.js", "js/script.js","js/jquery.colorbox-min.js" ],
		"matches": [ "http://ru-auto.livejournal.com/*","https://www.facebook.com/*" ]
	}],
	"description": "Добавляет фотографии к коментариям пользователей жж-сообжества ru_auto",
	"manifest_version": 2,
	"minimum_chrome_version": "18",
	"icons": {
		"128": "icons/icon128.png",
		"16": "icons/icon16.png",
		"64": "icons/icon64.png",
		"32": "icons/icon32.png",
		"48": "icons/icon48.png"
	},
		"web_accessible_resources": [
		"css/*",
		"js/*"
	],
	"name": "ljphoto",
	"permissions": [ "http://ru-auto.livejournal.com/*","cookies","http://skovpen.org/ra/*","https://www.facebook.com/*" ],
	"update_url": "https://clients2.google.com/service/update2/crx",
	"version": "@@ver"
}
