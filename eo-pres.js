/* ElevateOne presentations helper: language, Spanish text swap, natural-voice clips with browser-voice fallback. */
(function(){
  var EOP=window.EOP={dict:{},lang:"en"},cur=null,NO={};
  try{var q=(location.search.match(/[?&]lang=(en|es)/)||[])[1];EOP.lang=q||localStorage.getItem("lang")||"en"}catch(e){}
  if(EOP.lang!=="es")EOP.lang="en";
  EOP.t=function(s){return EOP.lang==="es"&&EOP.dict[s]||s};
  EOP.hash=function(t){var h=2166136261;for(var i=0;i<t.length;i++){h^=t.charCodeAt(i);h=Math.imul(h,16777619)}return("0000000"+(h>>>0).toString(16)).slice(-8)};
  EOP.apply=function(dict,extra){
    EOP.dict=dict;for(var k in (extra||{}))dict[k]=extra[k];
    document.documentElement.lang=EOP.lang==="es"?"es-MX":"en";
    if(EOP.lang!=="es")return;
    var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null),n,list=[];
    while((n=w.nextNode())){var p=n.parentNode&&n.parentNode.nodeName;if(p==="SCRIPT"||p==="STYLE")continue;list.push(n)}
    list.forEach(function(n){var m=n.nodeValue.match(/^(\s*)([\s\S]*?)(\s*)$/);if(m[2]&&dict[m[2]]!==undefined)n.nodeValue=m[1]+dict[m[2]]+m[3]});
    [].forEach.call(document.querySelectorAll("[aria-label],[title]"),function(e){["aria-label","title"].forEach(function(a){var v=e.getAttribute(a);if(v&&dict[v])e.setAttribute(a,dict[v])})});
    if(dict[document.title])document.title=dict[document.title];
  };
  /* language pill, top right */
  EOP.pill=function(){
    var b=document.createElement("button");b.type="button";b.className="eo-lang";b.textContent=EOP.lang==="es"?"English":"Español";
    b.setAttribute("aria-label",EOP.lang==="es"?"Switch to English":"Cambiar a español");
    b.onclick=function(e){e.stopPropagation();try{localStorage.setItem("lang",EOP.lang==="es"?"en":"es")}catch(x){}location.reload()};
    document.body.appendChild(b);
  };
  EOP.stop=function(){if(cur){var a=cur;cur=null;a.onended=a.onerror=a.onplaying=null;try{a.pause()}catch(e){}}};
  /* Plays audio/<lang>/<hash>.mp3 for this exact text. If the file is missing, calls o.onfail (browser voice). */
  EOP.clip=function(text,o){
    EOP.stop();var src="audio/"+EOP.lang+"/"+EOP.hash(text)+".mp3";
    if(!window.Audio||NO[src]){o.onfail&&o.onfail();return}
    var a=new Audio(src);cur=a;a.preload="auto";
    a.onplaying=function(){o.onstart&&o.onstart()};
    a.onended=function(){if(cur===a){cur=null;o.onend&&o.onend()}};
    a.onerror=function(){if(cur===a){cur=null;NO[src]=1;o.onfail&&o.onfail()}};
    var p=a.play();if(p&&p.catch)p.catch(function(e){if(cur===a&&e&&e.name==="NotAllowedError"){cur=null;o.onfail&&o.onfail()}});
  };
  var st=document.createElement("style");st.textContent=".eo-lang{position:fixed;top:max(10px,env(safe-area-inset-top));right:12px;z-index:9999;padding:9px 14px;border-radius:99px;background:var(--panel);color:var(--ink);border:1px solid var(--line);box-shadow:0 2px 10px rgba(14,42,71,.15);font:700 14px/1 'Plus Jakarta Sans',system-ui,sans-serif;cursor:pointer}.eo-lang:hover{border-color:var(--accent)}.eo-lang:focus-visible{outline:3px solid var(--accent);outline-offset:2px}";
  document.head.appendChild(st);
})();
