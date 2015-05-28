(function(){

    var forEach = function(obj, callback) {
        [].forEach.call(obj, callback);
    };
    var LJPhoto, Photo;
    LJPhoto = {
// @ifdef fchrome
        logged:0,
        uac:0,
        access: {
            photo: 1,
            vote: 2
        },
        entityMap: {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': '&quot;',
            "'": '&#39;',
            "/": '&#x2F;'
        },
        escapeHtml: function(string) {
            return String(string).replace(/[&<>""''\/]/g, function (s) {
                return LJPhoto.entityMap[s];
            });
        },
// @endif
        startup : function() {
            window.setInterval(function(){
                Photo.apply();
            }, 1000);
        }
    };
    Photo = {
        apply: function() {
            var uarr={};
            var injected=0;
// @ifdef chrome
            var fbarr={};
            if (window.location.href.match(/205720002785777/)) {
                $.each($('a[data-hovercard]:not([data-fb-injected]):not(a:has(img))'), function(i,val) {
                    $(this).attr('data-fb-injected',true);
                    fbarr[$(this).attr('data-hovercard').match(/id=([^&]+)/)[1]]={nick:''};
                });
            }
            if (Object.keys(fbarr).length>0){
                var xhr = new XMLHttpRequest();
                xhr.open('POST', 'https://skovpen.org/ra/fbcount.php',true);
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        if (xhr.status==200) {
                            var narr=JSON.parse(xhr.responseText);
                            if (Object.keys(narr).length>0) {
                                for(var key in narr) {
                                    fbarr[key]=narr[key];
                                }
                                $.each($('a[data-hovercard]:not([data-fb-apply]):not(a:has(img))'), function(i,val) {
                                    $(this).attr('data-fb-apply',true);
                                    var id=$(this).attr('data-hovercard').match(/id=([^&]+)/)[1];
                                    if (id in fbarr) {
                                        if ('nick' in fbarr[id]) {
                                            if (fbarr[id].nick.length>0) {
                                                $(this).append('&nbsp;['+fbarr[id].nick+']');
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
                xhr.send(JSON.stringify(Object.keys(fbarr)));
            }
// @endif
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
                xhr.open('POST', 'https://skovpen.org/ra/count2.php',true);
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
                                    if (LJPhoto.uac & LJPhoto.access.photo) {
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
                                            a.setAttribute('href','https://skovpen.org/ra/#'+node.getElementsByClassName('i-ljuser-username')[0].textContent);
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
                                    node.getElementsByClassName('ljuser')[0].className=node.getElementsByClassName('ljuser')[0].className+" i-photo";
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
                                $.getJSON('https://skovpen.org/ra/d.php', {count:50, last:0, sword: this.parentNode.getElementsByClassName('i-ljuser-username')[0].textContent, sname:'u.nick',stype:'asc',ss:3},
                                    function(data){
                                        var res='<ul class="thumbs">';
                                        for (var i=0, len = data.length; i<len; i++) {
                                            res+='<li class="fixed-width"><div class="thumbnail"><div class=photo>';
                                            res+='<a href="https://skovpen.org/ra/red.jpg?pid='+LJPhoto.escapeHtml(data[i].pid)+'" class="fancybox"  rel="'+LJPhoto.escapeHtml(data[i].nick)+'" title="'+LJPhoto.escapeHtml(data[i].nick)+'">';
                                            res+='<img  src="'+LJPhoto.escapeHtml(data[i].tn)+'">';
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
            if ("access" in resp){
                LJPhoto.uac=resp.access;
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
