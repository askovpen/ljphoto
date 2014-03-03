(function(){
    var forEach = function(obj, callback) {
	[].forEach.call(obj, callback);
    };
    var LJPhoto, Photo, PhotoItem;
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
		    uarr[node.getElementsByClassName('i-ljuser-username')[0].textContent]=0;
		    Photo.inject(node);
		    injected=injected+1;
		}
	    });
	    if (Object.keys(uarr).length>0){
		var xhr = new XMLHttpRequest();
		xhr.open('POST', 'http://skovpen.org/ra/count.php',true);
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
				if (node.getElementsByClassName('i-photo').length===0){
				    node.getElementsByClassName('ljuser')[0].appendChild(document.createTextNode(' Фоток: '));
				    if (uarr[node.getElementsByClassName('i-ljuser-username')[0].textContent]>0){
					var a=document.createElement('a');
					a.setAttribute('href','http://skovpen.org/ra/#'+node.getElementsByClassName('i-ljuser-username')[0].textContent);
					a.setAttribute('class','i-photo');
					a.setAttribute('target','_blank');
					a.textContent=' ('+uarr[node.getElementsByClassName('i-ljuser-username')[0].textContent]+')';
					node.getElementsByClassName('ljuser')[0].appendChild(a);
				    }
				    else
				    {
					node.getElementsByClassName('ljuser')[0].className=node.getElementsByClassName('ljuser')[0].className+" i-photo";
					node.getElementsByClassName('ljuser')[0].appendChild(document.createTextNode(' ('+uarr[node.getElementsByClassName('i-ljuser-username')[0].textContent]+')'));
				    }
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
