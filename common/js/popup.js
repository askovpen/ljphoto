(function() {
	function getStatus() {
// @ifdef chrome
		chrome.runtime.sendMessage({method:'getStatus'}, function(response){
		});
// @endif
// @ifdef firefox
		self.port.emit("getStatus");
// @endif

	}
// @ifdef chrome
	chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
		if (message.method=="setStatus"){
			var status=message.status;
// @endif
// @ifdef firefox
	self.port.on('setStatus',function(status){
// @endif
			if (status.result===false && !("access" in status)){
				document.getElementById("logged").style.display="none";
				document.getElementById("enter").style.display="inline";
				if (status.reason=="access"){
					document.getElementById("status").textContent="Для Вас доступ закрыт";
					document.getElementById("snick").style.display="none";
					document.getElementById("submit").style.display="none";
				}
			}else {
				document.getElementById("name").textContent=status.nick;
				document.getElementById("enter").style.display="none";
				document.getElementById("logged").style.display="inline";
			}
// @ifdef chrome
		}
// @endif
	});
	document.getElementById("submit").addEventListener("click", function(){
		var popup=window.open("https://skovpen.org/ra/oidc.php?ljname="+document.getElementById("nick").value+"&hash=","test","width=420,height=230,resizable=yes,scrollbars=yes,status=yes");
		var finishedInterval =setInterval(function() {
			if (popup.closed) {
				clearInterval(finishedInterval);
// @ifdef chrome
				chrome.runtime.sendMessage({method:'getHStatus'});
// @endif
// @ifdef firefox
				self.port.emit('getHStatus');
// @endif
			}
		},1000);
	}, false);
	document.getElementById("exit").addEventListener("click", function(){
// @ifdef chrome
		chrome.runtime.sendMessage({method:'exit'});
// @endif
// @ifdef firefox
		self.port.emit('exit');
// @endif
	});
	getStatus();
})();