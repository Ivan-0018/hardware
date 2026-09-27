/* Adaptive formulation: ratio slider drives stream widths, speeds and blend colour. */
(function(){
const slider=document.getElementById('slider');
const buttons=[...document.querySelectorAll('.presets button')];
const treatmentPct=document.getElementById('treatmentPct');
const diluentPct=document.getElementById('diluentPct');
const ratioMain=document.getElementById('ratioMain');
const metricRatio=document.getElementById('metricRatio');
const metricTreatment=document.getElementById('metricTreatment');
const metricDiluent=document.getElementById('metricDiluent');

const gBody=document.getElementById('gelBody');
const gShadow=document.getElementById('gShadow');
const gelEdge1=document.getElementById('gelEdge1');
const gelEdge2=document.getElementById('gelEdge2');
const gelRidge=document.getElementById('gelRidge');
const gelMotion1=document.getElementById('gelMotion1');
const gelMotion2=document.getElementById('gelMotion2');

const bBody=document.getElementById('waterBody');
const bShadow=document.getElementById('bShadow');
const waterEdge1=document.getElementById('waterEdge1');
const waterEdge2=document.getElementById('waterEdge2');
const waterRidge=document.getElementById('waterRidge');
const waterMotion1=document.getElementById('waterMotion1');
const waterMotion2=document.getElementById('waterMotion2');

const mixed=document.getElementById('mixedBodyPath');
const mixA=document.getElementById('mixA');
const mixB=document.getElementById('mixB');
const mixC=document.getElementById('mixC');
const helix=document.getElementById('helix');

function prettyRatio(t){
  const d=100-t;
  const r=t/d;
  if(Math.abs(t-50)<1) return '1:1';
  if(r<1) return '1:'+(Math.round((1/r)*10)/10);
  return (Math.round(r*10)/10)+':1';
}

function update(){
  const t=+slider.value;
  const d=100-t;
  const tf=t/100;
  const df=d/100;

  document.documentElement.style.setProperty('--ratio',t+'%');
  treatmentPct.textContent=t+'%';
  diluentPct.textContent=d+'%';
  ratioMain.textContent=prettyRatio(t);

  // thicker, slower, more structured gel
  const gw=56 + tf*44;
  gBody.style.strokeWidth=gw;
  gShadow.style.strokeWidth=gw+16;
  gelEdge1.style.strokeWidth=Math.max(5,gw*.085);
  gelEdge2.style.strokeWidth=Math.max(8,gw*.14);
  gelRidge.style.strokeWidth=Math.max(5,gw*.09);
  gelMotion1.style.strokeWidth=Math.max(5,gw*.075);
  gelMotion2.style.strokeWidth=Math.max(3,gw*.05);
  gelMotion1.style.animationDuration=(5.6-tf*2)+'s';
  gelMotion2.style.animationDuration=(7.1-tf*1.7)+'s';

  // thinner, faster diluent
  const bw=46 + df*30;
  bBody.style.strokeWidth=bw;
  bShadow.style.strokeWidth=bw+14;
  waterEdge1.style.strokeWidth=Math.max(4,bw*.09);
  waterEdge2.style.strokeWidth=Math.max(6,bw*.14);
  waterRidge.style.strokeWidth=Math.max(4,bw*.085);
  waterMotion1.style.strokeWidth=Math.max(4,bw*.075);
  waterMotion2.style.strokeWidth=Math.max(3,bw*.05);
  waterMotion1.style.animationDuration=(4.2-df*1.45)+'s';
  waterMotion2.style.animationDuration=(6.1-df*1.25)+'s';

  const mw=72 + Math.abs(t-50)*.08;
  mixed.style.strokeWidth=mw;

  // final blend visually shifts toward dominant stream
  mixA.setAttribute('stop-color',t>60?'#789a49':t<40?'#53835b':'#73934a');
  mixB.setAttribute('stop-color',t>60?'#619278':t<40?'#4f91a0':'#5b998c');
  mixC.setAttribute('stop-color',t>60?'#6d9d87':t<40?'#5fa0b4':'#67a2a2');

  helix.style.opacity=.62 + Math.min(tf,df)*.36;

  metricRatio.textContent=prettyRatio(t);
  metricTreatment.textContent=t+'%';
  metricDiluent.textContent=d+'%';

  buttons.forEach(b=>b.classList.toggle('active',Math.abs(+b.dataset.v-t)<1));
}

slider.addEventListener('input',update);
buttons.forEach(b=>b.addEventListener('click',()=>{
  slider.value=b.dataset.v;
  update();
}));

update();
})();
