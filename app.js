/* PORTVISION 3D — app.js · v2.4 · Kattupalli + Ennore, GPS-based Ennore twin,
   persistence layer (PostgreSQL via server/ when running; honest standalone fallback).
   Keep with index.html + styles.css. */

const ADANI_LOGO='data:image/png;base64,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';
/* ============================== STATE (all demo operations data erased — clean start) ============================== */
const now = Date.now, H = 3600e3;
const fmt = t => t ? new Date(t).toLocaleString('en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit',hour12:false}) : '—';
const fmtD = t => t ? new Date(t).toLocaleDateString('en-IN',{day:'2-digit',month:'short'}) : '—';
const STATUS = {
  'Incoming':      {c:'var(--inc)', ic:'🧭'},
  'At Anchorage':  {c:'var(--anc)', ic:'⚓'},
  'At Berth':      {c:'var(--brt)', ic:'🧱'},
  'Operating':     {c:'var(--opr)', ic:'🏗️'},
  'Completed':     {c:'var(--cmp)', ic:'✅'},
  'Sailed Out':    {c:'var(--sld)', ic:'🌊'},
};
/* Vessel master retained (reference data); ALL voyages/operations start at zero */
const vessels = [
  {id:1,name:"BLPL FAITH",imo:"9349887",call:"9V2323",flag:"Singapore",operator:"BLP",loa:140.0,service:"ADHOC"},
  {id:2,name:"SM MANALI",imo:"9312779",call:"D5QT7",flag:"Liberia",operator:"SIM",loa:222.0,service:"CCG"},
  {id:3,name:"HYUNDAI VOYAGER",imo:"9305685",call:"3FFB8",flag:"Panama",operator:"HMM",loa:294.12,service:"FIL"},
  {id:4,name:"HMM OCEAN",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"HMM",loa:272.0,service:"FIL"},
  {id:5,name:"ZEBRA",imo:"9401099",call:"V7A4T",flag:"Marshall Is.",operator:"MSI",loa:210.0,service:"CHEX"},
  {id:6,name:"HYUNDAI BRAVE",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"HMM",loa:339.6,service:"FIL"},
  {id:7,name:"MH GREEN",imo:"9461526",call:"VRPS6",flag:"Hong Kong",operator:"OCE",loa:199.93,service:"TCX"},
  {id:8,name:"TIGER CHENNAI",imo:"9612882",call:"9HA4821",flag:"Malta",operator:"BTL",loa:199.9,service:"CI5"},
  {id:9,name:"MOGRAL",imo:"9432244",call:"VTMG",flag:"India",operator:"SIM",loa:231.0,service:"CCG"},
  {id:10,name:"MSC LOME V",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"MSC",loa:264.0,service:"VZJ"},
  {id:11,name:"XIN WEN ZHOU",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"CCO",loa:255.1,service:"TCX"},
  {id:12,name:"MSC SABRINA III",imo:"9227338",call:"3EPX4",flag:"Panama",operator:"MSC",loa:242.0,service:"VZJ"},
  {id:13,name:"MARINA VOYAGER",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"MSI",loa:199.93,service:"CHEX"},
  {id:14,name:"NAWATA BHUM",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"RCF",loa:147.82,service:"ADHOC"},
  {id:15,name:"SEASPAN BRIGHTNESS",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"HMM",loa:336.95,service:"FIM"},
  {id:16,name:"DING YUAN HUAN YU",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"SCA",loa:197.0,service:"TCX"},
  {id:17,name:"HMM CLOVER",imo:"9385013",call:"3EWB2",flag:"Panama",operator:"HMM",loa:274.0,service:"FIL"},
  {id:18,name:"HUA DA 617",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"CCO",loa:197.0,service:"TCX"},
  {id:19,name:"HMM SAGE",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"HMM",loa:274.0,service:"FIM"},
  {id:20,name:"WAN HAI 355",imo:"9464209",call:"9V9629",flag:"Singapore",operator:"WAN",loa:204.0,service:"CI3"},
  {id:21,name:"HMM LEAF",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"HMM",loa:282.0,service:"FIM"},
  {id:22,name:"MSC JUANITA F",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"MSC",loa:146.45,service:"VZJ"},
  {id:23,name:"SM KAVERI",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"SIM",loa:207.98,service:"CCG"},
  {id:24,name:"SEASPAN BEAUTY",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"HMM",loa:336.93,service:"FIM"},
  {id:25,name:"MSC MANHATTAN V",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"MSC",loa:294.17,service:"VZJ"},
  {id:26,name:"INTERASIA HORIZON",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"IAS",loa:260.0,service:"CI5"},
  {id:27,name:"HMM FOREST",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"HMM",loa:274.0,service:"FIM"},
  {id:28,name:"HMM SKY",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"HMM",loa:272.0,service:"FIL"},
  {id:29,name:"HYUNDAI GRACE",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"HMM",loa:294.1,service:"FIL"},
  {id:30,name:"WAN HAI 522",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"WAN",loa:262.0,service:"CI5"},
  {id:31,name:"WAN HAI 372",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"WAN",loa:203.5,service:"CI5"},
  {id:32,name:"WAN HAI 521",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"WAN",loa:268.0,service:"CI5"},
  {id:33,name:"SEASPAN BRILLIANCE",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"HMM",loa:336.95,service:"FIM"},
  {id:34,name:"HMM JUNIPER",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"HMM",loa:274.0,service:"FIL"},
  {id:35,name:"GRAVITY",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"HUL",loa:166.15,service:"ADHOC"},
  {id:36,name:"ZHONG GU TAI YUAN",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"SCA",loa:228.0,service:"TCX"},
  {id:37,name:"VARADA",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"SIM",loa:260.0,service:"CCG"},
  {id:38,name:"HMM GREEN",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"HMM",loa:274.0,service:"FIL"},
  {id:39,name:"WAN HAI 510",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"WAN",loa:268.0,service:"CI5"},
  {id:40,name:"SOL PIONEER",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"BLP",loa:149.6,service:"ADHOC"},
  {id:41,name:"MSC PATNAREE III",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"MSC",loa:207.0,service:"VZJ"},
  {id:42,name:"HMM PREMIUM",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"HMM",loa:255.4,service:"FIM"},
  {id:43,name:"MTT SAISUNEE",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"RCF",loa:159.0,service:"ADHOC"},
  {id:44,name:"REN JIAN 16",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"MSI",loa:260.32,service:"CHEX"},
  {id:45,name:"MSC AKITETA II",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"MSC",loa:195.6,service:"VZJ"},
  {id:46,name:"KMTC JEBEL ALI",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"KMD",loa:261.4,service:"CI5"},
  {id:47,name:"SM NEYYAR",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"SIM",loa:260.0,service:"CCG"},
  {id:48,name:"HYUNDAI HONGKONG",imo:"\u2014",call:"\u2014",flag:"\u2014",operator:"HMM",loa:303.83,service:"FIL"}
];
const berths = [
  {id:'CB1',name:'Container Berth 1',type:'Container',len:350,port:'KTP'},
  {id:'CB2',name:'Container Berth 2',type:'Container',len:357,port:'KTP'},
  {id:'B3', name:'Berth 3',type:'Liquid / Bulk / Break-Bulk',len:426,port:'KTP'},
  {id:'EB1',name:'Ennore B1',type:'Container / Liquid / Bulk / Break-Bulk',len:400,port:'ENN'},
];
/* Vessel-type → permitted berths */
const TYPE_BERTHS={'Container':['CB1','CB2','EB1'],'Liquid':['CB2','B3','EB1'],'Bulk':['CB1','CB2','B3','EB1'],'Break-Bulk':['CB1','CB2','B3','EB1']};
const VESSEL_TYPES=['Container','Liquid','Bulk','Break-Bulk'];
const vtypeOf=ves=>ves.vtype||'Container';
const berthAllowed=(ves,bid)=>TYPE_BERTHS[vtypeOf(ves)].includes(bid);
/* Double-banking: max LOA per vessel for two-at-a-berth + mandatory clearance */
const DUAL_MAX={CB1:145,CB2:148,B3:183.25};
const GAP=15; /* metres: in front, behind and between vessels */
const CRANE_ORDER={CB1:['QC01','QC02','QC04','QC03'],CB2:['QC08','QC05','QC06','QC07'],EB1:['QC-01','QC-02','QC-03','QC-04']};
const craneApplicable=ves=>['Container','Break-Bulk'].includes(vtypeOf(ves));
/* ===== PHYSICAL BOLLARD POOLS =====
   CB1: independent pool, bollards 1–17.
   CB2 + B3: ONE shared physical pool, bollards 1–34 (1–17 shown on CB2, 18–34 on B3);
   either berth may moor on any available bollard of the shared range. */
const BOLLARD_SPACING=22.5;               /* Kattupalli spacing (m) */
const CB1_COMBINED_MAX=290;               /* CB1 two-vessel combined LOA limit (m) */
/* Ennore B1: independent pool 1–27, 15 m spacing, conflicts strictly enforced */
const poolOf=bid=>bid==='CB1'?'CB1':bid==='EB1'?'EB1':'CB2B3';
const poolBerths=bid=>bid==='CB1'?['CB1']:bid==='EB1'?['EB1']:['CB2','B3'];
const poolMax=pool=>pool==='CB1'?17:pool==='EB1'?27:34;
const spacingOf=pool=>pool==='EB1'?15:BOLLARD_SPACING;
const STRICT_POOLS=['CB1','EB1'];         /* pools where bollard conflicts block */
const bolRange=v=>(v.bowB&&v.sternB)?[Math.min(v.bowB,v.sternB),Math.max(v.bowB,v.sternB)]:null;
function occupiedBollardMap(voy){
  const pb=poolBerths(voy.berth),w=plannedWindow(voy),map={};
  voyages.forEach(o=>{
    if(o.id===voy.id||o.confirmed===false||o.status==='Sailed Out')return;
    if(!pb.includes(o.berth))return;
    const r=bolRange(o);if(!r)return;
    const ow=plannedWindow(o);if(!(ow&&w&&w.s<ow.e&&ow.s<w.e))return;
    for(let n=r[0];n<=r[1];n++)map[n]=o;});
  return map;}
function applyBollards(voy,bow,stern){
  const lo=Math.min(bow,stern),hi=Math.max(bow,stern);
  const pool=poolOf(voy.berth);
  if(!(lo>=1&&hi<=poolMax(pool))){
    conflictModal('Invalid Bollard','Bollard numbers for '+voy.berth+' must be between 1 and '+poolMax(pool)+'.');
    return false;}
  const span=(hi-lo)*spacingOf(pool);
  /* CB1 & Ennore B1 validate bollard conflicts. CB2 & B3: NO restriction —
     the operator's manual bollard selection is final and accepted as-is. */
  if(STRICT_POOLS.includes(pool)){
    const occ=occupiedBollardMap(voy);
    const clash=[];for(let n=lo;n<=hi;n++)if(occ[n])clash.push(n);
    if(clash.length){const o=occ[clash[0]];
      conflictModal('Bollard Conflict','Bollards <b>'+clash[0]+'–'+clash[clash.length-1]+'</b> are already occupied by '+vOf(o).name+' (VIA '+o.via+', bollards '+bolRange(o)[0]+'–'+bolRange(o)[1]+'). Choose a clear range — the whole Bow-to-Stern range must be free.');
      return false;}
    if(pool==='CB1'&&span<vOf(voy).loa*0.9){
      conflictModal('Invalid Mooring Range','The selected bollard spacing is insufficient for this vessel\'s LOA. '+(hi-lo+1)+' bollards span '+span.toFixed(1)+' m but the vessel is '+vOf(voy).loa+' m — select bollards further apart.');
      return false;}
  }
  voy.bowB=bow;voy.sternB=stern;
  voy.qFrom=(lo-1)*spacingOf(pool);voy.qTo=(hi-1)*spacingOf(pool);
  logAudit('Bollards '+lo+'–'+hi+' (bow #'+bow+', stern #'+stern+') — VIA '+voy.via);
  toast('Moored on bollards '+lo+'–'+hi+' ('+(hi-lo+1)+' bollards, '+span.toFixed(1)+' m span) — intermediate bollards allocated automatically');
  markPlanDirty();twinDirty=true;render();return true;}
function cargoVolTotals(type){let imp=0,exp=0;
  voyages.filter(v=>v.confirmed!==false&&inPort(v)&&(v.cargoLines||[]).length&&vtypeOf(vOf(v))===type)
    .forEach(v=>v.cargoLines.forEach(c=>{if(c.dir==='Export')exp+=+c.vol||0;else imp+=+c.vol||0;}));
  return {imp,exp,tot:imp+exp};}
const CARGO_OPTS={'Liquid':['CBFS','CPO','Bitumen'],'Bulk':['Soda Ash','Gypsum','Limestone','River Sand'],'Break-Bulk':['Steel Coil','Steel Plate','Steel Rebar','Bags']};
function overlapCo(bid,voy){const w=plannedWindow(voy);if(!w)return[];
  return voyages.filter(o=>o.id!==voy.id&&o.confirmed!==false&&o.berth===bid&&o.status!=='Sailed Out'&&(()=>{const ow=plannedWindow(o);return ow&&w.s<ow.e&&ow.s<w.e;})());}
function dualCheck(bid,voy){
  const B=berths.find(b=>b.id===bid);const co=overlapCo(bid,voy);
  if(!co.length)return {ok:true,co:[]};
  if(co.length>=2)return {ok:false,msg:bid+' already has two vessels planned in this window — maximum 2 simultaneous vessels per berth.'};
  const other=co[0];
  const L1=vOf(voy).loa,L2=vOf(other).loa;
  if(bid==='CB1'&&(L1+L2)>CB1_COMBINED_MAX)
    return {ok:false,msg:'CB1 Berthing Restriction: with 2 vessels the combined LOA must not exceed '+CB1_COMBINED_MAX+' m — '+vOf(other).name+' ('+L2+' m) + your vessel ('+L1+' m) = <b>'+(L1+L2)+' m</b>. A single vessel can be any LOA.'};
  /* physical fit: governed by bollard allocation when both vessels have bollards;
     otherwise fall back to the clearance-geometry check */
  if(!(bolRange(voy)&&bolRange(other))){
    const need=GAP*3+L1+L2;
    if(need>B.len&&bid==='CB1')return {ok:false,msg:'Insufficient berth space on '+bid+'. '+vOf(other).name+' ('+L2+' m) + your vessel ('+L1+' m) + the required '+GAP+' m clearance in front, between and behind need '+need.toFixed(1)+' m, but '+bid+' is only '+B.len+' m.'};
  }
  return {ok:true,co,other,pos:{from:GAP+L2+GAP,to:GAP+L2+GAP+L1},otherPos:{from:GAP,to:GAP+L2},spare:(B.len-(GAP*3+L1+L2)).toFixed(1)};}
/* QC01–QC04 on CB1, QC05–QC08 on CB2 (per MIDPL crane position diagram). Status: Available / Maintenance / Breakdown; Operational is derived */
const cranes = Array.from({length:8},(_,i)=>({id:'QC0'+(i+1),berth:i<4?'CB1':'CB2',status:'Available',port:'KTP'}))
  .concat(Array.from({length:4},(_,i)=>({id:'QC-0'+(i+1),berth:'EB1',status:'Available',port:'ENN'})));
/* ===== PORTS / SITES MASTER — add a port here + its berths/cranes/bollards above and the app scales ===== */
const PORTS=[
  {id:'KTP',name:'Kattupalli',label:'MIDPL — Kattupalli'},
  {id:'ENN',name:'Ennore',label:'AECTPL — Ennore'},
];
let curPort='KTP';
const portOf=v=>v.port||'KTP';
const inPort=v=>portOf(v)===curPort;
const curPortObj=()=>PORTS.find(p=>p.id===curPort);
const portName=id=>(PORTS.find(p=>p.id===id)||{}).name||id;
const portBerths=()=>berths.filter(b=>(b.port||'KTP')===curPort);
const portCranes=()=>cranes.filter(q=>(q.port||'KTP')===curPort);
function setPort(pid){
  if(pid===curPort||!PORTS.find(p=>p.id===pid))return;
  const doIt=()=>{
    curPort=pid;
    const sv=voyages.find(x=>x.id===selVoyageId);
    if(sv&&portOf(sv)!==curPort){selVoyageId=null;selVesselId=null;planDirty=false;planSnap=null;planSnapId=null;}
    TW=null;twinDirty=true;              /* the digital twin fully rebuilds for the selected port */
    logAudit('Operating port switched to '+curPortObj().name);
    document.querySelectorAll('.pbtn').forEach(b=>b.classList.toggle('on',b.dataset.port===curPort));
    toast('Operating port: '+curPortObj().label+' — all screens now show '+curPortObj().name+' data only');
    render();
  };
  if(view==='planning'&&planDirty)guardPlan(doIt);else doIt();
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-port]');if(b)setPort(b.dataset.port);});
/* ===== PERSISTENCE LAYER =====
   Frontend → API → server validation → PostgreSQL transaction → confirmed response → UI.
   When the bundled PortVision server (server/ in the repository) is running, vessels and
   voyages live in PostgreSQL and survive refresh, logout, browser and server restarts.
   Without the server the app runs in STANDALONE mode: state is saved in this browser's
   storage (survives refresh and restart on this machine) — shown honestly in the top bar
   and never described as a database save. Save failures are surfaced, never faked. */
const store={
  get(k){try{return localStorage.getItem(k);}catch(e){return null;}},
  set(k,v){try{localStorage.setItem(k,v);return true;}catch(e){return false;}}
};
const API_BASE=(store.get('pv_api')||'http://localhost:4000')+'/api';
let dbMode='standalone',dbErr=null;
async function api(path,opt){
  const r=await fetch(API_BASE+path,Object.assign({headers:{'Content-Type':'application/json'}},opt||{}));
  let j=null;try{j=await r.json();}catch(e){}
  if(!r.ok)throw new Error((j&&j.error)||('HTTP '+r.status));
  return j;
}
function updateDbBadge(){
  const el=$('#dbBadge');if(!el)return;
  el.textContent=dbMode==='postgres'?'🗄 PostgreSQL':'💾 Standalone';
  el.title=dbMode==='postgres'
    ?'Connected to the PortVision server — vessels & voyages are stored in PostgreSQL and shared between users'
    :'PortVision server not reachable — data is saved in THIS BROWSER only (survives refresh on this machine). Run server/ from the repository for PostgreSQL storage.'+(dbErr?' Last error: '+dbErr:'');
  el.style.background=dbMode==='postgres'?'#DCFCE7':'#FEF3C7';
  el.style.color=dbMode==='postgres'?'#046B4A':'#92400E';
}
async function persistVessel(rec,isEdit){
  if(dbMode==='postgres'){
    await api(isEdit?'/vessels/'+rec.id:'/vessels',{method:isEdit?'PUT':'POST',body:JSON.stringify(rec)});
  }else{
    const list=isEdit?vessels.map(x=>x.id===rec.id?rec:x):vessels.concat([rec]);
    if(!store.set('pv_vessels',JSON.stringify(list)))
      throw new Error('browser storage is unavailable — the vessel was NOT saved');
  }
}
let _persistT=null,_persistFailNoted=false;
function schedulePersist(){
  clearTimeout(_persistT);
  _persistT=setTimeout(async()=>{
    if(dbMode==='postgres'){
      try{await api('/state',{method:'PUT',body:JSON.stringify({voyages,viaSeq})});_persistFailNoted=false;dbErr=null;}
      catch(e){dbErr=e.message;
        if(!_persistFailNoted){_persistFailNoted=true;
          toast('⚠ PostgreSQL save failed: '+e.message+' — recent changes are NOT stored',true);}
        updateDbBadge();}
    }else{
      const ok=store.set('pv_voyages',JSON.stringify(voyages))
        &&store.set('pv_vessels',JSON.stringify(vessels))
        &&store.set('pv_viaSeq',String(viaSeq));
      if(!ok&&!_persistFailNoted){_persistFailNoted=true;
        toast('⚠ Browser storage unavailable — changes will be lost on refresh',true);}
    }
  },500);
}
async function initPersistence(){
  try{
    await api('/health');
    dbMode='postgres';
    let vs=await api('/vessels');
    if(!vs.length){await api('/vessels/seed',{method:'POST',body:JSON.stringify(vessels)});vs=await api('/vessels');}
    if(vs.length)vessels.splice(0,vessels.length,...vs);
    const vy=await api('/voyages');
    voyages.splice(0,voyages.length,...vy);
    viaSeq=Math.max(viaSeq,voyages.reduce((a,v)=>Math.max(a,(+v.via||0)+1),viaSeq));
  }catch(e){
    dbMode='standalone';dbErr=e.message;
    const sv=store.get('pv_vessels');if(sv)try{const a=JSON.parse(sv);if(a.length)vessels.splice(0,vessels.length,...a);}catch(_){}
    const so=store.get('pv_voyages');if(so)try{voyages.splice(0,voyages.length,...JSON.parse(so));}catch(_){}
    const sq=store.get('pv_viaSeq');if(sq)viaSeq=Math.max(viaSeq,+sq||viaSeq);
  }
  updateDbBadge();twinDirty=true;if(user)render();
}
initPersistence();
const craneBerthOf = q => (cranes.find(c=>c.id===q)||{}).berth;
let viaSeq = 2600001;
const voyages = [];          /* ← empty: no demo vessel calls */
const notifications = [];    /* ← empty */
const audit = [];            /* ← empty */
const settings = {productivity:30, etbOffset:60};
let user = null, view='dashboard', selVesselId=null, selVoyageId=null, twinDirty=true, pendingFocus=null;
let planSnap=null, planDirty=false, planSnapId=null, tlExtraDays=0;

/* ============================== HELPERS ============================== */
const $ = s => document.querySelector(s);
const vName = id => (vessels.find(v=>v.id===id)||{}).name||'—';
const vOf = voy => vessels.find(x=>x.id===voy.vesselId);
const activeVoyOnBerth = b => voyages.find(v=>v.berth===b && ['At Berth','Operating','Completed'].includes(v.status));
const craneBusy = q => voyages.find(v=>v.cranes.includes(q) && ['At Berth','Operating'].includes(v.status));
const totalHandled = () => voyages.filter(v=>v.atc&&inPort(v)).length;
const totalMoves = v => v.cargo.dis+v.cargo.lod+(v.hatch||0)+(v.binbox||0);
const portStayH = v => (v.atb&&v.atd)?(v.atd-v.atb)/H:null;
const bmph = v => {const st=portStayH(v);return st?totalMoves(v)/st:null;};
let dashMonths=new Set();
const movesOf = v => v.cargo.dis+v.cargo.lod;
const estHours = voy => {const m=movesOf(voy);const n=Math.max(1,voy.cranes.length);return Math.max(2,Math.ceil(m/(n*settings.productivity)*2)/2);};
function plannedWindow(voy){
  const s=voy.atb||voy.etb||voy.eta; if(!s)return null;
  const e=voy.atd||voy.etd||voy.atc||voy.etc||(s+estHours(voy)*H);
  return {s,e:Math.max(e,s+2*H)};
}
function berthOverlap(berthId,voy){
  const w=plannedWindow(voy); if(!w)return null;
  return voyages.find(o=>o.confirmed!==false&&o.id!==voy.id&&o.berth===berthId&&o.status!=='Sailed Out'&&(()=>{const ow=plannedWindow(o);return ow&&w.s<ow.e&&ow.s<w.e;})());
}
const sameDay=(a,b)=>{const x=new Date(a),y=new Date(b);return x.getDate()===y.getDate()&&x.getMonth()===y.getMonth()&&x.getFullYear()===y.getFullYear();};
const plannedTodayOn = b => voyages.find(v=>v.confirmed!==false&&v.berth===b&&v.status!=='Sailed Out'&&(()=>{const w=plannedWindow(v);return w&&(sameDay(w.s,now())||(w.s<now()&&w.e>now()));})());
function toast(msg,err){const t=$('#toast');t.textContent=msg;t.className='toast show'+(err?' err':'');clearTimeout(t._h);t._h=setTimeout(()=>t.className='toast',3200);}
function notify(t,m,ic){notifications.unshift({id:now(),t,m,at:now(),read:false,ic:ic||'🔔',port:curPort});updateBell();if(view==='notifications')render();}
function logAudit(a){audit.unshift({at:now(),u:user?user.role+' ('+user.mobile+')':'system',a,port:curPort});}
function updateBell(){const n=notifications.filter(x=>!x.read&&(x.port||'KTP')===curPort).length;const d=$('#bellDot');d.style.display=n?'flex':'none';d.textContent=n;
  $('#tbDone').textContent='🚢 Total vessels handled: '+totalHandled();
  updateDbBadge();}
function delayStr(est,act){if(!est||!act)return '';const d=act-est,m=Math.round(Math.abs(d)/60000),h=Math.floor(m/60),mm=m%60;const s=(h?h+'h ':'')+mm+'m';return d>60000?`<span class="late">+${s} late</span>`:`<span class="ontime">on time</span>`;}
function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));$('#'+id).classList.add('active');}
function badge(st){const s=STATUS[st];return `<span class="badge" style="background:${s.c}">${s.ic} ${st}</span>`;}
function vlink(voy){return `<span class="vlink" data-fv="${voy.id}">${vOf(voy).name}</span>`;}
let modalLock=false;
function openModal(html,cls){const bx=$('#modalBox');bx.className='modal'+(cls?' '+cls:'');bx.innerHTML=html;$('#modalWrap').classList.add('show');}
function closeModal(){modalLock=false;$('#modalWrap').classList.remove('show');}
$('#modalWrap').onclick=e=>{if(e.target.id==='modalWrap'&&!modalLock)closeModal();};
/* Unsaved berthing-plan guard: Save the plan / Cancel the plan */
function markPlanDirty(){if(selVoyageId)planDirty=true;}
function takePlanSnap(voy){planSnapId=voy.id;planDirty=false;
  planSnap=JSON.stringify({eta:voy.eta,firstEta:voy.firstEta,etb:voy.etb,eto:voy.eto,etc:voy.etc,etd:voy.etd,berth:voy.berth,via:voy.via,side:voy.side,bowB:voy.bowB,sternB:voy.sternB,cranes:voy.cranes.slice(),cargo:Object.assign({},voy.cargo)});}
function commitPlan(){const voy=voyages.find(v=>v.id===selVoyageId);
  if(voy){logAudit('Planning saved — VIA '+voy.via);toast('Plan saved for '+vOf(voy).name+' (VIA '+voy.via+') — reflected everywhere');takePlanSnap(voy);}
  planDirty=false;twinDirty=true;}
function revertPlan(){const voy=voyages.find(v=>v.id===selVoyageId);
  if(voy&&planSnap&&planSnapId===voy.id){const o=JSON.parse(planSnap);
    ['eta','firstEta','etb','eto','etc','etd','berth','via','side','bowB','sternB'].forEach(k=>voy[k]=o[k]);
    voy.cranes=o.cranes.slice();voy.cargo=Object.assign({},o.cargo);
    logAudit('Plan changes cancelled — VIA '+voy.via);toast('Plan changes cancelled');}
  planDirty=false;planSnap=null;planSnapId=null;twinDirty=true;}
function guardPlan(proceed){
  if(!planDirty||!selVoyageId){proceed();return;}
  const voy=voyages.find(v=>v.id===selVoyageId);
  openModal(`<h3>💾 Save the berthing plan?</h3>
    <p style="font-size:13.5px;line-height:1.5">You have unsaved planning changes for <b>${voy?vOf(voy).name:''}${voy?' (VIA '+voy.via+')':''}</b>.<br>Save the plan to keep them, or cancel the plan to discard.</p>
    <div class="mBtns"><button class="ghost" id="mDiscard">✖ Cancel the Plan</button><button class="primary" id="mSaveGo">💾 Save the Plan</button></div>`);
  $('#mSaveGo').onclick=()=>{commitPlan();closeModal();proceed();};
  $('#mDiscard').onclick=()=>{revertPlan();closeModal();proceed();};}
/* ETA/ETB planning validations (pop-up notifications) */
function etaClash(voy,ts){const M=60000;
  return voyages.find(o=>o.id!==voy.id&&portOf(o)===portOf(voy)&&o.status!=='Sailed Out'&&((o.eta&&Math.abs(o.eta-ts)<M)||(o.ata&&Math.abs(o.ata-ts)<M)));}
function conflictModal(title,msg){
  openModal(`<h3>⚠️ ${title}</h3><p style="font-size:13.5px;line-height:1.55">${msg}</p>
  <div class="mBtns"><button class="primary" id="mOk">OK — I will adjust the plan</button></div>`);
  $('#mOk').onclick=closeModal;}
function shiftVoy(voy,delta){
  const newEta=(voy.eta||now())+delta;
  const c1=etaClash(voy,newEta);
  if(c1){conflictModal('ETA clash — Condition 1',vOf(c1).name+' (VIA '+c1.via+') already has its ETA/ATA at '+fmt(newEta)+'. Two vessels cannot share the same ETA — pick a different time.');render();return false;}
  const trial=Object.assign({},voy,{eta:newEta,etb:voy.atb?voy.etb:(voy.etb?voy.etb+delta:null),etc:voy.atc?voy.etc:(voy.etc?voy.etc+delta:null),etd:voy.atd?voy.etd:(voy.etd?voy.etd+delta:null)});
  if(voy.berth){const clash=berthOverlap(voy.berth,trial);
    if(clash&&!voy.atb){const w=plannedWindow(clash);
      conflictModal('Tentative overlap on '+voy.berth,'This window overlaps <b>'+vOf(clash).name+'</b> ('+clash.status+') '+fmt(w.s)+' → '+fmt(w.e)+'. Tentative planning is allowed, but <b>ATB will be blocked until that vessel records ATD</b>'+(clash.etd?' (expected after ETD '+fmt(clash.etd)+')':'')+'. Adjust timings to avoid waiting.');}}
  voy.eta=newEta;if(!voy.firstEta)voy.firstEta=newEta;
  if(!voy.atb&&voy.etb)voy.etb+=delta;
  if(!voy.ato&&voy.eto)voy.eto+=delta;
  if(!voy.atc&&voy.etc)voy.etc+=delta;
  if(!voy.atd&&voy.etd)voy.etd+=delta;
  logAudit('ETA re-planned '+(delta>0?'+':'')+(delta/3600e3).toFixed(1)+'h — VIA '+voy.via);
  toast(vOf(voy).name+' re-planned · ETA '+fmt(voy.eta));
  twinDirty=true;render();return true;}
function setEtaChecked(voy,ts){
  if(voy.eta)return shiftVoy(voy,ts-voy.eta);
  const c1=etaClash(voy,ts);
  if(c1){conflictModal('ETA clash — Condition 1',vOf(c1).name+' (VIA '+c1.via+') already has its ETA/ATA at '+fmt(ts)+'. Two vessels cannot share the same ETA — pick a different time.');render();return false;}
  voy.eta=ts;voy.firstEta=ts;voy.etb=ts+settings.etbOffset*60000;
  toast('First ETA recorded · ETB auto-set to '+fmt(voy.etb));
  twinDirty=true;render();return true;}
function vesselInfoModal(voy){
  const ves=vOf(voy);
  openModal(`<h3>🚢 ${ves.name} — VIA ${voy.via}</h3>
    <div class="chipRow" style="margin-bottom:8px">
      <span class="chip">LOA <b>${ves.loa} m</b></span><span class="chip">Service <b>${ves.service}</b></span><span class="chip">Operator <b>${ves.operator}</b></span><span class="chip">IMO <b>${ves.imo}</b></span><span class="chip">Flag <b>${ves.flag}</b></span><span class="chip" style="background:#FFF7E0;border-color:#EAD48A">Port <b>${portName(portOf(voy))}</b></span><span class="chip">Berth <b>${voy.berth||'—'}</b></span>
    </div>
    <div class="chipRow" style="margin-bottom:10px">
      ${badge(voy.status)}
      <span class="chip">First ETA <b>${fmt(voy.firstEta)}</b></span><span class="chip">Latest ETA <b>${fmt(voy.eta)}</b></span>
      <span class="chip">ATA <b>${fmt(voy.ata)}</b></span><span class="chip">ETB <b>${fmt(voy.etb)}</b></span>
      <span class="chip">Cargo <b>${movesOf(voy)} moves</b></span><span class="chip">Cranes <b>${voy.cranes.join(', ')||'—'}</b></span>
      <span class="chip">Side <b>${voy.side==='STARBOARD'?'Starboard':'Port'} to berth</b></span>
      ${bolRange(voy)?`<span class="chip">Bollards <b>${bolRange(voy)[0]}–${bolRange(voy)[1]}</b> (bow #${voy.bowB} · stern #${voy.sternB} · ${bolRange(voy)[1]-bolRange(voy)[0]+1} total)</span>`:''}
    </div>
    ${voy.atb?'<p class="mut">Vessel is already berthed — ETA can no longer change (ETD still can).</p>':''}
    <div class="mGrid">
      ${voy.atb?'':`<div class="fld"><label>Change ETA (prepone / postpone)</label><input type="datetime-local" id="miEta" value="${voy.eta?toLocal(voy.eta):''}"></div>`}
      ${voy.atd?'':`<div class="fld"><label>ETD — planned departure (frees the berth after this)</label><input type="datetime-local" id="miEtd" value="${voy.etd?toLocal(voy.etd):''}"></div>`}
    </div>
    ${voy.etd&&(voy.etb||voy.eta)?`<p class="mut">Estimated port stay: <b>${(((voy.etd)-(voy.etb||voy.eta))/H).toFixed(1)} h</b> — the next vessel can be planned on ${voy.berth||'this berth'} after ${fmt(voy.etd)}.</p>`:''}
    <div class="mBtns">${voy.atb?'':'<button class="ghost" id="miAbort" style="border-color:#F3B8B8;color:#B42318">🗑 Abort Berthing Plan</button>'}<button class="ghost" id="mCancel">Close</button>${voy.atd?'':'<button class="primary" id="miSave">Update ETA / ETD</button>'}<button class="primary" id="miOpen" style="background:#2E5D9F">Open in Planning</button></div>`);
  $('#mCancel').onclick=closeModal;
  const mo=$('#miOpen');if(mo)mo.onclick=()=>{closeModal();guardPlan(()=>{selVesselId=voy.vesselId;selVoyageId=voy.id;render();});};
  const msv=$('#miSave');if(msv)msv.onclick=()=>{
    const elE=$('#miEta'),elD=$('#miEtd');
    if(elD&&elD.value){
      const newEtd=new Date(elD.value).getTime();
      const floor=voy.etb||voy.eta;
      if(floor&&newEtd<=floor){conflictModal('Invalid ETD','ETD must be after the berthing time ('+fmt(floor)+').');return;}
      const trial=Object.assign({},voy,{etd:newEtd});
      if(voy.berth){const clash=berthOverlap(voy.berth,trial);
        if(clash){const w=plannedWindow(clash);
          conflictModal('Tentative overlap on '+voy.berth,'This ETD overlaps <b>'+vOf(clash).name+'</b> ('+fmt(w.s)+' → '+fmt(w.e)+'). The next vessel\'s ATB stays blocked until this vessel records ATD — coordinate the timings.');}}
      voy.etd=newEtd;
      logAudit('ETD set '+fmt(newEtd)+' — VIA '+voy.via);
      toast(vOf(voy).name+' ETD '+fmt(newEtd)+' — '+(voy.berth||'berth')+' shows available after this');
      twinDirty=true;
    }
    closeModal();
    if(elE&&elE.value&&(!voy.eta||new Date(elE.value).getTime()!==voy.eta))setEtaChecked(voy,new Date(elE.value).getTime());
    else render();};
  const mab=$('#miAbort');if(mab)mab.onclick=()=>{
    openModal(`<h3>🗑 Abort Berthing Plan?</h3>
      <p style="font-size:13.5px;line-height:1.5">The berthing plan for <b>${ves.name} (VIA ${voy.via})</b> will be deleted — its planned window is removed from the timeline, dashboard, reports and the 3D twin. This cannot be undone.</p>
      <div class="mBtns"><button class="ghost" id="mCancel2">Keep the Plan</button><button class="primary" id="mAbortYes" style="background:#B42318">Yes, Abort the Plan</button></div>`);
    $('#mCancel2').onclick=closeModal;
    $('#mAbortYes').onclick=()=>{
      const ix=voyages.findIndex(x=>x.id===voy.id);
      if(ix>=0)voyages.splice(ix,1);
      if(selVoyageId===voy.id){selVoyageId=null;planDirty=false;planSnap=null;planSnapId=null;}
      notify('Berthing Plan Aborted',ves.name+' (VIA '+voy.via+') — plan deleted by the Vessel Planner','🗑');
      logAudit('Berthing plan aborted — VIA '+voy.via);
      closeModal();twinDirty=true;render();};};}
function toLocal(t){const d=new Date(t);d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,16);}

/* ============================== AUTH ============================== */
setTimeout(()=>show('login'),1800);
let selRole=null;
document.querySelectorAll('.roleCard').forEach(b=>b.onclick=()=>{document.querySelectorAll('.roleCard').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');selRole=b.dataset.role;checkLogin();});
$('#mobile').oninput=e=>{e.target.value=e.target.value.replace(/\D/g,'').slice(0,10);checkLogin();};
function checkLogin(){$('#sendOtp').disabled=!(selRole&&$('#mobile').value.length===10);}
$('#sendOtp').onclick=()=>{$('#otpHint').textContent='Enter the 6-digit code sent to +91 '+$('#mobile').value;show('otp');$('#otpRow input').focus();};
document.querySelectorAll('#otpRow input').forEach((inp,i,arr)=>{
  inp.oninput=()=>{inp.value=inp.value.replace(/\D/g,'');if(inp.value&&i<5)arr[i+1].focus();};
  inp.onkeydown=e=>{if(e.key==='Backspace'&&!inp.value&&i>0)arr[i-1].focus();};
});
$('#backLogin').onclick=()=>show('login');
$('#verifyOtp').onclick=()=>{
  const code=[...document.querySelectorAll('#otpRow input')].map(i=>i.value).join('');
  if(code!=='123456'){toast('Invalid OTP. Demo mode: use 123456',true);return;}
  user={role:selRole,mobile:$('#mobile').value};
  $('#uRole').textContent=user.role;$('#uMob').textContent='+91 '+user.mobile;
  buildNav();show('app');go('dashboard');updateBell();logAudit('Logged in');
};
$('#logout').onclick=()=>{user=null;document.querySelectorAll('#otpRow input').forEach(i=>i.value='');show('login');};
$('#bellBtn').onclick=()=>go('notifications');
const isAdmin=()=>user&&user.role==='Admin';
const canPlan=()=>user&&(user.role==='Vessel Planner'||user.role==='Admin');

/* ============================== NAV ============================== */
const NAVS=[
  {id:'dashboard', lb:'Dashboard', ic:'📊', roles:['Vessel Planner','Manager','Admin']},
  {id:'planning',  lb:'Vessel Planning', ic:'🧭', roles:['Vessel Planner','Admin']},
  {id:'twin',      lb:'3D Digital Twin', ic:'🌐', roles:['Vessel Planner','Manager','Admin']},
  {id:'reports',   lb:'Reports', ic:'📄', roles:['Vessel Planner','Manager','Admin']},
  {id:'notifications',lb:'Notifications', ic:'🔔', roles:['Vessel Planner','Manager','Admin']},
  {id:'admin',     lb:'Administration', ic:'🛡️', roles:['Admin']},
];
function buildNav(){
  $('#navRow').innerHTML=NAVS.filter(n=>n.roles.includes(user.role)).map(n=>`<button data-v="${n.id}">${n.ic} <span class="nvLb">${n.lb}</span></button>`).join('');
  document.querySelectorAll('#navRow button').forEach(b=>b.onclick=()=>go(b.dataset.v));
}
function go(v){
  if(view==='planning'&&v!=='planning'&&planDirty){guardPlan(()=>go2(v));return;}
  go2(v);}
function go2(v){view=v;document.querySelectorAll('#navRow button').forEach(b=>b.classList.toggle('on',b.dataset.v===v));
  $('#viewTitle').textContent=NAVS.find(n=>n.id===v).lb;render();}

/* ============================== RENDER ============================== */
function render(){
  const c=$('#content');
  updateBell();
  schedulePersist();
  if(view==='dashboard')c.innerHTML=rDashboard();
  else if(view==='planning'){c.innerHTML=rPlanning();wirePlanning();}
  else if(view==='twin'){c.innerHTML=rTwin();if(curPort==='ENN')initTwinENN();else initTwin();}
  else if(view==='reports'){c.innerHTML=rReports();wireReports();}
  else if(view==='notifications'){c.innerHTML=rNotifs();notifications.forEach(n=>n.read=true);updateBell();}
  else if(view==='admin'){c.innerHTML=rAdmin();wireAdmin();}
  wireVlinks();wireDashExtras();
}
function wireVlinks(){
  document.querySelectorAll('[data-fv]').forEach(el=>el.onclick=e=>{e.stopPropagation();pendingFocus={type:'vessel',id:+el.dataset.fv};go('twin');});
  document.querySelectorAll('[data-fb]').forEach(el=>el.onclick=e=>{e.stopPropagation();pendingFocus={type:'berth',id:el.dataset.fb};go('twin');});
}
function wireDashExtras(){
  if(view!=='dashboard')return;
  document.querySelectorAll('[data-mchip]').forEach(b=>b.onclick=()=>{
    const m=b.dataset.mchip;
    if(m==='ALL')dashMonths.clear();
    else dashMonths.has(m)?dashMonths.delete(m):dashMonths.add(m);
    render();});
  document.querySelectorAll('[data-dashqc]').forEach(el=>el.onclick=()=>{
    if(!canPlan())return;
    const q=cranes.find(x=>x.id===el.dataset.dashqc);
    if(craneBusy(q.id)){toast(q.id+' is operational on a vessel — release it first',true);return;}
    q.status=q.status==='Available'?'Maintenance':q.status==='Maintenance'?'Breakdown':'Available';
    if(q.status!=='Available')notify('Crane Unavailable',q.id+' set to '+q.status,'🔧');
    logAudit(q.id+' → '+q.status);twinDirty=true;render();});
  /* Dashboard berth-plan timeline: double-click a bar for details; Big Screen expands it */
  const wireTLbars=root=>{if(root)root.querySelectorAll('[data-tlv]').forEach(bar=>bar.ondblclick=()=>{
    const v=voyages.find(x=>x.id===+bar.dataset.tlv);if(v)vesselInfoModal(v);});};
  wireTLbars($('#dashTL'));
  const dsc=document.querySelector('#dashTL .tlScroll');
  if(dsc)dsc.scrollLeft=Math.max(0,(now()-window._tlT0)/864e5*window._tlDayW-2.5*window._tlDayW);
  const big=$('#dashTLBig');if(big)big.onclick=()=>{
    openModal(`<h3>🗓 Vessel Berth Plan — Big Screen</h3>
      <div id="dashTLBigWrap" style="max-height:76vh;overflow:auto">${berthTLHtml(null,false)}${dashPlanTable()}</div>
      <div class="mBtns"><button class="primary" id="mOk2">Close</button></div>`,'wide');
    $('#mOk2').onclick=closeModal;
    const wrap=$('#dashTLBigWrap');
    wireTLbars(wrap);
    wrap.querySelectorAll('[data-fv],[data-fb]').forEach(el=>el.onclick=e=>{e.stopPropagation();closeModal();
      pendingFocus=el.dataset.fv?{type:'vessel',id:+el.dataset.fv}:{type:'berth',id:el.dataset.fb};go('twin');});
    const sc2=wrap.querySelector('.tlScroll');
    if(sc2)sc2.scrollLeft=Math.max(0,(now()-window._tlT0)/864e5*window._tlDayW-2.5*window._tlDayW);};
}

/* ---------- Dashboard ---------- */
function rDashboard(){
  const tNow=now();
  const CV=voyages.filter(v=>v.confirmed!==false&&inPort(v));
  const opNow=CV.filter(v=>v.status==='Operating');
  const opToday=CV.filter(v=>v.ato&&sameDay(v.ato,tNow)||v.status==='Operating');
  const berthedToday=CV.filter(v=>v.atb&&sameDay(v.atb,tNow));
  const freeB=portBerths().filter(b=>!activeVoyOnBerth(b.id)&&!plannedTodayOn(b.id));
  const occB=portBerths().filter(b=>activeVoyOnBerth(b.id));
  const berthTimes=voyages.filter(v=>v.atb&&v.atc&&inPort(v)).map(v=>(v.atc-v.atb)/H);
  const avgB=berthTimes.length?(berthTimes.reduce((a,b)=>a+b,0)/berthTimes.length).toFixed(1):'0';
  const occHrsToday=voyages.filter(v=>v.atb&&inPort(v)).reduce((a,v)=>{
    const s=Math.max(v.atb,tNow-24*H),e=Math.min(v.atc||tNow,tNow);return a+Math.max(0,(e-s)/H);},0);
  const NB=portBerths().length;
  const utilToday=Math.min(100,Math.round(occHrsToday/(NB*24)*100));
  const cr=portCranes().filter(q=>craneBusy(q.id)).length;
  const teu=voyages.filter(inPort).reduce((a,v)=>a+movesOf(v),0);
  const tiles=[
    ['Total Vessels Handled — '+curPortObj().name,totalHandled(),'as of now'],
    ['Berths Available',freeB.length+' / '+NB,freeB.map(b=>b.id).join(' · ')||'none free'],
    ['Operational Berths Now',opNow.length?[...new Set(opNow.map(v=>v.berth))].join(' · '):'0','at current time'],
    ['Vessels Operational Today',opToday.length,''],
    ['Berthed Today',berthedToday.length,'vessels'],
    ['Avg Berthing Time',avgB,'hours'],
    ['Berth Utilization (today)',utilToday+'%',occHrsToday.toFixed(1)+' of '+(NB*24)+' berth-hours'],
    ['Crane Utilization',portCranes().length?Math.round(cr/portCranes().length*100)+'%':'—',cr+' of '+portCranes().length+' operational'],
    ['Containers Handled',teu.toLocaleString('en-IN'),'total moves (D+L)'],
    (()=>{const t2=cargoVolTotals('Liquid');return ['Liquid Cargo (MT)',t2.tot.toLocaleString('en-IN'),'Imported '+t2.imp.toLocaleString('en-IN')+' · Exported '+t2.exp.toLocaleString('en-IN')];})(),
    (()=>{const t2=cargoVolTotals('Bulk');return ['Bulk Cargo (MT)',t2.tot.toLocaleString('en-IN'),'Imported '+t2.imp.toLocaleString('en-IN')+' · Exported '+t2.exp.toLocaleString('en-IN')];})(),
    (()=>{const t2=cargoVolTotals('Break-Bulk');return ['Break-Bulk Cargo (MT)',t2.tot.toLocaleString('en-IN'),'Imported '+t2.imp.toLocaleString('en-IN')+' · Exported '+t2.exp.toLocaleString('en-IN')];})(),
    (()=>{const bs=CV.map(bmph).filter(Boolean);return ['Avg BMPH',bs.length?(bs.reduce((a,b)=>a+b,0)/bs.length).toFixed(1):'—','moves / port-stay hr'];})(),
  ];
  /* berth boxes: GREEN when unplanned/free, RED when occupied or planned for today */
  const strip=portBerths().map(b=>{
    const cur=activeVoyOnBerth(b.id);const plan=plannedTodayOn(b.id);
    const red=!!(cur||plan);
    const v=cur||plan;
    return `<div class="berthBox ${red?'rBusy':'gFree'}" data-fb="${b.id}" title="Open ${b.id} in 3D twin">
      <div class="bn">${b.id} ${red?'🔴':'🟢'}</div><div class="bt">${b.type} · ${b.len} m</div>
      <div class="bv">${cur?`${vlink(cur)} · VIA ${cur.via}<br>${badge(cur.status)}`
        :plan?`<span class="planned">Planned today:</span> ${vlink(plan)}<br><span class="mut">ETB ${fmt(plan.etb||plan.eta)}</span>`
        :'<span class="free">● Available — no plan today</span>'}</div></div>`;}).join('');
  const qcCard=(curPort==='KTP'?['CB1','CB2']:['EB1']).map(bid=>{
    const list=cranes.filter(q=>q.berth===bid);
    const used=list.filter(q=>craneBusy(q.id)).length;
    return `<div style="margin-bottom:6px"><span class="mut" style="font-weight:700">${bid} — ${used} of ${list.length} cranes in use</span></div>
    <div class="qcPos" style="margin-bottom:12px">${list.map(q=>{
      const busy=craneBusy(q.id);
      const cls=busy?'w':q.status==='Maintenance'?'m':q.status==='Breakdown'?'bd':'';
      const st=busy?'🏗️ Operational — '+vName(busy.vesselId):q.status==='Maintenance'?'🔧 Maintenance':q.status==='Breakdown'?'⛔ Breakdown':'✅ Available';
      return `<button class="qp ${cls}" data-dashqc="${q.id}" title="${canPlan()?'Click to change status':''}"><b>${q.id}</b>${st}</button>`;}).join('')}
    </div>`;}).join('')+`<div class="mut">${curPort==='KTP'?'B3 — worked by shore cranes / vessel gear. ':''}${canPlan()?'Click a crane to cycle Available → Maintenance → Breakdown.':''}</div>`;
  const VV=voyages.filter(v=>v.confirmed!==false&&inPort(v));
  const inPortNow=VV.filter(v=>v.status!=='Sailed Out'&&v.status!=='Incoming'&&v.status!=='At Anchorage');
  const currRows=VV.filter(v=>['At Anchorage','At Berth','Operating','Completed'].includes(v.status)).sort((a,b)=>(a.eta||0)-(b.eta||0))
    .map(v=>`<tr><td>${vlink(v)}</td><td>${v.via}</td><td>${vOf(v).service}</td><td>${vOf(v).loa}</td>
      <td>${fmt(v.eta)}${v.firstEta&&v.firstEta!==v.eta?'<div class="mut">1st ETA '+fmt(v.firstEta)+'</div>':''}${v.ata?'<div class="mut">ATA '+fmt(v.ata)+'</div>':''}</td>
      <td>${fmt(v.etb)}${v.atb?'<div class="mut">ATB '+fmt(v.atb)+'</div>':''}</td>
      <td>${fmt(v.etd)}${v.atd?'<div class="mut">ATD '+fmt(v.atd)+'</div>':''}</td>
      <td>${v.berth?`<span class="vlink" data-fb="${v.berth}">${v.berth}</span>`:'—'}</td><td>${v.cranes.join(', ')||'—'}</td><td>${badge(v.status)}</td></tr>`).join('');
  const upRows=VV.filter(v=>v.status==='Incoming').sort((a,b)=>(a.eta||9e15)-(b.eta||9e15))
    .map(v=>`<tr><td>${vlink(v)}</td><td>${v.via}</td><td>${vOf(v).service}</td><td>${vOf(v).loa}</td>
      <td><b>${fmt(v.eta)}</b>${v.firstEta&&v.firstEta!==v.eta?'<div class="mut">1st '+fmt(v.firstEta)+'</div>':''}</td><td>${fmt(v.etb)}</td><td>${fmt(v.etd)}</td><td>${v.berth||'<span class="mut">not planned</span>'}</td><td>${badge(v.status)}</td></tr>`).join('');
  const empty=`<div class="emptyState"><div class="big">🧭</div>No vessels yet. The Vessel Planner adds the first vessel from the <b>Vessel Planning</b> screen.</div>`;
  return `<div class="tiles">${tiles.map((t,i)=>`<div class="tile ${i===0?'hero':'accent'}"><div class="tl">${t[0]}</div><div class="tv">${t[1]}</div><div class="tu">${t[2]}</div></div>`).join('')}</div>
  <div class="card"><h4>Berth Occupancy — 🟢 free / unplanned · 🔴 occupied or planned today &nbsp;(click a berth to view in 3D)</h4><div class="berthStrip">${strip}</div></div>
  <div class="card"><h4>QC Crane Positions — ${curPortObj().name}${curPort==='KTP'?' (per MIDPL layout)':' (Ennore B1 · positions configurable)'}</h4>${qcCard}</div>
  <div class="card"><h4>Current Operations &nbsp;<span class="mut">(click a vessel name to see it in the 3D twin)</span></h4>
    ${currRows?`<table><thead><tr><th>Vessel</th><th>VIA</th><th>Service</th><th>LOA</th><th>ETA (Latest / 1st) / ATA</th><th>ETB / ATB</th><th>ETD / ATD</th><th>Berth</th><th>Cranes</th><th>Status</th></tr></thead><tbody>${currRows}</tbody></table>`:empty}</div>
  <div class="card"><h4 style="display:flex;align-items:center;gap:10px">Vessel Berth Plan — Assign Berth Timeline <span class="mut" style="font-weight:400;font-size:12px">which vessel · which berth · what period</span><button class="qc" id="dashTLBig" style="margin-left:auto">⛶ Big Screen</button></h4>
    <div id="dashTL">${berthTLHtml(null,false)}</div>
    ${dashPlanTable()}
  </div>
  <div class="card"><h4>Performance Analytics — month filter (single or multiple)</h4>
    <div class="tabRow" style="margin-bottom:10px">
      <button data-mchip="ALL" class="${dashMonths.size?'':'on'}">All months</button>
      ${(()=>{const ms=[...new Set(voyages.filter(v=>v.confirmed!==false&&inPort(v)).map(v=>monthKey(v.atd||v.atc||v.eta||tNow)))];
        if(!ms.includes(monthKey(tNow)))ms.push(monthKey(tNow));
        return ms.map(m=>`<button data-mchip="${m}" class="${dashMonths.has(m)?'on':''}">${m}</button>`).join('');})()}
    </div>
    ${(()=>{
      const inMonths=v=>!dashMonths.size||dashMonths.has(monthKey(v.atd||v.atc||v.eta||tNow));
      const gv=voyages.filter(v=>v.confirmed!==false&&inPort(v)&&v.gcr!=null&&inMonths(v));
      const bmv=voyages.filter(v=>v.confirmed!==false&&inPort(v)&&bmph(v)&&inMonths(v));
      const maxG=Math.max(40,...gv.map(v=>v.gcr));
      const maxB=Math.max(30,...bmv.map(v=>bmph(v)));
      const avgB=bmv.length?(bmv.reduce((a,v)=>a+bmph(v),0)/bmv.length).toFixed(1):null;
      const BARH=130;
      const gcols=gv.map(v=>{const red=v.gcr<30;const col=red?'#DC2626':'#16A34A';
        return `<div class="colItem"><div class="colVal" style="color:${col}">${red?'🔴':'🟢'} ${v.gcr.toFixed(1)}</div><div class="colBar" style="height:${Math.max(6,v.gcr/maxG*BARH).toFixed(0)}px;background:${col}"></div><div class="colLbl">${vOf(v).name}<br><span class="mut">VIA ${v.via}</span></div></div>`;}).join('');
      const bcols=bmv.map(v=>`<div class="colItem"><div class="colVal" style="color:#2E5D9F">${bmph(v).toFixed(1)}</div><div class="colBar" style="height:${Math.max(6,bmph(v)/maxB*BARH).toFixed(0)}px;background:#2E5D9F"></div><div class="colLbl">${vOf(v).name}<br><span class="mut">VIA ${v.via}</span></div></div>`).join('');
      return `<div class="mut" style="font-weight:700;margin-bottom:6px">GCR by vessel — X: vessel · Y: GCR · threshold 30 &nbsp;(🔴 below 30 · 🟢 30 and above)</div>
      ${gv.length?`<div class="colChart">${gcols}<div class="colThresh" style="bottom:${(46+30/maxG*BARH).toFixed(0)}px"><span>30</span></div></div>`
        :'<div class="mut" style="margin-bottom:8px">GCR appears here once a vessel\'s GCR is entered in the Vessel History &amp; GCR section.</div>'}
      <div class="mut" style="font-weight:700;margin:12px 0 6px">BMPH by vessel — Total Moves ÷ Port Stay (ATB→ATD) · no colour condition${avgB?' · <span style="color:#046B4A">Average: '+avgB+'</span>':''}</div>
      ${bmv.length?`<div class="colChart">${bcols}</div>`
        :'<div class="mut">BMPH appears once a vessel has ATB and ATD recorded.</div>'}`;})()}
  </div>
  <div class="card"><h4>Upcoming Operations — per planner's plan</h4>
    ${upRows?`<table><thead><tr><th>Vessel</th><th>VIA</th><th>Service</th><th>LOA</th><th>Planned ETA (Latest / 1st)</th><th>ETB</th><th>ETD</th><th>Berth</th><th>Status</th></tr></thead><tbody>${upRows}</tbody></table>`:'<div class="emptyState">No upcoming vessels planned yet.</div>'}</div>`;
}

/* ---------- Shared month-wide berth timeline (Planning + Dashboard) ---------- */
function berthTLHtml(activeId,planMode){
  const mS=new Date();mS.setHours(0,0,0,0);mS.setDate(1);
  const mE=new Date(mS);mE.setMonth(mE.getMonth()+1);
  const T0=mS.getTime(),T1=mE.getTime()+tlExtraDays*864e5;window._tlT0=T0;
  const days=Math.round((T1-T0)/864e5);const DAYW=110;window._tlDayW=DAYW;
  const monthName=mS.toLocaleString('en-IN',{month:'long',year:'numeric'})+(tlExtraDays?' → '+new Date(T1-864e5).toLocaleString('en-IN',{day:'2-digit',month:'short'}):'');
  const dayCells=Array.from({length:days},(_,i)=>{const d=new Date(T0+i*864e5+6*H);
    return `<div class="tlDayCell ${sameDay(d.getTime(),now())?'today':''}" style="width:${DAYW}px"><b>${d.getDate()}</b>${d.toLocaleString('en-IN',{weekday:'short'})}</div>`;}).join('');
  const lanes=portBerths().map(b=>{
    /* slot-stack time-overlapping (double-banked) vessels inside the SAME berth row */
    const laneV=voyages.filter(v=>v.berth===b.id&&v.status!=='Sailed Out'&&(v.confirmed!==false||v.id===activeId))
      .map(v=>({v,w:plannedWindow(v)})).filter(x=>x.w&&x.w.e>T0&&x.w.s<T1)
      .sort((a,b2)=>a.w.s-b2.w.s);
    laneV.forEach(x=>{x.slot=0;x.dual=false;});
    for(let i=0;i<laneV.length;i++)for(let j=0;j<i;j++){
      if(laneV[i].w.s<laneV[j].w.e&&laneV[j].w.s<laneV[i].w.e){
        laneV[i].dual=true;laneV[j].dual=true;
        if(laneV[i].slot===laneV[j].slot)laneV[i].slot=laneV[j].slot===0?1:0;}}
    const bars=laneV.map(x=>{
      const v=x.v,w=x.w;
      const l=(Math.max(w.s,T0)-T0)/864e5*DAYW, r=(Math.min(w.e,T1)-T0)/864e5*DAYW;
      const col=v.id===activeId?'#2E5D9F':cssVar(STATUS[v.status].c);
      const drag=planMode&&!v.atb;
      const draft=v.confirmed===false;
      const partner=x.dual?laneV.find(o=>o!==x&&x.w.s<o.w.e&&o.w.s<x.w.e):null;
      const dualCls=x.dual?' thin s'+x.slot+(x.slot===1?' alt':''):'';
      const qpos=(v.qFrom!=null&&v.qTo!=null)?' · quay '+v.qFrom.toFixed(0)+'–'+v.qTo.toFixed(0)+' m':'';
      return `<div class="tlBar ${drag?'draggable':''} ${draft?'draftBar':''}${dualCls}" data-tlv="${v.id}" style="left:${l}px;width:${Math.max(30,r-l)}px;background:${col}" title="${vOf(v).name} (LOA ${vOf(v).loa} m) · ETA ${fmt(v.eta)} · window ${fmt(w.s)} → ${fmt(w.e)}${qpos}${partner?' · DOUBLE-BANKED with '+vOf(partner.v).name:''}${drag?' — drag to prepone/postpone · double-click for details':' — double-click for details'}"><span class="tlBarTxt">${vOf(v).name}${x.dual?' · '+vOf(v).loa+' m':''}</span></div>`;}).join('');
    return `<div class="tlLaneM">${bars}</div>`;}).join('');
  return `<div class="tlMonth">
    <div class="tlLabels"><div class="tlMonthName">${monthName} · ${curPortObj().name}</div>${portBerths().map(b=>`<div class="tlLabelB" title="${b.name} — ${portName(b.port)}">${b.id==='EB1'?'Ennore B1':b.id}</div>`).join('')}</div>
    <div class="tlScroll" ${planMode?'id="tlScroll"':''}><div class="tlInner" style="width:${days*DAYW+52}px;background-size:${DAYW}px 100%">
      <div class="tlDayRow">${dayCells}${planMode?'<button class="tlAddBtn" id="tlAddDates" title="Add more dates — plan future berthing">＋</button>':''}</div>
      ${lanes}
      <div class="tlTodayLine" style="left:${(now()-T0)/864e5*DAYW}px"></div>
    </div></div>
  </div>
  <div class="mut" style="margin-top:6px">${planMode?`Scroll ⟷ across ${monthName} · use ＋ at the end to add future dates · drag a vessel bar to re-plan its ETA · double-click a bar for details`:`Scroll ⟷ across ${monthName} · double-click a vessel bar for full details`}</div>`;
}
function dashPlanTable(){
  const rows=voyages.filter(v=>v.confirmed!==false&&inPort(v)).sort((a,b)=>(a.eta||9e15)-(b.eta||9e15)).map(v=>{const w=plannedWindow(v);
    return `<tr><td>${vlink(v)}</td><td>${v.berth||'—'}</td><td>${fmt(v.eta)}</td><td>${fmt(v.atb)}</td><td>${fmt(v.ato)}</td><td>${fmt(v.atc)}</td><td>${fmt(v.atd)}</td><td>${w?((w.e-w.s)/H).toFixed(1)+' h':'—'}</td><td>${badge(v.status)}</td></tr>`;}).join('');
  return rows?`<div style="max-height:280px;overflow:auto;margin-top:10px"><table><thead><tr><th>Vessel</th><th>Berth</th><th>ETA</th><th>ATB</th><th>ATO</th><th>ATC</th><th>ATD</th><th>Berth Occupancy</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></div>`
    :'<div class="emptyState" style="margin-top:8px">No berthing plans yet — the Vessel Planner creates them in Vessel Planning.</div>';
}
/* ---------- Planning ---------- */
function rPlanning(){
  const ves=vessels.find(v=>v.id===selVesselId);
  const open=ves?voyages.filter(v=>v.vesselId===ves.id&&v.status!=='Sailed Out'):[];
  const voy=voyages.find(v=>v.id===selVoyageId);
  let html=`<div class="card"><h4>1 · Vessel Information</h4>
    <div class="chipRow" style="margin-bottom:8px">
      <span class="chip" style="font-weight:700">Port / Site</span>
      <button class="qc ${curPort==='KTP'?'mine':''}" data-port="KTP">Kattupalli</button>
      <button class="qc ${curPort==='ENN'?'mine':''}" data-port="ENN">Ennore</button>
      <span class="mut">Select the operating port first — the berth list, bollards, cranes, timeline and 3D twin all follow it. The plan is saved against <b>${curPortObj().name}</b>.</span>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
      <div class="combo">
        <input type="text" id="vesselSearch" placeholder="🔍 Type vessel name (e.g. A, H, MSC…)" value="${ves?ves.name:''}" autocomplete="off">
        <div class="comboList" id="comboList"></div>
      </div>
      <button class="qc" id="addVessel">＋ Add New Vessel</button>
      ${ves?`<button class="qc" id="editVessel">✏️ Edit Vessel</button>
      <select id="pVoyage" style="min-width:200px"><option value="">— Select voyage —</option>${open.map(v=>`<option value="${v.id}" ${v.id===selVoyageId?'selected':''}>VIA ${v.via} · ${v.status}</option>`).join('')}<option value="new">＋ New Voyage</option></select>`:''}
      ${voy?`<span class="mut">VIA No:</span><input type="text" id="viaEdit" value="${voy.via}" style="width:105px" maxlength="10">`:''}
    </div>
    ${ves?`<div class="chipRow"><span class="chip" style="background:#EFF4FC;border-color:#C6D4EA">Type of Vessel <select id="vtypeSel" style="padding:4px 8px;margin-left:6px;font-weight:700;color:var(--navy)">${VESSEL_TYPES.map(t=>`<option ${vtypeOf(ves)===t?'selected':''}>${t}</option>`).join('')}</select></span><span class="chip">LOA <b>${ves.loa} m</b></span><span class="chip">Service <b>${ves.service}</b></span><span class="chip">IMO <b>${ves.imo}</b></span><span class="chip">Call Sign <b>${ves.call}</b></span><span class="chip">Flag <b>${ves.flag}</b></span><span class="chip">Operator <b>${ves.operator}</b></span><span class="chip">Permitted berths <b>${TYPE_BERTHS[vtypeOf(ves)].join(' · ')}</b></span></div>`:''}
    ${voy?`<div class="etaBar">
      <div class="fld" style="margin:0"><label>Tentative ETA (date &amp; time) *</label><input type="datetime-local" id="etaMain" value="${voy.eta?toLocal(voy.eta):''}" ${voy.ata&&!isAdmin()?'disabled':''}></div>
      <div class="mut" style="padding-bottom:10px">Setting ETA auto-calculates ETB (ETA + 1 h) and drives the milestone timeline below.</div>
      ${voy.confirmed===false
        ?`<button class="saveBtn" id="vesselSelectedBtn" style="padding:11px 20px">✔ Vessel Selected</button>
          <div class="mut" style="padding-bottom:10px;color:#B45309;font-weight:600">Draft — not yet reflected in dashboard / 3D / reports until you click “Vessel Selected”.</div>`
        :`<span class="chip" style="background:#ECFDF5;border-color:#A7E3C9;color:#046B4A;align-self:center">✔ Vessel Selected — live everywhere</span>`}
    </div>`:''}
  </div>`;
  if(!voy) return html+`<div class="card mut">Search a vessel above, then select a voyage (or create a new one) to begin planning.</div>`+rGcrSection();
  const cg=voy.cargo;
  const vt=vtypeOf(ves);
  if(vt==='Container'){
    html+=`<div class="card"><h4>2 · Cargo Details — Container</h4><div class="cargoGrid">
      ${[['dis','Total Discharge Containers'],['lod','Total Loading Containers'],['rfr','Reefer Containers'],['odc','ODC Cargo'],['odo','One Door Open Containers'],['haz','Hazardous Containers']]
        .map(f=>`<div class="fld"><label>${f[1]}</label><input type="number" min="0" data-cg="${f[0]}" value="${cg[f[0]]}"></div>`).join('')}
    </div></div>`;
  } else {
    if(!voy.cargoLines)voy.cargoLines=CARGO_OPTS[vt].map(n=>({name:n,vol:0,dir:'Import'}));
    html+=`<div class="card"><h4>2 · Cargo Details — ${vt} <span class="mut">(volume in ${vt==='Liquid'?'KL / MT':'MT'})</span></h4>
      ${voy.cargoLines.map((c,i)=>`<div style="display:flex;gap:10px;align-items:end;margin-bottom:8px;flex-wrap:wrap">
        <div class="fld" style="margin:0"><label>Cargo</label><input type="text" data-clname="${i}" value="${c.name}" placeholder="Cargo name" style="min-width:200px"></div>
        <div class="fld" style="margin:0"><label>Cargo Volume (MT)</label><input type="number" min="0" data-clvol="${i}" value="${c.vol}" style="width:120px"></div>
        <div class="fld" style="margin:0"><label>Direction</label><select data-cldir="${i}"><option ${c.dir!=='Export'?'selected':''}>Import</option><option ${c.dir==='Export'?'selected':''}>Export</option></select></div>
        <button class="qc" data-clrm="${i}" title="Remove cargo line">✖</button>
      </div>`).join('')}
      <div style="display:flex;gap:10px;align-items:center;margin-top:4px">
        <button class="qc" id="addCargoLine">＋ Add Cargo</button>
        <span class="chip">Total volume <b>${voy.cargoLines.reduce((a,c)=>a+(+c.vol||0),0).toLocaleString('en-IN')}</b></span>
      </div>
    </div>`;
  }
  /* month-wide berth timeline — shared builder (also used on the Dashboard) */
  const tl=berthTLHtml(voy.id,true);
  html+=`<div class="card"><h4>3 · Assign Berth — full-month timeline prevents overlap</h4>
    <div class="berthCards">
      ${portBerths().map(b=>{const occ=activeVoyOnBerth(b.id);const mine=voy.berth===b.id;const busy=occ&&occ.id!==voy.id;const ok=berthAllowed(ves,b.id);
        return `<button class="bCard ${mine?'mine':''} ${busy?'busy':''} ${ok?'':'noType'}" data-berth="${b.id}">
        <div class="bn">${b.id} <span class="mut" style="font-weight:400">· ${b.len} m</span></div><div class="mut">${b.type}</div>
        <div style="margin-top:6px;font-size:12px">${!ok?'⛔ Not permitted for '+vt+' vessels':busy?'🟠 Occupied — '+vName(occ.vesselId)+(occ.etd?'<br><span class="mut">free after ETD '+fmt(occ.etd)+'</span>':'')+'<br><span class="mut">tentative / double-banking as per rules</span>':mine?'✔ Assigned to this vessel':'<span class="free">● Free</span>'}</div></button>`;}).join('')}
    </div>
    <div class="tlWrap">${tl}</div>
    ${voy.berth?(()=>{
      const pool=poolOf(voy.berth),pmax=poolMax(pool);
      const occ=occupiedBollardMap(voy);
      const r=bolRange(voy);
      const opts=sel=>Array.from({length:pmax},(_,i)=>i+1).map(n=>`<option value="${n}" ${sel===n?'selected':''} ${occ[n]&&STRICT_POOLS.includes(pool)?'disabled':''}>#${n}${occ[n]?' — occupied':''}</option>`).join('');
      const chips=Array.from({length:pmax},(_,i)=>{const n=i+1;
        let cls='',lb='';
        if(occ[n]){cls='occ';lb=vOf(occ[n]).name;}
        else if(voy.bowB===n)cls='bow';
        else if(voy.sternB===n)cls='stern';
        else if(r&&n>=r[0]&&n<=r[1])cls='mid';
        return `<button class="bol ${cls} ${pool==='CB2B3'&&n>=18?'b3s':''}" data-bol="${n}" title="Bollard ${n}${pool==='CB2B3'?(n>=18?' (on B3 quay)':' (on CB2 quay)'):''}${occ[n]?' — occupied by '+lb:voy.bowB===n?' — BOW':voy.sternB===n?' — STERN':r&&n>=r[0]&&n<=r[1]?' — auto-allocated':' — available'}">${n}</button>`;}).join('');
      return `
    <div style="margin-top:12px;border-top:1px dashed var(--line);padding-top:10px">
      <span class="qcGroupLb">BERTHING SIDE — which side of the vessel lies alongside (rotates the vessel in 3D)</span>
      <div class="chipRow">
        <button class="qc ${voy.side!=='STARBOARD'?'mine':''}" data-side="PORT">🔴 Port Side to Berth</button>
        <button class="qc ${voy.side==='STARBOARD'?'mine':''}" data-side="STARBOARD">🟢 Starboard Side to Berth</button>
      </div>
      <span class="qcGroupLb" style="margin-top:10px">SELECT MOORING BOLLARDS — pick Bow &amp; Stern; every bollard between is allocated automatically · ${voy.berth==='CB1'?'CB1 pool: bollards 1–17 · 22.5 m spacing':voy.berth==='EB1'?'ENNORE B1 pool: bollards 1–27 · 15 m spacing — bollard conflicts between simultaneous vessels are strictly enforced':'CB2 + B3 SHARED pool: bollards 1–34 (1–17 on CB2 quay · 18–34 on B3 quay) — NO selection restriction: whichever Bow &amp; Stern bollards you pick are accepted as final'}</span>
      <div class="chipRow" style="align-items:end;margin-top:6px">
        <div class="fld" style="margin:0"><label>Bow Bollard</label><select id="bowSel"><option value="">—</option>${opts(voy.bowB)}</select></div>
        <div class="fld" style="margin:0"><label>Stern Bollard</label><select id="sternSel"><option value="">—</option>${opts(voy.sternB)}</select></div>
        ${r?`<span class="chip">Occupied range <b>${r[0]}–${r[1]}</b> · <b>${r[1]-r[0]+1}</b> bollards · span ${((r[1]-r[0])*BOLLARD_SPACING).toFixed(1)} m (LOA ${ves.loa} m)</span>`:'<span class="mut">Tip: you can also click the bollard chips — first click sets Bow, second sets Stern.</span>'}
      </div>
      <div class="bolWrap">${chips}</div>
      <div class="chipRow" style="margin-top:4px;font-size:11px">
        <span class="chip" style="background:#EDFAF2;color:#046B4A;border-color:#A7E3C9">Available</span>
        <span class="chip" style="background:#2563EB;color:#fff;border-color:#2563EB">Bow</span>
        <span class="chip" style="background:#7C3AED;color:#fff;border-color:#7C3AED">Stern</span>
        <span class="chip" style="background:#0D9488;color:#fff;border-color:#0D9488">Auto-allocated</span>
        <span class="chip" style="background:#FDECEC;color:#B42318;border-color:#F3B8B8">Occupied</span>
      </div>
      ${r?`<div class="chipRow" style="margin-top:6px">
        <span class="chip">Vessel <b>${ves.name}</b></span><span class="chip">Berth <b>${voy.berth}</b></span><span class="chip">LOA <b>${ves.loa} m</b></span><span class="chip">ETA <b>${fmt(voy.eta)}</b></span>
        <span class="chip">Side <b>${voy.side==='STARBOARD'?'Starboard':'Port'} to berth</b></span><span class="chip">Bow <b>#${voy.bowB}</b></span><span class="chip">Stern <b>#${voy.sternB}</b></span>
        <span class="chip">Total bollards <b>${r[1]-r[0]+1}</b></span>${badge(voy.status)}
      </div>`:''}
    </div>`;})():''}
    ${craneApplicable(ves)?`
    <div style="margin-top:12px;border-top:1px dashed var(--line);padding-top:10px">
      <span class="qcGroupLb">SELECT CRANE — required for ${vt} vessels ${voy.berth?'· '+voy.berth:'· select a berth first'}</span>
      ${voy.berth?(voy.berth==='B3'
        ?`<div class="mut" style="margin-top:6px">B3 has no QC cranes — ${vt==='Break-Bulk'?'press “Port Crane not required” (vessel gear / shore crane arrangement).':'shore arrangement applies.'}</div>`
        :`<div class="craneChips" style="margin-top:6px">${CRANE_ORDER[voy.berth].map(qid=>{const q=cranes.find(c=>c.id===qid);const busy=craneBusy(qid);const mine=voy.cranes.includes(qid);
          return `<button class="qc ${mine?'mine':''} ${busy&&busy.id!==voy.id?'busy':''} ${q.status==='Maintenance'?'mnt':q.status==='Breakdown'?'bd':''}" data-bqc="${qid}" ${voy.craneWaived?'disabled':''}>${qid}${q.status==='Maintenance'?' 🔧':q.status==='Breakdown'?' ⛔':''}</button>`;}).join('')}</div>`)
      :''}
      ${vt==='Break-Bulk'&&voy.berth?`<button class="qc ${voy.craneWaived?'mine':''}" id="pcnr" style="margin-top:8px">${voy.craneWaived?'✔ Port Crane not required (vessel gear)':'Port Crane not required'}</button>`:''}
      ${voy.cranes.length?`<div class="chipRow"><span class="chip">Selected cranes: <b>${voy.cranes.join(' · ')}</b> — saved with this berth assignment</span></div>`:voy.craneWaived?`<div class="chipRow"><span class="chip" style="background:#ECFDF5;border-color:#A7E3C9;color:#046B4A">Port crane waived — vessel works with own gear</span></div>`:''}
    </div>`:''}
  </div>`;
  /* progressive milestones */
  const ms=[
    ['ETA','ata','Arrival','eta','ETA → ATA', true],
    ['ETB','atb','Berthing','etb','ETB → ATB', !!voy.ata],
    ['ETO','ato','Operation','eto','ETO → ATO', !!voy.atb],
    ['ETC','atc','Completion','etc','ETC → ATC', !!voy.ato],
    ['ETD','atd','Departure','etd','ETD → ATD', !!voy.atc],
  ];
  html+=`<div class="card"><h4>5 · Time Planning — each milestone unlocks when the previous actual is recorded <span class="mut">${isAdmin()?'(Admin: everything editable, even after sail-out)':'(recorded actuals stay editable until sail-out)'}</span></h4>
    ${ms.map(m=>{const est=voy[m[3]],act=voy[m[1]];const unlocked=m[5]||isAdmin();
      if(!unlocked&&!est&&!act)return `<div class="msRow locked"><div class="msName">${m[0]}<span>${m[2]}</span></div><div class="mut" style="grid-column:2/5">🔒 Unlocks after ${m[0]==='ETB'?'ATA':m[0]==='ETO'?'ATB':m[0]==='ETC'?'ATO':'ATC'} is recorded</div></div>`;
      return `<div class="msRow">
        <div class="msName">${m[0]}<span>${m[2]}</span></div>
        <div><input type="datetime-local" data-est="${m[3]}" value="${est?toLocal(est):''}" ${(act&&!isAdmin())?'disabled':''}></div>
        <div class="sliderWrap"><span class="slLabel">${m[4]}</span>
          <input type="range" class="sl ${act?'done':''}" min="0" max="100" value="${act?100:0}" data-sl="${m[1]}" ${(act&&!isAdmin())||!unlocked?'disabled':''}>
        </div>
        <div class="actualCell">${act?`<b>✅ ${fmt(act)}</b>${delayStr(est,act)}${(isAdmin()||voy.status!=='Sailed Out')?`<input type="datetime-local" data-act="${m[1]}" value="${toLocal(act)}" style="margin-top:4px;font-size:11px;padding:4px 6px" title="${isAdmin()?'Admin: editable anytime':'Editable until sail out'}">`:''}`:'<span class="mut">Not recorded</span>'}</div>
      </div>`;}).join('')}
  </div>`;
  html+=rGcrSection();
  html+=`<div style="display:flex;gap:12px;align-items:center;margin-bottom:30px">
    <button class="saveBtn" id="savePlan">💾 Save Planning</button>
    <button class="saveBtn" id="nextVessel" style="background:#2E5D9F">➕ Next Vessel Berthing Plan</button>
    <button class="sailBtn" id="sailOut" ${voy.status==='Completed'?'':'disabled'}>🚢 Sail Out (ATD)</button>
    <span style="margin-left:auto">${badge(voy.status)}</span>
  </div>`;
  return html;
}
function craneDeployModal(voy){
  if(voy.berth==='B3'){toast('B3 is worked by shore cranes / vessel gear — no QC cranes to deploy');return;}
  const list=cranes.filter(q=>q.berth===voy.berth); /* specified order QC01–04 or QC05–08 */
  openModal(`<h3>🏗️ Deploy Cranes — ${voy.berth} (order: ${list.map(q=>q.id).join(' → ')})</h3>
    <p class="mut" style="margin-bottom:8px">Select the QC cranes for ${vName(voy.vesselId)} (VIA ${voy.via}). Only ${voy.berth} cranes can reach this berth.</p>
    <div class="qcPick">${list.map(q=>{
      const busy=craneBusy(q.id);const dis=(busy&&busy.id!==voy.id)||q.status!=='Available';
      const note=busy&&busy.id!==voy.id?'Operational — '+vName(busy.vesselId):q.status==='Maintenance'?'Under maintenance':q.status==='Breakdown'?'Breakdown':'Available';
      return `<label class="${dis?'dis':''}"><input type="checkbox" value="${q.id}" ${voy.cranes.includes(q.id)?'checked':''} ${dis?'disabled':''}> <b>${q.id}</b> <span class="mut">· ${note}</span></label>`;}).join('')}
    </div>
    <div class="mBtns"><button class="ghost" id="mCancel">Skip for now</button><button class="primary" id="mDeploy">Deploy Selected</button></div>`);
  $('#mCancel').onclick=closeModal;
  $('#mDeploy').onclick=()=>{
    const sel=[...document.querySelectorAll('.qcPick input:checked')].map(i=>i.value);
    voy.cranes=sel;if(voy.id===selVoyageId)markPlanDirty();
    if(sel.length){notify('Crane Assigned',sel.join(', ')+' deployed to '+vName(voy.vesselId)+' (VIA '+voy.via+')','🏗️');logAudit('Cranes '+sel.join(',')+' — VIA '+voy.via);}
    closeModal();twinDirty=true;render();};
}
function vesselModal(existing){
  const v=existing||{name:'',imo:'',call:'',flag:'India',operator:'',loa:'',beam:'',draft:'',service:'ADHOC'};
  openModal(`<h3>${existing?'Edit Vessel — '+existing.name:'Add New Vessel'} <span class="mut" style="font-size:11px;font-weight:400">saved to the Vessel Master (${dbMode==='postgres'?'PostgreSQL':'this browser — standalone mode'})</span></h3>
    <div class="mGrid">
      <div class="fld" style="grid-column:1/3"><label>Vessel Name *</label><input id="mvName" value="${v.name}"></div>
      <div class="fld"><label>IMO Number</label><input id="mvImo" value="${v.imo}"></div>
      <div class="fld"><label>Call Sign</label><input id="mvCall" value="${v.call}"></div>
      <div class="fld"><label>Flag</label><input id="mvFlag" value="${v.flag}"></div>
      <div class="fld"><label>Operator</label><input id="mvOp" value="${v.operator}"></div>
      <div class="fld"><label>LOA (m) *</label><input id="mvLoa" type="number" step="0.01" value="${v.loa}"></div>
      <div class="fld"><label>Beam (m)</label><input id="mvBeam" type="number" step="0.01" value="${v.beam||''}"></div>
      <div class="fld"><label>Draft (m)</label><input id="mvDraft" type="number" step="0.01" value="${v.draft||''}"></div>
      <div class="fld"><label>Service</label><input id="mvSvc" value="${v.service}"></div>
      <div class="fld"><label>Type of Vessel *</label><select id="mvType">${VESSEL_TYPES.map(t=>`<option ${(v.vtype||'Container')===t?'selected':''}>${t}</option>`).join('')}</select></div>
    </div>
    <div class="mBtns"><button class="ghost" id="mCancel">Cancel</button><button class="primary" id="mSave">${existing?'Save Changes':'Add Vessel'}</button></div>`);
  $('#mCancel').onclick=closeModal;
  $('#mSave').onclick=async()=>{
    const name=$('#mvName').value.trim().toUpperCase(),loa=+$('#mvLoa').value;
    const beam=$('#mvBeam').value===''?null:+$('#mvBeam').value;
    const draft=$('#mvDraft').value===''?null:+$('#mvDraft').value;
    const vtype=$('#mvType').value;
    /* validation — clear message, nothing saved on failure */
    const err=!name?'Vessel Name is required'
      :!(isFinite(loa)&&loa>0)?'LOA must be a positive number'
      :(beam!=null&&!(isFinite(beam)&&beam>0))?'Beam must be a positive number'
      :(draft!=null&&!(isFinite(draft)&&draft>0))?'Draft must be a positive number'
      :!VESSEL_TYPES.includes(vtype)?'Type of Vessel must be one of: '+VESSEL_TYPES.join(', ')
      :(!existing&&vessels.some(x=>x.name===name))?'Vessel already exists — search it instead'
      :null;
    if(err){toast('⚠ '+err,true);return;}
    const rec={id:existing?existing.id:now(),name,imo:$('#mvImo').value||'—',call:$('#mvCall').value||'—',
      flag:$('#mvFlag').value||'—',operator:$('#mvOp').value||'—',loa,beam,draft,
      service:$('#mvSvc').value||'ADHOC',vtype};
    const btn=$('#mSave');btn.disabled=true;btn.textContent='Saving…';
    try{
      await persistVessel(rec,!!existing);              /* confirmed BEFORE the UI updates */
      if(existing)Object.assign(existing,rec);
      else{vessels.push(rec);selVesselId=rec.id;selVoyageId=null;}
      logAudit((existing?'Vessel edited: ':'Vessel added: ')+name+' ('+vtype+', LOA '+loa+' m)');
      toast('✔ '+name+(existing?' updated':' added')+' — '+(dbMode==='postgres'
        ?'saved in PostgreSQL and available in vessel selection'
        :'saved in this browser (standalone mode) and available in vessel selection'));
      closeModal();render();
    }catch(e){
      btn.disabled=false;btn.textContent=existing?'Save Changes':'Add Vessel';
      toast('⚠ NOT saved — '+(e.message||'save failed'),true);
    }};
}
function rGcrSection(){
  const pend=voyages.filter(v=>v.confirmed!==false&&inPort(v)&&v.status==='Sailed Out'&&!v.cycleDone);
  return `<div class="card"><h4>6 · Vessel History &amp; GCR Update <span class="mut">— enter the GCR after sail-out to close the vessel cycle</span></h4>
    ${pend.length?pend.map(v=>{const b=bmph(v);
      return `<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;padding:10px 4px;border-bottom:1px dashed var(--line)">
        <div style="flex:1;min-width:340px;font-size:13px"><b>${vOf(v).name}</b> · VIA ${v.via} · Berth ${v._berthHist||'—'}<br>
          <span class="mut">ATB ${fmt(v.atb)} → ATD ${fmt(v.atd)} · Total moves ${totalMoves(v)} (D+L ${v.cargo.dis+v.cargo.lod} · Hatch ${v.hatch||0} · Bin ${v.binbox||0}) · BMPH ${b?b.toFixed(1):'—'} · Cranes ${(v._craneHist||[]).join(', ')||'—'}</span></div>
        <input type="number" step="0.1" min="0" placeholder="GCR (mph)" data-gcrin="${v.id}" style="width:110px">
        <button class="saveBtn" data-gcrdone="${v.id}" style="padding:9px 14px;font-size:13px">✔ Vessel Cycle Completed</button>
      </div>`;}).join('')
    :'<div class="emptyState">No sailed-out vessels pending GCR update — all vessel cycles are complete.</div>'}
  </div>`;
}
function wirePlanning(){
  document.querySelectorAll('[data-gcrdone]').forEach(b=>b.onclick=()=>{
    const v=voyages.find(x=>String(x.id)===b.dataset.gcrdone);if(!v)return;
    const inp2=document.querySelector('[data-gcrin="'+v.id+'"]');
    const val=inp2?+inp2.value:0;
    if(!val){toast('Enter the GCR value first (moves per crane-hour)',true);return;}
    v.gcr=val;v.cycleDone=true;
    notify('Vessel Cycle Completed',vOf(v).name+' (VIA '+v.via+') — GCR '+val+' recorded; cycle closed','✔');
    logAudit('Vessel cycle completed — VIA '+v.via+' · GCR '+val);
    toast(vOf(v).name+' cycle completed — removed from the pending list');
    render();});
  const inp=$('#vesselSearch'),list=$('#comboList');
  function showList(q){
    const Q=(q||'').trim().toUpperCase();
    let hits=Q?vessels.filter(v=>v.name.startsWith(Q)):vessels.slice();
    if(Q&&!hits.length)hits=vessels.filter(v=>v.name.includes(Q));
    list.innerHTML=hits.length?hits.map(v=>`<button data-vid="${v.id}"><b>${v.name}</b> <span class="mut">· ${v.service} · LOA ${v.loa} m</span></button>`).join(''):`<span class="mut">No vessel found — use “Add New Vessel”.</span>`;
    list.classList.add('open');
    list.querySelectorAll('[data-vid]').forEach(b=>b.onclick=()=>guardPlan(()=>{selVesselId=+b.dataset.vid;selVoyageId=null;list.classList.remove('open');render();}));
  }
  if(inp){inp.oninput=()=>showList(inp.value);inp.onfocus=()=>showList(inp.value);
    document.addEventListener('click',e=>{if(!e.target.closest('.combo'))list.classList.remove('open');},{once:true});}
  const av=$('#addVessel');if(av)av.onclick=()=>vesselModal(null);
  const ev=$('#editVessel');if(ev)ev.onclick=()=>vesselModal(vessels.find(v=>v.id===selVesselId));
  const pv=$('#pVoyage');if(pv)pv.onchange=()=>guardPlan(()=>{
    if(pv.value==='new'){const nv={id:now(),vesselId:selVesselId,via:String(viaSeq++),status:'Incoming',eta:null,firstEta:null,etb:null,eto:null,etc:null,etd:null,ata:null,atb:null,ato:null,atc:null,atd:null,berth:null,cranes:[],port:curPort,confirmed:false,craneWaived:false,side:'PORT',bowB:null,sternB:null,cargo:{dis:0,lod:0,rfr:0,odc:0,odo:0,haz:0}};
      voyages.push(nv);selVoyageId=nv.id;logAudit('New voyage VIA '+nv.via+' — '+vName(selVesselId));toast('New voyage created — VIA '+nv.via);twinDirty=true;}
    else selVoyageId=+pv.value||null;
    render();});
  const voy=voyages.find(v=>v.id===selVoyageId);if(!voy)return;
  const ves=vessels.find(v=>v.id===selVesselId);
  if(planSnapId!==voy.id)takePlanSnap(voy);
  const vts=$('#vtypeSel');if(vts)vts.onchange=()=>{
    ves.vtype=vts.value;voy.cargoLines=null;
    if(!['Container','Break-Bulk'].includes(vts.value)){voy.cranes=[];voy.craneWaived=false;}
    if(voy.berth&&!berthAllowed(ves,voy.berth)){voy.berth=null;voy.cranes=[];voy.qFrom=null;voy.qTo=null;
      toast('Berth cleared — '+vts.value+' vessels are not permitted there. Permitted: '+TYPE_BERTHS[vts.value].join(', '),true);}
    logAudit('Vessel type set to '+vts.value+' — '+ves.name);markPlanDirty();twinDirty=true;render();};
  document.querySelectorAll('[data-clname]').forEach(i=>i.onchange=()=>{voy.cargoLines[+i.dataset.clname].name=i.value;markPlanDirty();});
  document.querySelectorAll('[data-clvol]').forEach(i=>i.onchange=()=>{voy.cargoLines[+i.dataset.clvol].vol=+i.value||0;markPlanDirty();render();});
  document.querySelectorAll('[data-clrm]').forEach(b2=>b2.onclick=()=>{voy.cargoLines.splice(+b2.dataset.clrm,1);markPlanDirty();render();});
  document.querySelectorAll('[data-cldir]').forEach(i=>i.onchange=()=>{voy.cargoLines[+i.dataset.cldir].dir=i.value;markPlanDirty();});
  const acl=$('#addCargoLine');if(acl)acl.onclick=()=>{voy.cargoLines.push({name:'',vol:0,dir:'Import'});markPlanDirty();render();};
  const vsb=$('#vesselSelectedBtn');if(vsb)vsb.onclick=()=>{
    if(voy.berth&&!berthAllowed(ves,voy.berth)){
      conflictModal('Berth not permitted','This vessel cannot be confirmed: the selected vessel type (<b>'+vtypeOf(ves)+'</b>) is not permitted at '+voy.berth+'. Change the berth or the vessel type first.');return;}
    if(voy.berth&&craneApplicable(ves)&&voy.berth!=='B3'&&!voy.cranes.length&&!voy.craneWaived){
      conflictModal('Crane required','Please select a Crane for '+vtypeOf(ves)+' vessel before confirming the berth assignment.'+(vtypeOf(ves)==='Break-Bulk'?'<br><br>Or press <b>“Port Crane not required”</b> if the vessel works with its own gear.':''));return;}
    voy.confirmed=true;
    notify('Vessel Selected',vOf(voy).name+' (VIA '+voy.via+') confirmed by the planner — now live across the system','✔');
    logAudit('Vessel selected — VIA '+voy.via);
    toast('Vessel selected — reflected in dashboard, 3D twin, timeline & reports');
    twinDirty=true;render();};
  const etaMain=$('#etaMain');if(etaMain)etaMain.onchange=()=>{
    if(!etaMain.value){render();return;}
    if(setEtaChecked(voy,new Date(etaMain.value).getTime()))markPlanDirty();};
  const nv=$('#nextVessel');if(nv)nv.onclick=()=>guardPlan(()=>{
    selVesselId=null;selVoyageId=null;render();
    toast('Next vessel: search the vessel, create its voyage and set the ETA');
    const vs=$('#vesselSearch');if(vs)vs.focus();});
  const viaE=$('#viaEdit');if(viaE)viaE.onchange=()=>{
    const nv=viaE.value.trim();
    if(!nv){viaE.value=voy.via;return;}
    if(voyages.some(v=>v.via===nv&&v.id!==voy.id)){toast('VIA '+nv+' already exists on another voyage',true);viaE.value=voy.via;return;}
    logAudit('VIA changed '+voy.via+' → '+nv);voy.via=nv;markPlanDirty();toast('VIA updated to '+nv);};
  document.querySelectorAll('[data-cg]').forEach(i=>i.onchange=()=>{voy.cargo[i.dataset.cg]=+i.value||0;markPlanDirty();});
  document.querySelectorAll('[data-est]').forEach(i=>i.onchange=()=>{
    const k=i.dataset.est;const ts=i.value?new Date(i.value).getTime():null;
    if(k==='eta'){if(ts)setEtaChecked(voy,ts);else render();return;}
    const old=voy[k];voy[k]=ts;markPlanDirty();
    if(k==='etb'&&ts&&voy.berth){const clash=berthOverlap(voy.berth,voy);
      if(clash){const w=plannedWindow(clash);voy[k]=old;
        conflictModal('ETB overlap — Condition 2',voy.berth+' already has <b>'+vOf(clash).name+'</b> planned/occupied from '+fmt(w.s)+' to '+fmt(w.e)+'. Adjust the ETB — overlapping windows are not allowed.');return;}}
    render();});
  /* month timeline: drag to re-plan, double-click for details */
  const ab=$('#tlAddDates');if(ab)ab.onclick=()=>{tlExtraDays+=7;render();toast('7 more days added to the timeline — plan future berthing');
    setTimeout(()=>{const sc2=$('#tlScroll');if(sc2)sc2.scrollLeft=sc2.scrollWidth;},50);};
  const sc=$('#tlScroll');
  if(sc)sc.scrollLeft=Math.max(0,(now()-window._tlT0)/864e5*window._tlDayW-2.5*window._tlDayW);
  document.querySelectorAll('[data-tlv]').forEach(bar=>{
    const bv=voyages.find(x=>String(x.id)===bar.dataset.tlv);if(!bv)return;
    bar.ondblclick=()=>{if(!bar._justDragged)vesselInfoModal(bv);};
    if(!bar.classList.contains('draggable'))return;
    bar.onpointerdown=e=>{e.preventDefault();bar.setPointerCapture(e.pointerId);
      bar._sx=e.clientX;bar._l0=parseFloat(bar.style.left);bar._drag=false;};
    bar.onpointermove=e=>{if(bar._sx===undefined)return;
      const dx=e.clientX-bar._sx;
      if(Math.abs(dx)>4)bar._drag=true;
      if(bar._drag){bar.classList.add('dragging');bar.style.left=(bar._l0+dx)+'px';}};
    bar.onpointerup=e=>{if(bar._sx===undefined)return;
      const dx=e.clientX-bar._sx;const wasDrag=bar._drag;
      bar._sx=undefined;bar._drag=false;bar.classList.remove('dragging');
      if(!wasDrag)return;
      bar._justDragged=true;setTimeout(()=>{bar._justDragged=false;},400);
      const deltaMs=Math.round(dx/window._tlDayW*48)/48*864e5;  /* snap to 30 min */
      if(Math.abs(deltaMs)<15*60000){render();return;}
      shiftVoy(bv,deltaMs);};
  });
  document.querySelectorAll('[data-act]').forEach(i=>i.onchange=()=>{ /* admin edits actuals */
    voy[i.dataset.act]=i.value?new Date(i.value).getTime():null;
    logAudit((isAdmin()?'ADMIN':'Planner')+' edited '+i.dataset.act.toUpperCase()+' — VIA '+voy.via);
    toast(i.dataset.act.toUpperCase()+' updated');twinDirty=true;render();});
  document.querySelectorAll('[data-berth]').forEach(b=>b.onclick=()=>{
    const id=b.dataset.berth;const occ=activeVoyOnBerth(id);
    if(voy.berth===id){voy.berth=null;voy.cranes=[];voy.qFrom=null;voy.qTo=null;voy.bowB=null;voy.sternB=null;twinDirty=true;render();return;}
    /* 1 · vessel-type eligibility */
    if(!berthAllowed(ves,id)){
      conflictModal('Berth not permitted — '+id,
        'This vessel cannot be assigned to '+id+' because the selected vessel type (<b>'+vtypeOf(ves)+'</b>) is not permitted at this berth.<br><br>Permitted berths for '+vtypeOf(ves)+' vessels: <b>'+TYPE_BERTHS[vtypeOf(ves)].join(' · ')+'</b>.');
      return;}
    if(!voy.eta){toast('Set the tentative ETA first — the timeline needs it to plan the window',true);return;}
    /* 2 · double-banking rules for a time-overlapping co-occupant (LOA caps + 15 m clearances + positions) */
    const d=dualCheck(id,voy);
    if(!d.ok){conflictModal('Two vessels at '+id+' — not possible',d.msg);return;}
    voy.berth=id;voy.cranes=[];voy.bowB=null;voy.sternB=null;markPlanDirty();
    if(d.co.length){ /* approved double-banking: compute quay positions */
      const other=d.other;
      if(other.qFrom==null){other.qFrom=d.otherPos.from;other.qTo=d.otherPos.to;}
      voy.qFrom=d.pos.from;voy.qTo=d.pos.to;
      conflictModal('Double-banking approved — '+id,
        '<b>'+vOf(other).name+'</b> ('+vOf(other).loa+' m) at '+other.qFrom.toFixed(0)+'–'+other.qTo.toFixed(0)+' m and <b>your vessel</b> ('+vOf(voy).loa+' m) at '+voy.qFrom.toFixed(0)+'–'+voy.qTo.toFixed(0)+' m fit '+id+' with the mandatory '+GAP+' m clearance in front, between and behind ('+d.spare+' m spare).');
    } else {
      voy.qFrom=null;voy.qTo=null;
      /* sequential occupancy (no time overlap): tentative with availability info */
      const clash=(occ&&occ.id!==voy.id)?occ:berthOverlap(id,voy);
      if(clash&&clash.id!==voy.id){
        const freeAt=clash.atd||clash.etd||plannedWindow(clash).e;
        conflictModal('Tentative berth — '+id+' availability',
          '<b>'+vOf(clash).name+'</b> (VIA '+clash.via+', '+clash.status+') holds '+id+' and is expected to sail at ETD <b>'+fmt(freeAt)+'</b>.'+
          '<br><br>Your vessel is tentatively planned on '+id+' — it can record ATA at anchorage, but <b>ATB will only be allowed after that vessel records its ATD</b>.');
      } else if(['Container','Break-Bulk'].includes(vtypeOf(ves))&&id!=='B3') craneDeployModal(voy);
    }
    notify('Berth Assigned',vName(voy.vesselId)+' (VIA '+voy.via+') assigned to '+id,'🧱');logAudit('Berth '+id+' assigned — VIA '+voy.via);
    twinDirty=true;render();
  });
  document.querySelectorAll('[data-side]').forEach(b2=>b2.onclick=()=>{
    voy.side=b2.dataset.side;
    logAudit('Berthing side '+voy.side+' — VIA '+voy.via);
    toast((voy.side==='STARBOARD'?'Starboard':'Port')+' side to berth — vessel orientation updated in the 3D twin');
    markPlanDirty();twinDirty=true;render();});
  const bowSel=$('#bowSel'),sternSel=$('#sternSel');
  function trySetBollards(){
    const b2=+bowSel.value||null,s2=+sternSel.value||null;
    if(b2&&s2){if(!applyBollards(voy,b2,s2))render();}
    else{voy.bowB=b2;voy.sternB=s2;markPlanDirty();render();}}
  if(bowSel)bowSel.onchange=trySetBollards;
  if(sternSel)sternSel.onchange=trySetBollards;
  document.querySelectorAll('[data-bol]').forEach(b2=>b2.onclick=()=>{
    const n=+b2.dataset.bol;
    if(b2.classList.contains('occ')&&STRICT_POOLS.includes(poolOf(voy.berth))){const o=occupiedBollardMap(voy)[n];
      toast('Bollard '+n+' is occupied by '+(o?vOf(o).name:'another vessel'),true);return;}
    if(!voy.bowB||(voy.bowB&&voy.sternB)){voy.bowB=n;voy.sternB=null;markPlanDirty();toast('Bow bollard #'+n+' — now pick the Stern bollard');render();}
    else{if(!applyBollards(voy,voy.bowB,n))render();}});
  document.querySelectorAll('[data-bqc]').forEach(b2=>b2.onclick=()=>{
    const qid=b2.dataset.bqc;const q=cranes.find(c=>c.id===qid);
    if(q.status!=='Available'){toast(qid+' is under '+q.status,true);return;}
    const busy=craneBusy(qid);if(busy&&busy.id!==voy.id){toast(qid+' is operational on '+vName(busy.vesselId),true);return;}
    if(voy.cranes.includes(qid))voy.cranes=voy.cranes.filter(x=>x!==qid);
    else{voy.cranes.push(qid);notify('Crane Assigned',qid+' selected for '+vName(voy.vesselId)+' (VIA '+voy.via+')','🏗️');logAudit(qid+' selected — VIA '+voy.via);}
    voy.craneWaived=false;markPlanDirty();twinDirty=true;render();});
  const pcnr=$('#pcnr');if(pcnr)pcnr.onclick=()=>{
    voy.craneWaived=!voy.craneWaived;if(voy.craneWaived)voy.cranes=[];
    logAudit('Port crane '+(voy.craneWaived?'not required (waived)':'required again')+' — VIA '+voy.via);
    toast(voy.craneWaived?'Port crane not required — vessel will work with its own gear':'Port crane selection required again');
    markPlanDirty();twinDirty=true;render();};
  document.querySelectorAll('[data-sl]').forEach(sl=>{
    sl.oninput=()=>{if(+sl.value>=97&&!voy[sl.dataset.sl])recordActual(voy,sl.dataset.sl,sl);};
    sl.onchange=()=>{if(+sl.value<97&&!voy[sl.dataset.sl])sl.value=0;};});
  const sp=$('#savePlan');if(sp)sp.onclick=()=>commitPlan();
  const so=$('#sailOut');if(so)so.onclick=()=>confirmSailOut(voy);
}
function recordActual(voy,key,sl){
  const ves=vOf(voy);
  if(voy.confirmed===false){toast('Click “Vessel Selected” first — confirm the vessel before recording actuals',true);if(sl)sl.value=0;return;}
  if(key==='atd'){
    if(!voy.atc){toast('Record ATC first — vessel must complete before departure',true);if(sl)sl.value=0;return;}
    if(sl)sl.value=0;confirmSailOut(voy);return;}
  if(key==='atb'&&voy.berth){
    /* alongside = vessels physically at ANY berth of the same PHYSICAL bollard pool */
    const pb=poolBerths(voy.berth);
    const alongsideSame=voyages.filter(o=>o.id!==voy.id&&o.confirmed!==false&&o.berth===voy.berth&&o.atb&&!o.atd);
    const alongsidePool=voyages.filter(o=>o.id!==voy.id&&o.confirmed!==false&&pb.includes(o.berth)&&o.atb&&!o.atd);
    let block=null;
    if(alongsideSame.length>=2)block=voy.berth+' already has two vessels alongside — maximum 2 simultaneous vessels per berth.';
    else if(alongsideSame.length===1&&voy.berth==='CB1'){
      const o=alongsideSame[0];const comb=vOf(voy).loa+vOf(o).loa;
      if(comb>CB1_COMBINED_MAX)block='CB1 Berthing Restriction: with 2 vessels the combined LOA must not exceed '+CB1_COMBINED_MAX+' m — '+vOf(o).name+' ('+vOf(o).loa+' m) + your vessel ('+vOf(voy).loa+' m) = <b>'+comb+' m</b>.'+(o.etd?'<br><br>Berth available after its ETD <b>'+fmt(o.etd)+'</b> → ATD.':'');}
    if(!block){
      /* physical bollard conflict — enforced on CB1 only (CB2/B3: the operator's bollard choice is final) */
      const r=bolRange(voy);
      if(STRICT_POOLS.includes(poolOf(voy.berth)))for(const o of alongsidePool){
        const ro=bolRange(o);if(!r||!ro)continue;
        const cl=Math.max(r[0],ro[0]),ch=Math.min(r[1],ro[1]);
        if(cl<=ch){block='Bollard Conflict: bollards <b>'+cl+'–'+ch+'</b> are already occupied by '+vOf(o).name+' (bollards '+ro[0]+'–'+ro[1]+'). Adjust your Bow/Stern bollards.'+(o.etd?'<br><br>They free after its ETD <b>'+fmt(o.etd)+'</b> → ATD.':'');break;}}
      if(!block&&alongsideSame.length===1&&!r){
        const o=alongsideSame[0];const B=berths.find(b=>b.id===voy.berth);
        const need=GAP*3+vOf(voy).loa+vOf(o).loa;
        if(need>B.len)block='Insufficient berth space on '+voy.berth+': the two vessels + '+GAP+' m clearances need '+need.toFixed(1)+' m but the berth is '+B.len+' m. Select mooring bollards to plan the exact positions.';
        else{if(o.qFrom==null){o.qFrom=GAP;o.qTo=GAP+vOf(o).loa;}
          voy.qFrom=o.qTo+GAP;voy.qTo=voy.qFrom+vOf(voy).loa;}}
    }
    if(block){if(sl)sl.value=0;conflictModal('Berth not yet available — '+voy.berth,block);return;}}
  const need={ata:()=>voy.eta?null:'Set ETA first',
    atb:()=>!voy.ata?'Record ATA first':!voy.berth?'Assign a berth before recording ATB':(craneApplicable(ves)&&voy.cranes.length===0&&!voy.craneWaived&&voy.berth!=='B3')?'Please select a Crane for '+vtypeOf(ves)+' vessel before berthing (or use “Port Crane not required” for Break-Bulk)':null,
    ato:()=>!voy.atb?'Record ATB first':null,
    atc:()=>!voy.ato?'Record ATO first':null}[key]();
  if(need){toast(need,true);if(sl)sl.value=0;return;}
  voy[key]=now();
  const map={ata:['At Anchorage','Vessel Arrived',ves.name+' (VIA '+voy.via+') arrived at anchorage','⚓'],
    atb:['At Berth','Vessel Berthed',ves.name+' all fast on '+voy.berth,'🧱'],
    ato:['Operating','Operation Started',ves.name+' operations commenced on '+voy.berth+' ('+(voy.cranes.join(', ')||'shore gear')+')','🏗️'],
    atc:['Completed','Operation Completed',ves.name+' cargo operations completed','✅']};
  voy.status=map[key][0];notify(map[key][1],map[key][2],map[key][3]);logAudit(key.toUpperCase()+' recorded — VIA '+voy.via);
  /* pre-fill next estimate when milestone achieved */
  if(key==='atb'&&!voy.eto)voy.eto=voy.atb+1*H;
  if(key==='ato'&&!voy.etc)voy.etc=voy.ato+estHours(voy)*H;
  if(key==='atc'&&!voy.etd)voy.etd=voy.atc+2*H;
  if(key==='atc'){voy._craneHist=voy.cranes.slice();voy._craneCount=voy.cranes.length;voy._berthHist=voy.berth;
    setTimeout(()=>hatchBinModal(voy),350);}
  twinDirty=true;render();
}
function hatchBinModal(voy){
  openModal(`<h3>🧰 Operation Completed — final handling figures</h3>
    <p class="mut" style="margin-bottom:10px">${vOf(voy).name} (VIA ${voy.via}) — enter the totals for BMPH calculation.</p>
    <div class="mGrid">
      <div class="fld"><label>Total Hatch Covers Handled</label><input type="number" min="0" id="hcHat" value="${voy.hatch||0}"></div>
      <div class="fld"><label>Total Bin Boxes Handled</label><input type="number" min="0" id="hcBin" value="${voy.binbox||0}"></div>
    </div>
    <div class="mBtns"><button class="primary" id="hcSave">Save Figures</button></div>`);
  modalLock=true;  /* mandatory — Save is the only way out */
  $('#hcSave').onclick=()=>{
    voy.hatch=+$('#hcHat').value||0;voy.binbox=+$('#hcBin').value||0;
    logAudit('Hatch covers '+voy.hatch+' · bin boxes '+voy.binbox+' — VIA '+voy.via);
    toast('Recorded: '+voy.hatch+' hatch covers, '+voy.binbox+' bin boxes — total moves now '+totalMoves(voy));
    closeModal();render();};}
function confirmSailOut(voy){
  if(voy.hatch===undefined&&voy.binbox===undefined){
    toast('Enter the hatch cover & bin box figures first — needed for BMPH',true);
    hatchBinModal(voy);return;}
  const ves=vOf(voy);
  openModal(`<h3>🚢 Confirm Sail Out</h3>
    <p style="font-size:14px;margin-bottom:6px"><b>${ves.name}</b> · VIA ${voy.via}</p>
    <p class="mut">Berth <b>${voy.berth}</b> and all deployed cranes will be released. The voyage closes into history; dashboard &amp; reports update.</p>
    <div class="mBtns"><button class="ghost" id="mCancel">Cancel</button><button class="primary" id="mConfirmSail" style="background:#B45309">Confirm Sail Out</button></div>`);
  $('#mCancel').onclick=closeModal;
  $('#mConfirmSail').onclick=()=>{closeModal();sailOut(voy);};
}
function sailOut(voy){
  const ves=vOf(voy);
  $('#sailName').textContent=ves.name+' — SAILING OUT';
  const ov=$('#sailOverlay');ov.classList.add('show');
  const anim=ov.querySelector('.shipAnim');anim.style.animation='none';void anim.offsetWidth;anim.style.animation='';
  setTimeout(()=>{ov.classList.remove('show');},3500);
  voy.atd=now();voy.status='Sailed Out';const b=voy.berth;voy.berth=null;voy.cranes=[];
  notify('Sail Out Completed (ATD)',ves.name+' departed with tug assistance. Berth '+b+' is now available.','🌊');
  logAudit('Sail out — VIA '+voy.via+' (berth '+b+' released)');
  twinDirty=true;render();
}

/* ---------- Notifications ---------- */
function rNotifs(){
  return `<div class="card"><h4>Notifications — ${curPortObj().name}</h4>${notifications.filter(n=>(n.port||'KTP')===curPort).map(n=>`
    <div class="notifItem ${n.read?'':'unread'}"><div class="notifIc">${n.ic}</div>
    <div><b>${n.t}</b><p>${n.m}</p></div><time>${fmt(n.at)}</time></div>`).join('')||'<div class="emptyState">No notifications yet.</div>'}</div>`;
}

/* ---------- Reports (month-wise with GCR + crane detail, CSV & PDF) ---------- */
let repTab='monthly';
const monthKey=t=>{const d=new Date(t);return d.toLocaleString('en-IN',{month:'short',year:'numeric'});};
function craneHours(voy){return voy.ato&&voy.atc?(voy.atc-voy.ato)/H:0;}
function gcr(voy){const h=craneHours(voy)*Math.max(1,voy.cranes.length||voy._craneCount||1);return h?(movesOf(voy)/h):0;}
function rReports(){
  const tabs=[['monthly','Monthly Vessels + GCR'],['bmphrep','Vessel Report'],['liquidrep','Liquid Report'],['bulkrep','Bulk & Break-Bulk Report'],['cranewise','Crane Detailed Report'],['history','Vessel History'],['berth','Berth Utilization'],['cargo','Cargo Summary']];
  const done=voyages.filter(v=>v.atc&&inPort(v));
  let body='',title='';
  if(repTab==='monthly'){
    title='Monthly Completed Vessels — Volume & GCR';
    const months={};
    done.forEach(v=>{const k=monthKey(v.atc);months[k]=months[k]||{n:0,vol:0,gsum:0};
      months[k].n++;months[k].vol+=movesOf(v);months[k].gsum+=gcr(v);});
    const rows=Object.entries(months).map(([k,m])=>[k,m.n,m.vol.toLocaleString('en-IN'),(m.gsum/m.n).toFixed(1)+' mph']);
    body=rows.length?tbl(['Month','Vessels Completed','Total Volume (moves)','Avg GCR (moves/crane-hr)'],rows):`<div class="emptyState">No completed vessels yet — complete a vessel (ATC) and it appears here month-wise.</div>`;
  }else if(repTab==='bmphrep'){
    title='Vessel Report — BMPH & GCR · cargo volumes in MT for Liquid / Bulk / Break-Bulk';
    const bv=voyages.filter(v=>v.confirmed!==false&&inPort(v)&&portStayH(v));
    const rows=bv.map(v=>{const cvol=(v.cargoLines||[]).reduce((a,c)=>a+(+c.vol||0),0);
      return [vOf(v).name+' <span class="mut">('+vtypeOf(vOf(v))+')</span>',v.via,v.cargo.dis+v.cargo.lod,(v.hatch||0),(v.binbox||0),totalMoves(v),cvol?cvol.toLocaleString('en-IN'):'—',fmt(v.atb),fmt(v.atd),portStayH(v).toFixed(1),bmph(v)?'<b>'+bmph(v).toFixed(1)+'</b>':'—',v.gcr?'<b>'+v.gcr.toFixed(1)+'</b>':'<span class="mut">pending</span>'];});
    if(rows.length){const bb=bv.filter(v=>bmph(v));
      const avg=bb.length?(bb.reduce((a,v)=>a+bmph(v),0)/bb.length).toFixed(1):'—';
      const gv=bv.filter(v=>v.gcr);const avgG=gv.length?(gv.reduce((a,v)=>a+v.gcr,0)/gv.length).toFixed(1):'—';
      const tvol=bv.reduce((a,v)=>a+(v.cargoLines||[]).reduce((x,c)=>x+(+c.vol||0),0),0);
      rows.push(['<b>AVERAGE / TOTAL</b>','','','','','','<b>'+(tvol?tvol.toLocaleString('en-IN'):'—')+'</b>','','','','<b>'+avg+'</b>','<b>'+avgG+'</b>']);}
    body=rows.length?tbl(['Vessel','VIA','D+L Moves','Hatch Covers','Bin Boxes','Total Moves','Cargo Vol (MT)','ATB','ATD','Port Stay (h)','BMPH','GCR'],rows):`<div class="emptyState">The Vessel Report fills in after a vessel records ATB and ATD (sail out).</div>`;
  }else if(repTab==='liquidrep'||repTab==='bulkrep'){
    const types=repTab==='liquidrep'?['Liquid']:['Bulk','Break-Bulk'];
    title=(repTab==='liquidrep'?'Liquid Cargo Report':'Bulk & Break-Bulk Cargo Report')+' — volumes in Metric Tonnes (MT)';
    const rows=[];let ti=0,te=0;
    voyages.filter(v=>v.confirmed!==false&&inPort(v)&&types.includes(vtypeOf(vOf(v)))&&(v.cargoLines||[]).some(c=>+c.vol)).forEach(v=>{
      v.cargoLines.filter(c=>+c.vol).forEach(c=>{
        const e=c.dir==='Export';if(e)te+=+c.vol;else ti+=+c.vol;
        rows.push([vOf(v).name,v.via,vtypeOf(vOf(v)),c.name||'—',c.dir||'Import',(+c.vol).toLocaleString('en-IN'),fmt(v.atb),fmt(v.atd),v.status]);});});
    if(rows.length)rows.push(['<b>TOTAL</b>','','','','<b>Imp '+ti.toLocaleString('en-IN')+' · Exp '+te.toLocaleString('en-IN')+'</b>','<b>'+(ti+te).toLocaleString('en-IN')+'</b>','','','']);
    body=rows.length?tbl(['Vessel','VIA','Type','Cargo','Direction','Volume (MT)','ATB','ATD','Status'],rows):`<div class="emptyState">No ${repTab==='liquidrep'?'liquid':'bulk / break-bulk'} cargo volumes recorded yet.</div>`;
  }else if(repTab==='cranewise'){
    title='Crane Detailed Report — month-wise';
    const rows=[];
    portCranes().forEach(q=>{
      const months={};
      done.forEach(v=>{if(!v._craneHist||!v._craneHist.includes(q.id))return;
        const k=monthKey(v.atc);months[k]=months[k]||{n:0,hrs:0,mv:0};
        months[k].n++;months[k].hrs+=craneHours(v);months[k].mv+=movesOf(v)/Math.max(1,v._craneHist.length);});
      Object.entries(months).forEach(([k,m])=>rows.push([k,q.id,q.berth,m.n,m.hrs.toFixed(1),Math.round(m.mv).toLocaleString('en-IN'),m.hrs?(m.mv/m.hrs).toFixed(1)+' mph':'—']));
    });
    body=rows.length?tbl(['Month','Crane','Berth','Vessels Served','Working Hours','Moves (share)','GCR'],rows):`<div class="emptyState">No crane operations recorded yet.</div>`;
  }else if(repTab==='history'){
    title='Vessel History';
    const head=['Vessel','VIA','Berth','First ETA','Last ETA','ATA','ATB','ATO','ATC','ATD','Status'];
    if(isAdmin())head.push('Edit');
    const histV=voyages.filter(v=>v.confirmed!==false&&inPort(v));
    body=histV.length?tbl(head,
      histV.map(v=>{const r=[vOf(v).name,v.via,v.berth||(v._berthHist||'—'),fmt(v.firstEta),fmt(v.eta),fmt(v.ata),fmt(v.atb),fmt(v.ato),fmt(v.atc),fmt(v.atd),v.status];
        if(isAdmin())r.push(`<button class="qc" data-editvoy="${v.id}">✏️</button>`);return r;})):`<div class="emptyState">No voyages yet.</div>`;
  }else{
    title='Berth Utilization';
    body=tbl(['Berth','Type','Vessels Handled','Occupied Hours','Current'],
      portBerths().map(b=>{const vs=voyages.filter(v=>v.atb&&(v.berth===b.id||v._berthHist===b.id));
        const hrs=vs.reduce((a,v)=>a+(((v.atc||now())-v.atb)/H),0);
        const cur=activeVoyOnBerth(b.id);
        return [b.id,b.type,vs.length,hrs.toFixed(1),cur?vName(cur.vesselId):'Free'];}));
  }
  if(repTab==='cargo'){
    title='Cargo Summary';
    const tot=k=>voyages.filter(inPort).reduce((x,v)=>x+(v.cargo[k]||0),0);
    body=tbl(['Measure','Total'],[
      ['Total discharge containers',tot('dis').toLocaleString('en-IN')],
      ['Total loading containers',tot('lod').toLocaleString('en-IN')],
      ['Reefer containers',tot('rfr').toLocaleString('en-IN')],
      ['ODC cargo (units)',tot('odc').toLocaleString('en-IN')],
      ['One door open containers',tot('odo').toLocaleString('en-IN')],
      ['Hazardous containers',tot('haz').toLocaleString('en-IN')],
      ['Total moves',(tot('dis')+tot('lod')).toLocaleString('en-IN')]]);
  }
  title+=' — '+curPortObj().name.toUpperCase();
  window._repTitle=title;
  return `<div class="tabRow" style="margin-bottom:6px"><span class="chip" style="align-self:center;font-weight:700">Port / Site</span>
      <button data-port="KTP" class="${curPort==='KTP'?'on':''}">Kattupalli</button>
      <button data-port="ENN" class="${curPort==='ENN'?'on':''}">Ennore</button></div>
    <div class="tabRow">${tabs.map(t=>`<button data-rt="${t[0]}" class="${repTab===t[0]?'on':''}">${t[1]}</button>`).join('')}</div>
    <div class="exportRow"><button id="csvBtn">⬇ CSV</button><button id="pdfBtn">⬇ PDF</button><span class="mut" style="align-self:center">${isAdmin()?'Admin: use ✏️ in Vessel History to correct any time or cargo figure — monthly &amp; GCR reports recalculate instantly.':'Excel export ships in the production build'}</span></div>
    <div class="card" id="repCard"><h4>${title}</h4>${body}</div>`;
}
function tbl(h,rows){return `<table><thead><tr>${h.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;}
function editVoyModal(voy){
  const f=(k,lb)=>`<div class="fld"><label>${lb}</label><input type="datetime-local" id="ev_${k}" value="${voy[k]?toLocal(voy[k]):''}"></div>`;
  openModal(`<h3>✏️ Admin Correction — ${vName(voy.vesselId)} (VIA ${voy.via})</h3>
    <div class="mGrid">
      ${f('eta','ETA (Latest)')}${f('ata','ATA')}${f('etb','ETB')}${f('atb','ATB')}${f('eto','ETO')}${f('ato','ATO')}${f('etc','ETC')}${f('atc','ATC')}${f('etd','ETD')}${f('atd','ATD (Sail Out)')}
      <div class="fld"><label>Discharge Containers</label><input type="number" min="0" id="ev_dis" value="${voy.cargo.dis}"></div>
      <div class="fld"><label>Loading Containers</label><input type="number" min="0" id="ev_lod" value="${voy.cargo.lod}"></div>
      <div class="fld"><label>Reefer Containers</label><input type="number" min="0" id="ev_rfr" value="${voy.cargo.rfr}"></div>
      <div class="fld"><label>ODC Cargo</label><input type="number" min="0" id="ev_odc" value="${voy.cargo.odc}"></div>
      <div class="fld"><label>One Door Open Containers</label><input type="number" min="0" id="ev_odo" value="${voy.cargo.odo||0}"></div>
      <div class="fld"><label>Hazardous Containers</label><input type="number" min="0" id="ev_haz" value="${voy.cargo.haz||0}"></div>
      <div class="fld"><label>Hatch Covers Handled</label><input type="number" min="0" id="ev_hat" value="${voy.hatch||0}"></div>
      <div class="fld"><label>Bin Boxes Handled</label><input type="number" min="0" id="ev_bin" value="${voy.binbox||0}"></div>
    </div>
    <div class="mBtns"><button class="ghost" id="mCancel">Cancel</button><button class="primary" id="mEvSave">Save Corrections</button></div>`);
  $('#mCancel').onclick=closeModal;
  $('#mEvSave').onclick=()=>{
    ['eta','ata','etb','atb','eto','ato','etc','atc','etd','atd'].forEach(k=>{
      const el=$('#ev_'+k);voy[k]=el.value?new Date(el.value).getTime():null;});
    ['dis','lod','rfr','odc','odo','haz'].forEach(k=>voy.cargo[k]=+$('#ev_'+k).value||0);
    voy.hatch=+$('#ev_hat').value||0;voy.binbox=+$('#ev_bin').value||0;
    logAudit('ADMIN corrected report data — VIA '+voy.via);
    toast('Report data corrected — monthly & GCR figures recalculated');
    closeModal();twinDirty=true;render();};
}
function wireReports(){
  document.querySelectorAll('[data-rt]').forEach(b=>b.onclick=()=>{repTab=b.dataset.rt;render();});
  document.querySelectorAll('[data-editvoy]').forEach(b=>b.onclick=()=>{
    const voy=voyages.find(v=>String(v.id)===b.dataset.editvoy);
    if(voy)editVoyModal(voy);});
  $('#csvBtn').onclick=()=>{
    const rows=[...document.querySelectorAll('#repCard tr')].map(tr=>[...tr.children].map(td=>'"'+td.textContent.replace(/"/g,'""')+'"').join(','));
    if(!rows.length){toast('Nothing to export yet',true);return;}
    const blob=new Blob([rows.join('\n')],{type:'text/csv'});const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);a.download='portvision_'+repTab+'.csv';a.click();toast('CSV downloaded');};
  $('#pdfBtn').onclick=()=>{
    const tb=$('#repCard table');
    if(!tb){toast('Nothing to export yet',true);return;}
    const w=window.open('','_blank');
    if(!w){toast('Pop-up blocked — allow pop-ups or open the file in your browser',true);return;}
    w.document.write(`<html><head><title>PORTVISION 3D Report</title><style>
      body{font-family:Segoe UI,Arial;padding:26px;color:#1A2233}
      h2{color:#1F3864;margin-bottom:2px}.sub{color:#5A6478;font-size:12px;margin-bottom:16px}
      table{width:100%;border-collapse:collapse;font-size:12px}
      th{background:#1F3864;color:#fff;text-align:left;padding:7px 9px}
      td{padding:7px 9px;border-bottom:1px solid #E3E8F0}
    </style></head><body>
      <h2>PORTVISION 3D — ${window._repTitle}</h2>
      <div class="sub">${curPortObj().label} Terminal · Generated ${new Date().toLocaleString('en-IN')}</div>
      ${tb.outerHTML}</body></html>`);
    w.document.close();w.focus();setTimeout(()=>w.print(),300);};
}

/* ---------- Admin ---------- */
function rAdmin(){
  return `<div class="planGrid">
    <div class="card"><h4>Vessel Master</h4>${tbl(['Name','IMO','LOA','Service','Operator','Flag'],vessels.map(v=>[v.name,v.imo,v.loa,v.service,v.operator,v.flag]))}</div>
    <div>
      <div class="card"><h4>Berths — ${curPortObj().name}</h4>${tbl(['Berth','Type','Length'],portBerths().map(b=>[b.id,b.type,b.len+' m']))}</div>
      <div class="card"><h4>STS Cranes — ${curPortObj().name} · click to cycle Available → Maintenance → Breakdown</h4><div class="craneChips">${portCranes().map(q=>`<button class="qc ${q.status==='Maintenance'?'mnt':q.status==='Breakdown'?'bd':''}" data-adminqc="${q.id}">${q.id}${q.status==='Maintenance'?' 🔧':q.status==='Breakdown'?' ⛔':''}</button>`).join('')}</div></div>
      <div class="card"><h4>Productivity Settings</h4>
        <div style="display:flex;gap:14px;align-items:end;flex-wrap:wrap">
          <div class="fld"><label>Moves / crane / hour</label><input type="number" id="setProd" value="${settings.productivity}" style="width:120px"></div>
          <div class="fld"><label>ETB offset (min after ETA)</label><input type="number" id="setOff" value="${settings.etbOffset}" style="width:120px"></div>
          <button class="saveBtn" id="saveSet" style="padding:10px 18px">Save</button>
        </div></div>
    </div>
  </div>
  <div class="card"><h4>Audit Log — ${curPortObj().name}</h4>${(()=>{const av=audit.filter(a=>(a.port||'KTP')===curPort);return av.length?tbl(['Time','User','Action'],av.map(a=>[fmt(a.at),a.u,a.a])):'<div class="emptyState">No activity yet.</div>';})()}</div>`;
}
function wireAdmin(){
  document.querySelectorAll('[data-adminqc]').forEach(b=>b.onclick=()=>{
    const q=cranes.find(x=>x.id===b.dataset.adminqc);
    if(craneBusy(q.id)){toast(q.id+' is currently operational on a vessel',true);return;}
    q.status=q.status==='Available'?'Maintenance':q.status==='Maintenance'?'Breakdown':'Available';
    if(q.status!=='Available')notify('Crane Unavailable',q.id+' set to '+q.status,'🔧');
    logAudit(q.id+' → '+q.status);twinDirty=true;render();});
  $('#saveSet').onclick=()=>{settings.productivity=+$('#setProd').value||30;settings.etbOffset=+$('#setOff').value||60;
    logAudit('Settings updated: productivity='+settings.productivity+', ETB offset='+settings.etbOffset);toast('Settings saved');};
}

/* ============================== 3D TWIN ============================== */
function rTwin(){
  return `<div id="twinWrap">
    <div class="twinHud">
      <span class="mut" style="align-self:center;font-weight:800;color:#F3C244;letter-spacing:.5px">${curPortObj().label.toUpperCase()}</span>
      ${curPort==='ENN'
        ?`<button data-cam="over">Aerial</button><button data-cam="eb1">Ennore B1</button><button data-cam="anch">Anchorage</button><button data-cam="chan">Channel</button>`
        :`<button data-cam="over">Aerial</button><button data-cam="cb1">C1</button><button data-cam="cb2">C2</button><button data-cam="b3">C3</button><button data-cam="anch">Anchorage</button><button data-cam="chan">Channel</button>`}
      <button id="dayNight">🌙 Night</button>
      <button id="qualBtn" class="on">🖥️ Desktop</button>
      ${curPort==='ENN'?'':'<button id="tourBtn">🎬 Tour</button>'}
    </div>
    <div id="tourCap"></div>
    <div class="legend"><b>Vessel status</b>${Object.entries(STATUS).filter(([k])=>k!=='Sailed Out').map(([k,s])=>`<div class="li"><span class="sw" style="background:${cssVar(s.c)}"></span>${k}</div>`).join('')}</div>
    <div id="shipCard"></div>
    <canvas id="twinCanvas"></canvas>
  </div>`;
}
function cssVar(v){const m=v.match(/var\((.+)\)/);return m?getComputedStyle(document.documentElement).getPropertyValue(m[1]).trim():v;}
let TW=null;
const CONTAINER_COLORS=[0xB33A3A,0x2E5D9F,0x2F7D4F,0xC98A2B,0x7A4E9E,0x3E7C8F];
const HULL_COLORS=[0x1E4636,0x24364F,0x59302B,0x2C2F3A];
function initTwin(){
  if(typeof THREE==='undefined'){init2DFallback();return;}
  const canvas=$('#twinCanvas');const wrap=$('#twinWrap');
  const W=wrap.clientWidth,Hh=wrap.clientHeight;
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
  renderer.setSize(W,Hh,false);renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene();
  const cam=new THREE.PerspectiveCamera(48,W/Hh,1,12000);
  const state={night:false,mobile:false,az:-2.2,el:1.05,dist:1150,target:new THREE.Vector3(200,0,150),ships:new Map(),trailers:[],goal:null};
  TW={renderer,scene,cam,state};
  TW.nightOnly=[];TW.rtgs=[];
  const hemi=new THREE.HemisphereLight(0xEAF2FF,0x39536B,0.8);scene.add(hemi);
  const sun=new THREE.DirectionalLight(0xFFF4E0,1.05);sun.position.set(420,560,300);
  sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
  sun.shadow.camera.left=-1100;sun.shadow.camera.right=1100;sun.shadow.camera.top=1100;sun.shadow.camera.bottom=-1100;
  scene.add(sun);TW.sun=sun;TW.hemi=hemi;
  /* sea (Bay of Bengal, east + south) */
  const sea=new THREE.Mesh(new THREE.PlaneGeometry(9000,9000),new THREE.MeshPhongMaterial({color:0x2E7D6E,shininess:90,specular:0x335544}));
  sea.rotation.x=-Math.PI/2;sea.position.y=-0.6;sea.receiveShadow=true;scene.add(sea);TW.sea=sea;

  /* ===== BERTH FRAMES — EXACT AKPPL L-SHAPED CONFIGURATION (master satellite reference)
     C1 (CB1): north–south quay, water EAST, heading 089°, backed by the container yard.
     C2 (CB2): from the north corner of C1, quay runs NE; face looks SOUTH-EAST (147°).
     C3 (B3): continuation NE of C2, pier parallel to the outer breakwater.               ===== */
  const DIR={x:0.838,z:-0.545};              /* C2/C3 quay direction (NE) */
  const PERP={x:0.545,z:0.838};              /* their water side (SE) */
  function frame(a,b,perp,ry,label){
    const mid={x:(a.x+b.x)/2,z:(a.z+b.z)/2};
    const len=Math.hypot(b.x-a.x,b.z-a.z);
    const dir={x:(b.x-a.x)/len,z:(b.z-a.z)/len};
    return {a,b,mid,len,dir,perp,ry,label};
  }
  const b3d={
    CB1:frame({x:0,z:300},{x:0,z:-20},{x:1,z:0},Math.PI/2,'C1 (CB1)'),
    CB2:frame({x:0,z:-20},{x:200,z:-150},PERP,0.577,'C2 (CB2)'),
    B3: frame({x:215,z:-160},{x:395,z:-276},PERP,0.577,'C3 (B3)'),
  };
  TW.b3d=b3d;
  const BASIN={x:280,z:250},ENT={x:640,z:330},CH1={x:900,z:470},CH_OUT={x:1150,z:600};
  TW.wp={BASIN,ENT,CH1,CH_OUT};

  /* ===== LAND: container yard west of C1, warehouses, admin, internal roads ===== */
  const yard=new THREE.Mesh(new THREE.BoxGeometry(560,10,470),new THREE.MeshLambertMaterial({color:0x9AA0A8}));
  yard.position.set(-278,4,155);yard.receiveShadow=true;scene.add(yard);
  const apron=new THREE.Mesh(new THREE.BoxGeometry(34,12,340),new THREE.MeshLambertMaterial({color:0x8B929D}));
  apron.position.set(-17,5,140);apron.receiveShadow=true;scene.add(apron);
  /* C2 quay deck (rotated) + corner filler */
  const c2deck=new THREE.Mesh(new THREE.BoxGeometry(b3d.CB2.len+40,12,46),new THREE.MeshLambertMaterial({color:0x8B929D}));
  c2deck.position.set(b3d.CB2.mid.x-b3d.CB2.perp.x*20,5,b3d.CB2.mid.z-b3d.CB2.perp.z*20);
  c2deck.rotation.y=0.577;c2deck.receiveShadow=true;scene.add(c2deck);
  const corner=new THREE.Mesh(new THREE.BoxGeometry(70,12,70),new THREE.MeshLambertMaterial({color:0x8B929D}));
  corner.position.set(-14,5,-24);scene.add(corner);
  /* C3 pier — standalone concrete pier parallel to breakwater */
  const c3deck=new THREE.Mesh(new THREE.BoxGeometry(b3d.B3.len+16,12,40),new THREE.MeshLambertMaterial({color:0x9BA1AB}));
  c3deck.position.set(b3d.B3.mid.x-b3d.B3.perp.x*6,5,b3d.B3.mid.z-b3d.B3.perp.z*6);
  c3deck.rotation.y=0.577;c3deck.receiveShadow=true;scene.add(c3deck);
  /* container yard blocks in a road grid (like the satellite) */
  for(let gx=0;gx<4;gx++)for(let gz=0;gz<6;gz++){
    const bx=-470+gx*112,bz=-8+gz*74;
    for(let s=0;s<8;s++){
      const h=2+((gx*6+gz+s)%3);
      for(let k=0;k<h;k++){
        const c=new THREE.Mesh(new THREE.BoxGeometry(12,6,5.6),new THREE.MeshLambertMaterial({color:CONTAINER_COLORS[(gx+gz+s+k)%6]}));
        c.position.set(bx+s*13,12.2+k*6.2,bz+(s%2)*7-3);c.castShadow=true;scene.add(c);}}
    if((gx+gz)%2===0){const rt=buildRTG();rt.position.set(bx+34,10,bz);scene.add(rt);TW.rtgs.push(rt);}
  }
  /* internal roads */
  for(let gz=0;gz<7;gz++){const rd=new THREE.Mesh(new THREE.BoxGeometry(540,0.4,10),new THREE.MeshLambertMaterial({color:0x6E747E}));
    rd.position.set(-278,9.4,-38+gz*74);scene.add(rd);}
  for(let gx=0;gx<5;gx++){const rd=new THREE.Mesh(new THREE.BoxGeometry(10,0.4,450),new THREE.MeshLambertMaterial({color:0x6E747E}));
    rd.position.set(-520+gx*112,9.4,155);scene.add(rd);}
  /* yard RTG cranes (rubber-tyred gantries) */
  function buildRTG(){
    const g=new THREE.Group();const m=new THREE.MeshLambertMaterial({color:0xE8B10F});
    [[-13,-8],[13,-8],[-13,8],[13,8]].forEach(p=>{
      const leg=new THREE.Mesh(new THREE.BoxGeometry(2.2,26,2.2),m);leg.position.set(p[0],13,p[1]);leg.castShadow=true;g.add(leg);
      const wheel=new THREE.Mesh(new THREE.CylinderGeometry(1.7,1.7,1.5,8),new THREE.MeshLambertMaterial({color:0x1A1E26}));
      wheel.rotation.x=Math.PI/2;wheel.position.set(p[0],1.5,p[1]);g.add(wheel);});
    [[-8],[8]].forEach(z=>{const beam=new THREE.Mesh(new THREE.BoxGeometry(30,2.4,2.4),m);beam.position.set(0,26.5,z[0]);g.add(beam);});
    const trolley=new THREE.Mesh(new THREE.BoxGeometry(5,2.2,14),new THREE.MeshLambertMaterial({color:0x394450}));
    trolley.position.set(0,25,0);g.add(trolley);
    const cab=new THREE.Mesh(new THREE.BoxGeometry(4,3.2,4),new THREE.MeshLambertMaterial({color:0xF2F5F9}));
    cab.position.set(4,22.5,8);g.add(cab);
    /* RTG floodlights — glow at night */
    const lampBar=new THREE.Mesh(new THREE.BoxGeometry(24,1,1.4),new THREE.MeshBasicMaterial({color:0xDDE6F2}));
    lampBar.position.set(0,24.6,0);g.add(lampBar);
    const gl1=new THREE.Mesh(new THREE.SphereGeometry(1.6,8,8),new THREE.MeshBasicMaterial({color:0xFFF3C4,transparent:true,opacity:0.95}));
    gl1.position.set(-11,25.5,0);gl1.visible=false;g.add(gl1);TW.nightOnly.push(gl1);
    const gl2=gl1.clone();gl2.position.x=11;gl2.visible=false;g.add(gl2);TW.nightOnly.push(gl2);
    const pool=new THREE.Mesh(new THREE.CircleGeometry(24,18),new THREE.MeshBasicMaterial({color:0xFFF3C4,transparent:true,opacity:0.10,depthWrite:false}));
    pool.rotation.x=-Math.PI/2;pool.position.set(0,0.9,0);pool.visible=false;g.add(pool);TW.nightOnly.push(pool);
    g.userData.trolley=trolley;
    return g;
  }
  /* yard high-mast lights (glow at night) — full container-yard coverage */
  for(let i=0;i<6;i++){
    const mx=-510+i*100,mz=i%2?20:295;
    const pole=new THREE.Mesh(new THREE.CylinderGeometry(1,1.5,62,8),new THREE.MeshLambertMaterial({color:0x8A94A4}));
    pole.position.set(mx,41,mz);scene.add(pole);
    const head=new THREE.Mesh(new THREE.BoxGeometry(9,2.4,9),new THREE.MeshBasicMaterial({color:0xDDE6F2}));
    head.position.set(mx,73,mz);scene.add(head);
    const glow=new THREE.Mesh(new THREE.SphereGeometry(4.5,10,10),new THREE.MeshBasicMaterial({color:0xFFF3C4,transparent:true,opacity:0.9}));
    glow.position.set(mx,73,mz);glow.visible=false;scene.add(glow);TW.nightOnly.push(glow);
    const pool=new THREE.Mesh(new THREE.CircleGeometry(46,22),new THREE.MeshBasicMaterial({color:0xFFF3C4,transparent:true,opacity:0.10,depthWrite:false}));
    pool.rotation.x=-Math.PI/2;pool.position.set(mx,10.6,mz);pool.visible=false;scene.add(pool);TW.nightOnly.push(pool);
  }
  /* warehouses + administration */
  for(let i=0;i<3;i++){const wh=new THREE.Mesh(new THREE.BoxGeometry(46,18,90),new THREE.MeshLambertMaterial({color:0xD8D2C4}));
    wh.position.set(-540,14,40+i*120);wh.castShadow=true;scene.add(wh);
    const roof=new THREE.Mesh(new THREE.BoxGeometry(48,3,92),new THREE.MeshLambertMaterial({color:0x8A94A4}));
    roof.position.set(-540,24.5,40+i*120);scene.add(roof);}
  const admin=new THREE.Mesh(new THREE.BoxGeometry(40,30,60),new THREE.MeshLambertMaterial({color:0xC9D4E4}));
  admin.position.set(-545,20,-60);admin.castShadow=true;scene.add(admin);
  makeLabel('CONTAINER YARD',-278,58,155,scene,13);
  makeLabel('ADMINISTRATION',-545,56,-60,scene,11);

  /* ===== quay furniture along each berth: face strip, bollards, fenders, label ===== */
  function alongQuay(F,t){return {x:F.a.x+(F.b.x-F.a.x)*t,z:F.a.z+(F.b.z-F.a.z)*t};}
  TW.alongQuay=alongQuay;
  const bolM=new THREE.MeshLambertMaterial({color:0x22262E});
  const fenM=new THREE.MeshLambertMaterial({color:0x14161B});
  Object.entries(b3d).forEach(([id,F])=>{
    const strip=new THREE.Mesh(new THREE.BoxGeometry(F.len-6,0.8,6),new THREE.MeshBasicMaterial({color:id==='B3'?0xC98A2B:0x59C2B4}));
    strip.position.set(F.mid.x-F.perp.x*3,11.7,F.mid.z-F.perp.z*3);
    strip.rotation.y=(id==='CB1')?Math.PI/2:0.577;scene.add(strip);
    /* NUMBERED MOORING BOLLARDS — CB1: 1–17 · CB2: 1–17 · B3: 18–34 (CB2+B3 = shared pool) */
    const bdef={CB1:{start:1,pool:'CB1'},CB2:{start:1,pool:'CB2B3'},B3:{start:18,pool:'CB2B3'}}[id];
    if(!TW.bollardMarks)TW.bollardMarks={};
    if(!TW.bollardMarks[bdef.pool])TW.bollardMarks[bdef.pool]={};
    for(let i=0;i<17;i++){const t=i/16;const p=alongQuay(F,t);const num=bdef.start+i;
      const bol=new THREE.Mesh(new THREE.CylinderGeometry(2,2.5,4.5,10),bolM);
      bol.position.set(p.x-F.perp.x*4,13,p.z-F.perp.z*4);bol.castShadow=true;scene.add(bol);
      const ring=new THREE.Mesh(new THREE.CylinderGeometry(3.8,3.8,0.7,12),new THREE.MeshBasicMaterial({color:0x2F9E62}));
      ring.position.set(p.x-F.perp.x*4,16,p.z-F.perp.z*4);scene.add(ring);
      const tag=nameSprite(String(num),'#2F9E62');tag.scale.multiplyScalar(0.38);
      tag.position.set(p.x-F.perp.x*11,22,p.z-F.perp.z*11);scene.add(tag);
      TW.bollardMarks[bdef.pool][num]={ring};
      if(i<16){const p2=alongQuay(F,(i+0.5)/16);
        const fen=new THREE.Mesh(new THREE.BoxGeometry(6,9,2.2),fenM);
        fen.position.set(p2.x+F.perp.x*1.5,4,p2.z+F.perp.z*1.5);
        fen.rotation.y=(id==='CB1')?Math.PI/2:0.577;scene.add(fen);}}
    makeLabel(F.label,F.mid.x-F.perp.x*44,50,F.mid.z-F.perp.z*44,scene,20);
  });

  /* ===== breakwaters (tetrapod) — outer arm parallel to C2/C3, southern arm; entrance SE ===== */
  function tetra(pts){
    pts.forEach((p,pi)=>{for(let i=0;i<4;i++){
      const r=5+Math.abs((Math.round(p[0])*7+Math.round(p[1])*3+i*31)%8);
      const rock=new THREE.Mesh(new THREE.IcosahedronGeometry(r,0),new THREE.MeshLambertMaterial({color:i%2?0xB8B4AC:0xA8A49C}));
      rock.position.set(p[0]+((i*17)%13)-6,r*0.4,p[1]+((i*23)%15)-7);
      rock.rotation.set(i+pi,p[0]*0.01,p[1]*0.01);rock.castShadow=true;scene.add(rock);}});
  }
  function polyline(pts,step){const out=[];for(let s=0;s<pts.length-1;s++){const a=pts[s],b=pts[s+1];
    const d=Math.hypot(b[0]-a[0],b[1]-a[1]);const n=Math.max(1,Math.round(d/step));
    for(let i=0;i<n;i++)out.push([a[0]+(b[0]-a[0])*i/n,a[1]+(b[1]-a[1])*i/n]);}out.push(pts[pts.length-1]);return out;}
  tetra(polyline([[-40,-140],[160,-262],[370,-352],[500,-282],[575,-90],[585,150]],20));
  tetra(polyline([[-60,660],[140,642],[300,592]],22));
  makeLabel('BREAKWATER',480,38,-310,scene,15);
  /* navigation channel buoys + PBG + labels */
  const cd={x:(CH_OUT.x-ENT.x),z:(CH_OUT.z-ENT.z)};const cl=Math.hypot(cd.x,cd.z);cd.x/=cl;cd.z/=cl;
  const cperp={x:-cd.z,z:cd.x};
  [0.12,0.38,0.64,0.9].forEach((t,i)=>{[-1,1].forEach(sgn=>{
    const px=ENT.x+cd.x*cl*t+cperp.x*44*sgn,pz=ENT.z+cd.z*cl*t+cperp.z*44*sgn;
    const g=new THREE.Group();
    const col=sgn>0?0x3FA34D:0xD84040;
    const float=new THREE.Mesh(new THREE.CylinderGeometry(4.5,5.5,3.5,10),new THREE.MeshLambertMaterial({color:col}));
    float.position.y=2;g.add(float);
    const mast=new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.5,7,6),new THREE.MeshLambertMaterial({color:0x333}));
    mast.position.y=7;g.add(mast);
    const top=new THREE.Mesh(sgn>0?new THREE.ConeGeometry(2.2,3.4,8):new THREE.BoxGeometry(3.4,3.4,3.4),new THREE.MeshLambertMaterial({color:col}));
    top.position.y=12;g.add(top);
    const nglow=new THREE.Mesh(new THREE.SphereGeometry(1.9,8,8),new THREE.MeshBasicMaterial({color:0x3BFF7E}));
    nglow.position.y=14.8;nglow.visible=false;g.add(nglow);g.userData.glow=nglow;
    g.position.set(px,0,pz);g.userData.buoy=true;scene.add(g);});});
  const pbg=new THREE.Mesh(new THREE.ConeGeometry(8,22,4),new THREE.MeshLambertMaterial({color:0xF3C244}));
  pbg.position.set(1250,11,650);scene.add(pbg);
  makeLabel('PILOT BOARDING POINT',1250,46,650,scene,15);
  makeLabel('NAVIGATION CHANNEL',890,44,480,scene,17);
  /* turning basin marker ring */
  for(let i=0;i<14;i++){const a=i/14*Math.PI*2;
    const dot=new THREE.Mesh(new THREE.CylinderGeometry(2,2,0.6,6),new THREE.MeshBasicMaterial({color:0xBFE8E0}));
    dot.position.set(BASIN.x+Math.cos(a)*110,0.4,BASIN.z+Math.sin(a)*110);scene.add(dot);}
  makeLabel('TURNING BASIN',BASIN.x,40,BASIN.z,scene,15);

  /* ===== STS cranes on their real quays: QC01–04 on C1 (east-facing), QC05–08 on C2 (SE-facing) ===== */
  TW.craneMeshes={};
  const rotFor={CB1:Math.PI/2,CB2:0.577};
  /* physical crane order along each quay, as corrected by the planner */
  const QC_ORDER={CB1:['QC01','QC02','QC04','QC03'],CB2:['QC08','QC05','QC06','QC07']};
  cranes.forEach((q,i)=>{
    const F=b3d[q.berth];const slot=QC_ORDER[q.berth].indexOf(q.id);
    const t=0.18+(slot<0?(i%4):slot)*0.21;
    const p=alongQuay(F,t);
    const g=buildCrane(0,scene,q.id);
    g.position.set(p.x-F.perp.x*8,10,p.z-F.perp.z*8);
    g.rotation.y=rotFor[q.berth];
    TW.craneMeshes[q.id]=g;
  });
  /* ITV trailers run the C1 apron road (north–south) */
  for(let i=0;i<4;i++){
    const tr=new THREE.Group();
    const cab=new THREE.Mesh(new THREE.BoxGeometry(6,5.5,4.6),new THREE.MeshLambertMaterial({color:0xC94434}));
    cab.position.set(-8,3.2,0);tr.add(cab);
    const chassis=new THREE.Mesh(new THREE.BoxGeometry(16,1.4,4.6),new THREE.MeshLambertMaterial({color:0x3A3F47}));
    chassis.position.set(2,1.6,0);tr.add(chassis);
    const box=new THREE.Mesh(new THREE.BoxGeometry(12.5,5,4.4),new THREE.MeshLambertMaterial({color:CONTAINER_COLORS[i%6]}));
    box.position.set(3,4.6,0);tr.add(box);box.visible=i%2===0;
    [[-10,-2],[-10,2],[6,-2],[6,2],[10,-2],[10,2]].forEach(w=>{
      const wh=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,1,8),new THREE.MeshLambertMaterial({color:0x111}));
      wh.rotation.x=Math.PI/2;wh.position.set(w[0],1.1,w[1]);tr.add(wh);});
    const dir0=i%2?1:-1;
    tr.position.set(-36,10.8,20+i*70);tr.rotation.y=dir0===1?-Math.PI/2:Math.PI/2;
    tr.userData={speed:0.5+i*0.13,dir:dir0,box};
    scene.add(tr);state.trailers.push(tr);
  }
  /* ===== TUG BOATS — stationed at a small tug pier; escort vessels from anchorage to alongside ===== */
  function buildTug(){
    const g=new THREE.Group();
    const hull=new THREE.Mesh(new THREE.BoxGeometry(16,4.5,7),new THREE.MeshLambertMaterial({color:0x16324A}));
    hull.position.y=2.6;hull.castShadow=true;g.add(hull);
    const bow=new THREE.Mesh(new THREE.CylinderGeometry(3.5,3.5,4.5,3,1),new THREE.MeshLambertMaterial({color:0x16324A}));
    bow.rotation.z=Math.PI/2;bow.rotation.y=Math.PI;bow.scale.set(1,1.2,1);bow.position.set(9.3,2.6,0);g.add(bow);
    const deck=new THREE.Mesh(new THREE.BoxGeometry(15,1,6.4),new THREE.MeshLambertMaterial({color:0xC94434}));
    deck.position.y=5.2;g.add(deck);
    const house=new THREE.Mesh(new THREE.BoxGeometry(6,5,5),new THREE.MeshLambertMaterial({color:0xF2F5F9}));
    house.position.set(-1,8.4,0);house.castShadow=true;g.add(house);
    const mast=new THREE.Mesh(new THREE.CylinderGeometry(0.35,0.35,6,6),new THREE.MeshLambertMaterial({color:0x222}));
    mast.position.set(-1,13.5,0);g.add(mast);
    const fender=new THREE.Mesh(new THREE.TorusGeometry(3.6,0.9,6,14),new THREE.MeshLambertMaterial({color:0x111}));
    fender.rotation.x=Math.PI/2;fender.position.set(9.5,3.4,0);g.add(fender);
    return g;
  }
  TW.tugs=[];
  const tugHome=[{x:60,z:40,ry:0.6},{x:86,z:62,ry:0.6}];
  const tugPier=new THREE.Mesh(new THREE.BoxGeometry(52,8,14),new THREE.MeshLambertMaterial({color:0x8B929D}));
  tugPier.position.set(52,3,26);tugPier.rotation.y=0.6;scene.add(tugPier);
  tugHome.forEach(h=>{
    const g=buildTug();g.position.set(h.x,0,h.z);g.rotation.y=h.ry;scene.add(g);
    TW.tugs.push({group:g,home:h});
  });
  /* coast strip behind the yard */
  const coast=new THREE.Mesh(new THREE.BoxGeometry(700,8,3000),new THREE.MeshLambertMaterial({color:0xB9AC85}));
  coast.position.set(-940,3,200);scene.add(coast);
  for(let i=0;i<20;i++){const gp=new THREE.Mesh(new THREE.CylinderGeometry(14+(i%5)*8,16+(i%5)*8,5,7),new THREE.MeshLambertMaterial({color:i%2?0x4F7A4A:0x5E8A54}));
    gp.position.set(-880+((i*137)%260),5,-1100+i*115);scene.add(gp);}

  /* ===== interactions ===== */
  let drag=false,px=0,py=0;
  canvas.onpointerdown=e=>{drag=false;px=e.clientX;py=e.clientY;canvas.setPointerCapture(e.pointerId);canvas._down=true;};
  canvas.onpointermove=e=>{if(!canvas._down)return;const dx=e.clientX-px,dy=e.clientY-py;
    if(Math.abs(dx)+Math.abs(dy)>3)drag=true;
    state.az-=dx*0.005;state.el=Math.min(1.5,Math.max(0.12,state.el+dy*0.004));px=e.clientX;py=e.clientY;
    if(!TW.tour)state.goal=null;};
  canvas.onpointerup=e=>{canvas._down=false;if(!drag)pick(e);};
  canvas.onwheel=e=>{e.preventDefault();state.dist=Math.min(3600,Math.max(120,state.dist+e.deltaY*0.7));if(!TW.tour)state.goal=null;};
  const ray=new THREE.Raycaster(),m2=new THREE.Vector2();
  function pickVoy(e){const r=canvas.getBoundingClientRect();
    m2.x=((e.clientX-r.left)/r.width)*2-1;m2.y=-((e.clientY-r.top)/r.height)*2+1;
    ray.setFromCamera(m2,cam);
    const groups=[...state.ships.values()].map(s=>s.group);
    const hit=ray.intersectObjects(groups,true)[0];
    if(!hit)return null;
    let o=hit.object;while(o&&!o.userData.voy)o=o.parent;
    return o?o.userData.voy:null;
  }
  function pick(e){const voy=pickVoy(e);const card=$('#shipCard');
    if(voy)showShipCard(voy);else card.style.display='none';}
  canvas.ondblclick=e=>{const voy=pickVoy(e);
    if(voy&&voy.id!==-1)vesselInfo3D(voy);};
  function goalTo(x,z,d,el,az){state.goal={t:new THREE.Vector3(x,0,z),d,el,az};}
  TW.goalTo=goalTo;
  document.querySelectorAll('[data-cam]').forEach(b=>b.onclick=()=>{
    if(TW.tour)return;
    const P={over:{x:200,z:150,d:1250,el:1.5,az:-2.2},
      cb1:{x:b3d.CB1.mid.x+40,z:b3d.CB1.mid.z,d:300,el:0.35,az:Math.PI},
      cb2:{x:b3d.CB2.mid.x+30,z:b3d.CB2.mid.z+40,d:300,el:0.35,az:-2.1},
      b3:{x:b3d.B3.mid.x+30,z:b3d.B3.mid.z+40,d:300,el:0.35,az:-2.1},
      anch:{x:1850,z:1500,d:820,el:0.55,az:-2.4},
      chan:{x:890,z:480,d:640,el:0.75,az:-2.2}}[b.dataset.cam];
    goalTo(P.x,P.z,P.d,P.el,P.az);});
  function setNight(on){
    state.night=on;$('#dayNight').textContent=on?'☀️ Day':'🌙 Night';
    if(on){scene.background=new THREE.Color(0x0A1526);scene.fog.color.set(0x0A1526);sea.material.color.set(0x0B2E33);sun.intensity=0.12;hemi.intensity=0.26;
      Object.values(TW.craneMeshes).forEach(g=>g.userData.lamp.material.color.set(0xFFE9A8));}
    else{scene.background=new THREE.Color(0xBFD9EE);scene.fog.color.set(0xBFD9EE);sea.material.color.set(0x2E7D6E);sun.intensity=1.05;hemi.intensity=0.8;
      Object.values(TW.craneMeshes).forEach(g=>g.userData.lamp.material.color.set(0xDDE6F2));}
    /* all lights ON at night: vessels (yellow), buoys (green), crane floods + yard masts */
    TW.nightOnly.forEach(m=>m.visible=on);
    scene.children.forEach(o=>{if(o.userData&&o.userData.buoy&&o.userData.glow)o.userData.glow.visible=on;});
    state.ships.forEach(rec=>{if(rec.group.userData.lights)rec.group.userData.lights.visible=on;});
    if(TW.tourShip&&TW.tourShip.group.userData.lights)TW.tourShip.group.userData.lights.visible=on;
  }
  TW.setNight=setNight;
  $('#dayNight').onclick=()=>{if(!TW.tour)setNight(!state.night);};
  $('#qualBtn').onclick=e=>{
    state.mobile=!state.mobile;
    e.target.textContent=state.mobile?'📱 Mobile':'🖥️ Desktop';
    renderer.setPixelRatio(state.mobile?1:Math.min(devicePixelRatio,2));
    renderer.shadowMap.enabled=!state.mobile;
    scene.traverse(o=>{if(o.material)o.material.needsUpdate=true;});
    cam.fov=state.mobile?60:48;cam.updateProjectionMatrix();
    toast(state.mobile?'Mobile mode: lighter graphics for phones/tablets':'Desktop mode: full quality');
  };
  const tb2=$('#tourBtn');if(tb2)tb2.onclick=()=>{if(TW.tour)endTour();else startTour();};
  scene.background=new THREE.Color(0xBFD9EE);
  scene.fog=new THREE.Fog(0xBFD9EE,1400,6500);
  twinDirty=true;
  if(!TW._loop){TW._loop=true;TW._lastT=performance.now();requestAnimationFrame(loop);}
}
/* ===================== CINEMATIC TOUR (Scenes 1–7) ===================== */
function tourApproach(bid){const F=TW.b3d[bid];
  const berth={x:F.mid.x+F.perp.x*16,z:F.mid.z+F.perp.z*16};
  return [{x:F.mid.x+F.perp.x*110,z:F.mid.z+F.perp.z*110},{x:F.mid.x+F.perp.x*45,z:F.mid.z+F.perp.z*45},berth];}
function tourViaBasin(bid){return [TW.wp.BASIN,...tourApproach(bid)];}
function berthGoal(bid){const F=TW.b3d[bid];return {x:F.mid.x+F.perp.x*40,z:F.mid.z+F.perp.z*40,d:330,el:0.5};}
function tourSteps(){
  const lbl=(cap,x,z,d)=>({dur:2.8,cap,goal:{x,z,d:d||430,el:0.75}});
  const F=TW.b3d;
  return [
    {dur:2.0,cap:'ADANI KATTUPALLI PORT PRIVATE LIMITED · Tamil Nadu · India',goal:{x:200,z:150,d:3500,el:1.5}},
    {dur:3.5,cap:'ADANI KATTUPALLI PORT PRIVATE LIMITED · Tamil Nadu · India',goal:{x:200,z:150,d:1700,el:1.5}},
    {dur:3.5,cap:'Complete harbour layout — top-down view',goal:{x:200,z:150,d:1250,el:1.52}},
    lbl('Berth C1 — heading 089° East, facing the entrance, connected to the container yard',F.CB1.mid.x,F.CB1.mid.z),
    lbl('Berth C2 — facing South-East (147°)',F.CB2.mid.x,F.CB2.mid.z),
    lbl('Berth C3 — adjacent to C2, alongside the breakwater',F.B3.mid.x,F.B3.mid.z),
    lbl('Navigation Channel — buoyed approach from the pilot boarding ground',890,470,560),
    lbl('Turning Basin',TW.wp.BASIN.x,TW.wp.BASIN.z,520),
    lbl('Outer Breakwater — tetrapod armour',480,-300,560),
    lbl('Anchorage Area — open sea, clear of the channel',1850,1500,900),
    {cap:'Scene 4 — vessel inbound from the anchorage through the navigation channel',spawn:true,
      path:[TW.wp.CH_OUT,TW.wp.CH1,TW.wp.ENT,{x:340,z:270}],follow:true,maxDur:30},
    {cap:'Tugs made fast — turning inside the basin, berthing at C1',path:()=>tourApproach('CB1'),follow:true,maxDur:22,moor:'CB1'},
    {dur:4.5,cap:'Cargo operations at C1 — QC01–QC04 working',ov:['QC01','QC02','QC03','QC04'],goal:berthGoal('CB1')},
    {cap:'Tugs shifting the vessel to C2',path:()=>tourViaBasin('CB2'),follow:true,maxDur:26,moor:'CB2'},
    {dur:4.5,cap:'Cargo operations at C2 — QC05–QC08 working',ov:['QC05','QC06','QC07','QC08'],goal:berthGoal('CB2')},
    {cap:'Tugs shifting the vessel to C3',path:()=>tourViaBasin('B3'),follow:true,maxDur:26,moor:'B3'},
    {dur:3.5,cap:'C3 — shore-crane / gear operations',goal:berthGoal('B3')},
    {dur:5,cap:'Scene 6 — yard operations: ITV trailers, RTGs, container handling',goal:{x:-200,z:150,d:520,el:0.8},trailers:true},
    {dur:6,cap:'Scene 7 — night operations: port lighting & navigation lights',night:true,goal:{x:150,z:60,d:720,el:0.55}},
    {dur:4,cap:'PORTVISION 3D — Digital Twin of AKPPL',night:false,goal:{x:200,z:150,d:1250,el:1.1},end:true},
  ];
}
function startTour(){
  if(!TW||TW.tour)return;
  TW.tour={steps:tourSteps(),i:-1,t:0};
  $('#tourBtn').textContent='⏹ Stop Tour';$('#tourBtn').classList.add('on');
  $('#tourCap').style.display='block';
  nextTourStep();
}
function nextTourStep(){
  const tour=TW.tour;if(!tour)return;
  tour.i++;tour.t=0;
  const s=tour.steps[tour.i];
  if(!s){endTour();return;}
  $('#tourCap').textContent=s.cap||'';
  if(s.goal)TW.goalTo(s.goal.x,s.goal.z,s.goal.d,s.goal.el,s.goal.az);
  TW.craneOv=null;
  if(s.ov){TW.craneOv={};s.ov.forEach(q=>TW.craneOv[q]=true);}
  if(s.trailers)TW.trailerOv=true;
  if(s.night!==undefined)TW.setNight(s.night);
  if(s.spawn&&!TW.tourShip){
    const fake={id:-1,vesselId:3,via:'TOUR',status:'Incoming',berth:null,cranes:[],cargo:{dis:0,lod:0,rfr:0,odc:0},eta:null,atb:null};
    const g=shipMesh(fake);g.position.set(2400,0,1950);g.rotation.y=Math.PI*0.75;
    TW.scene.add(g);TW.tourShip={group:g,path:[],speed:1.7};
  }
  if(s.path&&TW.tourShip)TW.tourShip.path=(typeof s.path==='function'?s.path():s.path).slice();
  if(s.moor)TW.tourShip.moorAt=s.moor;
  if(s.end)tour.ending=true;
}
function endTour(){
  if(!TW.tour)return;
  TW.tour=null;TW.craneOv=null;TW.trailerOv=false;
  if(TW.tourShip){TW.scene.remove(TW.tourShip.group);TW.tourShip=null;}
  if(TW.state.night)TW.setNight(false);
  $('#tourBtn').textContent='🎬 Tour';$('#tourBtn').classList.remove('on');
  $('#tourCap').style.display='none';
}

function twinStatusModal(voy){
  const ves=vOf(voy);
  const chain=[['ETA','eta','ATA','ata'],['ETB','etb','ATB','atb'],['ETO','eto','ATO','ato'],['ETC','etc','ATC','atc'],['ETD','etd','ATD','atd']];
  const next=chain.find(c=>!voy[c[3]]);
  openModal(`<h3>🚢 ${ves.name} — VIA ${voy.via} · ${voy.status}</h3>
    <table style="margin-bottom:12px"><thead><tr><th>Estimated</th><th>Time</th><th>Actual</th><th>Time</th></tr></thead><tbody>
    ${chain.map(c=>`<tr><td><b>${c[0]}</b></td><td>${fmt(voy[c[1]])}</td><td><b>${c[2]}</b></td><td>${voy[c[3]]?'✅ '+fmt(voy[c[3]]):'<span class="mut">not recorded</span>'}</td></tr>`).join('')}
    </tbody></table>
    ${canPlan()&&next?`<p class="mut" style="margin-bottom:4px">Next milestone: <b>${next[0]} → ${next[2]}</b>${next[3]==='atd'?' (vessel will sail out with tug assistance)':''}</p>`:''}
    <div class="mBtns"><button class="ghost" id="mCancel">Close</button>
      ${canPlan()&&next?`<button class="primary" id="twRec">▶ Record ${next[2]} now</button>`:''}</div>`);
  $('#mCancel').onclick=closeModal;
  const tr=$('#twRec');if(tr)tr.onclick=()=>{closeModal();
    recordActual(voy,next[3]);
    setTimeout(()=>{if(voy[next[3]]&&next[3]!=='atd'&&view==='twin')twinStatusModal(voy);},450);};
}
function vesselInfo3D(voy){
  const ves=vOf(voy);const r=bolRange(voy);
  const stay=voy.atb?(((voy.atd||now())-voy.atb)/H).toFixed(1)+' Hours'+(voy.atd?'':' (in port — still counting)'):'—';
  const rows=[
    ['Vessel Name',`<b>${ves.name}</b>`],['VIA',voy.via],['Service',ves.service],['LOA',ves.loa+' m'],
    ['Status',badge(voy.status)],['Port',`<b>${portName(portOf(voy))}</b>`],['Berth',voy.berth==='EB1'?'Ennore B1':(voy.berth||'—')],
    ['Bollard No',r?`<b>${r[0]} – ${r[1]}</b> <span class="mut">(bow #${voy.bowB} · stern #${voy.sternB} · ${r[1]-r[0]+1} bollards · ${voy.side==='STARBOARD'?'starboard':'port'} side to berth)</span>`:'—'],
    ['Crane',voy.cranes.join(', ')||(voy.craneWaived?'Port crane not required (vessel gear)':'—')],
    ['ETA',fmt(voy.eta)],['ATA',fmt(voy.ata)],['ATB',fmt(voy.atb)],['ATO',fmt(voy.ato)],['ATC',fmt(voy.atc)],['ATD',fmt(voy.atd)],
    ['Port Stay',stay]];
  openModal(`<h3>🚢 VESSEL INFORMATION</h3>
    <table style="margin-bottom:6px"><tbody>${rows.map(x=>`<tr><td style="font-weight:700;white-space:nowrap;width:130px">${x[0]}</td><td>${x[1]}</td></tr>`).join('')}</tbody></table>
    <div class="mBtns"><button class="ghost" id="mCancel">Close</button>${canPlan()?'<button class="primary" id="viMs">▶ Update Milestones</button>':''}</div>`);
  $('#mCancel').onclick=closeModal;
  const vm=$('#viMs');if(vm)vm.onclick=()=>{closeModal();twinStatusModal(voy);};
}
function showShipCard(voy){
  const ves=vOf(voy);const card=$('#shipCard');
  card.style.display='block';
  card.innerHTML=`<h5>${ves.name}</h5>
    <div class="r"><span>VIA</span><b>${voy.via}</b></div><div class="r"><span>Service</span><b>${ves.service}</b></div>
    <div class="r"><span>LOA</span><b>${ves.loa} m</b></div><div class="r"><span>Status</span><b>${voy.status}</b></div>
    <div class="r"><span>Berth</span><b>${voy.berth||'—'}</b></div><div class="r"><span>Cranes</span><b>${voy.cranes.join(', ')||'—'}</b></div>
    <div class="r"><span>ETA</span><b>${fmt(voy.eta)}</b></div><div class="r"><span>ATB</span><b>${fmt(voy.atb)}</b></div>`;
}
function buildCrane(x,scene,qcId){
  const g=new THREE.Group();
  const yellow=new THREE.MeshLambertMaterial({color:0xE8B10F});
  const yellowD=new THREE.MeshLambertMaterial({color:0xC79005});
  [[-11,4],[11,4],[-11,-14],[11,-14]].forEach(p=>{
    const leg=new THREE.Mesh(new THREE.BoxGeometry(2.6,58,2.6),yellow);
    leg.position.set(p[0],29,p[1]);leg.castShadow=true;g.add(leg);});
  [[-11],[11]].forEach(p=>{const brace=new THREE.Mesh(new THREE.BoxGeometry(2,2,20),yellowD);
    brace.position.set(p[0],26,-5);g.add(brace);
    const diag=new THREE.Mesh(new THREE.BoxGeometry(1.6,24,1.6),yellowD);
    diag.position.set(p[0],38,-5);diag.rotation.x=0.62;g.add(diag);});
  const portal=new THREE.Mesh(new THREE.BoxGeometry(26,3,2.6),yellow);portal.position.set(0,50,4);g.add(portal);
  const portal2=portal.clone();portal2.position.z=-14;g.add(portal2);
  [[4],[-14]].forEach(z=>{const sill=new THREE.Mesh(new THREE.BoxGeometry(28,2,3),yellowD);sill.position.set(0,1.4,z[0]);g.add(sill);
    [-12,12].forEach(wx=>{const bog=new THREE.Mesh(new THREE.BoxGeometry(6,2.6,2.6),new THREE.MeshLambertMaterial({color:0x1A1E26}));
      bog.position.set(wx,0.4,z[0]);g.add(bog);});});
  const house=new THREE.Mesh(new THREE.BoxGeometry(16,7,10),new THREE.MeshLambertMaterial({color:0xEDF1F7}));
  house.position.set(0,56,-9);house.castShadow=true;g.add(house);
  const apex=new THREE.Mesh(new THREE.CylinderGeometry(0.9,0.9,26,6),yellowD);
  apex.rotation.z=Math.PI/2;apex.position.set(0,68,-4);g.add(apex);
  const aL=new THREE.Mesh(new THREE.BoxGeometry(1.8,24,1.8),yellow);aL.position.set(-9,60,-4);aL.rotation.x=0.22;g.add(aL);
  const aR=aL.clone();aR.position.x=9;g.add(aR);
  /* boom + backreach */
  const boomG=new THREE.Group();boomG.position.set(0,52,2);
  const boom=new THREE.Mesh(new THREE.BoxGeometry(3.2,2.6,66),yellow);
  boom.position.set(0,0,33);boom.castShadow=true;boomG.add(boom);
  const lattice=new THREE.Mesh(new THREE.BoxGeometry(2.2,1.4,60),yellowD);lattice.position.set(0,-2,30);boomG.add(lattice);
  const boomTie=new THREE.Mesh(new THREE.CylinderGeometry(0.4,0.4,44,5),new THREE.MeshLambertMaterial({color:0x111}));
  boomTie.rotation.x=1.12;boomTie.position.set(0,8,21);boomG.add(boomTie);
  const back=new THREE.Mesh(new THREE.BoxGeometry(3.2,2.6,26),yellow);back.position.set(0,52,-11);g.add(back);
  const trolley=new THREE.Mesh(new THREE.BoxGeometry(5,2.4,6),new THREE.MeshLambertMaterial({color:0x394450}));
  trolley.position.set(0,-2.4,16);boomG.add(trolley);
  const cable=new THREE.Mesh(new THREE.BoxGeometry(0.4,14,0.4),new THREE.MeshLambertMaterial({color:0x111}));
  cable.position.set(0,-9.5,16);boomG.add(cable);
  const cont=new THREE.Mesh(new THREE.BoxGeometry(12.4,5,4.4),new THREE.MeshLambertMaterial({color:0xB33A3A}));
  cont.rotation.y=Math.PI/2;cont.position.set(0,-18,16);boomG.add(cont);
  g.add(boomG);
  const lamp=new THREE.Mesh(new THREE.BoxGeometry(3,1.2,1.2),new THREE.MeshBasicMaterial({color:0xDDE6F2}));
  lamp.position.set(0,60,-14);g.add(lamp);
  /* night: red blinking aviation beacon on top + white floodlight pool on the berth */
  const beacon=new THREE.Mesh(new THREE.SphereGeometry(1.6,8,8),new THREE.MeshBasicMaterial({color:0xFF2222}));
  beacon.position.set(0,83,-4);beacon.visible=false;g.add(beacon);g.userData.beacon=beacon;
  const flood=new THREE.Mesh(new THREE.CircleGeometry(32,22),new THREE.MeshBasicMaterial({color:0xFFFFFF,transparent:true,opacity:0.14,depthWrite:false}));
  flood.rotation.x=-Math.PI/2;flood.position.set(0,1.4,16);flood.visible=false;g.add(flood);
  if(TW&&TW.nightOnly)TW.nightOnly.push(flood);
  /* QC number on the crane (always readable) */
  const qcTag=nameSprite(qcId,'#E8B10F');qcTag.position.set(0,80,-4);qcTag.scale.multiplyScalar(0.85);g.add(qcTag);
  /* Adani logo banners — machinery house side + waterside portal beam */
  if(typeof ADANI_LOGO!=='undefined'){
    if(!TW._adaniTex){TW._adaniTex=new THREE.TextureLoader().load(ADANI_LOGO);TW._adaniTex.minFilter=THREE.LinearFilter;}
    const logoM=new THREE.MeshBasicMaterial({map:TW._adaniTex,side:THREE.DoubleSide});
    const bak=new THREE.Mesh(new THREE.BoxGeometry(20,5,0.5),new THREE.MeshLambertMaterial({color:0xFFFFFF}));
    bak.position.set(0,45.5,5.4);g.add(bak);
    const p2=new THREE.Mesh(new THREE.PlaneGeometry(14,4.4),logoM);
    p2.position.set(0,45.5,5.75);g.add(p2);                     /* white banner on waterside portal */
  }
  g.position.set(x,10,-6);
  g.userData={qc:qcId,boomG,trolley,cable,cont,lamp,boomTarget:-0.9};
  scene.add(g);
  return g;
}
function makeLabel(text,x,y,z,parent,hgt){
  /* auto-sized label: canvas grows to fit the FULL text so every letter is visible; renders on top */
  const fs=62,pad=30,h=118;
  const meas=document.createElement('canvas').getContext('2d');
  meas.font='bold '+fs+'px Segoe UI, Arial';
  const tw=Math.ceil(meas.measureText(text).width);
  const cv=document.createElement('canvas');cv.width=tw+pad*2;cv.height=h;
  const g=cv.getContext('2d');
  g.fillStyle='rgba(10,20,38,.9)';
  g.beginPath();
  if(g.roundRect)g.roundRect(3,10,cv.width-6,h-20,26);else g.rect(3,10,cv.width-6,h-20);
  g.fill();
  g.lineWidth=4;g.strokeStyle='#7FD1C8';g.stroke();
  g.fillStyle='#FFFFFF';g.font='bold '+fs+'px Segoe UI, Arial';g.textAlign='center';g.textBaseline='middle';
  g.fillText(text,cv.width/2,h/2+2);
  const tex=new THREE.CanvasTexture(cv);tex.minFilter=THREE.LinearFilter;
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,depthTest:false}));
  const H=hgt&&hgt<40?hgt:16;               /* height in world units; width scales to keep text proportions */
  sp.scale.set(cv.width/h*H,H,1);
  sp.renderOrder=999;
  sp.position.set(x,y,z);parent.add(sp);
  return sp;
}
function nameSprite(text,color){
  const fs=46,pad=22,h=96;
  const meas=document.createElement('canvas').getContext('2d');
  meas.font='bold '+fs+'px Segoe UI, Arial';
  const tw=Math.ceil(meas.measureText(text).width);
  const cv=document.createElement('canvas');cv.width=tw+pad*2+44;cv.height=h;
  const g=cv.getContext('2d');
  g.fillStyle='rgba(10,18,34,.82)';
  g.beginPath();if(g.roundRect)g.roundRect(3,8,cv.width-6,h-16,20);else g.rect(3,8,cv.width-6,h-16);g.fill();
  g.fillStyle=color;g.fillRect(pad-4,h/2-13,26,26);
  g.fillStyle='#fff';g.font='bold '+fs+'px Segoe UI, Arial';g.textBaseline='middle';
  g.fillText(text,pad+32,h/2+2);
  const tex=new THREE.CanvasTexture(cv);tex.minFilter=THREE.LinearFilter;
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,depthTest:false}));
  const H=12;
  sp.scale.set(cv.width/h*H,H,1);
  sp.renderOrder=998;
  return sp;
}
function shipTarget(voy){
  const F3=TW.b3d;
  if(voy.status==='Sailed Out')return null;
  if(voy.status==='Incoming'){const i=voyages.filter(v=>v.confirmed!==false&&v.status==='Incoming').indexOf(voy);
    return {x:2350+i*150,z:1900+i*190,ry:Math.PI*0.8};}     /* deep sea, well clear of the channel */
  if(voy.status==='At Anchorage'){const i=voyages.filter(v=>v.confirmed!==false&&v.status==='At Anchorage').indexOf(voy);
    return {x:1850+(i%3)*150,z:1500+Math.floor(i/3)*150,ry:2.4};}   /* anchorage ~4 km clear of the navigation channel */
  const F=F3[voy.berth]||F3.CB1||F3.EB1;
  const sideFlip=voy.side==='STARBOARD'?Math.PI:0;   /* PORT-to-berth is the frame default */
  const r=bolRange(voy);
  if(r){ /* position from the physical bollard range (works across the shared CB2/B3 pool) */
    const a=bollardWorld(poolOf(voy.berth),r[0]),b2=bollardWorld(poolOf(voy.berth),r[1]);
    return {x:(a.x+b2.x)/2+F.perp.x*16,z:(a.z+b2.z)/2+F.perp.z*16,ry:F.ry+sideFlip};}
  let t=0.5;
  if(voy.qFrom!=null&&voy.qTo!=null){const B=berths.find(b=>b.id===voy.berth);if(B)t=Math.min(0.94,Math.max(0.06,((voy.qFrom+voy.qTo)/2)/B.len));}
  const px=F.a.x+(F.b.x-F.a.x)*t,pz=F.a.z+(F.b.z-F.a.z)*t;
  return {x:px+F.perp.x*16,z:pz+F.perp.z*16,ry:F.ry+sideFlip};
}
function bollardWorld(pool,n){
  const F3=TW.b3d;
  if(pool==='EB1'){const F=F3.EB1;const t=(n-1)/26;
    return {x:F.a.x+(F.b.x-F.a.x)*t,z:F.a.z+(F.b.z-F.a.z)*t,F};}
  if(pool==='CB1'){const F=F3.CB1;const t=(n-1)/16;
    return {x:F.a.x+(F.b.x-F.a.x)*t,z:F.a.z+(F.b.z-F.a.z)*t,F};}
  if(n<=17){const F=F3.CB2;const t=(n-1)/16;
    return {x:F.a.x+(F.b.x-F.a.x)*t,z:F.a.z+(F.b.z-F.a.z)*t,F};}
  const F=F3.B3;const t=(n-18)/16;
  return {x:F.a.x+(F.b.x-F.a.x)*t,z:F.a.z+(F.b.z-F.a.z)*t,F};
}

function shipMesh(voy){
  const ves=vOf(voy);
  const L=ves.loa*0.62,Wd=Math.max(14,L*0.15);
  const g=new THREE.Group();
  const vt=vtypeOf(ves);
  const hullCol=vt==='Liquid'?0x10303E:(vt==='Bulk'||vt==='Break-Bulk')?0x1E4FA0:HULL_COLORS[voy.vesselId%HULL_COLORS.length];
  const hullM=new THREE.MeshLambertMaterial({color:hullCol});
  const hull=new THREE.Mesh(new THREE.BoxGeometry(L*0.86,9,Wd),hullM);
  hull.position.set(-L*0.05,5.5,0);hull.castShadow=true;g.add(hull);
  const bow=new THREE.Mesh(new THREE.CylinderGeometry(Wd/2,Wd/2,9,3,1),hullM);
  bow.rotation.z=Math.PI/2;bow.rotation.y=Math.PI;bow.scale.set(1,L*0.14/(Wd/2),1);
  bow.position.set(L*0.38+L*0.045,5.5,0);g.add(bow);
  const water=new THREE.Mesh(new THREE.BoxGeometry(L*0.88,1.6,Wd+0.6),new THREE.MeshLambertMaterial({color:0xB23A32}));
  water.position.set(-L*0.05,1.2,0);g.add(water);
  const deckCol=vt==='Liquid'?0x2E9E5B:(vt==='Bulk'||vt==='Break-Bulk')?0x8A2F2A:0x9FB0C4;
  const deck=new THREE.Mesh(new THREE.BoxGeometry(L*0.84,1.6,Wd*0.94),new THREE.MeshLambertMaterial({color:deckCol}));
  deck.position.set(-L*0.05,10.6,0);g.add(deck);
  const acc=new THREE.Mesh(new THREE.BoxGeometry(L*0.1,15,Wd*0.86),new THREE.MeshLambertMaterial({color:0xF2F5F9}));
  acc.position.set(-L*0.4,18.5,0);acc.castShadow=true;g.add(acc);
  const bridge=new THREE.Mesh(new THREE.BoxGeometry(L*0.115,3.4,Wd*1.06),new THREE.MeshLambertMaterial({color:0xDCE4EE}));
  bridge.position.set(-L*0.4,27.5,0);g.add(bridge);
  const funnel=new THREE.Mesh(new THREE.BoxGeometry(L*0.045,7,Wd*0.3),new THREE.MeshLambertMaterial({color:0x30455F}));
  funnel.position.set(-L*0.46,25,0);g.add(funnel);
  const fband=new THREE.Mesh(new THREE.BoxGeometry(L*0.047,1.6,Wd*0.31),new THREE.MeshLambertMaterial({color:0xC23B33}));
  fband.position.set(-L*0.46,27.5,0);g.add(fband);
  if(vt==='Container'){
    /* container stacks */
    const bays=Math.max(4,Math.floor(L/34));
    const rows=Math.max(2,Math.floor(Wd/7));
    for(let b=0;b<bays;b++)for(let r=0;r<rows;r++){
      const hgt=1+((b*7+r*3+voy.id)%3);
      for(let k=0;k<hgt;k++){
        const c=new THREE.Mesh(new THREE.BoxGeometry(L*0.6/bays-1.6,4.6,Wd*0.86/rows-1),
          new THREE.MeshLambertMaterial({color:CONTAINER_COLORS[(b+r*2+k+voy.id)%6]}));
        c.position.set(-L*0.3+b*(L*0.6/bays)+L*0.06,13.9+k*4.8,-Wd*0.43+Wd*0.86/rows*(r+0.5));
        g.add(c);}}
  } else if(vt==='Liquid'){
    /* tanker: green flush deck, centre pipeline, manifolds, foremast — per reference image */
    const pipe=new THREE.Mesh(new THREE.CylinderGeometry(0.9,0.9,L*0.62,8),new THREE.MeshLambertMaterial({color:0xC8D2CC}));
    pipe.rotation.z=Math.PI/2;pipe.position.set(-L*0.04,12.4,0);g.add(pipe);
    const pipe2=pipe.clone();pipe2.position.z=Wd*0.18;pipe2.scale.set(0.7,1,0.7);g.add(pipe2);
    for(let m=0;m<3;m++){
      const man=new THREE.Mesh(new THREE.BoxGeometry(3.5,2.6,Wd*0.7),new THREE.MeshLambertMaterial({color:0xE8EDE8}));
      man.position.set(-L*0.22+m*L*0.2,12.6,0);g.add(man);
      const walk=new THREE.Mesh(new THREE.BoxGeometry(L*0.6,0.4,2.2),new THREE.MeshLambertMaterial({color:0xDDE4DE}));
      walk.position.set(-L*0.04,13.4,0);g.add(walk);}
    const fmast=new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.7,10,6),new THREE.MeshLambertMaterial({color:0xE8EDE8}));
    fmast.position.set(L*0.34,16,0);g.add(fmast);
    const derr=new THREE.Mesh(new THREE.CylinderGeometry(0.4,0.5,9,6),new THREE.MeshLambertMaterial({color:0xE8EDE8}));
    derr.rotation.z=0.7;derr.position.set(L*0.05,15,Wd*0.2);g.add(derr);
  } else {
    /* bulk / break-bulk: red hatch covers + yellow deck cranes — per reference image */
    const nh=Math.max(3,Math.floor(L/44));
    for(let hIdx=0;hIdx<nh;hIdx++){
      const hx=-L*0.3+hIdx*(L*0.62/nh)+L*0.06;
      const hatch=new THREE.Mesh(new THREE.BoxGeometry(L*0.62/nh-5,2.6,Wd*0.62),new THREE.MeshLambertMaterial({color:0xC03A30}));
      hatch.position.set(hx,12.4,0);g.add(hatch);
      const ridge=new THREE.Mesh(new THREE.BoxGeometry(L*0.62/nh-9,1.4,Wd*0.4),new THREE.MeshLambertMaterial({color:0xD24A40}));
      ridge.position.set(hx,14.2,0);g.add(ridge);
      if(hIdx<nh-0){ /* yellow deck crane at each hatch boundary */ }
    }
    const yel=new THREE.MeshLambertMaterial({color:0xE8B10F});
    const nc=Math.min(4,Math.max(2,nh-1));
    for(let cIdx=0;cIdx<nc;cIdx++){
      const cx=-L*0.26+cIdx*(L*0.58/nc)+L*0.09;
      const post=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.5,16,8),yel);
      post.position.set(cx,18,Wd*0.12);post.castShadow=true;g.add(post);
      const boom=new THREE.Mesh(new THREE.CylinderGeometry(0.6,0.8,L*0.16,6),yel);
      boom.rotation.z=1.0;boom.position.set(cx-L*0.05,23,Wd*0.12);g.add(boom);
      const cabB=new THREE.Mesh(new THREE.BoxGeometry(3.4,3,3.4),new THREE.MeshLambertMaterial({color:0xF2F5F9}));
      cabB.position.set(cx,13.5,Wd*0.12);g.add(cabB);}
    const fmast2=new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.7,11,6),new THREE.MeshLambertMaterial({color:0xE8EDE8}));
    fmast2.position.set(L*0.34,16.5,0);g.add(fmast2);
  }
  /* yellow navigation/deck lights — ON at night */
  const lg=new THREE.Group();const lm=new THREE.MeshBasicMaterial({color:0xFFD34D});
  for(let li=0;li<4;li++){
    const d1=new THREE.Mesh(new THREE.SphereGeometry(0.95,6,6),lm);d1.position.set(-L*0.3+li*L*0.2,12.4,Wd*0.47);lg.add(d1);
    const d2=d1.clone();d2.position.z=-Wd*0.47;lg.add(d2);}
  const mastL=new THREE.Mesh(new THREE.SphereGeometry(1.2,6,6),lm);mastL.position.set(-L*0.4,31.5,0);lg.add(mastL);
  lg.visible=!!(TW&&TW.state&&TW.state.night);g.add(lg);
  const lineM=new THREE.LineBasicMaterial({color:0x111111});
  const moor=new THREE.Group();
  [[L*0.42,1],[L*0.34,1],[-L*0.44,-1],[-L*0.36,-1]].forEach(p=>{
    const geo=new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(p[0],7,-Wd/2),
      new THREE.Vector3(p[0]+p[1]*26,13.5,-Wd/2-18)]);
    moor.add(new THREE.Line(geo,lineM));});
  moor.visible=false;g.add(moor);
  const st=new THREE.Mesh(new THREE.BoxGeometry(6,2.6,6),new THREE.MeshBasicMaterial({color:new THREE.Color(cssVar(STATUS[voy.status].c))}));
  st.position.set(-L*0.4,32.6,0);g.add(st);
  const label=nameSprite(ves.name,cssVar(STATUS[voy.status].c));
  label.position.set(0,42,0);g.add(label);
  g.userData={voy,statusMesh:st,label,moor,ves,lights:lg};
  return g;
}
function refreshShipStatus(rec,voy){
  const col=cssVar(STATUS[voy.status].c);
  rec.group.userData.statusMesh.material.color.set(new THREE.Color(col));
  /* static hull ropes replaced by dynamic bollard-accurate ropes (updateRopes) */
  rec.group.userData.moor.visible=false;
  if(rec.lastStatus!==voy.status){
    rec.lastStatus=voy.status;
    const old=rec.group.userData.label;rec.group.remove(old);
    const nl=nameSprite(rec.group.userData.ves.name,col);nl.position.set(0,42,0);
    rec.group.add(nl);rec.group.userData.label=nl;
  }
}
/* ===== DYNAMIC MOORING ROPES =====
   Every rope runs Vessel → Bollard and its endpoint touches the selected bollard.
   Nothing is hard-coded: recomputed EVERY FRAME from vessel position, vessel rotation
   (Port/Starboard side to berth), Bow bollard, Stern bollard and the bollard's real
   3D position — so a rope endpoint can never terminate in the sea. When no bollards
   are selected yet, the ropes drop to the nearest points on the quay edge instead. */
let ROPE_MAT=null;   /* lazy: THREE only exists when WebGL/CDN is available */
function updateRopes(rec){
  if(!ROPE_MAT)ROPE_MAT=new THREE.LineBasicMaterial({color:0x14181E});
  const g=rec.group,v=g.userData.voy;
  if(!rec.ropes){rec.ropes=[];for(let i=0;i<4;i++){
    const geo=new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(6),3));
    const ln=new THREE.Line(geo,ROPE_MAT);ln.visible=false;ln.frustumCulled=false;
    TW.scene.add(ln);rec.ropes.push(ln);}}
  const moored=v&&v.berth&&['At Berth','Operating','Completed'].includes(v.status)&&!(rec.path&&rec.path.length)&&!rec.leaving;
  if(!moored){rec.ropes.forEach(l=>{l.visible=false;});return;}
  const F=TW.b3d[v.berth]||TW.b3d.CB1||TW.b3d.EB1;
  const ves=g.userData.ves,L=ves.loa*0.62,Wd=Math.max(14,L*0.15);
  const ry=g.rotation.y,co=Math.cos(ry),si=Math.sin(ry);
  const l2w=(lx,lz)=>({x:g.position.x+lx*co+lz*si,z:g.position.z-lx*si+lz*co});
  const w2lz=(wx,wz)=>{const dx=wx-g.position.x,dz=wz-g.position.z;return dx*si+dz*co;};
  const r=bolRange(v),pool=poolOf(v.berth);
  let tgts;
  if(r){const lo=r[0],hi=r[1];
    tgts=[bollardWorld(pool,lo),bollardWorld(pool,Math.min(lo+1,hi)),bollardWorld(pool,Math.max(hi-1,lo)),bollardWorld(pool,hi)];}
  else{const abx=F.b.x-F.a.x,abz=F.b.z-F.a.z,len2=abx*abx+abz*abz||1;
    const proj=pt=>{let tt=((pt.x-F.a.x)*abx+(pt.z-F.a.z)*abz)/len2;tt=Math.min(1,Math.max(0,tt));
      return {x:F.a.x+abx*tt,z:F.a.z+abz*tt};};
    const bw=l2w(L*0.42,0),sw=l2w(-L*0.44,0);
    tgts=[proj(bw),proj({x:bw.x*0.7+sw.x*0.3,z:bw.z*0.7+sw.z*0.3}),proj({x:bw.x*0.3+sw.x*0.7,z:bw.z*0.3+sw.z*0.7}),proj(sw)];}
  /* whichever physical end of the hull is nearer the first target gets the first fairlead */
  const endBow=l2w(L*0.42,0),endStern=l2w(-L*0.44,0);
  const bowNear=Math.hypot(tgts[0].x-endBow.x,tgts[0].z-endBow.z)<=Math.hypot(tgts[0].x-endStern.x,tgts[0].z-endStern.z);
  const AX=(bowNear?[0.42,0.3,-0.32,-0.44]:[-0.44,-0.32,0.3,0.42]).map(f=>f*L);
  rec.ropes.forEach((ln,i)=>{
    const tp=tgts[i];
    const sideZ=(w2lz(tp.x,tp.z)>=0?1:-1)*Wd/2;   /* fairlead always on the quay-facing side */
    const a=l2w(AX[i],sideZ);
    const pos=ln.geometry.attributes.position.array;
    pos[0]=a.x;pos[1]=7+g.position.y;pos[2]=a.z;
    pos[3]=tp.x;pos[4]=3;pos[5]=tp.z;               /* endpoint touches the bollard */
    ln.geometry.attributes.position.needsUpdate=true;
    ln.visible=true;});
}
function refreshBollards(){
  if(!TW||!TW.bollardMarks)return;
  const setC=(pool,n,c)=>{const m=TW.bollardMarks[pool]&&TW.bollardMarks[pool][n];if(m)m.ring.material.color.set(c);};
  Object.keys(TW.bollardMarks).forEach(pool=>{for(let n=1;n<=poolMax(pool);n++)setC(pool,n,0x2F9E62);});
  voyages.forEach(v=>{
    if(v.confirmed===false||v.status==='Sailed Out'||!v.berth)return;
    const r=bolRange(v);if(!r)return;
    const pool=poolOf(v.berth);
    for(let n=r[0];n<=r[1];n++)setC(pool,n,0x0D9488);   /* auto-allocated intermediates */
    setC(pool,v.bowB,0x2563EB);                          /* bow */
    setC(pool,v.sternB,0x7C3AED);                        /* stern */
  });
}
function syncShips(){
  const st=TW.state;
  refreshBollards();
  const {BASIN,ENT,CH1,CH_OUT}=TW.wp;
  voyages.filter(v=>v.confirmed!==false&&inPort(v)).forEach(v=>{
    const tgt=shipTarget(v);
    if(tgt&&!st.ships.has(v.id)){
      const g=shipMesh(v);
      g.position.set(v.status==='Incoming'?tgt.x+120:tgt.x+0.01,0,v.status==='Incoming'?tgt.z+300:tgt.z);
      g.rotation.y=tgt.ry;TW.scene.add(g);
      if(TW.state.night&&g.userData.lights)g.userData.lights.visible=true;
      st.ships.set(v.id,{group:g,lastStatus:v.status,key:v.status+'|'+v.berth});
    }
    const rec=st.ships.get(v.id);
    if(!rec)return;
    const key=v.status+'|'+v.berth;
    if(rec.key!==key){
      const from=rec.key.split('|')[0];
      if(['At Berth','Operating','Completed'].includes(v.status)&&(from==='At Anchorage'||from==='Incoming')&&v.berth){
        const F=TW.b3d[v.berth]||TW.b3d.CB1;
        const app=[{x:F.mid.x+F.perp.x*110,z:F.mid.z+F.perp.z*110},{x:F.mid.x+F.perp.x*45,z:F.mid.z+F.perp.z*45},{x:tgt.x,z:tgt.z}];
        rec.path=from==='At Anchorage'
          ?[CH1,ENT,BASIN,...app]
          :[CH_OUT,CH1,ENT,BASIN,...app];
        rec.speed=1.15;
      }
      rec.key=key;
    }
    rec.target=tgt;rec.group.userData.voy=v;refreshShipStatus(rec,v);
  });
  [...st.ships.keys()].forEach(id=>{
    const v=voyages.find(x=>x.id===id&&x.confirmed!==false&&inPort(x));
    if(!v||!shipTarget(v)){const rec=st.ships.get(id);
      if(!rec.leaving){rec.leaving=true;
        rec.path=[BASIN,ENT,CH1,CH_OUT,{x:2000,z:1100}];
        rec.speed=1.4;rec.target=null;
        rec.group.userData.moor.visible=false;
        if(rec.ropes)rec.ropes.forEach(l=>l.visible=false);
        setTimeout(()=>{TW.scene.remove(rec.group);if(rec.ropes)rec.ropes.forEach(l=>TW.scene.remove(l));st.ships.delete(id);},26000);}}
  });
  if(pendingFocus){
    if(pendingFocus.type==='vessel'&&st.ships.has(pendingFocus.id)){
      const rec=st.ships.get(pendingFocus.id);
      const wp=new THREE.Vector3();rec.group.getWorldPosition(wp);
      TW.goalTo(wp.x,wp.z,280,0.45);
      showShipCard(rec.group.userData.voy);
    }else if(pendingFocus.type==='berth'){
      const F=TW.b3d[pendingFocus.id];
      if(F)TW.goalTo(F.mid.x+F.perp.x*30,F.mid.z+F.perp.z*30,280,0.35);
    }
    pendingFocus=null;
  }
}

function moveRec(rec){
  const g=rec.group;
  if(rec.path&&rec.path.length){
    const p=rec.path[0];const dx=p.x-g.position.x,dz=p.z-g.position.z;const d=Math.hypot(dx,dz);
    const sp=rec.speed||1;
    if(d<14)rec.path.shift();
    else{g.position.x+=dx/d*sp;g.position.z+=dz/d*sp;
      const hd=Math.atan2(-dz,dx);
      let diff=hd-g.rotation.y;while(diff>Math.PI)diff-=2*Math.PI;while(diff<-Math.PI)diff+=2*Math.PI;
      g.rotation.y+=diff*0.05;}
    return false;
  } else if(rec.target){
    const tg=rec.target;
    g.position.x+=(tg.x-g.position.x)*0.015;
    g.position.z+=(tg.z-g.position.z)*0.015;
    let diff=tg.ry-g.rotation.y;while(diff>Math.PI)diff-=2*Math.PI;while(diff<-Math.PI)diff+=2*Math.PI;
    g.rotation.y+=diff*0.03;
  }
  return true;
}
function loop(){
  if(!TW||!document.body.contains(TW.renderer.domElement)){if(TW)TW._loop=false;return;}
  requestAnimationFrame(loop);
  const {cam,state,renderer,scene}=TW;
  const nowT=performance.now();const dt=Math.min(0.1,(nowT-(TW._lastT||nowT))/1000);TW._lastT=nowT;
  if(twinDirty){syncShips();twinDirty=false;}
  const t=nowT/1000;
  /* planned ships */
  state.ships.forEach(rec=>{moveRec(rec);rec.group.position.y=Math.sin(t*1.2+rec.group.position.x*0.5)*0.6;updateRopes(rec);});
  /* tour demo ship */
  if(TW.tourShip){
    const done=moveRec(TW.tourShip);
    const g=TW.tourShip.group;
    g.position.y=Math.sin(t*1.2+g.position.x*0.5)*0.6;
    if(done&&TW.tourShip.moorAt){
      const F=TW.b3d[TW.tourShip.moorAt];
      TW.tourShip.target={x:F.mid.x+F.perp.x*16,z:F.mid.z+F.perp.z*16,ry:F.ry};
      g.userData.moor.visible=true;
    } else if(!done&&g.userData.moor.visible)g.userData.moor.visible=false;
  }
  /* tour state machine */
  if(TW.tour){
    const tour=TW.tour;tour.t+=dt;
    const s=tour.steps[tour.i];
    if(s){
      if(s.follow&&TW.tourShip){
        const g=TW.tourShip.group;
        TW.goalTo(g.position.x,g.position.z,360,0.5);
      }
      const pathDone=!s.path||(TW.tourShip&&TW.tourShip.path.length===0);
      const durDone=s.dur?tour.t>=s.dur:false;
      const maxDone=s.maxDur?tour.t>=s.maxDur:false;
      if((s.dur&&durDone)||(s.path&&pathDone&&tour.t>2)||maxDone){
        if(s.end){endTour();}else nextTourStep();
      }
    } else endTour();
  }
  /* cranes: boom + trolley/spreader — real assignments, plus tour override */
  const anyOp={};voyages.forEach(v=>{if(v.status==='Operating')v.cranes.forEach(q=>anyOp[q]=true);});
  if(TW.craneOv)Object.keys(TW.craneOv).forEach(q=>anyOp[q]=true);
  Object.values(TW.craneMeshes).forEach(g=>{
    const working=anyOp[g.userData.qc];
    g.userData.boomTarget=working?0:-0.9;
    g.userData.boomG.rotation.x+=(g.userData.boomTarget-g.userData.boomG.rotation.x)*0.03;
    if(working){
      const cyc=(Math.sin(t*0.9+g.position.x)+1)/2;
      g.userData.trolley.position.z=8+cyc*38;
      g.userData.cable.position.z=8+cyc*38;
      g.userData.cont.position.z=8+cyc*38;
      const lift=Math.abs(Math.sin(t*0.9+g.position.x));
      g.userData.cable.scale.y=0.6+lift*0.9;g.userData.cable.position.y=-2.5-7*(0.6+lift*0.9)/1.4;
      g.userData.cont.position.y=-6-13*(0.6+lift*0.9)/1.4;
      g.userData.cont.visible=cyc>0.12;
    } else {g.userData.cont.visible=false;g.userData.trolley.position.z=10;g.userData.cable.position.z=10;}
    if(g.userData.beacon)g.userData.beacon.visible=state.night&&Math.sin(t*5+g.position.x)>0;
  });
  if(TW.rtgs)TW.rtgs.forEach((rt,i)=>{rt.userData.trolley.position.x=Math.sin(t*0.4+i*1.3)*9;});
  /* ITV trailers along the C1 apron (north–south road) */
  const opsOn=voyages.some(v=>v.status==='Operating')||TW.trailerOv;
  state.trailers.forEach(tr=>{
    if(opsOn){tr.position.z+=tr.userData.speed*tr.userData.dir;
      if(tr.position.z>320){tr.userData.dir=-1;tr.rotation.y=Math.PI/2;}
      if(tr.position.z<-10){tr.userData.dir=1;tr.rotation.y=-Math.PI/2;}}
  });
  scene.children.forEach(o=>{if(o.userData&&o.userData.buoy)o.position.y=Math.sin(t*1.6+o.position.z)*1.1;});
  /* ===== TUG ESCORT — tugs leave their pier and guide any vessel that is manoeuvring (ATA → ATB and departure) ===== */
  if(TW.tugs&&TW.tugs.length){
    let escort=null;
    if(TW.tourShip&&TW.tourShip.path&&TW.tourShip.path.length)escort=TW.tourShip;
    if(!escort)state.ships.forEach(rec=>{if(!escort&&rec.path&&rec.path.length)escort=rec;});
    TW.tugs.forEach((tug,i)=>{
      let gx,gz,gry;
      if(escort){
        const s=escort.group;
        const fx=Math.cos(s.rotation.y),fz=-Math.sin(s.rotation.y);   /* ship forward */
        const lx=-fz,lz=fx;                                            /* ship starboard */
        const off=i===0?{f:52,l:22}:{f:-46,l:-22};                     /* lead tug fwd-stbd, stern tug aft-port */
        gx=s.position.x+fx*off.f+lx*off.l;
        gz=s.position.z+fz*off.f+lz*off.l;
        gry=s.rotation.y;
      } else {gx=tug.home.x;gz=tug.home.z;gry=tug.home.ry;}
      const g=tug.group;
      g.position.x+=(gx-g.position.x)*0.045;
      g.position.z+=(gz-g.position.z)*0.045;
      let dr=gry-g.rotation.y;while(dr>Math.PI)dr-=2*Math.PI;while(dr<-Math.PI)dr+=2*Math.PI;
      g.rotation.y+=dr*0.08;
      g.position.y=Math.sin(t*1.8+i*2)*0.8;
    });
  }
  /* smooth camera: fly toward goal when one is set */
  if(state.goal){
    state.target.lerp(state.goal.t,0.045);
    state.dist+=(state.goal.d-state.dist)*0.045;
    state.el+=(state.goal.el-state.el)*0.045;
    if(state.goal.az!==undefined){
      let da=state.goal.az-state.az;while(da>Math.PI)da-=2*Math.PI;while(da<-Math.PI)da+=2*Math.PI;
      state.az+=da*0.045;}
  }
  cam.position.set(
    state.target.x+state.dist*Math.cos(state.el)*Math.cos(state.az),
    state.dist*Math.sin(state.el),
    state.target.z+state.dist*Math.cos(state.el)*Math.sin(state.az));
  cam.lookAt(state.target);
  renderer.render(scene,cam);
}

/* ================= ENNORE (AECTPL) DIGITAL TWIN =================
   Independent scene per the AECTPL reference: straight 400 m berth (Ennore B1),
   sea to the south, 27 bollards @ 15 m, 4 QC cranes (QC-01…QC-04), then a
   100 m paved gap between the crane apron and the container yard (real scale).
   Geometry lives in ENN_CFG so positions stay configurable. */
const ENN_CFG={
  /* Plotted from the AECTPL Google-Maps GPS reference (uploaded satellite views,
     ~13.272°N 80.339°E): the B1 quay runs NORTH–SOUTH with the harbour water to
     the EAST and the container yard WEST of the quay; the vessel berths along the
     eastern quay face; breakwater arms shelter the basin with the entrance to the
     south-east; Ennore Anchorage lies offshore to the east.
     Engineering dimensions (AUTHORITATIVE): berth 400 m · 27 bollards · 15 m
     spacing · 4 QC cranes · 100 m crane-to-yard gap. Breakwater/shoreline shapes
     are REFERENCE/APPROXIMATE (no survey data supplied). */
  quayHalf:200,                          /* 400 m N–S berth, centred on z=0 */
  craneT:[0.2,0.4,0.6,0.8],              /* QC positions along the berth (configurable) */
  craneSetback:8, apronDepth:60, gap:100, yardDepth:300,
  breakwaterN:[[130,-330],[420,-300],[570,-150],[620,60]],   /* northern arm, entrance SE */
  breakwaterS:[[170,330],[400,370]],                          /* southern arm stub */
};
function initTwinENN(){
  if(typeof THREE==='undefined'){init2DFallback();return;}
  const canvas=$('#twinCanvas');const wrap=$('#twinWrap');
  const W=wrap.clientWidth,Hh=wrap.clientHeight;
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
  renderer.setSize(W,Hh,false);renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene();
  const cam=new THREE.PerspectiveCamera(48,W/Hh,1,12000);
  const state={night:false,mobile:false,az:-2.2,el:0.95,dist:950,target:new THREE.Vector3(-40,0,0),ships:new Map(),trailers:[],goal:null};
  TW={renderer,scene,cam,state};
  TW.nightOnly=[];TW.tugs=[];TW.craneMeshes={};TW.bollardMarks={};
  const hemi=new THREE.HemisphereLight(0xEAF2FF,0x39536B,0.8);scene.add(hemi);
  const sun=new THREE.DirectionalLight(0xFFF4E0,1.05);sun.position.set(380,540,320);
  sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
  sun.shadow.camera.left=-900;sun.shadow.camera.right=900;sun.shadow.camera.top=900;sun.shadow.camera.bottom=-900;
  scene.add(sun);TW.sun=sun;TW.hemi=hemi;
  const sea=new THREE.Mesh(new THREE.PlaneGeometry(9000,9000),new THREE.MeshPhongMaterial({color:0x2E7D6E,shininess:90,specular:0x335544}));
  sea.rotation.x=-Math.PI/2;sea.position.y=-0.6;sea.receiveShadow=true;scene.add(sea);TW.sea=sea;
  /* berth frame per the GPS reference: N–S quay, water EAST (+x) → the frame's
     default heading is port-side-to-berth; STARBOARD berthing adds π as everywhere */
  const C=ENN_CFG;
  const mid={x:0,z:0};
  const b3d={EB1:{a:{x:0,z:C.quayHalf},b:{x:0,z:-C.quayHalf},mid,len:C.quayHalf*2,
    dir:{x:0,z:-1},perp:{x:1,z:0},ry:Math.PI/2,label:'ENNORE B1 — 400 m'}};
  TW.b3d=b3d;const F=b3d.EB1;
  const BASIN={x:230,z:80},ENT={x:660,z:250},CH1={x:1050,z:430},CH_OUT={x:1400,z:620};
  TW.wp={BASIN,ENT,CH1,CH_OUT};
  /* land per GPS reference: quay deck → crane apron → 100 m gap → yard, all WEST (−x) */
  const deck=new THREE.Mesh(new THREE.BoxGeometry(C.apronDepth,12,F.len+60),new THREE.MeshLambertMaterial({color:0x8B929D}));
  deck.position.set(-C.apronDepth/2,5,0);deck.receiveShadow=true;scene.add(deck);
  const gapSlab=new THREE.Mesh(new THREE.BoxGeometry(C.gap,10,F.len+60),new THREE.MeshLambertMaterial({color:0xA7ADB6}));
  gapSlab.position.set(-C.apronDepth-C.gap/2,4,0);gapSlab.receiveShadow=true;scene.add(gapSlab);
  for(let i=0;i<5;i++){const lane=new THREE.Mesh(new THREE.BoxGeometry(1.4,0.5,F.len+40),new THREE.MeshBasicMaterial({color:0xE8E2D2}));
    lane.position.set(-C.apronDepth-14-i*18,9.3,0);scene.add(lane);}
  const yard=new THREE.Mesh(new THREE.BoxGeometry(C.yardDepth,10,F.len+140),new THREE.MeshLambertMaterial({color:0x9AA0A8}));
  yard.position.set(-C.apronDepth-C.gap-C.yardDepth/2,4,0);yard.receiveShadow=true;scene.add(yard);
  /* container blocks in N–S rows (as on the satellite view) + RTGs */
  for(let r=0;r<4;r++)for(let cIdx=0;cIdx<8;cIdx++){
    const st2=new THREE.Mesh(new THREE.BoxGeometry(13,10+(r%3)*4,34),
      new THREE.MeshLambertMaterial({color:CONTAINER_COLORS[(r*3+cIdx)%6]}));
    st2.position.set(-C.apronDepth-C.gap-40-r*58,9+(5+(r%3)*2),-176+cIdx*50);st2.castShadow=true;scene.add(st2);}
  for(let i=0;i<2;i++){const rtg=new THREE.Group();
    [[-14],[14]].forEach(px=>{const leg=new THREE.Mesh(new THREE.BoxGeometry(2.2,30,2.2),new THREE.MeshLambertMaterial({color:0xD9822B}));
      leg.position.set(px[0],15,0);rtg.add(leg);});
    const beam=new THREE.Mesh(new THREE.BoxGeometry(32,2.6,3),new THREE.MeshLambertMaterial({color:0xD9822B}));
    beam.position.set(0,30,0);rtg.add(beam);
    rtg.rotation.y=Math.PI/2;
    rtg.position.set(-C.apronDepth-C.gap-110,9,-90+i*220);scene.add(rtg);}
  /* shoreline / coast strip west of the terminal */
  const coast=new THREE.Mesh(new THREE.BoxGeometry(600,8,3000),new THREE.MeshLambertMaterial({color:0xB9AC85}));
  coast.position.set(-C.apronDepth-C.gap-C.yardDepth-320,3,0);scene.add(coast);
  makeLabel('AECTPL CONTAINER YARD',-C.apronDepth-C.gap-130,54,0,scene,15);
  makeLabel('100 m APRON–YARD GAP',-C.apronDepth-C.gap/2,30,140,scene,10);
  /* berth face strip + 27 numbered bollards @15 m + fenders (eastern quay face) */
  const strip=new THREE.Mesh(new THREE.BoxGeometry(F.len-4,0.8,6),new THREE.MeshBasicMaterial({color:0x59C2B4}));
  strip.position.set(-3,11.7,0);strip.rotation.y=Math.PI/2;scene.add(strip);
  TW.bollardMarks.EB1={};
  const bolM=new THREE.MeshLambertMaterial({color:0x22262E});
  for(let i=0;i<27;i++){const t=i/26;const pz=F.a.z+(F.b.z-F.a.z)*t;const num=i+1;
    const bol=new THREE.Mesh(new THREE.CylinderGeometry(2,2.5,4.5,10),bolM);
    bol.position.set(-4,13,pz);bol.castShadow=true;scene.add(bol);
    const ring=new THREE.Mesh(new THREE.CylinderGeometry(3.8,3.8,0.7,12),new THREE.MeshBasicMaterial({color:0x2F9E62}));
    ring.position.set(-4,16,pz);scene.add(ring);
    const tag=nameSprite(String(num),'#2F9E62');tag.scale.multiplyScalar(0.34);
    tag.position.set(-11,22,pz);scene.add(tag);
    TW.bollardMarks.EB1[num]={ring};
    if(i<26){const fen=new THREE.Mesh(new THREE.BoxGeometry(2.2,9,6),new THREE.MeshLambertMaterial({color:0x14161B}));
      fen.position.set(1.6,4,pz-7.4);scene.add(fen);}}
  makeLabel(F.label,-46,52,0,scene,20);
  /* 4 QC cranes along Ennore B1, booms EAST over the water (per the GPS reference;
     positions configurable in ENN_CFG.craneT) */
  cranes.filter(q=>q.berth==='EB1').forEach((q,i)=>{
    const t=C.craneT[i]!==undefined?C.craneT[i]:0.2+i*0.2;
    const pz=F.a.z+(F.b.z-F.a.z)*t;
    const g=buildCrane(0,scene,q.id);
    g.position.set(-C.craneSetback,10,pz);
    g.rotation.y=Math.PI/2;               /* boom reaches over the water (+x, east) */
    TW.craneMeshes[q.id]=g;});
  /* channel buoys + labels + anchorage */
  [0.14,0.4,0.66,0.9].forEach(t=>{[-1,1].forEach(sgn=>{
    const bx=ENT.x+(CH_OUT.x-ENT.x)*t,bz=ENT.z+(CH_OUT.z-ENT.z)*t;
    const off={x:-(CH_OUT.z-ENT.z),z:(CH_OUT.x-ENT.x)};const ol=Math.hypot(off.x,off.z);
    const g=new THREE.Group();const col=sgn>0?0x3FA34D:0xD84040;
    const fl=new THREE.Mesh(new THREE.CylinderGeometry(4.5,5.5,3.5,10),new THREE.MeshLambertMaterial({color:col}));
    fl.position.y=2;g.add(fl);
    const glow=new THREE.Mesh(new THREE.SphereGeometry(1.9,8,8),new THREE.MeshBasicMaterial({color:0x3BFF7E}));
    glow.position.y=8;glow.visible=false;g.add(glow);g.userData.glow=glow;
    g.position.set(bx+off.x/ol*46*sgn,0,bz+off.z/ol*46*sgn);
    g.userData.buoy=true;scene.add(g);});});
  /* breakwater arms — plotted from the GPS reference (northern arm curving east with
     the harbour entrance to the SE, plus the southern stub); scale approximate */
  (function(){
    const arm=pts=>{for(let sIx=0;sIx<pts.length-1;sIx++){
      const a=pts[sIx],b2=pts[sIx+1];
      const d=Math.hypot(b2[0]-a[0],b2[1]-a[1]);const n=Math.max(1,Math.round(d/20));
      for(let i=0;i<n;i++){const px=a[0]+(b2[0]-a[0])*i/n,pz=a[1]+(b2[1]-a[1])*i/n;
        for(let k=0;k<3;k++){
          const r=5+Math.abs((Math.round(px)*7+Math.round(pz)*3+k*31)%8);
          const rock=new THREE.Mesh(new THREE.IcosahedronGeometry(r,0),
            new THREE.MeshLambertMaterial({color:k%2?0xB8B4AC:0xA8A49C}));
          rock.position.set(px+((k*17)%13)-6,r*0.4,pz+((k*23)%15)-7);
          rock.rotation.set(k+i,px*0.01,pz*0.01);rock.castShadow=true;scene.add(rock);}}}};
    arm(C.breakwaterN);arm(C.breakwaterS);
    makeLabel('BREAKWATER (per GPS reference)',C.breakwaterN[1][0]+40,36,C.breakwaterN[1][1],scene,12);})();
  makeLabel('NAVIGATION CHANNEL',1050,44,430,scene,16);
  makeLabel('ENNORE ANCHORAGE',1850,44,1500,scene,15);
  const pbg=new THREE.Mesh(new THREE.ConeGeometry(8,22,4),new THREE.MeshLambertMaterial({color:0xF3C244}));
  pbg.position.set(1450,11,680);scene.add(pbg);
  makeLabel('PILOT BOARDING POINT',1450,46,680,scene,13);
  /* yard light masts — night only */
  for(let i=0;i<4;i++){const m=new THREE.Group();
    const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.8,1.1,34,6),new THREE.MeshLambertMaterial({color:0x666}));
    pole.position.y=17;m.add(pole);
    const head=new THREE.Mesh(new THREE.SphereGeometry(2.4,8,8),new THREE.MeshBasicMaterial({color:0xFFE9A8}));
    head.position.y=34;head.visible=false;m.add(head);TW.nightOnly.push(head);
    m.position.set(-C.apronDepth-C.gap-20,9,-170+i*115);scene.add(m);}
  /* ===== interactions (orbit, pick, presets, night, quality) ===== */
  let drag=false,px2=0,py2=0;
  canvas.onpointerdown=e=>{drag=false;px2=e.clientX;py2=e.clientY;canvas.setPointerCapture(e.pointerId);canvas._down=true;};
  canvas.onpointermove=e=>{if(!canvas._down)return;const dx=e.clientX-px2,dy=e.clientY-py2;
    if(Math.abs(dx)+Math.abs(dy)>3)drag=true;
    state.az-=dx*0.005;state.el=Math.min(1.5,Math.max(0.12,state.el+dy*0.004));px2=e.clientX;py2=e.clientY;
    state.goal=null;};
  canvas.onpointerup=e=>{canvas._down=false;if(!drag)pick(e);};
  canvas.onwheel=e=>{e.preventDefault();state.dist=Math.min(3600,Math.max(120,state.dist+e.deltaY*0.7));state.goal=null;};
  const ray=new THREE.Raycaster(),m2=new THREE.Vector2();
  function pickVoy(e){const r=canvas.getBoundingClientRect();
    m2.x=((e.clientX-r.left)/r.width)*2-1;m2.y=-((e.clientY-r.top)/r.height)*2+1;
    ray.setFromCamera(m2,cam);
    const groups=[...state.ships.values()].map(s2=>s2.group);
    const hit=ray.intersectObjects(groups,true)[0];
    if(!hit)return null;
    let o=hit.object;while(o&&!o.userData.voy)o=o.parent;
    return o?o.userData.voy:null;}
  function pick(e){const voy=pickVoy(e);const card=$('#shipCard');
    if(voy)showShipCard(voy);else card.style.display='none';}
  canvas.ondblclick=e=>{const voy=pickVoy(e);
    if(voy&&voy.id!==-1)vesselInfo3D(voy);};
  function goalTo(x,z,d,el,az){state.goal={t:new THREE.Vector3(x,0,z),d,el,az};}
  TW.goalTo=goalTo;
  document.querySelectorAll('[data-cam]').forEach(b=>b.onclick=()=>{
    const P={over:{x:60,z:0,d:1150,el:1.5,az:-2.2},
      eb1:{x:40,z:0,d:320,el:0.35,az:Math.PI},
      anch:{x:1850,z:1500,d:820,el:0.55,az:-2.4},
      chan:{x:1050,z:430,d:640,el:0.75,az:-2.2}}[b.dataset.cam];
    if(P)goalTo(P.x,P.z,P.d,P.el,P.az);});
  function setNight(on){
    state.night=on;$('#dayNight').textContent=on?'☀️ Day':'🌙 Night';
    if(on){scene.background=new THREE.Color(0x0A1526);scene.fog.color.set(0x0A1526);sea.material.color.set(0x0B2E33);sun.intensity=0.12;hemi.intensity=0.26;
      Object.values(TW.craneMeshes).forEach(g=>g.userData.lamp&&g.userData.lamp.material.color.set(0xFFE9A8));}
    else{scene.background=new THREE.Color(0xBFD9EE);scene.fog.color.set(0xBFD9EE);sea.material.color.set(0x2E7D6E);sun.intensity=1.05;hemi.intensity=0.8;
      Object.values(TW.craneMeshes).forEach(g=>g.userData.lamp&&g.userData.lamp.material.color.set(0xDDE6F2));}
    TW.nightOnly.forEach(m=>m.visible=on);
    scene.children.forEach(o=>{if(o.userData&&o.userData.buoy&&o.userData.glow)o.userData.glow.visible=on;});
    state.ships.forEach(rec=>{if(rec.group.userData.lights)rec.group.userData.lights.visible=on;});
  }
  TW.setNight=setNight;
  $('#dayNight').onclick=()=>setNight(!state.night);
  $('#qualBtn').onclick=e=>{
    state.mobile=!state.mobile;
    e.target.textContent=state.mobile?'📱 Mobile':'🖥️ Desktop';
    renderer.setPixelRatio(state.mobile?1:Math.min(devicePixelRatio,2));
    renderer.shadowMap.enabled=!state.mobile;
    scene.traverse(o=>{if(o.material)o.material.needsUpdate=true;});
    cam.fov=state.mobile?60:48;cam.updateProjectionMatrix();
    toast(state.mobile?'Mobile mode: lighter graphics':'Desktop mode: full quality');};
  scene.background=new THREE.Color(0xBFD9EE);
  scene.fog=new THREE.Fog(0xBFD9EE,1400,6500);
  twinDirty=true;
  if(!TW._loop){TW._loop=true;TW._lastT=performance.now();requestAnimationFrame(loop);}
}

/* ---- 2D top-view fallback (no WebGL) ---- */
function init2DFallback(){
  const canvas=$('#twinCanvas'),wrap=$('#twinWrap');
  document.querySelectorAll('[data-cam],#dayNight,#qualBtn,#tourBtn').forEach(b=>b.style.display='none');
  const W=wrap.clientWidth,Hh=wrap.clientHeight;
  canvas.width=W*devicePixelRatio;canvas.height=Hh*devicePixelRatio;
  const g=canvas.getContext('2d');g.scale(devicePixelRatio,devicePixelRatio);
  const bz=curPort==='ENN'?{EB1:{x0:140,x1:700}}:{CB1:{x0:60,x1:300},CB2:{x0:320,x1:560},B3:{x0:600,x1:800}};
  const bzFirst=bz[Object.keys(bz)[0]];
  const QY=110;
  const ships=new Map();
  function target(voy){
    if(voy.status==='Sailed Out')return null;
    if(voy.status==='Incoming'){const i=voyages.filter(v=>v.status==='Incoming').indexOf(voy);
      return{x:W-140-i*40,y:Hh-60-i*70};}
    if(voy.status==='At Anchorage'){const i=voyages.filter(v=>v.status==='At Anchorage').indexOf(voy);
      return{x:W-220-(i%3)*140,y:Hh-190-Math.floor(i/3)*70};}
    const z=voy.berth&&bz[voy.berth]?bz[voy.berth]:bzFirst;return{x:(z.x0+z.x1)/2,y:QY+34};
  }
  function sync(){voyages.filter(v=>v.confirmed!==false&&inPort(v)).forEach(v=>{const t=target(v);
    if(t&&!ships.has(v.id))ships.set(v.id,{x:v.status==='Incoming'?W-80:t.x,y:v.status==='Incoming'?Hh-40:t.y});
    if(!t&&ships.has(v.id)){const s=ships.get(v.id);s.leave={x:W+300,y:s.y+120};}});
    if(pendingFocus){if(pendingFocus.type==='vessel'){const voy=voyages.find(v=>v.id===pendingFocus.id);if(voy)showShipCard(voy);}pendingFocus=null;}}
  sync();
  canvas.onclick=e=>{const r=canvas.getBoundingClientRect();const mx=e.clientX-r.left,my=e.clientY-r.top;
    let found=null;
    ships.forEach((s,id)=>{const voy=voyages.find(v=>v.id===id);if(!voy)return;
      const ves=vOf(voy);const L=ves.loa*0.42;
      if(Math.abs(mx-s.x)<L/2+8&&Math.abs(my-s.y)<24)found=voy;});
    const card=$('#shipCard');
    if(found)showShipCard(found);else card.style.display='none';};
  canvas.ondblclick=e=>{const r=canvas.getBoundingClientRect();const mx=e.clientX-r.left,my=e.clientY-r.top;
    let found=null;
    ships.forEach((s2,id)=>{const voy=voyages.find(v=>v.id===id);if(!voy)return;
      const ves=vOf(voy);const L=ves.loa*0.42;
      if(Math.abs(mx-s2.x)<L/2+8&&Math.abs(my-s2.y)<24)found=voy;});
    if(found)vesselInfo3D(found);};
  function draw(){
    if(!document.body.contains(canvas))return;requestAnimationFrame(draw);
    if(twinDirty){sync();twinDirty=false;}
    const t=performance.now()/1000;
    g.fillStyle='#2E7D6E';g.fillRect(0,0,W,Hh);
    g.fillStyle='#9AA0A8';g.fillRect(0,0,W,QY);g.fillStyle='#8B929D';g.fillRect(0,QY-16,W,16);
    g.fillStyle='rgba(255,255,255,.8)';g.font='600 11px Segoe UI';g.fillText(curPortObj().label.toUpperCase()+' — TOP VIEW (3D unavailable in this panel: open the file in Chrome/Edge for full 3D)',14,20);
    ['#B33A3A','#2E5D9F','#2F7D4F','#C98A2B'].forEach((c,i)=>{for(let j=0;j<10;j++){g.fillStyle=c;g.fillRect(40+j*70+(i%2)*20,34+i*14,26,8);}});
    g.strokeStyle='#B8B4AC';g.lineWidth=12;g.lineCap='round';
    g.beginPath();g.moveTo(W-60,QY);g.quadraticCurveTo(W-40,Hh*0.55,W-160,Hh-40);g.stroke();
    g.beginPath();g.moveTo(20,QY);g.lineTo(20,QY+170);g.stroke();g.lineWidth=1;
    Object.entries(bz).forEach(([id,z])=>{g.fillStyle=id==='B3'?'#C98A2B':'#7FD1C8';g.fillRect(z.x0,QY-5,z.x1-z.x0,5);
      g.fillStyle='#fff';g.font='700 14px Segoe UI';g.fillText(id==='EB1'?'ENNORE B1 — 400 m':id,(z.x0+z.x1)/2-12,QY-24);});
    cranes.filter(q=>(q.port||'KTP')===curPort&&bz[q.berth]).forEach((q,i)=>{const zone=bz[q.berth];const x=zone.x0+20+(i%4)*((zone.x1-zone.x0-40)/3);
      const busy=craneBusy(q.id);g.strokeStyle=q.status!=='Available'?'#DC2626':busy?'#F3C244':'#E8B10F';g.lineWidth=3;
      g.beginPath();g.moveTo(x-8,QY);g.lineTo(x-8,QY-18);g.lineTo(x+8,QY-18);g.lineTo(x+8,QY);g.stroke();
      g.beginPath();g.moveTo(x,QY-18);g.lineTo(x,QY+16+(busy?Math.sin(t*2+i)*4:0));g.stroke();});
    g.strokeStyle='rgba(255,255,255,.3)';g.setLineDash([6,6]);g.strokeRect(W-560,Hh-280,420,180);g.setLineDash([]);
    g.fillStyle='rgba(255,255,255,.6)';g.font='11px Segoe UI';g.fillText('ANCHORAGE',W-550,Hh-286);
    for(let i=0;i<4;i++){g.fillStyle=i%2?'#D84040':'#3FA34D';g.beginPath();g.arc(W-120-i*6,Hh-70-i*70,4,0,7);g.fill();}
    if(!ships.size){g.fillStyle='rgba(255,255,255,.8)';g.font='600 14px Segoe UI';g.textAlign='center';
      g.fillText('No vessels yet — plan the first vessel to see it arrive here.',W/2,Hh/2);g.textAlign='left';}
    ships.forEach((s,id)=>{const voy=voyages.find(v=>v.id===id);
      const tg=(s.leave)||(voy?target(voy):null);if(!tg)return;
      s.x+=(tg.x-s.x)*0.02;s.y+=(tg.y-s.y)*0.02;
      if(s.leave&&s.x>W+200){ships.delete(id);return;}
      const ves=vOf(voy);const L=ves.loa*0.42;
      g.save();g.translate(s.x,s.y+Math.sin(t*1.5+s.x)*1.5);
      g.fillStyle=cssVar(STATUS[voy.status].c);
      g.beginPath();g.moveTo(-L/2,-9);g.lineTo(L/2-14,-9);g.lineTo(L/2,0);g.lineTo(L/2-14,9);g.lineTo(-L/2,9);g.closePath();g.fill();
      g.fillStyle='#E8EDF5';g.fillRect(-L/2+4,-5,10,10);
      g.fillStyle='#fff';g.font='600 10.5px Segoe UI';g.textAlign='center';g.fillText(ves.name,0,-15);g.textAlign='left';
      g.restore();});
  }
  draw();
}
/* keep crane history on sail-out for crane-wise reports */
const _origSailOut=sailOut;
sailOut=function(voy){voy._craneHist=voy.cranes.slice();voy._craneCount=voy.cranes.length;voy._berthHist=voy.berth;_origSailOut(voy);};
