(function(){
	var status={};
		chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
//			console.log(message);
			if (message.method=='getStatus'){
				if (Object.keys(status).length<1){
					checklogin();
				}else {
					chrome.runtime.sendMessage({method:'setStatus',status:status});
					sendResponse(status);
				}
			}
			if (message.method=='getHStatus'){
					checklogin();
			}
			if (message.method=='exit'){
//				console.log("exit");
				var xhr = new XMLHttpRequest();
				xhr.open('GET', 'http://skovpen.org/ra/checklogin.php?logout=1',true);
				xhr.onreadystatechange = function() {
					if (xhr.readyState == 4) {
						if (xhr.status==200){
//							console.log('exit ok');
							checklogin();
						}
					}
				};
				xhr.send();
			}
		});
//		chrome.runtime.sendMessage({method:'setTitle'}, function(response){
//			console.log(response);
//		});
		
	function checklogin(){
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'http://skovpen.org/ra/checklogin.php',true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status==200){
					var res=JSON.parse(xhr.responseText);
//					console.log(res);
					status=res;
					chrome.runtime.sendMessage({method:'setStatus',status:res});
				}
			}
		};
		xhr.send();
	}
//	console.log('test');
//	checklogin();
})();