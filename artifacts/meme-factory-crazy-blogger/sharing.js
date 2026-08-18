(function(){
  "use strict";
  window.MemeFactory=window.MemeFactory||{};var api=window.MemeFactory;
  api.initSharing=function(){
    document.getElementById("share-button").addEventListener("click",api.openShare);
    document.getElementById("share-close").addEventListener("click",api.closeShare);
    document.getElementById("copy-button").addEventListener("click",function(){
      var text="https://memefactory.fun/m/"+(api.state.character||"meme")+"-2026", status=document.getElementById("share-status");
       var done=function(){status.textContent="Скопировано! Отправляй ссылку в чат.";api.toast("Ссылка скопирована!");};
      if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(done).catch(function(){fallback(text,done);});else fallback(text,done);api.tap();
    });
    document.getElementById("native-share-button").addEventListener("click",function(){
      api.shareMeme();
    });
    document.getElementById("yandex-share-button").addEventListener("click",api.shareMeme);
  };
  api.shareMeme=function(){
    var sdk=api.ysdk||window.ysdk;
     var payload={title:"Мем-Фабрика — мой вирусный мем",text:"Я собрал мем в Мем-Фабрике. Повторишь?",url:window.location.href};
    var status=document.getElementById("share-status");
     var copied=function(){if(status)status.textContent="Скопировано! Отправляй ссылку в чат.";api.toast("Ссылка скопирована!");};
     var fallbackShare=function(){
       if(navigator.share){
         try{var nativeResult=navigator.share(payload);if(nativeResult&&nativeResult.catch)nativeResult.catch(function(){copyFallback();});return;}catch(error){}
       }
       copyFallback();
     };
     var copyFallback=function(){
       if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(window.location.href).then(copied).catch(function(){fallback(window.location.href,copied);});
       else fallback(window.location.href,copied);
     };
    if(sdk&&typeof sdk.share==="function"){
       try{
         var result=sdk.share(payload),shared=function(){if(status)status.textContent="Мем отправлен через Я.Игры.";api.tap();};
         if(result&&result.then)result.then(shared).catch(fallbackShare);else shared();
         return;
       }catch(error){}
    }
     fallbackShare();api.tap();
  };
  window.shareMeme=api.shareMeme;
  function fallback(text,done){var area=document.createElement("textarea");area.value=text;area.style.position="fixed";area.style.opacity="0";document.body.appendChild(area);area.select();try{document.execCommand("copy");}catch(e){}document.body.removeChild(area);done();}
})();