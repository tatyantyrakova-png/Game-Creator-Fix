(function(){
  "use strict";
  window.MemeFactory=window.MemeFactory||{};var api=window.MemeFactory;
  function $(id){return document.getElementById(id);}
  function setVisible(id,visible){var node=$(id);if(node)node.hidden=!visible;}
  function paint(){
    var settings=api.settings||{sfx:true,music:true,vibration:true},supported=!!navigator.vibrate;
    ["sfx","music","vibration"].forEach(function(name){
      var on=!!settings[name],value=$(("setting-"+name+"-value")),switchNode=$(("setting-"+name+"-switch"));
      if(value)value.textContent=name==="vibration"&&!supported?"НЕТ":on?"ВКЛ":"ВЫКЛ";
      if(switchNode){switchNode.classList.toggle("is-on",on&&!(name==="vibration"&&!supported));switchNode.setAttribute("aria-checked",String(on));}
    });
    var note=$("vibration-note");if(note)note.textContent=supported?"Лёгкий отклик на нажатия":"Браузер не поддерживает вибрацию";
    document.querySelectorAll(".music-ticker").forEach(function(ticker){ticker.classList.toggle("is-muted",!settings.music);});
  }
  api.applySettings=paint;
  api.openSettings=function(){paint();setVisible("settings-modal",true);api.tap();};
  api.closeSettings=function(){setVisible("settings-modal",false);};
  api.initSettings=function(){
    ["menu-settings","editor-settings"].forEach(function(id){var node=$(id);if(node)node.addEventListener("click",api.openSettings);});
    document.querySelectorAll(".setting-row").forEach(function(row){row.addEventListener("click",function(){var name=row.dataset.setting;if(name==="vibration"&&!navigator.vibrate){api.toast("Вибрация недоступна в этом браузере");return;}api.setSetting(name,!api.settings[name]);paint();api.tap();});});
    $("settings-close").addEventListener("click",api.closeSettings);$("settings-close-button").addEventListener("click",api.closeSettings);
    $("rules-button").addEventListener("click",function(){setVisible("settings-modal",false);setVisible("rules-modal",true);api.tap();});
    $("rules-close").addEventListener("click",function(){setVisible("rules-modal",false);api.tap();});$("rules-close-button").addEventListener("click",function(){setVisible("rules-modal",false);api.tap();});
    $("clear-progress-button").addEventListener("click",function(){setVisible("confirm-modal",true);api.tap();});
    $("confirm-cancel").addEventListener("click",function(){setVisible("confirm-modal",false);api.tap();});
    $("confirm-delete").addEventListener("click",function(){api.clearProgress();setVisible("confirm-modal",false);setVisible("settings-modal",false);if(api.renderEditor)api.renderEditor();api.toast("Прогресс удалён. Чистый лист!");api.tap();});
    ["settings-modal","rules-modal","confirm-modal"].forEach(function(id){$(id).addEventListener("click",function(event){if(event.target===this){setVisible(id,false);}});});
    paint();
  };
})();