(function(){
  var $=function(i){return document.getElementById(i)};
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* balon membentuk hati */
  var cols=['#ff4d79','#ff8fab','#ffb347','#ffd9a0','#e83e8c','#f3efe8'],g=$('bal'),NS='http://www.w3.org/2000/svg',n=78;
  var pts=[];
  for(var i=0;i<n;i++){
    var t=Math.random()*Math.PI*2,r=Math.sqrt(Math.random())*(0.35+0.65*Math.random()+0.2);r=Math.min(r,1);
    var hx=16*Math.pow(Math.sin(t),3),hy=13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t);
    pts.push({x:200+hx*r*8.6,y:165-hy*r*8.6,s:i});
  }
  pts.sort(function(a,b){return b.y-a.y});
  pts.forEach(function(p,k){
    var o=document.createElementNS(NS,'g');o.setAttribute('transform','translate('+p.x.toFixed(1)+' '+p.y.toFixed(1)+')');
    var b=document.createElementNS(NS,'g');b.setAttribute('class','b');b.style.setProperty('--d',(1.9+k*0.03).toFixed(2)+'s');
    var c=document.createElementNS(NS,'ellipse');c.setAttribute('rx',9);c.setAttribute('ry',11);c.setAttribute('fill',cols[k%cols.length]);
    var h=document.createElementNS(NS,'ellipse');h.setAttribute('cx',-3);h.setAttribute('cy',-4);h.setAttribute('rx',2.2);h.setAttribute('ry',3.2);h.setAttribute('fill','#fff');h.setAttribute('opacity','.5');
    b.appendChild(c);b.appendChild(h);o.appendChild(b);g.appendChild(o);
  });

  /* alur */
  var intro=$('intro'),app=$('app');
  intro.addEventListener('click',function(){
    app.hidden=false;window.scrollTo(0,0);
    requestAnimationFrame(function(){app.classList.add('go');intro.classList.add('off');burst(60,.5)});
    setTimeout(function(){intro.hidden=true},reduce?0:850);
  });

  /* foto lokal */
  document.querySelectorAll('.tile input').forEach(function(inp){
    inp.addEventListener('change',function(){
      var f=inp.files&&inp.files[0];if(!f)return;
      var tile=inp.parentNode;tile.style.backgroundImage='url('+URL.createObjectURL(f)+')';tile.classList.add('has');
    });
  });

  /* hadiah */
  var modal=$('modal'),claimed=false;
  $('gift').addEventListener('click',function(){modal.hidden=false;$('claim').focus()});
  $('claim').addEventListener('click',function(){
    if(!claimed){
      claimed=true;$('mt').textContent='Selamat, kamu menang';
      $('mp').textContent='Satu kali traktir makan malam. Kamu yang pilih tempatnya.';
      $('claim').textContent='Tutup';burst(140,.45);
    }else{modal.hidden=true}
  });
  modal.addEventListener('click',function(e){if(e.target===modal)modal.hidden=true});
  addEventListener('keydown',function(e){if(e.key==='Escape')modal.hidden=true});

  /* konfeti */
  var cv=$('c'),ctx=cv.getContext('2d'),P=[],raf=null,cc=['#ff4d79','#ff8fab','#ffb347','#ffd9a0','#f3efe8'];
  function size(){cv.width=innerWidth*devicePixelRatio;cv.height=innerHeight*devicePixelRatio}
  size();addEventListener('resize',size);
  function burst(num,yy){
    if(reduce)return;var d=devicePixelRatio;
    for(var i=0;i<num;i++)P.push({x:cv.width/2,y:cv.height*yy,vx:(Math.random()-.5)*14*d,vy:(-Math.random()*13-3)*d,s:(Math.random()*6+3)*d,r:Math.random()*6,vr:(Math.random()-.5)*.3,c:cc[i%5],l:1});
    if(!raf)loop();
  }
  function loop(){
    ctx.clearRect(0,0,cv.width,cv.height);
    P=P.filter(function(p){return p.l>0&&p.y<cv.height+40});
    P.forEach(function(p){
      p.x+=p.vx;p.y+=p.vy;p.vy+=.32*devicePixelRatio;p.vx*=.99;p.r+=p.vr;p.l-=.006;
      ctx.save();ctx.globalAlpha=Math.max(p.l,0);ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.fillStyle=p.c;ctx.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);ctx.restore();
    });
    raf=P.length?requestAnimationFrame(loop):null;
  }
})();
