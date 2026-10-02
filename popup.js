const ICONS = {
  shield:`<svg viewBox="0 0 24 24"><path d="M12 3 19 6v5c0 4.8-3 8.6-7 10-4-1.4-7-5.2-7-10V6l7-3Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></svg>`,
  radar:`<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 9 9"/><path d="M12 7a5 5 0 1 0 5 5"/><path d="M12 12 19 5"/><circle cx="12" cy="12" r="1"/></svg>`,
  brain:`<svg viewBox="0 0 24 24"><path d="M9 4a3 3 0 0 0-3 3v.5A3.5 3.5 0 0 0 4 10.8 3.5 3.5 0 0 0 6.5 14 3 3 0 0 0 9 18"/><path d="M15 4a3 3 0 0 1 3 3v.5a3.5 3.5 0 0 1 2 3.3 3.5 3.5 0 0 1-2.5 3.2A3 3 0 0 1 15 18"/><path d="M9 8h2M13 8h2M9 12h6M9 16h2M13 16h2"/></svg>`,
  eye:`<svg viewBox="0 0 24 24"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.5"/></svg>`,
  share:`<svg viewBox="0 0 24 24"><circle cx="6" cy="12" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="m8 11 8-4M8 13l8 4"/></svg>`,
  pin:`<svg viewBox="0 0 24 24"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/></svg>`,
  image:`<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m4 17 5-5 3 3 2-2 6 5"/></svg>`,
  users:`<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3 20c.5-3.5 2.5-5 6-5s5.5 1.5 6 5"/><path d="M16 5.5a3 3 0 0 1 0 5.5M17 15c2.3.4 3.6 2 4 4"/></svg>`,
  key:`<svg viewBox="0 0 24 24"><circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M16 7l2 2M13.5 9.5l2 2"/></svg>`,
  alert:`<svg viewBox="0 0 24 24"><path d="m12 3 9 17H3L12 3Z"/><path d="M12 9v5M12 17h.01"/></svg>`,
  check:`<svg viewBox="0 0 24 24"><path d="M12 3 19 6v5c0 4.8-3 8.6-7 10-4-1.4-7-5.2-7-10V6l7-3Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></svg>`,
  activity:`<svg viewBox="0 0 24 24"><path d="M3 12h4l2-6 4 12 2-6h6"/></svg>`,
  globe:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>`,
  settings:`<svg viewBox="0 0 24 24"><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"/><path d="m19 13.5 1.5 1-.9 1.6-1.7-.4a7 7 0 0 1-1.7 1l-.3 1.7h-1.8l-.6-1.6a7 7 0 0 1-2.1 0l-.6 1.6H9l-.3-1.7a7 7 0 0 1-1.7-1l-1.7.4-.9-1.6 1.5-1a7 7 0 0 1 0-2.5l-1.5-1 .9-1.6 1.7.4a7 7 0 0 1 1.7-1L9 6.1h1.8l.6 1.6a7 7 0 0 1 2.1 0l.6-1.6H16l.3 1.7a7 7 0 0 1 1.7 1l1.7-.4.9 1.6-1.5 1a7 7 0 0 1 0 2.5Z"/></svg>`,
  lock:`<svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>`,
  scan:`<svg viewBox="0 0 24 24"><path d="M5 3H3v4M19 3h2v4M5 21H3v-4M19 21h2v-4M7 12h10"/></svg>`
};
document.querySelectorAll("[data-icon]").forEach(el=>{el.innerHTML=ICONS[el.dataset.icon]||ICONS.shield});

const $=id=>document.getElementById(id);
let lastResponse=null;
let currentTab=null;

const riskMeta = {
  "DATA SHARING": {icon:"share", desc:"Third-party sharing detected"},
  "TRACKING": {icon:"eye", desc:"Cookies / tracking detected"},
  "PERMISSIONS": {icon:"pin", desc:"Location access or permission signal"},
  "PERSONAL DATA": {icon:"key", desc:"Sensitive information mentioned"},
  "CONSENT": {icon:"alert", desc:"Consent or decision-pressure signal"}
};

function levelFromCategory(category, findings){
  const f=findings.find(x=>x.category===category);
  if(!f) return "CLEAR";
  return f.points>=20 ? "HIGH" : "MEDIUM";
}
function riskClass(level){return level==="HIGH"?"high":level==="MEDIUM"?"medium":"low"}

function renderRiskGrid(findings){
  const cats=["DATA SHARING","TRACKING","PERMISSIONS","PERSONAL DATA","CONSENT"];
  $("riskGrid").innerHTML=cats.map(cat=>{
    const meta=riskMeta[cat], level=levelFromCategory(cat,findings);
    const present=level!=="CLEAR";
    return `<article class="risk-card ${riskClass(present?level:"LOW")}">
      <div class="risk-top"><div class="risk-icon"><span class="ico">${ICONS[meta.icon]}</span></div><span class="risk-level">${present?level:"CLEAR"}</span></div>
      <h4>${cat}</h4><p>${present?meta.desc:"No matching signal in visible text."}</p>
    </article>`;
  }).join("");
}

function renderInsights(findings){
  const defaults=[
    {tag:"SAFE BOUNDARY",title:"Sensitive form values excluded",text:"Passwords, OTPs and card fields are excluded from the scan."},
    {tag:"EXPLAINABLE",title:"Finding linked to a signal",text:"Each warning is generated from a visible text pattern the scanner detected."}
  ];
  const dynamic=findings.slice(0,4).map(f=>({tag:f.category,title:f.title,text:f.explanation}));
  const list=[...dynamic,...defaults].slice(0,5);
  $("insightsList").innerHTML=list.map(x=>`<article class="insight"><span class="tag">${x.tag}</span><b>${x.title}</b><p>${x.text}</p></article>`).join("");
  $("fullInsights").innerHTML=list.map(x=>`<article class="insight"><span class="tag">${x.tag}</span><b>${x.title}</b><p>${x.text}</p><button class="ghost detail-btn">Why / Details</button></article>`).join("");
}

function setWhy(findings){
  const f=findings[0];
  if(!f){
    $("whySignal").textContent="No obvious privacy signal found";
    $("whyText").textContent="The current rule set did not detect a matching privacy pattern in visible text.";
    $("whyWhy").textContent="There is no detected signal to explain yet.";
    $("whyConcern").textContent="A clear result is not a guarantee of privacy. Review important policies when needed.";
    return;
  }
  $("whySignal").textContent=f.title;
  $("whyText").textContent=f.explanation;
  $("whyWhy").textContent=f.why;
  $("whyConcern").textContent=f.concern;
}

function setScore(score,level){
  $("score").textContent=score;
  $("heroLevel").textContent=level==="HIGH"?"HIGH RISK":level==="MEDIUM"?"MEDIUM RISK":"LOW RISK";
  $("heroMessage").textContent=level==="HIGH"?"Several privacy signals need careful review before you continue.":level==="MEDIUM"?"Your privacy has some areas that need attention.":"No major matching risk signals were found in the visible text.";
  $("completeText").textContent="SCAN COMPLETE";
  $("scanMeta").textContent="Last scanned: Just now";
  $("scoreOrbit").classList.remove("scanning");
}

async function getTab(){
  const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
  return tab;
}
function domain(url){
  try{return new URL(url).hostname.replace(/^www\./,"")}catch{return "Current website"}
}

function setScanningUI(on){
  $("scoreOrbit").classList.toggle("scanning",on);
  $("scannerVisual").classList.toggle("scanning",on);
  if(on){$("completeText").textContent="SCANNING";$("scanMeta").textContent="Analyzing visible privacy content…"}
}

function runScanAnimation(){
  const steps=["Scanning page…","Analyzing privacy policy…","Checking permissions…","Detecting tracking…","Generating privacy explanation…"];
  const box=$("scanSteps"); box.innerHTML=steps.map((s,i)=>`<div class="scan-step" data-step="${i}">${s}</div>`).join("");
  $("scannerVisual").classList.add("scanning");
  $("scanStage").textContent="Scanning page…";
  $("scanDetail").textContent="The Bodyguard is checking visible privacy-related signals.";
  return new Promise(resolve=>{
    let i=0;
    const timer=setInterval(()=>{
      document.querySelectorAll(".scan-step").forEach((el,n)=>el.classList.toggle("done",n<i));
      const active=document.querySelector(`.scan-step[data-step="${i}"]`);
      if(active) active.classList.add("active");
      if(i<steps.length-1){$("scanStage").textContent=steps[i];i++}
      else{clearInterval(timer);setTimeout(()=>{$("scanStage").textContent="SCAN COMPLETE";resolve()},260)}
    },230);
  });
}

async function scan(){
  $("scanBtn").disabled=true;$("scanBtn2").disabled=true;setScanningUI(true);
  try{
    currentTab=await getTab();
    $("siteName").textContent=domain(currentTab.url);
    await runScanAnimation();
    const response=await chrome.tabs.sendMessage(currentTab.id,{action:"scan"});
    if(response?.error) throw new Error(response.message);
    lastResponse=response;
    setScore(response.score,response.level);
    renderRiskGrid(response.findings);renderInsights(response.findings);setWhy(response.findings);
    $("scanDetail").textContent=`${response.meta.words.toLocaleString()} visible words inspected. No form values were read.`;
    await saveHistory(currentTab,response);
  }catch(error){
    $("score").textContent="--";$("heroLevel").textContent="SCAN UNAVAILABLE";$("heroMessage").textContent="This browser-protected page cannot be inspected.";
    $("siteName").textContent=currentTab?domain(currentTab.url):"Unavailable";
    $("scanMeta").textContent="Open a normal webpage and try again";
    $("completeText").textContent="UNAVAILABLE";
    $("scanStage").textContent="Unable to scan";$("scanDetail").textContent="Extension pages and some browser-protected pages cannot be inspected.";
  }finally{
    $("scanBtn").disabled=false;$("scanBtn2").disabled=false;$("scannerVisual").classList.remove("scanning");$("scoreOrbit").classList.remove("scanning");
  }
}

async function saveHistory(tab,response){
  const settings=await chrome.storage.local.get({saveHistory:true});
  if(!settings.saveHistory)return;
  const old=(await chrome.storage.local.get({history:[]})).history;
  const entry={host:domain(tab.url),score:response.score,level:response.level,time:Date.now(),categories:response.meta.categories};
  await chrome.storage.local.set({history:[entry,...old].slice(0,10)});
  renderHistory();
}

async function renderHistory(){
  const {history=[]}=await chrome.storage.local.get({history:[]});
  if(!history.length){$("historyList").innerHTML=`<div class="panel"><p style="font-size:9px;color:#8191a5;margin:0">No scans saved yet. Run a scan to create local history.</p></div>`;return}
  $("historyList").innerHTML=history.map((h,i)=>`<article class="timeline-item"><span class="timeline-meta">${i===0?"JUST NOW":new Date(h.time).toLocaleString()}</span><strong>${h.host}</strong><span class="timeline-score">${h.score}/100 · ${h.level} · ${(h.categories||[]).join(" · ")||"No matching signals"}</span></article>`).join("");
}

function navigate(view){
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
  document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id===`view-${view}`));
  if(view==="history")renderHistory();
}

document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.view)));
$("scanBtn").addEventListener("click",scan);$("scanBtn2").addEventListener("click",scan);
$("reviewBtn").addEventListener("click",()=>navigate("insights"));
$("policyBtn").addEventListener("click",()=>{if(currentTab?.url){chrome.tabs.create({url:currentTab.url})}});
$("scanVisibleToggle").addEventListener("change",e=>chrome.storage.local.set({scanVisible:e.target.checked}));
$("historyToggle").addEventListener("change",e=>chrome.storage.local.set({saveHistory:e.target.checked}));

(async function init(){
  const settings=await chrome.storage.local.get({scanVisible:true,saveHistory:true});
  $("scanVisibleToggle").checked=settings.scanVisible;
  $("historyToggle").checked=settings.saveHistory;
  try{currentTab=await getTab();$("siteName").textContent=domain(currentTab.url)}catch{}
  renderRiskGrid([]);renderInsights([]);setWhy([]);renderHistory();
  // Preserve the original behavior: scan immediately when the popup opens.
  scan();
})();
