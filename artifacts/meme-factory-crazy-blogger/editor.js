(function(){
  "use strict";
  window.MemeFactory = window.MemeFactory || {};
  var api = window.MemeFactory;
  var canvas, ctx;
  var tabTitles = {backgrounds:"Выбери сцену",characters:"Выбери героя",items:"Навешай штук",effects:"Добавь безумия"};
  var posesHint = "ПОЗА ГЕРОЯ";

  function state(){ return api.state; }
  function save(){ if(api.saveState) api.saveState(); }
  function toast(message){ if(api.toast) api.toast(message); }
  function fitEmoji(text, size){ return size + "px 'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif"; }
  function findById(list,id){ return list.find(function(item){ return item.id === id; }); }
  function roundedRect(context,x,y,w,h,r){
    context.beginPath(); context.moveTo(x+r,y); context.arcTo(x+w,y,x+w,y+h,r); context.arcTo(x+w,y+h,x,y+h,r);
    context.arcTo(x,y+h,x,y,r); context.arcTo(x,y,x+w,y,r); context.closePath();
  }

  api.initEditor = function(){
    canvas = document.getElementById("meme-canvas");
    ctx = canvas.getContext("2d");
    var captionInput = document.getElementById("caption-input");
    if(captionInput){
      captionInput.value = state().caption || "";
      captionInput.addEventListener("input",function(){
        state().caption = captionInput.value.slice(0,48);
        save();
        renderCanvas();
      });
    }
    var captionClear = document.getElementById("caption-clear");
    if(captionClear) captionClear.addEventListener("click",function(){
      state().caption = "";
      if(captionInput) captionInput.value = "";
      save();
      renderCanvas();
      api.tap();
    });
    document.querySelectorAll(".tab").forEach(function(button){
      button.addEventListener("click",function(){
        state().activeTab = button.dataset.tab;
        document.querySelectorAll(".tab").forEach(function(tab){tab.classList.toggle("is-selected",tab===button);});
        renderPicker(); api.tap();
      });
    });
    renderPicker(); renderCanvas();
    if(api.setRewardedState)api.setRewardedState(state().unlocked||state().rewardedUnlocked ? "reward" : "ready");
  };
  api.renderEditor = function(){
    var captionInput = document.getElementById("caption-input");
    if(captionInput) captionInput.value = state().caption || "";
     renderPicker(); renderCanvas();
     if(api.setRewardedState)api.setRewardedState(state().unlocked||state().rewardedUnlocked ? "reward" : "ready");
  };
  api.renderCanvas = renderCanvas;

  function renderPicker(){
    var s = state(), grid = document.getElementById("picker-grid");
    if(!grid) return;
    document.getElementById("picker-title").textContent = tabTitles[s.activeTab] || tabTitles.backgrounds;
    document.getElementById("picker-hint").textContent = s.activeTab === "characters" ? posesHint : "листай →";
    grid.innerHTML = "";
    var list = s.activeTab === "backgrounds" ? BACKGROUNDS : s.activeTab === "characters" ? CHARACTERS : s.activeTab === "items" ? ITEMS.concat(SECRET_ITEMS) : EFFECTS;
    list.forEach(function(item){
      var selected = s.activeTab === "backgrounds" ? s.background === item.id :
        s.activeTab === "characters" ? s.character === item.id :
        s.activeTab === "items" ? s.items.indexOf(item.id) !== -1 : s.effects.indexOf(item.id) !== -1;
     var locked = item.secret && !s.unlocked && !(s.rewardedUnlocked && item.id === "toilet");
      var card = document.createElement("button");
      card.className = "picker-card" + (selected ? " is-selected" : "") + (locked ? " locked" : "");
      card.type = "button"; card.dataset.testid = "picker-" + item.id;
      card.innerHTML = '<span class="item-emoji">'+item.emoji+'</span><span class="item-label">'+item.label+'</span>' +
        (s.activeTab === "effects" ? '<span class="item-note">'+(selected ? "ВКЛ" : "выкл")+'</span>' : "") +
        (locked ? '<span class="lock">🔒</span>' : "");
      card.addEventListener("click",function(){
        api.tap();
        if(locked){ toast("Секрет пока спит. Введи код блогера!"); return; }
        if(s.activeTab === "backgrounds") s.background = item.id;
        if(s.activeTab === "characters") s.character = item.id;
        if(s.activeTab === "items"){
          var at = s.items.indexOf(item.id);
          if(at !== -1) s.items.splice(at,1);
          else if(s.items.length < 5) s.items.push(item.id);
          else { toast("Пять штук — потолок безумия!"); return; }
        }
        if(s.activeTab === "effects"){
          var effectAt = s.effects.indexOf(item.id);
          if(effectAt !== -1) s.effects.splice(effectAt,1); else s.effects.push(item.id);
        }
        save(); renderPicker(); renderCanvas();
      });
      grid.appendChild(card);
    });
    if(s.activeTab === "characters"){
      var poseTitle = document.createElement("div"); poseTitle.className = "pose-title"; poseTitle.textContent = "Поза героя";
      grid.appendChild(poseTitle);
      POSES.forEach(function(pose){
        var poseCard = document.createElement("button"); poseCard.type="button";
        poseCard.className = "picker-card pose-card" + (s.pose===pose.id ? " is-selected" : "");
        poseCard.dataset.testid = "pose-" + pose.id;
        poseCard.innerHTML = '<span class="item-emoji">'+pose.emoji+'</span><span class="item-label">'+pose.label+'</span>';
        poseCard.addEventListener("click",function(){s.pose=pose.id;save();renderPicker();renderCanvas();api.tap();});
        grid.appendChild(poseCard);
      });
    }
    var count = document.getElementById("layer-count");
    if(count) count.textContent = s.items.length + "/5 предметов";
    renderShotBoard();
  }

  function renderShotBoard(){
    var host = document.getElementById("shot-slots");
    if(!host) return;
    var s = state();
    var background = findById(BACKGROUNDS, s.background);
    var character = findById(CHARACTERS, s.character);
    var selectedItems = s.items.map(function(id){ return findById(ITEMS.concat(SECRET_ITEMS), id); }).filter(Boolean);
    var selectedEffects = s.effects.map(function(id){ return findById(EFFECTS, id); }).filter(Boolean);
    var slots = [
      {tab:"backgrounds", icon:"▧", label:"СЦЕНА", value:background ? background.label : "Выбери фон", ready:!!background},
      {tab:"characters", icon:"☻", label:"ГЕРОЙ", value:character ? character.label : "Выбери героя", ready:!!character},
      {tab:"items", icon:"✦", label:"РЕКВИЗИТ", value:selectedItems.length ? selectedItems.length + " шт. в кадре" : "Пусто — добавь детали", ready:selectedItems.length > 0},
      {tab:"effects", icon:"✹", label:"ЭФФЕКТ", value:selectedEffects.length ? selectedEffects.map(function(item){return item.label;}).join(" · ") : "Без эффекта", ready:selectedEffects.length > 0}
    ];
    var complete = !!background && !!character && selectedItems.length > 0 && selectedEffects.length > 0;
    var status = document.getElementById("shot-board-status");
    if(status) status.textContent = complete ? "КАДР СОБРАН" : "ДОБАВЬ ДЕТАЛИ";
    host.innerHTML = slots.map(function(slot){
      return '<button type="button" class="shot-slot '+(slot.ready ? "is-ready" : "")+(s.activeTab===slot.tab ? " is-active" : "")+'" data-shot-tab="'+slot.tab+'" aria-label="Открыть раздел '+slot.label+'">'+
        '<span class="shot-slot-icon" aria-hidden="true">'+slot.icon+'</span>'+
        '<span class="shot-slot-copy"><b>'+slot.label+'</b><small>'+slot.value+'</small></span>'+
        '<span class="shot-slot-state">'+(slot.ready ? "ГОТОВО" : "ВЫБРАТЬ")+'</span>'+
        '</button>';
    }).join("");
    host.querySelectorAll("[data-shot-tab]").forEach(function(button){
      button.addEventListener("click",function(){
        state().activeTab = button.dataset.shotTab;
        document.querySelectorAll(".tab").forEach(function(tab){ tab.classList.toggle("is-selected", tab.dataset.tab === state().activeTab); });
        renderPicker();
        api.tap();
      });
    });
  }

  function drawBackground(background){
    var w=canvas.width,h=canvas.height, colors=background.colors;
    var gradient=ctx.createLinearGradient(0,0,w,h); gradient.addColorStop(0,colors[0]); gradient.addColorStop(1,colors[1]);
    ctx.fillStyle=gradient;ctx.fillRect(0,0,w,h);
    ctx.globalAlpha=.18; for(var i=0;i<18;i++){ctx.fillStyle=i%2?"#fff":"#30165c";ctx.beginPath();ctx.arc((i*97)%w,(i*151)%h,24+(i%4)*13,0,Math.PI*2);ctx.fill();} ctx.globalAlpha=1;
    ctx.fillStyle="rgba(255,255,255,.42)";ctx.font="900 22px 'Trebuchet MS',sans-serif";ctx.textAlign="left";ctx.fillText(background.label.toUpperCase(),30,h-28);
    ctx.strokeStyle="rgba(255,255,255,.65)";ctx.lineWidth=4;ctx.setLineDash([12,14]);ctx.strokeRect(20,20,w-40,h-40);ctx.setLineDash([]);
  }
  function drawCharacter(character, pose){
    var w=canvas.width,h=canvas.height;
    var transforms={
      chill:{x:0,y:26,r:0,s:1,accent:""},
      dance:{x:-20,y:-18,r:-.2,s:1.13,accent:"♪"},
      shock:{x:0,y:-34,r:.04,s:1.22,accent:"!"},
      sleep:{x:30,y:35,r:.13,s:.86,accent:"Zzz"}
    };
    var t=transforms[pose]||transforms.chill;
    var poseItem=POSES.find(function(item){return item.id===pose;})||POSES[0];
    ctx.save();
    ctx.translate(w/2+t.x,h/2+47+t.y);
    ctx.rotate(t.r);
    ctx.scale(t.s,t.s);
    ctx.fillStyle="rgba(38,19,63,.28)";
    ctx.beginPath();ctx.ellipse(0,164,138,25,0,0,Math.PI*2);ctx.fill();
    if(pose==="dance"){
      ctx.strokeStyle="rgba(255,216,61,.95)";ctx.lineWidth=8;ctx.lineCap="round";
      [-1,1].forEach(function(side){ctx.beginPath();ctx.moveTo(side*112,-52);ctx.lineTo(side*160,-92);ctx.stroke();});
      ctx.fillStyle="#fffdf8";ctx.font="900 56px 'Trebuchet MS',sans-serif";ctx.fillText("♪",-168,-110);ctx.fillText("♫",145,22);
    }
    if(pose==="shock"){
      ctx.strokeStyle="#fffdf8";ctx.lineWidth=7;ctx.lineCap="round";
      for(var ray=0;ray<8;ray++){var angle=ray*Math.PI/4;ctx.beginPath();ctx.moveTo(Math.cos(angle)*155,Math.sin(angle)*155-40);ctx.lineTo(Math.cos(angle)*190,Math.sin(angle)*190-40);ctx.stroke();}
      ctx.fillStyle="#ffd83d";ctx.font="1000 82px 'Trebuchet MS',sans-serif";ctx.fillText("!",112,-135);
    }
    if(pose==="sleep"){
      ctx.fillStyle="#54e5ed";ctx.font="1000 42px 'Trebuchet MS',sans-serif";ctx.fillText("Z",120,-128);
      ctx.font="1000 27px 'Trebuchet MS',sans-serif";ctx.fillText("z",156,-165);
    }
    ctx.font=fitEmoji(character.emoji,250);ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(character.emoji,0,0);
    if(pose==="chill"){
      ctx.fillStyle="#54e5ed";ctx.font="1000 26px 'Trebuchet MS',sans-serif";ctx.fillText("READY",0,174);
    }
    ctx.font=fitEmoji(poseItem.emoji,72);ctx.fillText(poseItem.emoji,112,-124);
    ctx.restore();
  }
  function drawItems(items){
    var w=canvas.width, positions=[[-104,-228],[0,-256],[105,-224],[-52,-156],[58,-165]];
    items.forEach(function(id,index){
      var item=ITEMS.concat(SECRET_ITEMS).find(function(entry){return entry.id===id;}); if(!item)return;
      var p=positions[index];ctx.save();ctx.translate(w/2+p[0],canvas.height/2+47+p[1]);ctx.rotate((index%2?.08:-.08));
      ctx.font=fitEmoji(item.emoji,78);ctx.textAlign="center";ctx.textBaseline="middle";ctx.shadowColor="rgba(38,19,63,.35)";ctx.shadowBlur=1;ctx.shadowOffsetX=4;ctx.shadowOffsetY=5;ctx.fillText(item.emoji,0,0);ctx.restore();
    });
  }
  function drawCanvasEffects(effectIds){
    var w=canvas.width,h=canvas.height;
    if(effectIds.indexOf("glitch")!==-1){
      ctx.save();
      ctx.globalAlpha=.9;
      for(var strip=0;strip<8;strip++){
        var y=95+strip*74;
        ctx.fillStyle=strip%2?"#54e5ed":"#ff2f81";
        ctx.fillRect((strip%3)*18,y,w-(strip%4)*42,9);
        ctx.fillStyle="rgba(20,5,40,.55)";
        ctx.fillRect(((strip+1)%4)*24,y+13,w*.55,5);
      }
      ctx.globalAlpha=.22;ctx.fillStyle="#fffdf8";
      for(var scan=0;scan<h;scan+=12)ctx.fillRect(0,scan,w,2);
      ctx.restore();
    }
    if(effectIds.indexOf("deepfried")!==-1){
      ctx.save();
      ctx.globalCompositeOperation="overlay";
      ctx.fillStyle="rgba(255,42,40,.58)";ctx.fillRect(0,0,w,h);
      ctx.globalCompositeOperation="screen";
      ctx.fillStyle="rgba(255,220,68,.28)";ctx.fillRect(0,0,w,h);
      ctx.globalCompositeOperation="source-over";
      for(var n=0;n<130;n++){ctx.fillStyle=n%3?"rgba(30,0,40,.3)":"rgba(255,240,120,.38)";ctx.fillRect((n*83)%w,(n*47)%h,2+(n%3),2+(n%2));}
      ctx.restore();
    }
    if(effectIds.indexOf("sad")!==-1){
      ctx.save();
      ctx.fillStyle="rgba(36,56,130,.3)";ctx.fillRect(0,0,w,h);
      var vignette=ctx.createRadialGradient(w/2,h/2,140,w/2,h/2,520);
      vignette.addColorStop(0,"transparent");vignette.addColorStop(1,"rgba(12,11,54,.78)");
      ctx.fillStyle=vignette;ctx.fillRect(0,0,w,h);
      ctx.strokeStyle="rgba(174,215,255,.62)";ctx.lineWidth=4;
      for(var rain=0;rain<24;rain++){var rx=(rain*71)%w;ctx.beginPath();ctx.moveTo(rx,80+(rain%5)*40);ctx.lineTo(rx-20,145+(rain%5)*40);ctx.stroke();}
      ctx.restore();
    }
    if(effectIds.indexOf("rainbow")!==-1){
      ctx.save();ctx.globalAlpha=.36;
      ["#ff4f91","#ffcf40","#b7ef4e","#54e5ed","#9259d8"].forEach(function(color,index){ctx.fillStyle=color;ctx.fillRect(index*w/5,0,w/5,h);});
      ctx.globalAlpha=.8;ctx.strokeStyle="#fffdf8";ctx.lineWidth=12;ctx.beginPath();ctx.arc(w/2,h+100,390,Math.PI,Math.PI*2);ctx.stroke();
      ctx.restore();
    }
  }

  function drawCaption(caption){
    var value=String(caption||"").trim();
    if(!value)return;
    var w=canvas.width,h=canvas.height,maxWidth=w-92;
    ctx.save();
    ctx.font="1000 38px 'Trebuchet MS',sans-serif";
    ctx.textAlign="center";ctx.textBaseline="middle";
    var words=value.split(/\s+/),lines=[],line="";
    words.forEach(function(word){
      var next=line?line+" "+word:word;
      if(ctx.measureText(next).width>maxWidth&&line){lines.push(line);line=word;}else line=next;
    });
    if(line)lines.push(line);
    lines=lines.slice(0,2);
    var lineHeight=48,padX=24,padY=16,maxLineWidth=Math.max.apply(null,lines.map(function(text){return ctx.measureText(text).width;})),boxW=Math.min(maxWidth+padX*2,Math.max(240,maxLineWidth+padX*2)),boxH=lines.length*lineHeight+padY*2;
    var x=w/2,y=78;
    roundedRect(ctx,x-boxW/2,y-boxH/2,boxW,boxH,18);
    ctx.fillStyle="#fffdf8";ctx.fill();ctx.strokeStyle="#26133f";ctx.lineWidth=6;ctx.stroke();
    ctx.fillStyle="#30165c";
    lines.forEach(function(text,index){ctx.fillText(text,x,y-boxH/2+padY+lineHeight/2+index*lineHeight);});
    ctx.restore();
  }
  function renderCanvas(){
    if(!canvas||!ctx||!api.state)return;
    var s=api.state, bg=BACKGROUNDS.find(function(item){return item.id===s.background;})||BACKGROUNDS[0], character=CHARACTERS.find(function(item){return item.id===s.character;})||CHARACTERS[0];
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.save();
    var zoom=s.effects.indexOf("zoom")!==-1, shake=s.effects.indexOf("shake")!==-1;
    var scale=zoom?1.16:1, offset=shake?7:0;
    ctx.translate(canvas.width*(1-scale)/2+offset,canvas.height*(1-scale)/2-offset);
    ctx.scale(scale,scale);
    drawBackground(bg);drawCharacter(character,s.pose);drawItems(s.items);
    ctx.restore();
    drawCanvasEffects(s.effects);
    drawCaption(s.caption);
    document.getElementById("step-number").textContent = s.effects.length ? "4" : s.items.length ? "3" : s.character !== CHARACTERS[0].id ? "2" : "1";
  }
})();