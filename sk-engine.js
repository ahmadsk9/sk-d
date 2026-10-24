/* SK engine: محرك تصميم الدعوات (مشترك بين sk-order.html و sk-admin.html) */
function esc(s){return s.replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}

function fmtDate(v){if(!v)return"";return new Date(v+"T00:00:00").toLocaleDateString("ar-u-nu-latn",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
var HN=["","الأولى","الثانية","الثالثة","الرابعة","الخامسة","السادسة","السابعة","الثامنة","التاسعة","العاشرة","الحادية عشرة","الثانية عشرة"];
function fmtTime(v){
 if(!v)return"";var p=v.split(":"),h=+p[0],m=+p[1],pe=h>=12?"مساءً":"صباحاً",h12=h%12||12;
 if(m===0)return HN[h12]+" "+pe;
 if(m===30)return HN[h12]+" والنصف "+pe;
 if(m===15)return HN[h12]+" والربع "+pe;
 if(m===45)return HN[h12%12+1]+" إلا ربعاً "+pe;
 return HN[h12]+" و"+m+" دقيقة "+pe}


/* محرك التصميم (من صانع الدعوات) */
var S={type:"wedding",n1:"",n2:"",p1:"",p2:"",date:"",dt:"",time:"",venue:"",addr:"",map:"",wa:"",intro:"",br:"SK",bw:"",fx:"none",tp:"classic",am:"none",nf:"ruqaa",story:"",gal:[],th:0,cc:"#7a4fb0",dk:false,bg:"",ph:""};
var TYPES={
 wedding:{pl1:"والد العريس",pl2:"والد العروس",n:"حفل زفاف",two:1,l1:"اسم العريس",l2:"اسم العروس",b:"﷽",t:"يتشرف أهل العروسين بدعوتكم لحضور حفل زفافهما، سائلين الله لهما حياة سعيدة، ولكم دوام الفرح والمسرات."},
 engage:{pl1:"والد الخطيب",pl2:"والد الخطيبة",n:"حفل خطوبة",two:1,l1:"اسم الخطيب",l2:"اسم الخطيبة",b:"﷽",t:"يسرّنا دعوتكم لمشاركتنا فرحة الخطوبة، وتشريفنا بحضوركم الكريم."},
 katb:{pl1:"والد العريس",pl2:"والد العروس",n:"حفل كتب كتاب",two:1,l1:"اسم العريس",l2:"اسم العروس",b:"﷽",t:"يتشرف أهل العروسين بدعوتكم لحضور حفل عقد القران، وتقاسم الفرحة معهم."},
 henna:{pl1:"والد العروس",pl2:"والدة العروس",n:"ليلة الحنّاء",two:0,l1:"اسم العروس",b:"✦",t:"تتشرف أسرة العروس بدعوتكم لحضور ليلة الحنّاء، لتكتمل فرحتنا بوجودكم."},
 grad:{pl1:"والد الخريج",pl2:"والدة الخريج",n:"حفل تخرج",two:0,l1:"اسم الخريج",b:"✦",t:"يسرّنا دعوتكم لمشاركتنا فرحة التخرج، وتشريفنا بحضوركم الكريم."},
 baby:{pl1:"الأب",pl2:"الأم",n:"استقبال مولود",two:0,l1:"اسم المولود",b:"✦",t:"بكل الحب والامتنان نتشرف بدعوتكم للاحتفال معنا بقدوم مولودنا الجديد."}
};
// [اسم، خلفية الغلاف، لون نص الغلاف، لون التمييز، خلفية الأقسام، نص الأقسام]
var TH=[
 ["#cdb4ea","radial-gradient(ellipse at 15% 10%,#efe6fa,transparent 55%),radial-gradient(ellipse at 85% 85%,#b89bdc,transparent 60%),linear-gradient(160deg,#ddd0f0,#b79ad8)","#3a2557","#7a4fb0","#faf6fd","#3a2f4a"],
 ["#d9b25f","radial-gradient(ellipse at 15% 10%,#fff,transparent 55%),linear-gradient(160deg,#f8eed3,#e0c685)","#4a3a14","#a67c1f","#fffdf7","#40351c"],
 ["#6fae8f","radial-gradient(ellipse at 15% 10%,#f0faf4,transparent 55%),linear-gradient(160deg,#dcefe4,#9fc9b0)","#17372a","#2f7d5b","#f6fbf8","#22392e"],
 ["#d8708f","radial-gradient(ellipse at 15% 10%,#fff4f7,transparent 55%),linear-gradient(160deg,#fbe3e9,#e8a9bb)","#4a1f2f","#b9476a","#fff7f9","#472733"],
 ["#d4af37","linear-gradient(160deg,#1f3150,#0c1320)","#f1ead8","#d4af37","#10192a","#e8e1cf",true],
 ["#e8b4a0","linear-gradient(160deg,#fbeee6,#efc9b8)","#4a2a22","#b76e4f","#fffaf6","#4a3029"],
 ["#2e7d6b","linear-gradient(160deg,#0f2a24,#06140f)","#e8f1ec","#d9b86a","#0b1f1a","#e3eee8",true],
 ["#7a2a3c","linear-gradient(160deg,#3a0f1c,#1a060c)","#f4e6d8","#e2b867","#230a12","#f1e4d6",true],
 ["#8fb8e0","linear-gradient(160deg,#e3f0fb,#a9cdee)","#17304a","#3b78b4","#f5faff","#23364a"],
 ["#b9b4a6","linear-gradient(160deg,#f6f5f1,#dcdad2)","#22221e","#8a6d3b","#fcfcfa","#2e2e2a"],
 ["#8a7a4a","linear-gradient(160deg,#1c1c1c,#050505)","#f3ead2","#d4af37","#0d0d0d","#eee6d0",true]
];
function hx(h,s,l){s/=100;l/=100;var a=s*Math.min(l,1-l),f=function(n){var k=(n+h/30)%12,c=l-a*Math.max(-1,Math.min(k-3,9-k,1));return Math.round(255*c).toString(16).padStart(2,"0")};return"#"+f(0)+f(8)+f(4)}
function hs(c){var r=parseInt(c.slice(1,3),16)/255,g=parseInt(c.slice(3,5),16)/255,b=parseInt(c.slice(5,7),16)/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn,h=0,l=(mx+mn)/2,s=d?d/(1-Math.abs(2*l-1)):0;if(d){h=mx==r?((g-b)/d)%6:mx==g?(b-r)/d+2:(r-g)/d+4;h=Math.round(h*60);if(h<0)h+=360}return[h,Math.max(35,Math.min(70,Math.round(s*100)))]}
function pal(S){if(S.th!=="c")return TH[S.th];var q=hs(S.cc),H=q[0],t=q[1];
 return S.dk?[hx(H,t,60),"linear-gradient(160deg,"+hx(H,40,17)+","+hx(H,45,7)+")",hx(H,30,90),hx(H,t,62),hx(H,40,9),hx(H,25,88),true]:
 [hx(H,t,72),"radial-gradient(ellipse at 15% 10%,"+hx(H,60,96)+",transparent 55%),radial-gradient(ellipse at 85% 85%,"+hx(H,t,70)+",transparent 60%),linear-gradient(160deg,"+hx(H,50,89)+","+hx(H,t,73)+")",hx(H,45,17),hx(H,t,38),hx(H,50,97),hx(H,25,22),false]}
function lum(c){var v=[1,3,5].map(function(i){var x=parseInt(c.substr(i,2),16)/255;return x<=.03928?x/12.92:Math.pow((x+.055)/1.055,2.4)});return .2126*v[0]+.7152*v[1]+.0722*v[2]}
function build(S,nofx){
 var T=TYPES[S.type],h=pal(S),img=!!S.bg,bt=lum(h[3])>.4?"#1d1630":"#ffffff";
 var ht=img?"#fff":h[2],ac=img?"#f3dfa2":h[3],at=lum(ac)>.4?"#1d1630":"#ffffff";
 var hero=img?"linear-gradient(#0004,#000a),url("+S.bg+") center/cover fixed":"linear-gradient(115deg,transparent 28%,#ffffff40 46%,transparent 64%),"+h[1];
 var two=T.two&&S.n2;
 var flo="url(\"data:image/svg+xml,"+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='-60 -60 120 120'><g fill='"+ac+"' fill-opacity='.5'>"+[0,60,120,180,240,300].map(function(a){return"<ellipse rx='13' ry='30' cy='-27' transform='rotate("+a+")'/>"}).join("")+"</g><circle r='11' fill='"+ac+"'/></svg>")+"\")";
 var TP={classic:"",
 modern:`.t-modern .hero{align-items:flex-start;text-align:start;padding:80px 32px 60px}
.t-modern .hero:before,.t-modern .hero:after{display:none}
.t-modern .bis{font-size:18px;letter-spacing:8px;opacity:.8}.t-modern .intro{font-size:17px;max-width:420px;opacity:.85}
.t-modern .names{font-family:'Reem Kufi',sans-serif;font-weight:500;font-size:clamp(48px,15vw,92px);line-height:1.2}
.t-modern .and{display:inline;font-size:.45em;margin:0 .4em;font-family:'Reem Kufi',sans-serif}
.t-modern .line{width:80px;height:3px;margin:22px 0;background:${ac}}.t-modern .line:before,.t-modern .line:after,.t-modern .line span{display:none}
.t-modern .date{font-size:20px;letter-spacing:1px}.t-modern .cd{justify-content:flex-start}
.t-modern .cd div{border-radius:0;background:none;backdrop-filter:none;border-width:0 0 2px 0;box-shadow:none}
.t-modern .sec h2{font-family:'Reem Kufi',sans-serif;font-size:28px}.t-modern .sec h2:after{content:"";width:40px;height:3px;background:${h[3]};margin:10px auto 18px;font-size:0}
.t-modern .it{border-radius:6px;box-shadow:none;border-width:0 0 1px 0;background:none}.t-modern .btn{border-radius:6px;box-shadow:none}`,
 glass:`body.t-glass{background:var(--hb);background-attachment:fixed;color:${ht}}
.t-glass .hero{background:none}.t-glass .hero:before{inset:18px;border-radius:30px;border:1px solid #ffffff66}.t-glass .hero:after{display:none}
.t-glass .dc i{display:block;border-radius:50%;filter:blur(36px);opacity:.55;background:${ac};animation:fl 14s ease-in-out infinite alternate}
.t-glass .dc i:nth-child(1){width:220px;height:220px;top:-50px;right:-60px}
.t-glass .dc i:nth-child(2){width:180px;height:180px;bottom:8%;left:-70px;background:${h[0]};animation-delay:-4s}
.t-glass .dc i:nth-child(3){width:140px;height:140px;top:45%;right:10%;opacity:.35;animation-delay:-8s}.t-glass .dc i:nth-child(4){display:none}
@keyframes fl{to{transform:translate(30px,40px) scale(1.2)}}
.t-glass .it,.t-glass .cd div{background:#ffffff2e;backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid #ffffff66;box-shadow:0 8px 28px #0002}
.t-glass .it b{color:${ht}}.t-glass .it small,.t-glass .sec h2{color:${ac}}.t-glass .sec h2:after{color:${ac}}.t-glass footer{color:${ht}}`,
 floral:`.t-floral .hero:before{inset:16px;border-radius:34px;border:2px solid ${ac};opacity:.7}.t-floral .hero:after{inset:26px;border-radius:26px;border:1px dashed ${ac};opacity:.5}
.t-floral .dc i{display:block;position:absolute;background:${flo} center/contain no-repeat;opacity:.55;animation:sp 70s linear infinite}
.t-floral .dc i:nth-child(1){width:230px;height:230px;top:-70px;right:-70px}
.t-floral .dc i:nth-child(2){width:150px;height:150px;top:-40px;left:-40px;animation-direction:reverse;opacity:.4}
.t-floral .dc i:nth-child(3){width:240px;height:240px;bottom:-80px;left:-80px}
.t-floral .dc i:nth-child(4){width:130px;height:130px;bottom:-30px;right:-30px;animation-direction:reverse;opacity:.4}
@keyframes sp{to{transform:rotate(360deg)}}
.t-floral .it{border-radius:28px}.t-floral .btn{border-radius:50px}.t-floral .sec h2:after{content:"❀ ❀ ❀";font-size:14px;letter-spacing:6px}`,
 luxe:`.t-luxe .hero:before{inset:18px;border:1px solid ${ac};border-radius:0}.t-luxe .hero:after{inset:26px;border:1px solid ${ac};opacity:.35;border-radius:0}
.t-luxe .dc i{display:block;position:absolute;width:46px;height:46px;border:0 solid ${ac}}
.t-luxe .dc i:nth-child(1){top:30px;right:30px;border-width:3px 3px 0 0}.t-luxe .dc i:nth-child(2){top:30px;left:30px;border-width:3px 0 0 3px}
.t-luxe .dc i:nth-child(3){bottom:30px;right:30px;border-width:0 3px 3px 0}.t-luxe .dc i:nth-child(4){bottom:30px;left:30px;border-width:0 0 3px 3px}
.t-luxe .names{letter-spacing:2px;font-size:clamp(44px,12vw,72px)}.t-luxe .line{width:260px}
.t-luxe .line:before,.t-luxe .line:after{background:linear-gradient(90deg,transparent,${ac},#fff9,${ac},transparent);background-size:200% 100%;animation:sh 3s linear infinite}
@keyframes sh{to{background-position:-200% 0}}
.t-luxe .it,.t-luxe .cd div{border-radius:0;background:none;box-shadow:none;border:1px solid ${ac}}
.t-luxe .btn{border-radius:0;letter-spacing:1px;background:${ac};background-image:none;color:${at};box-shadow:none}.t-luxe .sec h2{letter-spacing:2px}`,
 arch:`.t-arch .hero:before,.t-arch .hero:after{display:none}
.t-arch .dc i:nth-child(1){display:block;position:absolute;width:260px;height:260px;border-radius:50%;background:${ac};opacity:.18;top:6%;left:50%;margin-left:-130px}
.t-arch .names{border:2px solid ${ac};border-radius:999px 999px 28px 28px;padding:64px 34px 26px;margin-top:22px;min-width:min(300px,86%);background:#ffffff1a;font-size:clamp(38px,11vw,60px)}
.t-arch .ph{width:190px;height:240px;border-radius:999px 999px 14px 14px;border-width:3px}
.t-arch .it{border-radius:22px 22px 4px 4px}.t-arch .sec h2:after{content:"◠";font-size:22px}`};
 var NF={katibeh:["Katibeh","'Katibeh'","clamp(58px,17vw,100px)","1.5"],lalezar:["Lalezar","'Lalezar'","clamp(46px,13vw,80px)","1.5"],rakkas:["Rakkas","'Rakkas'","clamp(46px,13vw,78px)","1.5"],gulzar:["Gulzar","'Gulzar'","clamp(40px,11vw,64px)","2.2"],ruqaa:[0,"'Aref Ruqaa'","clamp(46px,13vw,80px)","1.45"],reem:[0,"'Reem Kufi'","clamp(44px,12vw,72px)","1.4"],amiri:[0,"'Amiri'","clamp(46px,13vw,76px)","1.5"]}[S.nf];
 var nfq=NF&&NF[0]?"&family="+NF[0]:"";
 var nfcss=NF?"body .names,body .and{font-family:"+NF[1]+",'Amiri',serif!important}body .names{font-size:"+NF[2]+";line-height:"+NF[3]+";font-weight:700;text-shadow:0 1px 0 #ffffff80,0 3px 10px "+ac+"66}body .and{font-size:.42em;line-height:1.3;text-shadow:none}.pp .tz,.bkc .tz,.mid .tz,body .ov .tz{font-family:"+NF[1]+",'Amiri',serif}":"";
 var tcss=(TP[S.tp]||"")+nfcss;

 var fxh="";
 if(!nofx&&S.fx&&S.fx!=="none"){
  var nm0=esc(S.n1)+(two?'<i class="and">و</i>'+esc(S.n2):""),tz='<div class="tz">'+nm0+'</div><div class="ty">'+esc(T.n)+'</div>';
  if(S.fx==="env")fxh='<div id="ov" class="ov" data-fx="env"><div class="env"><div class="pp"><div class="tz">'+nm0+'</div></div><div class="fr"></div><div class="fl"></div><div class="sl">❖</div></div><div class="hn">اضغط لفتح الدعوة</div></div>';
  if(S.fx==="cur")fxh='<div id="ov" class="ov" data-fx="cur"><div class="cl"></div><div class="cl r"></div><div class="mid">'+tz+'<div class="hn">اضغط لفتح الستارة</div></div></div>';
  if(S.fx==="book")fxh='<div id="ov" class="ov" data-fx="book"><div class="bkw"><div class="bkp"><div class="tz">❖</div></div><div class="bkc"><div class="tz">'+nm0+'</div><div class="ty">'+esc(T.n)+'</div></div></div><div class="hn">اضغط لفتح الكتاب</div></div>';
  if(S.fx==="doors")fxh='<div id="ov" class="ov" data-fx="doors"><div class="dr"><b></b></div><div class="dr r"><b></b></div><div class="mid">'+tz+'<div class="hn">اضغط لفتح الأبواب</div></div></div>';
  if(S.fx==="seal")fxh='<div id="ov" class="ov" data-fx="seal"><div class="sb"><span>❖</span></div>'+tz+'<div class="hn">اضغط على الختم لفتح الدعوة</div></div>';
  if(S.fx==="slide")fxh='<div id="ov" class="ov" data-fx="slide">'+tz+'<div class="tk" id="tk"><span class="tt">اسحب لفتح الدعوة</span><div class="hd" id="hd">❖</div></div></div>';
  if(S.fx==="gate")fxh='<div id="ov" class="ov" data-fx="gate"><div class="gl"></div><div class="gd"><i></i></div><div class="gd r"><i></i></div><div class="mid">'+tz+'<div class="hn">اضغط لفتح البوابة</div></div></div>';
  if(S.fx==="env3")fxh='<div id="ov" class="ov" data-fx="env3"><div class="e3"><div class="e3c"><div class="tz">'+nm0+'</div><div class="ty">'+esc(T.n)+'</div></div><div class="e3b"></div><div class="e3f"></div><div class="e3l"></div><div class="e3s">❖</div></div><div class="hn">اضغط لفتح الظرف</div></div>';
  if(S.fx==="scroll")fxh='<div id="ov" class="ov" data-fx="scroll"><div class="scw"><div class="rod"></div><div class="sc"><div class="scin">'+tz+'</div></div><div class="rod"></div></div><div class="hn">اضغط لفتح الطومار</div></div>';
  if(S.fx==="box"){var cf="";for(var q=0;q<12;q++)cf+='<s style="--x:'+Math.round((q-5.5)*24)+'px;--y:'+(-150-(q%4)*38)+'px;--r:'+(q*65)+'deg;animation-delay:'+((q%3)*0.08)+'s"></s>';
   fxh='<div id="ov" class="ov" data-fx="box"><div class="bx">'+cf+'<div class="bxc">'+tz+'</div><div class="bxb"></div><div class="bxl"><span>❖</span></div></div><div class="hn">اضغط لفتح الهدية</div></div>'}
 }
 var names=esc(S.n1)+(two?'<i class="and">و</i>'+esc(S.n2):"");
 var C=JSON.stringify({dt:S.dt,wa:S.wa.replace(/\D/g,""),ev:T.n,names:S.n1+(two?" و"+S.n2:""),loc:S.venue+(S.addr?"، "+S.addr:""),am:S.am}).replace(/</g,"\\u003c");
 var rows=[["التاريخ",S.date],["الوقت",S.time],["المكان",S.venue],["العنوان",S.addr]].filter(function(r){return r[1]})
  .map(function(r){return '<div class="it"><small>'+r[0]+'</small><b>'+esc(r[1])+'</b></div>'}).join("");
 var story=S.story?'<section class="sec"><h2>قصتنا</h2><p class="st">'+esc(S.story)+'</p></section>':"";
 var gal=S.gal.length?'<section class="sec gsec"><h2>لحظاتنا</h2><div class="rail" id="rail">'+S.gal.map(function(g){return'<img alt="" src="'+g+'">'}).join("")+'</div><div class="dots" id="dots">'+S.gal.map(function(){return"<i></i>"}).join("")+'</div><p class="swh">اسحب لتتصفح الصور</p></section>':"";
 var cal=S.dt?'<a class="btn out" id="cal" target="_blank" rel="noopener">أضف إلى التقويم</a>':"";
 var map=/^https?:\/\//.test(S.map)?'<a class="btn out" href="'+esc(S.map)+'" target="_blank" rel="noopener">فتح الموقع على الخريطة</a>':"";
 var rsvp=S.wa.replace(/\D/g,"")?`<section class="sec"><h2>تأكيد الحضور</h2><p class="sub">يسعدنا معرفة ما إذا كنتم ستشرفوننا بالحضور.</p>
<form id="f"><input id="gn" placeholder="الاسم" required>
<div class="ch"><label><input type="radio" name="a" value="y" checked><span>سأحضر بإذن الله</span></label><label><input type="radio" name="a" value="n"><span>أعتذر عن الحضور</span></label></div>
<select id="gc"><option value="1">عدد الحضور: 1</option><option value="2">عدد الحضور: 2</option><option value="3">عدد الحضور: 3</option><option value="4">عدد الحضور: 4</option><option value="5">عدد الحضور: 5</option><option value="6">عدد الحضور: 6</option></select>
<button class="btn" type="submit">إرسال التأكيد عبر واتساب</button></form></section>`:"";
 return `<!DOCTYPE html>
<html lang="ar" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(T.n)} - ${esc(S.n1+(two?" و"+S.n2:""))}</title>
<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Aref+Ruqaa:wght@400;700&family=Reem+Kufi:wght@500${nfq}&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0}
:root{--hb:${hero}}
body{font-family:'Amiri','Noto Naskh Arabic',Georgia,serif;background:${h[4]} radial-gradient(circle at 50% 0,${h[0]}40,transparent 65%);color:${h[5]};line-height:1.9}
.hero{position:relative;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:64px 30px;background:var(--hb);color:${ht};overflow:hidden}
.hero:before,.hero:after{content:"";position:absolute;pointer-events:none;border:1px solid ${ac}}
.hero:before{inset:14px;border-width:2px;border-radius:4px;opacity:.9}.hero:after{inset:24px;opacity:.5}
.hero>*{animation:up 1s both}.hero>*:nth-child(2){animation-delay:.15s}.hero>*:nth-child(3){animation-delay:.3s}.hero>*:nth-child(4){animation-delay:.45s}.hero>*:nth-child(5){animation-delay:.6s}
@keyframes up{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
.bis{font-size:30px;color:${ac}}
.intro{max-width:520px;font-size:19px;margin:10px 0 18px}
.par{display:flex;justify-content:center;width:100%;max-width:520px;margin:4px 0 14px;text-align:center}.par>div{flex:1;padding:0 12px}.par>div+div{border-inline-start:1px solid ${ac}88}.par small{display:block;color:${ac};font-size:15px}.par b{display:block;font-size:21px;font-weight:700;line-height:1.7}
.ph{width:150px;height:150px;border-radius:50%;object-fit:cover;border:4px solid ${ac};margin:6px 0 16px}
.names{font-family:'Aref Ruqaa','Amiri',serif;font-weight:700;font-size:clamp(44px,12vw,76px);line-height:1.45;margin:8px 0;color:${ac};text-shadow:0 2px 8px #0003}
@supports((-webkit-background-clip:text) or (background-clip:text)){.names.g{background:linear-gradient(180deg,color-mix(in srgb,${ac} 55%,#fff),${ac} 50%,color-mix(in srgb,${ac} 70%,#000));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;text-shadow:none}.names.g .and{-webkit-text-fill-color:${ac}}}
.and{display:block;font-family:'Amiri',serif;font-size:32px;line-height:1;color:${ac}}
.date{font-size:22px;margin-top:4px;color:${ac};letter-spacing:.5px}
.line{display:flex;align-items:center;gap:12px;width:210px;margin:20px auto;color:${ac}}
.line:before,.line:after{content:"";flex:1;height:1px;background:linear-gradient(90deg,transparent,${ac})}.line:after{transform:scaleX(-1)}
.cd{display:flex;gap:10px;justify-content:center;margin-top:22px}
.cd div{min-width:72px;padding:12px 6px;border:1px solid ${ac};border-radius:16px;background:#ffffff26;backdrop-filter:blur(6px);box-shadow:0 4px 14px #0002}
.cd b{display:block;font-size:30px;font-family:'Reem Kufi',serif;color:${ac};line-height:1.4}.cd span{font-size:14px}
.sec{max-width:560px;margin:0 auto;padding:56px 22px;text-align:center}.rv{opacity:0;transform:translateY(26px);transition:opacity 1s,transform 1s}.rv.on{opacity:1;transform:none}
.sec h2{font-family:'Aref Ruqaa',serif;font-size:34px;color:${h[3]};margin-bottom:6px}
.sec h2:after{content:"◆";display:block;font-size:12px;color:${h[3]};margin:2px auto 16px}
.sub{margin-bottom:16px}
.it{padding:15px;margin:12px 0;border:1px solid ${h[3]}66;border-radius:18px;background:${h[6]?"#ffffff0d":"#ffffffb0"};box-shadow:0 6px 20px ${h[3]}22}
.it small{display:block;color:${h[3]};font-size:15px}.it b{font-size:21px;font-weight:700}
.btn{display:block;width:100%;margin-top:16px;padding:14px;border:0;border-radius:40px;background:${h[3]};background-image:linear-gradient(135deg,color-mix(in srgb,${h[3]} 85%,#fff),${h[3]},color-mix(in srgb,${h[3]} 80%,#000));color:${bt};font:inherit;font-size:19px;font-weight:700;text-decoration:none;cursor:pointer;box-shadow:0 6px 16px ${h[3]}55}
.btn.out{background:transparent;background-image:none;color:${h[3]};border:1.5px solid ${h[3]}}
form input[type=text],#gn,select{width:100%;padding:12px;margin-top:10px;border:1px solid ${h[0]};border-radius:12px;font:inherit;font-size:18px;background:#fff;color:#333;text-align:center}
.ch{display:flex;gap:10px;margin-top:10px}.ch label{flex:1}.ch input{display:none}
.ch span{display:block;padding:11px 4px;border:1px solid ${h[0]};border-radius:12px;cursor:pointer;background:#fff;color:#333}
.ch input:checked+span{background:${h[3]};color:${bt};border-color:${h[3]}}
.ov{position:fixed;inset:0;z-index:50;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:24px;text-align:center;background:var(--hb);color:${ht};transition:opacity .9s,transform .9s;cursor:pointer}
.ov.go{opacity:0;pointer-events:none}.ov[data-fx=slide].go{transform:translateY(-100%);opacity:1}.ov[data-fx=cur]{background:none}
.tz{font-family:'Aref Ruqaa','Amiri',serif;font-weight:700;font-size:clamp(36px,11vw,60px);line-height:1.5;color:${ac}}.tz .and{font-size:26px}
.ty{font-size:20px}.hn{font-size:17px;opacity:.85;animation:pl 1.8s infinite}@keyframes pl{50%{opacity:.35}}
.env{position:relative;width:min(320px,82vw);aspect-ratio:3/2;background:${h[3]};border-radius:8px;box-shadow:0 14px 34px #0005}
.pp{position:absolute;left:7%;right:7%;top:8%;bottom:8%;background:#fffdf8;border-radius:5px;z-index:1;display:flex;align-items:flex-start;justify-content:center;padding-top:12px;transition:transform .9s .5s}
.pp .tz{font-size:24px;color:${h[3]};line-height:1.4}.pp .tz .and{font-size:15px}
.fr,.fl{position:absolute;inset:0;background:${h[3]}}
.fr{z-index:2;clip-path:polygon(0 0,50% 52%,100% 0,100% 100%,0 100%);filter:brightness(.93)}
.fl{z-index:3;clip-path:polygon(0 0,100% 0,50% 52%);filter:brightness(1.12);transform-origin:top;transition:transform .8s,z-index 0s .4s}
.sl{position:absolute;z-index:4;left:50%;top:52%;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;background:${h[0]};color:${h[2]};display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 3px 8px #0004;transition:opacity .4s}
.ov.op .fl{transform:rotateX(180deg);z-index:0}.ov.op .sl{opacity:0}.ov.op .pp{transform:translateY(-88%)}
.cl{position:fixed;top:0;bottom:0;left:0;width:50.5%;z-index:0;background:${h[3]} repeating-linear-gradient(90deg,#0000 0 22px,#0002 22px 44px);box-shadow:inset -6px 0 14px #0004;transition:transform 1.4s cubic-bezier(.7,0,.3,1)}
.cl.r{left:auto;right:0;box-shadow:inset 6px 0 14px #0004}.ov.op .cl{transform:translateX(-101%)}.ov.op .cl.r{transform:translateX(101%)}
.mid{position:relative;z-index:2;color:${bt};transition:opacity .5s}.mid .tz,.mid .tz .and{color:${bt}}.ov.op .mid{opacity:0}
.tk{position:relative;direction:ltr;width:min(320px,82vw);height:58px;border:1.5px solid ${ac};border-radius:40px;background:#ffffff26;display:flex;align-items:center;justify-content:center;margin-top:20px;cursor:default}
.tt{font-size:17px}.hd{position:absolute;right:4px;top:4px;width:48px;height:48px;border-radius:50%;background:${ac};color:${at};display:flex;align-items:center;justify-content:center;font-size:22px;touch-action:none;cursor:grab;transition:transform .25s}
.hero>.dc{position:absolute;inset:0;pointer-events:none;animation:none!important}.dc i{display:none}.hero>*:not(.dc){position:relative;z-index:1}
.ov[data-fx=doors]{background:none}
.dr{position:fixed;top:0;bottom:0;left:0;width:50.4%;z-index:0;background:${h[3]};background-image:linear-gradient(90deg,#ffffff1f,#0000 30%,#0003);transform-origin:left center;transition:transform 1.5s cubic-bezier(.7,0,.3,1);box-shadow:inset -8px 0 18px #0005}
.dr:before{content:"";position:absolute;inset:22px;border:2px solid ${h[0]};border-radius:140px 140px 0 0;opacity:.8}
.dr b{position:absolute;top:50%;right:16px;width:16px;height:16px;border-radius:50%;background:${h[0]};box-shadow:0 2px 6px #0006}
.dr.r{left:auto;right:0;transform-origin:right center;box-shadow:inset 8px 0 18px #0005}.dr.r b{right:auto;left:16px}
.ov.op .dr{transform:perspective(1600px) rotateY(-108deg)}.ov.op .dr.r{transform:perspective(1600px) rotateY(108deg)}
.bkw{position:relative;width:min(270px,70vw);aspect-ratio:3/4;perspective:1400px}
.bkp,.bkc{position:absolute;inset:0;border-radius:14px 4px 4px 14px;box-shadow:0 14px 34px #0005}
.bkp{background:#fffdf8;display:flex;align-items:center;justify-content:center}.bkp .tz{color:${h[3]};font-size:44px}
.bkc{background:${h[3]};display:flex;flex-direction:column;align-items:center;justify-content:center;transform-origin:right center;transition:transform 1.4s cubic-bezier(.6,0,.2,1);backface-visibility:hidden;-webkit-backface-visibility:hidden;color:${bt}}
.bkc:before{content:"";position:absolute;inset:12px;border:1px solid ${h[0]};border-radius:8px 2px 2px 8px}.bkc .tz{color:${bt};font-size:34px}
.ov.op .bkc{transform:rotateY(-160deg)}
.sb{width:118px;height:118px;border-radius:48% 52% 50% 50%/55% 45% 55% 45%;background:radial-gradient(circle at 35% 30%,#ffffff66,transparent 42%),${h[3]};box-shadow:inset 0 -8px 14px #0005,0 12px 26px #0005;display:flex;align-items:center;justify-content:center;font-size:48px;color:${h[0]};animation:pu 2s ease-in-out infinite;transition:transform .7s,opacity .7s}
@keyframes pu{50%{transform:scale(1.07)}}
.ov[data-fx=gate]{background:none}
.gl{position:fixed;inset:0;z-index:0;background:radial-gradient(circle at 50% 55%,${h[0]},${h[0]}00 58%),var(--hb);opacity:0;transition:opacity 1.4s}.ov.op .gl{opacity:1}
.gd{position:fixed;top:0;bottom:0;left:0;width:50.4%;z-index:1;overflow:hidden;transform-origin:left center;background:${h[3]};background-image:repeating-linear-gradient(45deg,#ffffff10 0 2px,#0000 2px 16px),repeating-linear-gradient(-45deg,#ffffff10 0 2px,#0000 2px 16px),linear-gradient(90deg,#ffffff22,#0000 30%,#0004);box-shadow:inset -10px 0 22px #0006;transition:transform 2s cubic-bezier(.65,0,.25,1)}
.gd:before{content:"";position:absolute;inset:20px 16px 20px 20px;border:2px solid ${h[0]};border-radius:160px 160px 0 0;box-shadow:0 0 18px ${h[0]}55}
.gd:after{content:"";position:absolute;top:0;bottom:0;width:60px;left:-90px;background:linear-gradient(90deg,#0000,#ffffff40,#0000);transform:skewX(-18deg);animation:shn 3.2s ease-in-out infinite}
@keyframes shn{0%{left:-90px}60%,100%{left:120%}}
.gd i{position:absolute;top:50%;right:22px;width:22px;height:22px;margin-top:-11px;border-radius:50%;border:3px solid ${h[0]};box-shadow:0 0 10px ${h[0]}88}
.gd.r{left:auto;right:0;transform-origin:right center;box-shadow:inset 10px 0 22px #0006}.gd.r i{right:auto;left:22px}.gd.r:after{display:none}
.ov.op .gd{transform:perspective(1800px) rotateY(-104deg)}.ov.op .gd.r{transform:perspective(1800px) rotateY(104deg)}
.ov[data-fx=gate] .mid{z-index:3}
.e3{position:relative;width:min(340px,86vw);aspect-ratio:3/2;animation:flt 3.4s ease-in-out infinite;filter:drop-shadow(0 18px 26px #0006)}
@keyframes flt{50%{transform:translateY(-9px)}}
.e3b,.e3f,.e3l{position:absolute;inset:0;border-radius:10px}
.e3b{background:${h[3]};border:1px solid ${h[0]}99}
.e3c{position:absolute;left:6%;right:6%;top:9%;bottom:9%;z-index:1;background:#fffdf8;border:1px solid ${h[0]};border-radius:6px;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:transform 1.1s .55s cubic-bezier(.3,.8,.2,1)}
.e3c .tz,.e3c .tz .and{color:${h[3]}}.e3c .tz{font-size:24px;line-height:1.4}.e3c .tz .and{font-size:15px}.e3c .ty{font-size:13px;color:${h[3]}}
.e3f{z-index:2;background:${h[3]};clip-path:polygon(0 0,50% 56%,100% 0,100% 100%,0 100%);filter:brightness(.9)}
.e3l{z-index:3;background:${h[3]};filter:brightness(1.18);clip-path:polygon(0 0,100% 0,50% 56%);transform-origin:top;transition:transform .9s cubic-bezier(.5,0,.2,1),z-index 0s .45s}
.e3s{position:absolute;z-index:4;left:50%;top:56%;width:48px;height:48px;margin:-24px 0 0 -24px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff7,#0000 45%),${h[0]};color:${h[3]};display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 4px 10px #0006;transition:opacity .4s,transform .4s}
.ov.op .e3l{transform:rotateX(180deg);z-index:0}.ov.op .e3s{opacity:0;transform:scale(1.6)}.ov.op .e3c{transform:translateY(-70%) scale(1.12)}
.ov[data-fx=env3].go{transform:scale(1.5);opacity:0;transition:opacity .9s,transform 1.1s}
.scw{display:flex;flex-direction:column;align-items:center;width:min(300px,78vw);filter:drop-shadow(0 16px 24px #0006)}
.rod{position:relative;z-index:2;width:106%;height:22px;border-radius:12px;background:linear-gradient(180deg,${h[0]},${h[3]} 60%,${h[0]});box-shadow:inset 0 2px 3px #fff6,0 3px 6px #0005}
.rod:before,.rod:after{content:"";position:absolute;top:-3px;bottom:-3px;width:12px;border-radius:50%;background:${h[0]}}.rod:before{left:-6px}.rod:after{right:-6px}
.sc{width:92%;height:16px;overflow:hidden;background:linear-gradient(90deg,#d9c9a3,#fffaf0 12%,#fffdf8 50%,#fffaf0 88%,#d9c9a3);display:flex;align-items:center;justify-content:center;transition:height 1.9s cubic-bezier(.55,0,.2,1)}
.scin{opacity:0;transition:opacity .9s 1s;padding:20px 12px}.scin .tz,.scin .tz .and,.scin .ty{color:${h[3]}}.scin .tz{font-size:34px;line-height:1.45}.scin .tz .and{font-size:20px}.scin .ty{font-size:17px}
.ov.op .sc{height:min(360px,50vh)}.ov.op .scin{opacity:1}.ov[data-fx=scroll].go{transform:scale(1.12)}
.bx{position:relative;width:210px;height:190px;margin-bottom:22px}
.bxb,.bxl{position:absolute;left:0;right:0;background:${h[3]}}
.bxb{bottom:0;height:62%;border-radius:4px 4px 10px 10px;box-shadow:0 14px 28px #0006,inset 0 -10px 16px #0004;z-index:2}
.bxl{top:0;height:42%;left:-8px;right:-8px;border-radius:8px;filter:brightness(1.15);box-shadow:0 8px 14px #0005;z-index:3;transition:transform 1.1s cubic-bezier(.4,0,.2,1),opacity .6s .6s}
.bxb:after,.bxl:after{content:"";position:absolute;left:50%;top:0;bottom:0;width:30px;margin-left:-15px;background:${h[0]};box-shadow:inset 0 0 6px #0004}
.bxl span{position:absolute;z-index:1;left:50%;top:-22px;margin-left:-22px;width:44px;height:44px;border-radius:50%;background:${h[0]};color:${h[3]};display:flex;align-items:center;justify-content:center;font-size:24px;box-shadow:0 3px 8px #0005}
.bxc{position:absolute;left:10%;right:10%;bottom:12%;height:58%;z-index:1;background:#fffdf8;border:1px solid ${h[0]};border-radius:6px;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:transform 1.2s .5s cubic-bezier(.3,.8,.2,1)}
.bxc .tz,.bxc .tz .and,.bxc .ty{color:${h[3]}}.bxc .tz{font-size:22px;line-height:1.4}.bxc .tz .and{font-size:14px}.bxc .ty{font-size:12px}
.ov.op .bxl{transform:translateY(-150%) rotate(-16deg);opacity:0}.ov.op .bxc{transform:translateY(-115%) scale(1.15)}
.bx s{position:absolute;left:50%;top:34%;width:8px;height:14px;border-radius:2px;background:${h[0]};opacity:0;z-index:4}.bx s:nth-child(3n){background:#fff}.bx s:nth-child(3n+1){background:${ac}}
.ov.op .bx s{animation:cf 1.4s cubic-bezier(.2,.7,.3,1) forwards}
@keyframes cf{0%{opacity:1;transform:translate(0,0) rotate(0)}100%{opacity:0;transform:translate(var(--x),var(--y)) rotate(var(--r))}}
.ov[data-fx=box].go{transform:scale(1.15)}
#pg{position:fixed;top:0;left:0;height:3px;width:0;z-index:40;background:linear-gradient(90deg,${ac},${h[0]});box-shadow:0 0 10px ${ac}}
@keyframes rise{from{opacity:0;transform:translateY(34px);filter:blur(8px)}to{opacity:1;transform:none;filter:none}}
@keyframes drw{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes pop{from{opacity:0;transform:perspective(500px) rotateX(-80deg) translateY(16px)}to{opacity:1;transform:none}}
@keyframes glw{50%{filter:drop-shadow(0 0 14px ${ac}99)}}
@keyframes phf{50%{transform:translateY(-8px)}}
.hero>*:not(.dc){opacity:0}
body.ready .hero>*:not(.dc){animation:rise 1.1s cubic-bezier(.2,.7,.2,1) both}
body.ready .hero>.bis{animation-delay:.1s}body.ready .hero>.gt{animation-delay:.2s}body.ready .hero>.par{animation-delay:.3s}body.ready .hero>.intro{animation-delay:.45s}body.ready .hero>div:last-child{animation-delay:1.15s}
body.ready .hero>.ph{animation:rise 1.1s .6s cubic-bezier(.2,.7,.2,1) both,phf 5s 1.8s ease-in-out infinite}
body.ready .hero>.names{animation:rise 1.4s .8s cubic-bezier(.2,.7,.2,1) both,glw 4.5s 2.3s ease-in-out infinite}
body.ready .line{animation:drw 1.2s 1.15s both}
body.ready .cd div{animation:pop .8s 1.4s both}body.ready .cd div:nth-child(2){animation-delay:1.52s}body.ready .cd div:nth-child(3){animation-delay:1.64s}body.ready .cd div:nth-child(4){animation-delay:1.76s}
.rv .it,.rv .btn,.rv img,.rv p{opacity:0;transform:translateY(22px);transition:opacity .8s,transform .8s}
.rv.on .it,.rv.on .btn,.rv.on img,.rv.on p{opacity:1;transform:none}
.rv.on .it:nth-child(3),.rv.on img:nth-child(2){transition-delay:.1s}.rv.on .it:nth-child(4),.rv.on img:nth-child(3){transition-delay:.2s}.rv.on .it:nth-child(5),.rv.on img:nth-child(4){transition-delay:.3s}.rv.on .it:nth-child(n+6),.rv.on .btn{transition-delay:.4s}
@media(prefers-reduced-motion:reduce){.hero>*:not(.dc),.rv .it,.rv .btn,.rv img,.rv p{opacity:1!important;transform:none!important}*{animation:none!important}}
.ov[data-fx=seal].op .sb{transform:scale(1.7) rotate(14deg);opacity:0;animation:none}.ov[data-fx=seal].op .tz,.ov[data-fx=seal].op .ty,.ov[data-fx=seal].op .hn{opacity:0;transition:opacity .4s}.ov[data-fx=seal].go{transform:scale(1.12)}
.gsec{max-width:760px;padding-left:0;padding-right:0}
.rail{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;direction:ltr;perspective:900px;padding:26px calc(50% - min(29vw,115px));scrollbar-width:none;-webkit-overflow-scrolling:touch}.rail::-webkit-scrollbar{display:none}
.rail img{flex:none;width:min(58vw,230px);aspect-ratio:3/4;object-fit:cover;border-radius:22px;scroll-snap-align:center;border:1px solid ${h[3]}66;box-shadow:0 14px 30px ${h[3]}44;transition:transform .12s linear,opacity .12s}
.dots{display:flex;gap:8px;justify-content:center}.dots i{width:8px;height:8px;border-radius:50%;background:${h[3]}55;transition:.3s}.dots i.on{width:24px;border-radius:6px;background:${h[3]}}.swh{font-size:14px;opacity:.7;margin-top:8px}
.am{position:fixed;inset:0;pointer-events:none;z-index:5;overflow:hidden}.am i{position:absolute;display:block}
.am i.petal{top:-30px;background:${ac};opacity:.55;border-radius:150% 0 150% 0;animation:pt linear infinite}
.am i.dust{top:-10px;border-radius:50%;background:${ac};opacity:.75;box-shadow:0 0 6px ${ac};animation:pt linear infinite}
@keyframes pt{to{transform:translate(60px,112vh) rotate(540deg)}}
.am i.sparkle{animation:tw ease-in-out infinite;color:${ac};line-height:1}.am i.sparkle:before{content:"✦"}
@keyframes tw{0%,100%{opacity:0;transform:scale(.3)}50%{opacity:1;transform:scale(1)}}
.am i.bokeh{bottom:-120px;border-radius:50%;background:${ac};opacity:.2;filter:blur(2px);animation:bk linear infinite}
@keyframes bk{to{transform:translateY(-115vh)}}
.gt{font-size:22px;color:${ac};margin-bottom:4px}.st{white-space:pre-line;font-size:19px}
.gal{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.gal img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:16px;border:1px solid ${h[3]}66;box-shadow:0 6px 16px ${h[3]}22}
.cr{margin-top:6px;font-size:15px}.cr b{letter-spacing:2px}.cr a{color:inherit;text-decoration:none}
footer{text-align:center;padding:26px;font-size:15px;opacity:.75;color:${h[3]}}
${tcss}
</style></head><body class="t-${S.tp}"><div id="pg"></div>
${fxh}<header class="hero"><div class="dc"><i></i><i></i><i></i><i></i></div><div class="bis">${T.b}</div><div class="gt" id="gr" style="display:none"></div>${(S.p1||S.p2)?'<div class="par">'+[[T.pl1,S.p1],[T.pl2,S.p2]].filter(function(x){return x[1]}).map(function(x){return'<div><small>'+esc(x[0])+'</small><b>'+esc(x[1])+'</b></div>'}).join("")+'</div>':""}<p class="intro">${esc(S.intro)}</p>
${S.ph?'<img class="ph" alt="" src="'+S.ph+'">':'<div></div>'}
<h1 class="names">${names}</h1>
<div><div class="line"><span>❖</span></div><div class="date">${esc(S.date)}</div>${S.dt?'<div class="cd" id="cd"></div>':""}</div></header>
${story}${gal}<section class="sec"><h2>تفاصيل الحفل</h2>${rows}${cal}${map}</section>
${rsvp}
<footer>❖ ${esc(T.n)} ❖${S.br?'<div class="cr">صُمّمت بواسطة '+(S.bw.replace(/\D/g,"")?'<a href="https://wa.me/'+S.bw.replace(/\D/g,"")+'" target="_blank" rel="noopener"><b>'+esc(S.br)+'</b></a>':'<b>'+esc(S.br)+'</b>')+'</div>':""}</footer>
<script>
var C=${C};
function tick(){var e=document.getElementById("cd");if(!e)return;var d=new Date(C.dt).getTime()-Date.now();
 if(isNaN(d))return;if(d<=0){e.textContent="حان الموعد، نتشرف بحضوركم";return}
 var v=[Math.floor(d/864e5),Math.floor(d/36e5)%24,Math.floor(d/6e4)%60,Math.floor(d/1e3)%60],n=["يوم","ساعة","دقيقة","ثانية"];
 e.innerHTML=v.map(function(x,i){return"<div><b>"+x+"</b><span>"+n[i]+"</span></div>"}).join("")}
tick();setInterval(tick,1000);
var q=document.querySelectorAll(".sec");[].forEach.call(q,function(x){x.classList.add("rv")});
if("IntersectionObserver"in window){var o=new IntersectionObserver(function(l){l.forEach(function(e){if(e.isIntersecting){e.target.classList.add("on");o.unobserve(e.target)}})},{threshold:.15});[].forEach.call(q,function(x){o.observe(x)})}else{[].forEach.call(q,function(x){x.classList.add("on")})}
(function(){
 var P=new URLSearchParams(location.search).get("g");
 if(P){var t=document.getElementById("gr");t.textContent="دعوة خاصة إلى "+P;t.style.display="block";var g=document.getElementById("gn");if(g)g.value=P}
 var cb=document.getElementById("cal");
 if(cb&&C.dt){var d=new Date(C.dt),e=new Date(d.getTime()+108e5),z=function(n){return(n<10?"0":"")+n},
  fm=function(x){return x.getFullYear()+z(x.getMonth()+1)+z(x.getDate())+"T"+z(x.getHours())+z(x.getMinutes())+"00"};
  if(/iPad|iPhone|iPod/.test(navigator.userAgent)){
   cb.href="data:text/calendar;charset=utf8,"+encodeURIComponent("BEGIN:VCALENDAR\\r\\nVERSION:2.0\\r\\nBEGIN:VEVENT\\r\\nDTSTART:"+fm(d)+"\\r\\nDTEND:"+fm(e)+"\\r\\nSUMMARY:"+C.ev+" - "+C.names+"\\r\\nLOCATION:"+C.loc+"\\r\\nEND:VEVENT\\r\\nEND:VCALENDAR");cb.download="event.ics"}
  else cb.href="https://calendar.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent(C.ev+" - "+C.names)+"&dates="+fm(d)+"/"+fm(e)+"&location="+encodeURIComponent(C.loc)}
})();
(function(){var b=document.body,pg=document.getElementById("pg");
 if(!document.getElementById("ov"))b.classList.add("ready");else setTimeout(function(){b.classList.add("ready")},9000);
 function sc(){var h=document.documentElement,m=h.scrollHeight-h.clientHeight,y=window.scrollY||0,d=document.querySelector(".hero>.dc");
  if(pg)pg.style.width=(m>0?y/m*100:0)+"%";if(d)d.style.transform="translateY("+(y*.25)+"px)"}
 window.addEventListener("scroll",sc,{passive:true});sc()})();
(function(){var o=document.getElementById("ov");if(!o)return;var fx=o.getAttribute("data-fx"),b=document.body,on=false;b.style.overflow="hidden";
 function go(){if(on)return;on=true;o.classList.add("op");setTimeout(function(){o.classList.add("go");b.classList.add("ready");b.style.overflow="";setTimeout(function(){o.style.display="none"},1200)},({slide:150,seal:700,book:1900,doors:1700,gate:2300,env3:2000,scroll:2400,box:2000})[fx]||1500)}
 if(fx==="slide"){var h=document.getElementById("hd"),t=document.getElementById("tk"),x=0,d=false,s0=0,mx=0;
  h.onpointerdown=function(e){d=true;h.style.transition="none";s0=e.clientX;mx=t.clientWidth-h.clientWidth-8;h.setPointerCapture(e.pointerId)};
  h.onpointermove=function(e){if(!d)return;x=Math.max(0,Math.min(mx,s0-e.clientX));h.style.transform="translateX("+(-x)+"px)"};
  h.onpointerup=h.onpointercancel=function(){d=false;h.style.transition="";if(x>mx*.85){h.style.transform="translateX("+(-mx)+"px)";go()}else{x=0;h.style.transform=""}}}
 else o.onclick=go})();
(function(){var r=document.getElementById("rail");if(!r)return;var it=[].slice.call(r.children),ds=[].slice.call(document.querySelectorAll("#dots i"));
 function up(){var c=r.getBoundingClientRect(),m=c.left+c.width/2,best=0,bd=1e9;it.forEach(function(e,i){var b=e.getBoundingClientRect(),d=(b.left+b.width/2-m)/b.width,a=Math.abs(d);
  e.style.transform="scale("+Math.max(.8,1-a*.16)+") rotateY("+Math.max(-32,Math.min(32,-d*22))+"deg)";e.style.opacity=Math.max(.6,1-a*.3);if(a<bd){bd=a;best=i}});
  ds.forEach(function(x,i){x.className=i===best?"on":""})}
 r.addEventListener("scroll",function(){requestAnimationFrame(up)});window.addEventListener("resize",up);up()})();
(function(){var am=C.am;if(!am||am==="none"||(window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches))return;
 var L=document.createElement("div");L.className="am";document.body.appendChild(L);var r=Math.random;
 for(var i=0;i<(am==="sparkle"?26:am==="bokeh"?14:20);i++){var e=document.createElement("i"),z=am==="bokeh"?30+r()*70:am==="petal"?10+r()*12:am==="dust"?3+r()*4:8+r()*12;
  e.className=am;e.style.left=(r()*100)+"%";e.style.animationDuration=(am==="petal"?8+r()*8:am==="bokeh"?10+r()*10:am==="dust"?7+r()*7:2+r()*3)+"s";e.style.animationDelay=(-r()*12)+"s";
  if(am==="sparkle"){e.style.fontSize=z+"px";e.style.top=(r()*100)+"%"}else{e.style.width=e.style.height=z+"px"}L.appendChild(e)}})();
var f=document.getElementById("f");
if(f){var r=f.elements.a;[].forEach.call(r,function(x){x.onchange=function(){document.getElementById("gc").style.display=r.value==="y"?"":"none"}});
f.onsubmit=function(e){e.preventDefault();var y=r.value==="y",m="السلام عليكم، أنا "+document.getElementById("gn").value+(y?"، سأحضر بإذن الله "+C.ev+" ("+C.names+") وعدد الحضور "+document.getElementById("gc").value:"، أعتذر عن الحضور في "+C.ev+" ("+C.names+")");
 location.href="https://wa.me/"+C.wa+"?text="+encodeURIComponent(m)}}
<\/script></body></html>`;
}

var S_DEFAULT=JSON.stringify(S);
function waIntl(v){v=(v||"").replace(/\D/g,"");return v.indexOf("00")===0?v.slice(2):v.charAt(0)==="0"?"962"+v.slice(1):v}
function shrink(file,max,q){return new Promise(function(res){var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){var k=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=Math.max(1,Math.round(im.width*k));c.height=Math.max(1,Math.round(im.height*k));c.getContext("2d").drawImage(im,0,0,c.width,c.height);res(c.toDataURL("image/jpeg",q))};im.onerror=function(){res("")};im.src=r.result};r.onerror=function(){res("")};r.readAsDataURL(file)})}
