(function(){

    var forEach = function(obj, callback) {
		[].forEach.call(obj, callback);
    };
    var LJPhoto, Photo;
    LJPhoto = {
// @ifdef fchrome
		logged:0,
// @endif
		startup : function() {
			this.onDOMLoad();
		},
		onDOMLoad: function(){
			window.setInterval(function(){
				Photo.apply();
			}, 1000);
// @ifdef fchrome
			Votes.apply();
// @endif
		}
	};
// @ifdef fchrome
	Votes = {
		posts: {},
		change: function(val) {
			var xhr = new XMLHttpRequest();
			xhr.open('POST', 'http://skovpen.org/ra/postvote.php',true);
			xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			xhr.withCredentials=true;
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					if (xhr.status==200){
						Votes.apply();
					}
				}
			};
			xhr.send(JSON.stringify({
				postid: window.location.pathname.match(/\d+/)[0],
				vote: val
			}));
		},
		apply: function() {
			$('.b-singlepost-title span').remove();
			var uarr={};
			forEach(document.getElementsByClassName('b-singlepost-title'),
				function(node) {
//				console.log(node);
				uarr[window.location.pathname.match(/\d+/)[0]]=1;
			});
			$('tr td font b font').each(function(index){
				console.log($(this).parent().parent()[0].href);
				uarr[$(this).parent().parent()[0].href.match(/\d+/)[0]]=1;
			});
			if (Object.keys(uarr).length>0){
				var xhr = new XMLHttpRequest();
				xhr.open('POST', 'http://skovpen.org/ra/postvotes.php',true);
				xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
				xhr.onreadystatechange = function() {
					if (xhr.readyState == 4) {
						if (xhr.status==200){
							var narr=JSON.parse(xhr.responseText);
							for(var key in narr) {
								Votes.posts[key]={};
								Votes.posts[key].vote=0;
								Votes.posts[key].voters={};
								for (var key1 in narr[key]) {
									Votes.posts[key].vote+=parseInt(narr[key][key1]);
									Votes.posts[key].voters[key1]=narr[key][key1];
								}
							}
//							console.log(posts);
							$('tr td font b font').each(function(index){
								$(this).prepend($('<span />').html($('<span>',{text:'['}).add($('<a>',{
									text: ' '+Votes.posts[$(this).parent().parent()[0].href.match(/\d+/)[0]].vote+' ',
									href: "#",
									hover: function(event){ 
										if (event.type=="mouseenter"){
											console.log($(this).parent().parent().parent().parent()[0].href.match(/\d+/)[0]);
											if (Object.keys(Votes.posts[$(this).parent().parent().parent().parent()[0].href.match(/\d+/)[0]].voters).length>0){
												var res='<table border=0>';
												for (var key in Votes.posts[$(this).parent().parent().parent().parent()[0].href.match(/\d+/)[0]].voters){
													res+='<tr><td>'+key+'</td><td>'+Votes.posts[$(this).parent().parent().parent().parent()[0].href.match(/\d+/)[0]].voters[key]+'</td></tr>';
												}
												res+='</table>';
												$(this).popover({
													content:res,
													trigger: 'hover'
												}).popover('show');
											}
										}
										return false;
									},
									click: function(){return false;}
								})).add($('<span>',{text:'] '}))));
							});
							$('.b-singlepost-title').each(function(index){
								var span=$('<span>');
								$(this).prepend($('<span />').html($('<span>',{text:'['}).add($('<a>',{
									text: '↑',
									title: 'up',
									href: '#',
									click: function(){
										Votes.change(1);
										return false;
									}
									}).css('text-decoration','none')).add($('<a>',{
										text: ' '+Votes.posts[window.location.pathname.match(/\d+/)[0]].vote+' ',
										href: "#",
										hover: function(event){ 
											if (event.type=="mouseenter"){
												if (Object.keys(Votes.posts[window.location.pathname.match(/\d+/)[0]].voters).length>0){
													var res='<table border=0>';
													for (var key in Votes.posts[window.location.pathname.match(/\d+/)[0]].voters){
														res+='<tr><td>'+key+'</td><td>'+Votes.posts[window.location.pathname.match(/\d+/)[0]].voters[key]+'</td></tr>';
													}
													res+='</table>';
													$(this).popover({
														content:res,
														trigger: 'hover'
													}).popover('show');
												}
											}
											return false;
										},
										click: function(){return false;}
									}).css('text-decoration','none')).add($('<a>',{
										text: '↓',
										title: 'down',
										href: "#",
										click: function(){ 
											Votes.change(-1);
											return false;
										}
									}).css('text-decoration','none')).add($('<span>',{text:']'}))
								));
							});
						}
					}
				};
				xhr.send(JSON.stringify(Object.keys(uarr)));
			}
		}
	};
// @endif
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
									node.getElementsByClassName('ljuser')[0].appendChild(document.createTextNode(' ['));
// @ifdef fchrome
									if (LJPhoto.logged>0) {
										node.getElementsByClassName('ljuser')[0].appendChild(document.createTextNode('Фоток: '));
										if (uarr[node.getElementsByClassName('i-ljuser-username')[0].textContent].count>0){
											a=document.createElement('a');
											a.setAttribute('class','i-photo popover1');
											a.textContent=uarr[node.getElementsByClassName('i-ljuser-username')[0].textContent].count;
											node.getElementsByClassName('ljuser')[0].appendChild(a);
										}
										else
										{
											node.getElementsByClassName('ljuser')[0].className=node.getElementsByClassName('ljuser')[0].className+" i-photo";
											node.getElementsByClassName('ljuser')[0].appendChild(document.createTextNode(uarr[node.getElementsByClassName('i-ljuser-username')[0].textContent].count));
										}
										node.getElementsByClassName('ljuser')[0].appendChild(document.createTextNode(', '));
									}
// @endif
// @ifndef fchrome
									node.getElementsByClassName('ljuser')[0].appendChild(document.createTextNode('Фоток: '));
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
									node.getElementsByClassName('ljuser')[0].appendChild(document.createTextNode(', '));
// @endif
									node.getElementsByClassName('ljuser')[0].appendChild(document.createTextNode('в песочнице '));
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
// @ifdef fchrome
							$(".popover1").click(function(event) {
								event.preventDefault();
								event.stopPropagation();
								var that=this;
								$.getJSON('http://skovpen.org/ra/d.php', {count:50, last:0, sword: this.parentNode.getElementsByClassName('i-ljuser-username')[0].textContent, sname:'u.nick',stype:'asc',ss:3},
									function(data){
										var res='<ul class="thumbs">';
										for (var i=0, len = data.length; i<len; i++) {
											res+='<li class="fixed-width"><div class="thumbnail"><div class=photo>';
											res+='<a href=http://skovpen.org/ra/red.jpg?pid='+data[i].pid+' class="fancybox"  rel="'+data[i].nick+'" title="'+data[i].nick+'">';
											res+='<img  src='+data[i].tn+'>';
											res+='</a></div></li>';
										}
										res+="</ul>";
										$(that).popover({
											stopChildrenPropagation: false,
											title:false,
											content:res
										}).popover('show');
										$('.fancybox').colorbox({maxWidth:"100%",maxHeight:"100%"});
								});
							});
// @endif
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
// @ifdef chrome
	chrome.runtime.sendMessage({method:'getStatus'},function(resp){
// @endif
// @ifdef firefox
	self.port.on('setStatus',function(resp){
// @endif
// @ifdef fchrome
			if (resp.result===false){
				LJPhoto.logged=0;
			} else {
				LJPhoto.logged=1;
			}
	});
// @endif
// @ifdef firefox
	$.ajaxSetup({
		type: "POST",
		data: {},
		dataType: 'json',
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true
	});
// @endif

	LJPhoto.startup();
})();
