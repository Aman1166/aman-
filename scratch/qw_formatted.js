function Qw({
images:e,mode:t=`quad`,cubeSize:r=.5,autoSpinSpeed:a=.15,scrollSpins:o=1,mouseTiltIntensity:c=1,backgroundColor:l=`#000000`,photoOpacity:d=1,glassThickness:f=1.3,glassRoughness:m=.12,glassOpacity:h=.16,glassColor:_=`#ffffff`,galleryItemWidth:v,galleryItemHeight:y,gridGapX:x,gridGapY:S,borderRadius:C=16,maxDpr:w,qualityTier:T=0
}
){
let E=i(null),D=i(null),O=i(0),k=i(null),A=Kw(),j=i({
autoSpinSpeed:a,scrollSpins:o,mouseTiltIntensity:c,photoOpacity:d,glassThickness:f,glassRoughness:m,glassOpacity:h,glassColor:_
}
);
b(()=>{
j.current={
autoSpinSpeed:a,scrollSpins:o,mouseTiltIntensity:c,photoOpacity:d,glassThickness:f,glassRoughness:m,glassOpacity:h,glassColor:_
}

}
);
let M=n(()=>e&&e.length>0?e:tT,[e?.join(`,`)]),N=n(()=>w??([2,1.5,1][T]||2),[w,T]);
return s(()=>{
let e=E.current,t=D.current;
if(!e||!t)return;
let n=e.clientWidth||u.innerWidth,r=e.clientHeight||u.innerHeight,i=new jl,a=new Zd(45,n/r,.1,100);
a.position.z=6.6;
let o=new Ch({
canvas:t,antialias:T===0,alpha:!0,powerPreference:`high-performance`
}
);
o.setSize(n,r),o.setPixelRatio(Math.min(u.devicePixelRatio,N)),o.debug.checkShaderErrors=!1,i.add(new rf(16777215,.35));
let s=new nf(16777215,1.2);
s.position.set(-8,10,-2),i.add(s);
let c=new nf(16777215,.7);
c.position.set(8,-5,6),i.add(c),i.add(new zd(16777215,4473924,.4));
let l=new $d(16777215,0,10,1.6);
i.add(l);
let d=new Cl;
i.add(d);
let f={
scene:i,camera:a,renderer:o,group:d,coreLight:l,glassMesh:null,glassMaterial:null,faceMeshes:[],scrollTrigger:null,rafId:0,containerRect:e.getBoundingClientRect(),unfoldEnd:1,gridHeight:5
}
;
k.current=f;
let p,m=()=>{
clearTimeout(p),p=setTimeout(()=>{
let t=e.clientWidth||u.innerWidth,n=e.clientHeight||u.innerHeight;
a.aspect=t/n,a.updateProjectionMatrix(),o.setSize(t,n),f.containerRect=e.getBoundingClientRect()
}
,150)
}
;
u.addEventListener(`resize`,m);
let h=0,g=0,_=0,v=!1,y=performance.now(),b={
x:0,y:0
}
,x=!1,S=!0,C=typeof document>`u`||!document.hidden,w=null,M=e=>{
if(!x)return;
let t=Math.min(.1,(e-y)/1e3);
y=e;
let n=t*60,r=j.current,s=A.state.pointer,c=f.containerRect;
c&&c.width>0&&(b.x=(s.x-c.left)/c.width*2-1,b.y=-((s.y-c.top)/c.height)*2+1);
let u=1-Math.exp(-.12*n),p=1-Math.exp(-.08*n),m=1-Math.exp(-.15*n);
g+=(O.current-g)*u;
let S=1-Math.min(1,g/f.unfoldEnd),C=r.autoSpinSpeed??.15,w=r.mouseTiltIntensity??1,T=r.scrollSpins??1;
if(O.current===0)v&&=(h=d.rotation.y/Math.max(.01,C),!1),h+=t;
else if(!v){
let e=(d.rotation.y%(Math.PI*2)+Math.PI*2)%(Math.PI*2);
d.rotation.y=e,_=e,v=!0
}
let E=.5*(1-Math.cos(S*Math.PI)),D=(.35+.1*Math.sin(h*.5)-b.y*w)*E,k=O.current===0?h*C+b.x*w:(_+b.x*w)*E+(1-E)*(T*Math.PI*2),N=(.2+.08*Math.cos(h*.4))*E;
d.rotation.x+=(D-d.rotation.x)*p,d.rotation.y+=(k-d.rotation.y)*p,d.rotation.z+=(N-d.rotation.z)*p;
let P=a.aspect,ee=P<1?Math.max(.65,P):1,te=(.55+.45*S)*ee,ne=d.scale.x+(te-d.scale.x)*u;
d.scale.set(ne,ne,ne);
let re=a.fov*Math.PI/180,ie=2*Math.tan(re/2)*Math.abs(a.position.z),F=Math.max(0,f.gridHeight*ne-ie),ae=0;
if(g>=f.unfoldEnd&&f.unfoldEnd<.99){
let e=f.unfoldEnd+(1-f.unfoldEnd)*.25;
ae=g<e?(g-f.unfoldEnd)/Math.max(.001,e-f.unfoldEnd)*(-F/2):-F/2+(g-e)/Math.max(.001,1-e)*F
}
if(d.position.y+=(ae-d.position.y)*u,f.glassMaterial){
let e=O.current===0?r.glassOpacity??.16:0;
f.glassMaterial.opacity+=(e-f.glassMaterial.opacity)*m,f.glassMaterial.thickness=r.glassThickness??1.3,f.glassMaterial.roughness=r.glassRoughness??.12,f.glassMaterial.color.set(r.glassColor??`#ffffff`)
}
if(f.glassMesh){
let e=.001+.999*S;
f.glassMesh.scale.set(e,e,e)
}
l.color.set(r.glassColor??`#ffffff`),l.intensity=5*S;
let oe=r.photoOpacity??1,I=f.faceMeshes;
for(let e=0;
e<I.length;
e++){
let{
mesh:t,material:n,config:r
}
=I[e],i=(1-S)*r.flatPos[0]+S*r.basePos[0],a=(1-S)*r.flatPos[1]+S*r.basePos[1],o=(1-S)*r.flatPos[2]+S*r.basePos[2];
t.position.x+=(i-t.position.x)*u,t.position.y+=(a-t.position.y)*u,t.position.z+=(o-t.position.z)*u;
let s=(1-S)*(r.flatScale[0]/r.foldedScale[0])+S,c=(1-S)*(r.flatScale[1]/r.foldedScale[1])+S;
t.scale.set(s,c,1),t.rotation.x+=(r.baseRot[0]*S-t.rotation.x)*u,t.rotation.y+=(r.baseRot[1]*S-t.rotation.y)*u,t.rotation.z+=(r.baseRot[2]*S-t.rotation.z)*u;
let l=1-(1-oe)*S;
n.opacity+=(l-n.opacity)*m,n.color.setRGB(S,S,S),n.emissive.setRGB(1-S,1-S,1-S)
}
o.render(i,a),x&&(f.rafId=requestAnimationFrame(M))
}
,P=()=>{
x||(x=!0,y=performance.now(),f.containerRect=e.getBoundingClientRect(),f.rafId=requestAnimationFrame(M))
}
,ee=()=>{
x&&(x=!1,cancelAnimationFrame(f.rafId),f.rafId=0)
}
,te=()=>{
S&&C?P():ee()
}
,ne=()=>{
C=typeof document>`u`||!document.hidden,te()
}
;
return typeof IntersectionObserver<`u`&&(w=new IntersectionObserver(e=>{
S=!!e[0]?.isIntersecting,te()
}
,{
threshold:.01
}
),w.observe(e)),typeof document<`u`&&document.addEventListener(`visibilitychange`,ne),te(),()=>{
ee(),w&&=(w.disconnect(),null),typeof document<`u`&&document.removeEventListener(`visibilitychange`,ne),u.removeEventListener(`resize`,m),clearTimeout(p),o.dispose(),i.clear(),k.current=null
}

}
,[N]),s(()=>{
let e=k.current,n=E.current;
if(!e||!n)return;
let{
group:i,renderer:a
}
=e,o=new Map,s=new Map,c=new Ld,l=Math.min(4,a.capabilities.getMaxAnisotropy()),u=new sd(3.02*r,3.02*r,3.02*r),d=new hd({
transmission:1,roughness:j.current.glassRoughness??.12,thickness:j.current.glassThickness??1.3,clearcoat:1,clearcoatRoughness:.05,ior:1.45,color:new kl(j.current.glassColor??`#ffffff`),transparent:!0,opacity:0,side:2,depthWrite:!1
}
),f=new qu(u,d);
i.add(f),e.glassMesh=f,e.glassMaterial=d;
let p=nT[t]??24,m=Array.from({
length:p
}
,(e,t)=>M[t%M.length]),h=Xw(t,r,v,y,x,S),g=[];
for(let e of h){
let t=m[e.texIndex],n;
o.has(t)?n=o.get(t):(n=c.load(t),n.colorSpace=pc,n.minFilter=Qo,n.magFilter=Xo,n.anisotropy=l,n.generateMipmaps=!0,o.set(t,n));
let r=`${
e.foldedScale[0]
}
:${
e.foldedScale[1]
}
`,a;
s.has(r)?a=s.get(r):(a=new cd(e.foldedScale[0],e.foldedScale[1]),s.set(r,a));
let u=new hd({
map:n,emissiveMap:n,emissive:new kl(`#ffffff`),transparent:!0,opacity:1,side:2,roughness:1,metalness:0,clearcoat:0,clearcoatRoughness:.25,depthWrite:!0,toneMapped:!1
}
),d=new qu(a,u);
d.position.set(e.basePos[0],e.basePos[1],e.basePos[2]),d.rotation.set(e.baseRot[0],e.baseRot[1],e.baseRot[2]),i.add(d),g.push({
mesh:d,material:u,config:e
}
)
}
e.faceMeshes=g;
let _=t===`quad`?3:2,b=y??(t===`square`?2.8:1.37)*r,C=S??(t===`rect`?.13:.12)*r,w=_*b+(_-1)*C,T=w*.55,D=5.467,A=Math.max(0,T-D),N=`100%`,P=1;
if(A>0){
let e=100+A/D*100;
N=`${
e
}
%`,P=100/e
}
e.unfoldEnd=P,e.gridHeight=w;
let ee=n.querySelector(`[data-gg-scroll-hint]`),te=ew.create({
trigger:n,start:`top top`,end:`+=${
N
}
`,pin:!0,pinSpacing:!0,scrub:.8,onUpdate:e=>{
ew.isRefreshing||(O.current=e.progress,ee&&(ee.style.opacity=Math.max(0,1-e.progress*4.5).toString()))
}

}
);
e.scrollTrigger=te,e.containerRect=n.getBoundingClientRect();
let ne=setTimeout(()=>ew.refresh(),300);
return()=>{
clearTimeout(ne),i.remove(f),u.dispose(),d.dispose();
for(let e of g)i.remove(e.mesh),e.material.dispose();
o.forEach(e=>e.dispose()),s.forEach(e=>e.dispose()),te.kill();
let e=k.current;
e&&(e.glassMesh=null,e.glassMaterial=null,e.faceMeshes=[],e.scrollTrigger=null)
}

}
,[M,t,r,v,y,x,S]),g(`div`,{
ref:E,style:{
width:`100%`,height:`100vh`,backgroundColor:l,touchAction:`pan-y`,position:`relative`,overflow:`hidden`,borderRadius:`${
C
}
px`
}
,children:[p(`canvas`,{
ref:D,style:{
display:`block`,width:`100%`,height:`100%`,outline:`none`
}

}
),g(`div`,{
"data-gg-scroll-hint":``,style:{
position:`absolute`,bottom:40,right:40,zIndex:20,display:`flex`,flexDirection:`column`,alignItems:`center`,gap:12,pointerEvents:`none`,color:`rgba(255,255,255,0.4)`,fontFamily:`monospace`,fontSize:9,textTransform:`uppercase`,letterSpacing:`0.4em`,transition:`opacity 0.3s ease`
}
,children:[p(`span`,{
style:{
animation:`gg-pulse 2s cubic-bezier(0.4,0,0.6,1) infinite`
}
,children:`Scroll to Disintegrate`
}
),p(`div`,{
style:{
width:1,height:40,background:`rgba(255,255,255,0.1)`,position:`relative`,overflow:`hidden`
}
,children:p(`div`,{
style:{
position:`absolute`,left:0,right:0,top:0,height:`50%`,background:`white`,animation:`gg-bounce 2s infinite ease-in-out`
}

}
)
}
)]
}
),p(`style`,{
dangerouslySetInnerHTML:{
__html:`
                @keyframes gg-bounce {
 0%,100%{
transform:translateY(0)
}
 50%{
transform:translateY(20px)
}
 
}

                @keyframes gg-pulse  {
 0%,100%{
opacity:1
}
 50%{
opacity:.5
}
 
}

            `
}

}
)]
}
)
}
