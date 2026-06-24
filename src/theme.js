export const G = {
  bg:          "#0A0A0A",
  surface:     "#111111",
  card:        "#161616",
  border:      "#1E1E1E",
  green:       "#00FF88",
  greenGlow:   "rgba(0,255,136,0.10)",
  greenBorder: "rgba(0,255,136,0.28)",
  red:         "#FF4455",
  redGlow:     "rgba(255,68,85,0.12)",
  orange:      "#FF8C42",
  orangeGlow:  "rgba(255,140,66,0.12)",
  blue:        "#4A9EFF",
  blueGlow:    "rgba(74,158,255,0.12)",
  purple:      "#A855F7",
  purpleGlow:  "rgba(168,85,247,0.12)",
  white:       "#FFFFFF",
  grey:        "#A0A0A0",
};

export const F = { fontFamily:"'Poppins', sans-serif" };

export const STAGE_LABELS = ["BUILD","TEST","DOC","DEMO","ANN","PUB"];

export const SYSTEMS_DEFAULT = [
  { id:1,  name:"Smart Lead Onboarding Pro",  health:60, price:"$1,500+$200/mo", stages:[1,1,1,1,1,1] },
  { id:2,  name:"HR Screening AI Pro",         health:68, price:"$3,000+$200/mo", stages:[1,1,1,1,1,1] },
  { id:3,  name:"Sales Analyst AI Pro",        health:65, price:"$1,800+$200/mo", stages:[1,1,1,1,1,1] },
  { id:4,  name:"MeetingPilot AI Pro",         health:60, price:"$3,500+$200/mo", stages:[1,1,1,1,1,1] },
  { id:5,  name:"LeadForge AI Pro",            health:62, price:"$2,000+$200/mo", stages:[1,1,1,1,1,1] },
  { id:6,  name:"ReputationShield AI Pro",     health:62, price:"$3,000+$200/mo", stages:[1,1,1,1,1,1] },
  { id:7,  name:"Customer Support AI Pro",     health:60, price:"$2,500+$200/mo", stages:[1,1,1,1,1,1] },
  { id:8,  name:"Service Chatbot Pro",         health:58, price:"$2,500+$200/mo", stages:[1,1,1,1,1,1] },
  { id:9,  name:"Onboarding AI Pro (A+B)",     health:65, price:"$2,200+$200/mo", stages:[1,1,1,1,0,0] },
  { id:10, name:"Content Studio AI Pro",       health:58, price:"$1,800+$200/mo", stages:[1,1,1,1,0,0] },
  { id:11, name:"Industry Brief AI",           health:62, price:"$1,500+$200/mo", stages:[1,1,1,1,0,0] },
];

export const TIME_BLOCKS = [
  { id:"sabah",  ar:"الصبح",  emoji:"🌅", time:"6–10 ص",  dept:"sales",   hours:[6,7,8,9],           desc:"مبيعات + outreach" },
  { id:"nahar",  ar:"النهار", emoji:"☀️", time:"10ص–4م",  dept:"build",   hours:[10,11,12,13,14,15], desc:"بناء + n8n"        },
  { id:"asar",   ar:"العصر",  emoji:"🌤️", time:"4–7م",    dept:"content", hours:[16,17,18],           desc:"محتوى + تصاميم"   },
  { id:"masa",   ar:"المساء", emoji:"🌙", time:"7–10م",   dept:"ops",     hours:[19,20,21],           desc:"عمليات + مراجعة"  },
];

export const PROSPECT_STATUSES = [
  { id:"new",      label:"New",           color:"#A0A0A0", bg:"rgba(160,160,160,0.1)" },
  { id:"contacted",label:"Contacted",     color:"#4A9EFF", bg:"rgba(74,158,255,0.1)"  },
  { id:"talking",  label:"In Talk",       color:"#FF8C42", bg:"rgba(255,140,66,0.1)"  },
  { id:"proposal", label:"Proposal Sent", color:"#A855F7", bg:"rgba(168,85,247,0.1)"  },
  { id:"closed",   label:"Closed ✅",     color:"#00FF88", bg:"rgba(0,255,136,0.1)"   },
  { id:"dead",     label:"Dead ❌",       color:"#FF4455", bg:"rgba(255,68,85,0.1)"   },
];

export const PLATFORMS = ["LinkedIn","Instagram","Referral","Cold Email","Other"];
