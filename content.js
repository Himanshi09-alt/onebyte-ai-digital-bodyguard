// ONEBYTE privacy scanner: visible text only.
// Inputs, textareas, selects, buttons, scripts, styles and iframes are removed before analysis.
function getSafePageText() {
  const root = document.body;
  if (!root) return "";
  const clone = root.cloneNode(true);
  clone.querySelectorAll("input, textarea, select, button, script, style, noscript, iframe").forEach(el => el.remove());
  return (clone.innerText || "").replace(/\s+/g, " ").trim().slice(0, 50000);
}

function analyze(text) {
  const t = text.toLowerCase();
  const findings = [];
  const rules = [
    {id:"sharing",category:"DATA SHARING",icon:"share",title:"Third-party data sharing language detected",keywords:["third parties","third-party","service providers","share your information","share information"],explanation:"The page contains language suggesting your information may be shared with other organizations.",why:"Service providers or partners may receive some information to provide a service.",concern:"Check which data is shared, with whom, and for what purpose.",points:15},
    {id:"tracking",category:"TRACKING",icon:"eye",title:"Tracking / advertising language detected",keywords:["tracking technologies","tracking technology","advertising partners","behavioral advertising","cookies","analytics"],explanation:"The page mentions tracking or advertising-related technologies. Check what activity is collected and why.",why:"Tracking can be used to understand activity across a website or service.",concern:"Look for the types of identifiers used and whether you can opt out.",points:15},
    {id:"location",category:"PERMISSIONS",icon:"pin",title:"Location data mentioned",keywords:["location data","precise location","geolocation","location access","nearby services"],explanation:"The page mentions location information or location access.",why:"Location can reveal where a person is or has been.",concern:"Consider whether location access is necessary for the feature you want.",points:15},
    {id:"personal",category:"PERSONAL DATA",icon:"key",title:"Sensitive personal information mentioned",keywords:["date of birth","government id","government-issued id","location data","contact list","biometric","passport number"],explanation:"The page mentions potentially sensitive personal information. Check whether providing it is necessary.",why:"Some personal information can be more identifying or difficult to change if exposed.",concern:"Review why the information is requested and how long it may be retained.",points:15},
    {id:"pressure",category:"CONSENT",icon:"alert",title:"Pressure language detected",keywords:["act now","limited time","don't miss","only today","last chance"],explanation:"Urgency language can push users toward a quick decision instead of a considered choice.",why:"Time pressure can make privacy or purchase conditions easier to overlook.",concern:"Slow down and review the relevant terms before continuing.",points:20},
    {id:"renewal",category:"CONSENT",icon:"alert",title:"Renewal / cancellation language detected",keywords:["cancellation fee","non-refundable","renew automatically","auto-renew","automatic renewal"],explanation:"The page mentions renewal, cancellation or refund conditions that may deserve a closer look.",why:"These conditions can affect what happens after an initial decision.",concern:"Check cancellation timing, fees and renewal terms before agreeing.",points:20},
    {id:"photo",category:"PERSONAL DATA",icon:"image",title:"Photo or personal-media collection mentioned",keywords:["photos","photographs","images","camera roll","media library","personal media"],explanation:"The page mentions access to photos or personal media.",why:"Personal images can contain identity, location and other contextual information.",concern:"Confirm why media access is needed and whether it is optional.",points:15},
    {id:"contacts",category:"PERSONAL DATA",icon:"users",title:"Contacts data mentioned",keywords:["contacts","address book","contact list","friends list"],explanation:"The page mentions access to contacts or an address book.",why:"Contact data can expose information about other people as well as you.",concern:"Check whether contact access is essential and how it is handled.",points:15}
  ];
  for (const rule of rules) {
    const matched = rule.keywords.find(k => t.includes(k));
    if (matched) findings.push({...rule, matched});
  }
  let points = findings.reduce((sum, f) => sum + f.points, 0);
  points = Math.min(points, 100);
  let level = "LOW";
  if (points >= 60) level = "HIGH";
  else if (points >= 30) level = "MEDIUM";
  return {
    score: points,
    level,
    findings,
    meta: {
      words: text ? text.split(/\s+/).filter(Boolean).length : 0,
      categories: [...new Set(findings.map(f => f.category))],
      scannedAt: Date.now()
    }
  };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "scan") {
    try {
      const text = getSafePageText();
      sendResponse(analyze(text));
    } catch (e) {
      sendResponse({error: true, message: "Unable to inspect this page."});
    }
    return true;
  }
});
