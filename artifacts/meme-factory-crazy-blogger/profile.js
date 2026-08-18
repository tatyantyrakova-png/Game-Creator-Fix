(function(){
  "use strict";
  window.MemeFactory=window.MemeFactory||{};
  var api=window.MemeFactory;
  var PROFILE_KEY="meme_factory_profile";
  var avatarColors=["#ffd83d","#54e5ed","#b7ef4e","#ff8bbf","#9259d8"];
  var levelNames=["Новичок","Автор","Идейник","Трендсеттер","Мем-мейкер","Звезда ленты","Хайп-магнит","Гуру вайба","Легенда","Мем-бог"];
  var defaultProfile={
    nickname:"МемЛорд",
    avatarColor:"#ffd83d",
    xp:0,
    followers:0,
    views:0,
    likes:0,
    comments:0,
    posts:0,
    bestViews:0,
    bestScore:0,
    lastPost:"",
    recentPosts:[]
  };

  function loadProfile(){
    try{
      var saved=JSON.parse(localStorage.getItem(PROFILE_KEY)||"null");
      if(saved)return Object.assign({},defaultProfile,saved,{recentPosts:Array.isArray(saved.recentPosts)?saved.recentPosts:[]});
    }catch(error){}
    return Object.assign({},defaultProfile,{recentPosts:[]});
  }

  function $(id){return document.getElementById(id);}
  function formatCount(value){
    if(value>=1000000)return (value/1000000).toFixed(value<10000000?1:0)+"M";
    if(value>=1000)return (value/1000).toFixed(value<10000?1:0)+"K";
    return String(Math.round(value||0));
  }
  function initials(name){
    var clean=String(name||"МемЛорд").trim();
    return (clean.slice(0,2)||"М").toUpperCase();
  }
  function levelForXp(xp){
    return Math.min(10,Math.floor(Math.max(0,xp)/100)+1);
  }
  function xpInLevel(xp){
    return Math.max(0,xp)%100;
  }
  function levelName(level){return levelNames[Math.max(0,Math.min(9,level-1))];}

  api.profile=loadProfile();
  api.saveProfile=function(){try{localStorage.setItem(PROFILE_KEY,JSON.stringify(api.profile));}catch(error){}};
  api.resetProfile=function(){
    api.profile=Object.assign({},defaultProfile,{recentPosts:[]});
    api.saveProfile();
    renderProfile();
  };
  api.getProfileLevel=function(){return levelForXp(api.profile.xp);};
  api.recordPost=function(stats){
    if(!stats)return;
    var profile=api.profile;
    var score=Number(stats.score)||0;
    var views=Number(stats.views)||0;
    var likes=Number(stats.likes)||0;
    var comments=Math.max(1,Math.round(views*.012));
    var followersGain=Math.max(4,Math.round(score/2500)+Math.min(5,api.state&&api.state.items?api.state.items.length:0)*2);
    var xpGain=Math.max(20,Math.round(score/500));
    var levelBefore=levelForXp(profile.xp);
    var post={
      title:((window.CHARACTERS||[]).find(function(item){return api.state&&item.id===api.state.character;})||{label:"Новый мем"}).label,
      views:views,
      likes:likes,
      score:score,
      followers:followersGain,
      createdAt:"только что"
    };
    profile.xp+=xpGain;
    profile.followers+=followersGain;
    profile.views+=views;
    profile.likes+=likes;
    profile.comments+=comments;
    profile.posts+=1;
    profile.bestViews=Math.max(profile.bestViews,views);
    profile.bestScore=Math.max(profile.bestScore,score);
    profile.lastPost=post.title;
    profile.recentPosts.unshift(post);
    profile.recentPosts=profile.recentPosts.slice(0,5);
    api.saveProfile();
    renderProfile();
    if(levelForXp(profile.xp)>levelBefore&&api.toast)api.toast("НОВЫЙ УРОВЕНЬ! "+levelName(levelForXp(profile.xp)));
  };

  function setText(id,value){var node=$(id);if(node)node.textContent=value;}
  function paintAvatar(id){
    var node=$(id);
    if(!node)return;
    node.textContent=initials(api.profile.nickname);
    node.style.backgroundColor=api.profile.avatarColor;
  }

  function renderRecentPosts(){
    var host=$("profile-recent-posts"),posts=api.profile.recentPosts||[];
    if(!host)return;
    host.innerHTML="";
    if(!posts.length){
      host.innerHTML='<p class="profile-empty">Сними первый тренд, и он появится здесь.</p>';
      return;
    }
    posts.forEach(function(post){
      var row=document.createElement("article");
      row.className="recent-post";
      row.innerHTML='<div class="recent-post-mark">▶</div><div class="recent-post-copy"><b>'+post.title+'</b><small>'+formatCount(post.views)+' просмотров · '+formatCount(post.likes)+' лайков</small></div><strong>+'+post.followers+'</strong>';
      host.appendChild(row);
    });
  }

  function renderProfile(){
    var profile=api.profile||defaultProfile,level=levelForXp(profile.xp),currentXp=xpInLevel(profile.xp);
    setText("profile-display-name",String(profile.nickname).toUpperCase());
    setText("profile-level-copy","Уровень "+level+" · "+levelName(level));
    setText("profile-xp-copy",level>=10?"МАКСИМАЛЬНЫЙ УРОВЕНЬ":currentXp+" / 100 XP");
    setText("profile-followers",formatCount(profile.followers));
    setText("profile-level",level);
    setText("profile-level-label",levelName(level));
    setText("profile-posts",profile.posts);
    setText("profile-best-views",formatCount(profile.bestViews));
    setText("profile-total-views",formatCount(profile.views));
    setText("profile-total-likes",formatCount(profile.likes));
    setText("profile-total-comments",formatCount(profile.comments));
    setText("profile-average-score",formatCount(profile.posts?Math.round(profile.bestScore/profile.posts):0));
    setText("profile-last-post",profile.lastPost||"—");
    setText("profile-last-post-meta",profile.lastPost?"последняя публикация":"ещё не создан");
    setText("profile-posts-count",profile.posts+" "+(profile.posts===1?"запись":"записей"));
    var bar=$("profile-xp-bar");if(bar)bar.style.width=(level>=10?100:currentXp)+"%";
    setText("menu-profile-name",String(profile.nickname).toUpperCase());
    setText("menu-profile-followers",formatCount(profile.followers)+" подписчиков");
    paintAvatar("profile-avatar");paintAvatar("menu-profile-avatar");paintAvatar("editor-profile-avatar");
    renderRecentPosts();
  }

  function showProfileTab(tab){
    document.querySelectorAll(".profile-tab").forEach(function(button){button.classList.toggle("is-selected",button.dataset.profileTab===tab);});
    document.querySelectorAll(".profile-panel").forEach(function(panel){panel.classList.toggle("is-active",panel.dataset.profilePanel===tab);});
  }
  function openEdit(){
    var modal=$("profile-name-modal"),input=$("profile-name-input");
    if(!modal||!input)return;
    input.value=api.profile.nickname;
    modal.hidden=false;
    window.setTimeout(function(){input.focus();input.select();},30);
    if(api.tap)api.tap();
  }
  function closeEdit(){$("profile-name-modal").hidden=true;}
  function saveName(){
    var input=$("profile-name-input"),value=String(input&&input.value||"").trim().replace(/[<>]/g,"").slice(0,16);
    if(!value){if(api.toast)api.toast("Придумай ник для канала");return;}
    api.profile.nickname=value;
    api.saveProfile();renderProfile();closeEdit();
    if(api.toast)api.toast("Ник сохранён!");
    if(api.tap)api.tap();
  }
  function cycleAvatar(){
    var index=avatarColors.indexOf(api.profile.avatarColor);
    api.profile.avatarColor=avatarColors[(index+1)%avatarColors.length];
    api.saveProfile();renderProfile();
    if(api.tap)api.tap();
  }

  api.openProfile=function(){renderProfile();if(api.showScreen)api.showScreen("profile");if(api.tap)api.tap();};
  api.initProfile=function(){
    ["menu-profile","menu-profile-action","editor-profile"].forEach(function(id){var node=$(id);if(node)node.addEventListener("click",api.openProfile);});
    var home=$("profile-home");if(home)home.addEventListener("click",function(){api.showScreen("menu");api.tap();});
    var settings=$("profile-settings");if(settings)settings.addEventListener("click",api.openSettings);
    document.querySelectorAll(".profile-tab").forEach(function(button){button.addEventListener("click",function(){showProfileTab(button.dataset.profileTab);api.tap();});});
    $("profile-edit-button").addEventListener("click",openEdit);
    $("profile-avatar-button").addEventListener("click",cycleAvatar);
    $("profile-edit-close").addEventListener("click",closeEdit);
    $("profile-name-save").addEventListener("click",saveName);
    $("profile-name-input").addEventListener("keydown",function(event){if(event.key==="Enter")saveName();});
    $("profile-name-modal").addEventListener("click",function(event){if(event.target===this)closeEdit();});
    renderProfile();
  };
})();