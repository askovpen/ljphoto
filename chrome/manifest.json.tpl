{
   "content_scripts": [ {
      "js": [ "scripts/script.js" ],
      "matches": [ "http://ru-auto.livejournal.com/*" ]
   } ],
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
   "name": "ljphoto",
   "permissions": [ "http://ru-auto.livejournal.com/*" ],
   "update_url": "https://clients2.google.com/service/update2/crx",
   "version": "@@ver"
}
