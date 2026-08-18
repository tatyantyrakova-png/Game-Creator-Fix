(function(){
  "use strict";
  var KEY="meme-factory-crazy-blogger-state";
  var SETTINGS_KEY="meme_factory_settings";
   var ysdk=null,interstitialShownAt=0,interstitialBusy=false,rewardedBusy=false;
  window.MemeFactory=window.MemeFactory||{};var api=window.MemeFactory;
   var defaults={background:"candy",character:"blob",pose:"chill",items:[],effects:[],caption:"",activeTab:"backgrounds",unlocked:false,rewardedUnlocked:false};
  var settingsDefaults={sfx:true,music:true,vibration:true};
  api.state=loadState();
  api.settings=loadSettings();
  api.saveState=function(){try{localStorage.setItem(KEY,JSON.stringify(api.state));}catch(error){}};
  api.saveSettings=function(){try{localStorage.setItem(SETTINGS_KEY,JSON.stringify(api.settings));}catch(error){}};
  api.setSetting=function(name,value){if(Object.prototype.hasOwnProperty.call(settingsDefaults,name)){api.settings[name]=!!value;api.saveSettings();if(name==="music"&&api.settings.music&&api.startMusic)api.startMusic();if(name==="music"&&!api.settings.music&&api.stopMusic)api.stopMusic();if(api.applySettings)api.applySettings();}};
  api.clearProgress=function(){
    api.state=Object.assign({},defaults,{items:[],effects:[]});
    api.settings=Object.assign({},settingsDefaults);
    if(api.stopMusic)api.stopMusic();
     try{localStorage.removeItem(KEY);localStorage.removeItem(SETTINGS_KEY);}catch(error){}
     if(api.resetProfile)api.resetProfile();
    api.saveState();api.saveSettings();if(api.applySettings)api.applySettings();
  };
   api.resetState=function(){api.state={background:defaults.background,character:defaults.character,pose:defaults.pose,items:[],effects:[],caption:"",activeTab:"backgrounds",unlocked:api.state.unlocked,rewardedUnlocked:api.state.rewardedUnlocked};api.saveState();};
  api.toast=function(message){
    var toast=document.getElementById("toast");if(!toast)return;toast.textContent=message;toast.classList.add("is-visible");
    clearTimeout(api.toastTimer);api.toastTimer=setTimeout(function(){toast.classList.remove("is-visible");},2600);
  };
  var audioContext,musicTimer=0,musicIndex=0;
  var melody=[261.63,329.63,392,329.63,293.66,349.23,440,349.23];
  function playMusicNote(){
    if(!api.settings.music)return;
    try{
      audioContext=audioContext||new (window.AudioContext||window.webkitAudioContext)();
      var osc=audioContext.createOscillator(),gain=audioContext.createGain(),now=audioContext.currentTime;
      osc.type="triangle";osc.frequency.value=melody[musicIndex++%melody.length];
      gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.012,now+.03);gain.gain.exponentialRampToValueAtTime(.0001,now+.42);
      osc.connect(gain);gain.connect(audioContext.destination);osc.start(now);osc.stop(now+.45);
    }catch(error){}
  }
  api.startMusic=function(){if(!api.settings.music||musicTimer)return;playMusicNote();musicTimer=window.setInterval(playMusicNote,900);};
  api.stopMusic=function(){if(musicTimer){window.clearInterval(musicTimer);musicTimer=0;}};
  api.tap=function(){
    if(api.settings.sfx){try{audioContext=audioContext||new (window.AudioContext||window.webkitAudioContext)();var osc=audioContext.createOscillator(),gain=audioContext.createGain();
       osc.type="sine";osc.frequency.value=520;gain.gain.setValueAtTime(.035,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+.07);osc.connect(gain);gain.connect(audioContext.destination);osc.start();osc.stop(audioContext.currentTime+.08);
     }catch(error){}}
    if(api.settings.music)api.startMusic();
    api.vibrate(8);
  };
  api.ding=function(){
    if(api.settings.sfx){try{audioContext=audioContext||new (window.AudioContext||window.webkitAudioContext)();var now=audioContext.currentTime;
      [880,1175,1568].forEach(function(freq,index){var osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type="triangle";osc.frequency.value=freq;gain.gain.setValueAtTime(.001,now+index*.07);gain.gain.exponentialRampToValueAtTime(.16,now+index*.07+.02);gain.gain.exponentialRampToValueAtTime(.001,now+index*.07+.28);osc.connect(gain);gain.connect(audioContext.destination);osc.start(now+index*.07);osc.stop(now+index*.07+.3);});
    }catch(error){}} api.vibrate(45);
  };
  api.vibrate=function(duration){if(api.settings.vibration&&navigator.vibrate)navigator.vibrate(duration||12);};
  function loadState(){
    try{var saved=JSON.parse(localStorage.getItem(KEY)||"null");if(saved)return Object.assign({},defaults,saved,{items:Array.isArray(saved.items)?saved.items:[],effects:Array.isArray(saved.effects)?saved.effects:[]});}catch(error){}
    return Object.assign({},defaults,{items:[],effects:[]});
  }
  function loadSettings(){
    try{var saved=JSON.parse(localStorage.getItem(SETTINGS_KEY)||"null");if(saved)return Object.assign({},settingsDefaults,saved);}catch(error){}
    return Object.assign({},settingsDefaults);
  }
   function setRewardedState(state){
     var button=document.getElementById("rewarded-button"),status=document.getElementById("rewarded-status");
     if(!button||!status)return;
     button.disabled=state==="loading";
     button.setAttribute("aria-busy",state==="loading"?"true":"false");
     if(state==="loading"){status.textContent="Загружаем бонусный ролик…";button.textContent="ЗАГРУЗКА";}
     if(state==="ready"){status.textContent="Посмотри короткое видео — награда появится только после просмотра.";button.textContent="ОТКРЫТЬ";button.disabled=false;button.removeAttribute("aria-busy");}
     if(state==="reward"){status.textContent="Секретный предмет открыт и уже в разделе «Штуки».";button.textContent="ОТКРЫТО";button.disabled=true;}
     if(state==="closed"){status.textContent="Ролик закрыт без награды. Попробуй ещё раз позже.";button.textContent="ОТКРЫТЬ";}
     if(state==="error"){status.textContent="Видео сейчас недоступно. Игра продолжается без него.";button.textContent="ПОВТОРИТЬ";}
     if(state==="unavailable"){status.textContent="Локальный запуск: рекламное видео недоступно, награда не выдана.";button.textContent="НЕДОСТУПНО";}
   }
   api.setRewardedState=setRewardedState;
   function initYandexSDK(){
      if(typeof YaGames==="undefined"){console.info("SDK not available (playing locally)");return;}
    YaGames.init().then(function(ysdkInstance){
      ysdk=ysdkInstance;api.ysdk=ysdk;window.ysdk=ysdk;
      console.info("Yandex SDK initialized");
      }).catch(function(error){console.info("SDK not available (playing locally):",error);});
  }
   api.showInterstitial=function(onComplete){
     var now=Date.now();
     if(interstitialBusy){if(onComplete)onComplete();return;}
     if(now-interstitialShownAt<45000){if(onComplete)onComplete();return;}
     if(!ysdk||!ysdk.adv||typeof ysdk.adv.showFullscreenAdv!=="function"){if(onComplete)onComplete();return;}
     interstitialBusy=true;interstitialShownAt=now;
     var done=false;
     var complete=function(){if(done)return;done=true;interstitialBusy=false;if(onComplete)onComplete();};
     try{
       var result=ysdk.adv.showFullscreenAdv({callbacks:{onOpen:function(){console.info("Interstitial opened");},onClose:complete,onError:function(error){console.info("Interstitial unavailable:",error);complete();}}});
       if(result&&result.catch)result.catch(function(error){console.info("Interstitial unavailable:",error);complete();});
     }catch(error){console.info("Interstitial unavailable:",error);complete();}
   };
   api.showRewardedAd=function(onReward,onState){
     if(rewardedBusy)return;
     if(!ysdk||!ysdk.adv||typeof ysdk.adv.showRewardedVideo!=="function"){
       if(onState)onState("unavailable");
       return;
     }
     rewardedBusy=true;if(onState)onState("loading");
     var rewarded=false,closed=false;
     var finish=function(state){
       if(closed)return;closed=true;rewardedBusy=false;
       if(onState)onState(state);
     };
     try{
       var result=ysdk.adv.showRewardedVideo({
         callbacks:{
           onOpen:function(){console.info("Rewarded video opened");},
           onRewarded:function(){if(rewarded)return;rewarded=true;console.info("Rewarded!");if(onReward)onReward();},
           onClose:function(){console.info("Rewarded video closed");finish(rewarded?"reward":"closed");},
           onError:function(error){console.info("Error while opening rewarded video:",error);finish("error");}
         }
       });
       if(result&&result.catch)result.catch(function(error){console.info("Rewarded video unavailable:",error);finish("error");});
     }catch(error){console.info("Rewarded video unavailable:",error);finish("error");}
  };
   api.unlockRewardedItem=function(){
     if(api.state.rewardedUnlocked||api.state.unlocked)return false;
     api.state.rewardedUnlocked=true;api.saveState();
     if(api.renderEditor)api.renderEditor();
     api.toast("СЕКРЕТНЫЙ ПРЕДМЕТ ОТКРЫТ!");
     return true;
   };
  window.showRewardedAd=api.showRewardedAd;
  window.addEventListener("load",initYandexSDK);
  function initKonami(){
    var code=["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"],position=0;
    document.addEventListener("keydown",function(event){
      if(event.key===code[position]||(event.key.toLowerCase()===code[position]))position++;else position=0;
      if(position===code.length){position=0;if(!api.state.unlocked){api.state.unlocked=true;api.saveState();api.toast("СЕКРЕТ ОТКРЫТ! +5 безумных штук 🎉");api.renderEditor();}else api.toast("Секреты уже все у тебя ✦");}
    });
  }
  document.addEventListener("DOMContentLoaded",function(){
    api.initSettings();api.initScenes();api.initEditor();api.initTikTok();api.initSharing();initKonami();
    document.querySelectorAll("button").forEach(function(button){button.addEventListener("pointerdown",function(){if(!button.closest(".picker-card"))api.tap();},{passive:true});});
    if(api.initProfile)api.initProfile();
  });
})();