(function(){
// @ifdef firefox
// test
// @endif
    var forEach = function(obj, callback) {
		[].forEach.call(obj, callback);
    };
    var LJPhoto, Photo;
    LJPhoto = {
		startup : function() {
			this.onDOMLoad();
		},
		onDOMLoad: function(){
			window.setInterval(function(){
				Photo.apply();
			}, 1000);
		}
	};
	Photo = {
		apply: function() {
			var uarr={};
			var injected=0;
			forEach(document.getElementsByClassName('b-leaf-username-name'),
				function(node) {
				if (!node.hasAttribute('data-lj-injected'))
				{
					uarr[node.getElementsByClassName('i-ljuser-username')[0].textContent]={count:0,fpost:0,pcount:0};
					Photo.inject(node);
					injected=injected+1;
				}
			});
			if (Object.keys(uarr).length>0){
				var xhr = new XMLHttpRequest();
				xhr.open('POST', 'http://skovpen.org/ra/count2.php',true);
				xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
				xhr.onreadystatechange = function() {
					if (xhr.readyState == 4) {
						if (xhr.status==200){
							var narr=JSON.parse(xhr.responseText);
							if (Object.keys(narr).length>0){
								for(var key in narr) {
									uarr[key]=narr[key];
								}
							}
							forEach(document.getElementsByClassName('b-leaf-username-name'),
								function(node) {
								var a;
								if (node.getElementsByClassName('i-photo').length===0){
									node.getElementsByClassName('ljuser')[0].appendChild(document.createTextNode(' [Фоток: '));
									if (uarr[node.getElementsByClassName('i-ljuser-username')[0].textContent].count>0){
										a=document.createElement('a');
										a.setAttribute('href','http://skovpen.org/ra/#'+node.getElementsByClassName('i-ljuser-username')[0].textContent);
										a.setAttribute('class','i-photo');
										a.setAttribute('target','_blank');
										a.textContent=uarr[node.getElementsByClassName('i-ljuser-username')[0].textContent].count;
										node.getElementsByClassName('ljuser')[0].appendChild(a);
									}
									else
									{
										node.getElementsByClassName('ljuser')[0].className=node.getElementsByClassName('ljuser')[0].className+" i-photo";
										node.getElementsByClassName('ljuser')[0].appendChild(document.createTextNode(uarr[node.getElementsByClassName('i-ljuser-username')[0].textContent].count));
									}
									node.getElementsByClassName('ljuser')[0].appendChild(document.createTextNode(', в песочнице '));
									var span=document.createElement('span');
									if (uarr[node.getElementsByClassName('i-ljuser-username')[0].textContent].fpost.length==10){
										node.getElementsByClassName('ljuser')[0].appendChild(document.createTextNode('с '));
										if (uarr[node.getElementsByClassName('i-ljuser-username')[0].textContent].fpost.substr(0,4)>2012){
											span.style.color="chocolate";
										}else {
											span.style.color="green";
										}
										span.appendChild(document.createTextNode(uarr[node.getElementsByClassName('i-ljuser-username')[0].textContent].fpost));
										node.getElementsByClassName('ljuser')[0].appendChild(span);
									}else {
										span.style.color="red";
										span.appendChild(document.createTextNode('гость'));
										node.getElementsByClassName('ljuser')[0].appendChild(span);
									}
									if (uarr[node.getElementsByClassName('i-ljuser-username')[0].textContent].pcount>0){
										node.getElementsByClassName('ljuser')[0].appendChild(document.createTextNode(', постов: '));
										a=document.createElement('a');
										a.setAttribute('href','http://ru-auto.livejournal.com/?poster='+node.getElementsByClassName('i-ljuser-username')[0].textContent);
										a.setAttribute('target','_blank');
										a.textContent=uarr[node.getElementsByClassName('i-ljuser-username')[0].textContent].pcount;
										node.getElementsByClassName('ljuser')[0].appendChild(a);
									}
									node.getElementsByClassName('ljuser')[0].appendChild(document.createTextNode(']'));
								}
							});
							uarr={};
						}
					}
				};
				xhr.send(JSON.stringify(Object.keys(uarr)));
			}
		},
		inject: function(node){
			node.setAttribute('data-lj-injected', true);
		}
	};
	LJPhoto.startup();
})();
