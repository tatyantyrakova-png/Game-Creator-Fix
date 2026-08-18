(function(){
  "use strict";
  window.MemeFactory = window.MemeFactory || {};
  var api=window.MemeFactory;
  api.showScreen=function(screenName){
    if(screenName!=="result"&&api.stopGrowth)api.stopGrowth();
    document.querySelectorAll(".screen").forEach(function(screen){screen.classList.toggle("is-active",screen.id===screenName+"-screen");});
    window.scrollTo({top:0,behavior:"instant"});
  };
  api.openTutorial=function(){document.getElementById("tutorial-modal").hidden=false;api.tap();};
  api.closeTutorial=function(){document.getElementById("tutorial-modal").hidden=true;};
  api.openShare=function(){document.getElementById("share-modal").hidden=false;api.tap();};
  api.closeShare=function(){document.getElementById("share-modal").hidden=true;};
  api.initScenes=function(){
    document.getElementById("play-button").addEventListener("click",function(){api.showScreen("editor");api.renderEditor();api.tap();});
    document.getElementById("how-button").addEventListener("click",api.openTutorial);
    document.getElementById("tutorial-close").addEventListener("click",api.closeTutorial);
    document.getElementById("tutorial-start").addEventListener("click",function(){api.closeTutorial();api.showScreen("editor");api.renderEditor();api.tap();});
    document.getElementById("editor-home").addEventListener("click",function(){api.showScreen("menu");api.tap();});
    document.getElementById("result-back").addEventListener("click",function(){api.showScreen("editor");api.tap();});
     document.getElementById("capture-button").addEventListener("click",function(){api.showScreen("result");api.renderResult();api.startGrowth();api.toast("ТРЕНД ОПУБЛИКОВАН! ЛИСТАЙ НИЖЕ — ТАМ ДЕЙСТВИЯ.");api.tap();});
     document.getElementById("new-meme-button").addEventListener("click",function(){
       var startNext=function(){api.resetState();api.showScreen("editor");api.renderEditor();api.tap();};
       if(api.showInterstitial)api.showInterstitial(startNext);else startNext();
     });
     document.getElementById("rewarded-button").addEventListener("click",function(){
       if(api.state.unlocked||api.state.rewardedUnlocked){api.toast("Секретный предмет уже открыт");return;}
       if(!api.showRewardedAd){api.setRewardedState("unavailable");return;}
       api.showRewardedAd(function(){api.unlockRewardedItem();},function(status){api.setRewardedState(status);});
       api.tap();
     });
    document.getElementById("tutorial-modal").addEventListener("click",function(event){if(event.target===this)api.closeTutorial();});
    document.getElementById("share-modal").addEventListener("click",function(event){if(event.target===this)api.closeShare();});
  };
})();