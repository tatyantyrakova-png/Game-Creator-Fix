(function(){
  "use strict";
  window.MemeFactory = window.MemeFactory || {};
  var api = window.MemeFactory;
  api.applyEffects = function(node, effectIds){
    if(!node) return;
    EFFECTS.forEach(function(effect){ node.classList.remove(effect.className); });
    (effectIds || []).forEach(function(id){
      var effect = EFFECTS.find(function(item){ return item.id === id; });
      if(effect) node.classList.add(effect.className);
    });
  };
  api.effectLabel = function(id){
    var found = EFFECTS.find(function(effect){return effect.id===id;});
    return found ? found.label : "";
  };
})();