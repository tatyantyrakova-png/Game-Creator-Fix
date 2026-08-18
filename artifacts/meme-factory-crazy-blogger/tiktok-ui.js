(function(){
  "use strict";
  window.MemeFactory=window.MemeFactory||{};var api=window.MemeFactory;
  var growthFrame=0,growthTimer=0,phaseTimer1=0,phaseTimer2=0,commentTimer=0,milestones=[];
  var pushMessages=["🔥 Мем попал в рекомендации!","👤 @memelord подписался на вас","📈 +10K просмотров за минуту!","💬 Новый комментарий: «Жиза 😂»"];
  function formatCount(value){
    if(value>=1000000)return (value/1000000).toFixed(value<10000000?1:0)+"M";
    if(value>=1000)return (value/1000).toFixed(value<10000?1:0)+"K";
    return Math.round(value).toString();
  }
  function viralScore(){
    var state=api.state||{},items=Math.min(5,Array.isArray(state.items)?state.items.length:0);
    var score=10000+(items*5000);
    if((state.effects||[]).indexOf("glitch")!==-1||(state.effects||[]).indexOf("deepfried")!==-1)score*=3;
    return score;
  }
  function targetStats(){
    var score=viralScore(),views=score>=35000?score*16:score;
    return {score:score,views:views,likes:Math.round(views*(340000/1200000))};
  }
  function commentsFor(views){
    if(views<20000)return VIRAL_COMMENT_SETS.low;
    if(views<=100000)return VIRAL_COMMENT_SETS.medium;
    return VIRAL_COMMENT_SETS.high;
  }
  function showPush(message){
    var host=document.getElementById("push-notifications");if(!host)return;
    var note=document.createElement("div");note.className="push-note";note.textContent=message||pushMessages[Math.floor(Math.random()*pushMessages.length)];host.appendChild(note);
    setTimeout(function(){note.classList.add("is-leaving");setTimeout(function(){if(note.parentNode)note.parentNode.removeChild(note);},450);},2200);
  }
  function confetti(){
    var layer=document.getElementById("confetti-layer");if(!layer)return;
    var colors=["#ff4f91","#ffd83d","#54e5ed","#b7ef4e","#fffdf8"];
    for(var i=0;i<36;i++){
      var bit=document.createElement("i");bit.style.setProperty("--x",(Math.random()*100)+"vw");bit.style.setProperty("--r",(Math.random()*720-360)+"deg");bit.style.setProperty("--c",colors[i%colors.length]);bit.style.setProperty("--d",(Math.random()*.35)+"s");layer.appendChild(bit);
      setTimeout(function(node){return function(){if(node.parentNode)node.parentNode.removeChild(node);};}(bit),1800);
    }
  }
  function milestone(value){
    var screen=document.getElementById("result-screen"),video=document.getElementById("reel-video-wrap");
    if(milestones.indexOf(value)!==-1)return;milestones.push(value);
    if(screen)screen.classList.add("milestone-flash");if(video)video.classList.add("milestone-pop");
    api.ding();confetti();api.toast(value===1000?"ПЕРВАЯ ТЫСЯЧА! 🔥":value===10000?"ДЕСЯТЬ ТЫСЯЧ! 📈":"СТО ТЫСЯЧ! ЛЕГЕНДА 🏆");
    setTimeout(function(){if(screen)screen.classList.remove("milestone-flash");if(video)video.classList.remove("milestone-pop");},850);
  }
  function setPhase(text){
    var node=document.getElementById("viral-phase");if(node)node.textContent=text;
  }
  function setGrowthHint(text){
    var node=document.getElementById("growth-next-copy");if(node)node.textContent=text;
  }
  function setStats(views,likes){
    var viewNode=document.getElementById("views-count"),likeNode=document.getElementById("like-count");
    if(viewNode)viewNode.textContent=formatCount(views);
    if(likeNode)likeNode.textContent=formatCount(likes);
  }
  api.calculateChaosScore=viralScore;
  api.getViralStats=targetStats;
  api.stopGrowth=function(){
    cancelAnimationFrame(growthFrame);clearInterval(growthTimer);clearTimeout(phaseTimer1);clearTimeout(phaseTimer2);
    growthFrame=0;growthTimer=0;phaseTimer1=0;phaseTimer2=0;milestones=[];
    var badge=document.getElementById("viral-badge"),screen=document.getElementById("result-screen"),growth=document.getElementById("viral-growth"),host=document.getElementById("push-notifications"),stamp=document.getElementById("hype-stamp"),video=document.getElementById("reel-video-wrap");
    if(badge)badge.hidden=true;if(stamp)stamp.hidden=true;
    if(screen)screen.classList.remove("legendary","milestone-flash","viral-finale");
    if(growth)growth.classList.remove("growth-complete");
    if(video)video.classList.remove("milestone-pop","viral-shake");
    if(host)host.innerHTML="";setPhase("● ЗАГРУЗКА...");
  };
  api.startGrowth=function(){
    api.stopGrowth();
    var stats=targetStats(),start=performance.now(),duration=8000,intermediate=Math.max(120,stats.views*.32);
     var countNode=document.getElementById("views-count"),scoreNode=document.getElementById("chaos-score"),bar=document.getElementById("growth-progress"),badge=document.getElementById("viral-badge"),screen=document.getElementById("result-screen"),growth=document.getElementById("viral-growth"),stamp=document.getElementById("hype-stamp"),video=document.getElementById("reel-video-wrap");
    if(scoreNode)scoreNode.textContent="ВИРУСНОСТЬ "+formatCount(stats.score);
    if(bar)bar.style.width="0%";if(badge){badge.textContent="👑 МЕМ-БОГ";badge.hidden=stats.views<=100000;}
    if(screen)screen.classList.toggle("legendary",stats.views>100000);
    setStats(12,1);setPhase("● ЗАГРУЗКА...");
    phaseTimer1=setTimeout(function(){
      setPhase("● СЧЁТЧИК РАЗГОНЯЕТСЯ");
      showPush("🔥 Мем попал в рекомендации!");
    },2000);
    phaseTimer2=setTimeout(function(){
      setPhase("● ХАЙП НА ПИКЕ");
      if(screen)screen.classList.add("viral-finale");if(video)video.classList.add("viral-shake");if(stamp)stamp.hidden=false;
      confetti();api.ding();api.vibrate(50);
    },5000);
    function tick(now){
      var elapsed=now-start,progress=Math.min(1,elapsed/duration),views=12,likes=1,barProgress=progress;
      if(elapsed<2000){
        var p=elapsed/2000;views=12+108*p;likes=1+Math.round(p*3);barProgress=p*.12;
      }else if(elapsed<5000){
        var p2=(elapsed-2000)/3000,ease2=1-Math.pow(1-p2,2);views=120+(intermediate-120)*ease2;likes=4+Math.round((stats.likes*.22-4)*ease2);barProgress=.12+p2*.34;
      }else{
        var p3=(elapsed-5000)/3000,ease3=1-Math.pow(1-p3,3);views=intermediate+(stats.views-intermediate)*ease3;likes=Math.max(1,Math.round(stats.likes*.22+(stats.likes-stats.likes*.22)*ease3));barProgress=.46+p3*.54;
      }
      if(countNode)countNode.textContent=formatCount(views);var likeNode=document.getElementById("like-count");if(likeNode)likeNode.textContent=formatCount(likes);
      if(bar)bar.style.width=(barProgress*100)+"%";
      if(views>=1000)milestone(1000);if(views>=10000)milestone(10000);if(views>=100000)milestone(100000);
      if(progress<1)growthFrame=requestAnimationFrame(tick);
      else{
        setStats(stats.views,stats.likes);if(bar)bar.style.width="100%";setPhase("● ВИРУСНЫЙ ФИНИШ");
        setGrowthHint("РАЗГОН ЗАВЕРШЁН! Выбирай: отправить мем или снять новый.");
        if(growth)growth.classList.add("growth-complete");
        var nextButton=document.getElementById("new-meme-button");if(nextButton)nextButton.classList.add("is-recommended");
       if(api.recordPost)api.recordPost(stats);
     }
    }
    growthFrame=requestAnimationFrame(tick);
  };
  api.renderResult=function(){
    var source=document.getElementById("meme-canvas"),result=document.getElementById("result-canvas"),ctx=result.getContext("2d");
    ctx.clearRect(0,0,result.width,result.height);ctx.drawImage(source,0,0);
    api.applyEffects(document.getElementById("reel-video-wrap"),api.state.effects);
    var stats=targetStats(),commentTexts=commentsFor(stats.views),comments=document.getElementById("fake-comments");
    setGrowthHint("Мем опубликован — просмотры разгоняются.");
    var nextButton=document.getElementById("new-meme-button");if(nextButton)nextButton.classList.remove("is-recommended");
    if(comments){
      clearInterval(commentTimer);
      var cursor=0;
      function paintComments(){
        comments.innerHTML="";
        var visible=commentTexts.slice(cursor,cursor+5);
        if(visible.length<5)visible=visible.concat(commentTexts.slice(0,5-visible.length));
        visible.forEach(function(text,index){
          var row=document.createElement("div");row.className="fake-comment";row.dataset.testid="comment-"+((cursor+index)%commentTexts.length);row.style.animationDelay=(index*.08)+"s";
          var user=document.createElement("span");user.className="comment-user";user.textContent=FAKE_USERNAMES[(cursor+index)%FAKE_USERNAMES.length];
          var body=document.createElement("span");body.className="comment-text";body.textContent=text;
          row.appendChild(user);row.appendChild(body);comments.appendChild(row);
        });
        cursor=(cursor+1)%commentTexts.length;
      }
      paintComments();
      commentTimer=window.setInterval(paintComments,3600);
    }
    var likeNode=document.getElementById("like-count");if(likeNode)likeNode.textContent="1";
    var commentsCount=document.getElementById("comments-count");if(commentsCount)commentsCount.textContent=commentTexts.length.toString();
    var link=document.getElementById("share-url");if(link)link.textContent="memefactory.fun/m/"+(api.state.character||"LOL").toUpperCase()+"-2026";
  };
  api.initTikTok=function(){
    document.querySelectorAll(".engage-button").forEach(function(button){button.addEventListener("click",function(){button.classList.toggle("is-pressed");api.tap();if(button.dataset.testid==="button-like"){button.setAttribute("aria-pressed",button.classList.contains("is-pressed")?"true":"false");button.setAttribute("aria-label",button.classList.contains("is-pressed")?"Убрать лайк":"Поставить лайк");button.setAttribute("title",button.classList.contains("is-pressed")?"Убрать лайк":"Поставить лайк");api.toast(button.classList.contains("is-pressed")?"Лайк улетел!":"Лайк снят");}else if(button.dataset.testid==="button-comments")api.toast("Комментарии уже кричат от восторга!");});});
    document.getElementById("follow-button").addEventListener("click",function(){this.classList.toggle("is-following");this.textContent=this.classList.contains("is-following")?"ВЫ ПОДПИСАНЫ":"ПОДПИСАТЬСЯ";api.tap();});
  };
})();