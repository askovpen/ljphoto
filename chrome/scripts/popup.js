(function() {
	function getStatus() {
		chrome.runtime.sendMessage({method:'getStatus'}, function(response){
//			console.log(response);
		});
	}
	chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
//		console.log(message);
		if (message.method=="setStatus"){
			if (message.status.result===false){
//				console.log("ttt");
//				document.getElementById("status").innerHTML="Вы не вошли";
				document.getElementById("logged").style.display="none";
				document.getElementById("enter").style.display="inline";
				if (message.status.reason=="access"){
					document.getElementById("status").innerHTML="Для Вас доступ закрыт";
					document.getElementById("snick").style.display="none";
					document.getElementById("submit").style.display="none";
				}
			}else {
//				console.log(message.status.nick);
				document.getElementById("name").innerHTML=message.status.nick;
				document.getElementById("enter").style.display="none";
				document.getElementById("logged").style.display="inline";
			}
		}
	});
	document.getElementById("submit").addEventListener("click", function(){
		var popup=window.open("http://skovpen.org/ra/oidc.php?ljname="+document.getElementById("nick").value+"&hash=","test","width=420,height=230,resizable=yes,scrollbars=yes,status=yes");
		var finishedInterval =setInterval(function() {
			if (popup.closed) {
				clearInterval(finishedInterval);
//				console.log('popup is now closed');
				chrome.runtime.sendMessage({method:'getHStatus'});
			}
		},1000);
	}, false);
	document.getElementById("exit").addEventListener("click", function(){
		chrome.runtime.sendMessage({method:'exit'});
	});
	getStatus();
//	console.log("test1");
})();