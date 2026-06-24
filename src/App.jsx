import { useState, useEffect } from "react";
import { db } from "./firebase.js";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { G, F, SYSTEMS_DEFAULT } from "./theme.js";
import Dashboard from "./components/Dashboard.jsx";
import Systems   from "./components/Systems.jsx";
import Sales     from "./components/Sales.jsx";

const DOC_SYSTEMS   = doc(db, "yousef-os", "systems");
const DOC_PROSPECTS = doc(db, "yousef-os", "prospects");
const DOC_LOCKS     = doc(db, "yousef-os", "locks");

const ADMIN_PASS  = import.meta.env.VITE_ADMIN_PASS  || "admin2026";
const EDITOR_PASS = import.meta.env.VITE_EDITOR_PASS || "editor2026";

const TABS_ADMIN  = [
  { id:"dashboard", label:"اليوم",    emoji:"🏠" },
  { id:"systems",   label:"الأنظمة", emoji:"⚙️" },
  { id:"sales",     label:"Sales",   emoji:"💼" },
];
const TABS_EDITOR = [
  { id:"dashboard", label:"اليوم",    emoji:"🏠" },
  { id:"systems",   label:"الأنظمة", emoji:"⚙️" },
];

function SyncBadge({ status }) {
  const map = {
    syncing: { color:"#FF8C42", label:"جاري الحفظ..." },
    synced:  { color:G.green,   label:"محفوظ ✓"       },
    error:   { color:G.red,     label:"خطأ في الحفظ"  },
    loading: { color:G.grey,    label:"جاري التحميل..." },
  };
  const m = map[status] || map.synced;
  return <div style={{ fontSize:10, color:m.color, fontWeight:600 }}>{m.label}</div>;
}

function LoginScreen({ onLogin }) {
  const [pass, setPass]   = useState("");
  const [error, setError] = useState(false);
  const [show, setShow]   = useState(false);

  const handleLogin = () => {
    if (pass === ADMIN_PASS)  { onLogin("admin");  return; }
    if (pass === EDITOR_PASS) { onLogin("editor"); return; }
    setError(true);
    setTimeout(() => setError(false), 2000);
  };

  return (
    <div style={{
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      height:"100vh", background:G.bg, padding:"0 32px",
    }}>
      <div style={{ marginBottom:32, textAlign:"center" }}>
        <div style={{ fontSize:36, marginBottom:12 }}>⚡</div>
        <div style={{ fontSize:24, fontWeight:800, color:G.white, ...F }}>Yousef OS</div>
        <div style={{ fontSize:12, color:G.grey, marginTop:4, ...F }}>AI Automation Specialist</div>
      </div>
      <div style={{ width:"100%", maxWidth:320 }}>
        <div style={{ fontSize:11, color:G.grey, marginBottom:8, ...F }}>كلمة المرور</div>
        <div style={{ position:"relative", marginBottom:16 }}>
          <input
            type={show ? "text" : "password"}
            value={pass}
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="أدخل كلمة المرور..."
            autoFocus
            style={{
              width:"100%", padding:"14px 44px 14px 16px",
              background:G.card, border:`1px solid ${error ? G.red : G.border}`,
              borderRadius:12, color:G.white, fontSize:14, ...F,
            }}
          />
          <button onClick={() => setShow(s => !s)} style={{
            position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
            background:"none", border:"none", color:G.grey, cursor:"pointer", fontSize:16,
          }}>{show ? "🙈" : "👁️"}</button>
        </div>
        {error && (
          <div style={{
            padding:"10px 14px", background:G.redGlow, border:`1px solid ${G.red}33`,
            borderRadius:8, fontSize:12, color:G.red, textAlign:"center", marginBottom:12, ...F,
          }}>كلمة المرور غلط ❌</div>
        )}
        <button onClick={handleLogin} style={{
          width:"100%", padding:"14px", background:G.green, border:"none",
          borderRadius:12, color:G.bg, fontSize:14, fontWeight:700, cursor:"pointer", ...F,
        }}>دخول →</button>
      </div>
    </div>
  );
}

export default function App() {
  const [role,       setRole]       = useState(null);
  const [tab,        setTab]        = useState("dashboard");
  const [systems,    setSystems]    = useState(SYSTEMS_DEFAULT);
  const [prospects,  setProspects]  = useState([]);
  const [locks,      setLocks]      = useState({});
  const [syncStatus, setSyncStatus] = useState("loading");
  const [ready,      setReady]      = useState(false);

  useEffect(() => {
    if (!role) return;
    const unsubSys = onSnapshot(DOC_SYSTEMS, snap => {
      if (snap.exists()) { const d=snap.data().list; if(Array.isArray(d)&&d.length>0) setSystems(d); }
      setReady(true); setSyncStatus("synced");
    }, () => { setReady(true); setSyncStatus("error"); });
    const unsubPro = onSnapshot(DOC_PROSPECTS, snap => {
      if (snap.exists()) { const d=snap.data().list; if(Array.isArray(d)) setProspects(d); }
    }, () => {});
    const unsubLocks = onSnapshot(DOC_LOCKS, snap => {
      if (snap.exists()) setLocks(snap.data());
    }, () => {});
    return () => { unsubSys(); unsubPro(); unsubLocks(); };
  }, [role]);

  const saveSystems = async (data) => {
    setSyncStatus("syncing");
    try { await setDoc(DOC_SYSTEMS, { list:data, updatedAt:new Date().toISOString() }); setSyncStatus("synced"); }
    catch { setSyncStatus("error"); }
  };
  const saveProspects = async (data) => {
    setSyncStatus("syncing");
    try { await setDoc(DOC_PROSPECTS, { list:data, updatedAt:new Date().toISOString() }); setSyncStatus("synced"); }
    catch { setSyncStatus("error"); }
  };

  const toggleLock = async (systemId) => {
    const updated = { ...locks, [systemId]: !locks[systemId] };
    setLocks(updated);
    await setDoc(DOC_LOCKS, updated);
  };

  const toggleStage = (id, idx) => {
    if (role === "editor" && !locks[id]) return;
    const updated = systems.map(s => s.id!==id ? s : { ...s, stages:s.stages.map((v,i)=>i===idx?(v?0:1):v) });
    setSystems(updated); saveSystems(updated);
  };
  const addSystem    = (n) => { const u=[...systems,{...n,id:Date.now(),stages:[0,0,0,0,0,0]}]; setSystems(u); saveSystems(u); };
  const deleteSystem = (id) => { const u=systems.filter(s=>s.id!==id); setSystems(u); saveSystems(u); };
  const addProspect    = (p) => { const u=[p,...prospects]; setProspects(u); saveProspects(u); };
  const updateProspect = (p) => { const u=prospects.map(x=>x.id===p.id?p:x); setProspects(u); saveProspects(u); };
  const deleteProspect = (id) => { const u=prospects.filter(x=>x.id!==id); setProspects(u); saveProspects(u); };

  const live = systems.filter(s=>s.stages.every(x=>x)).length;
  const TABS = role==="admin" ? TABS_ADMIN : TABS_EDITOR;

  if (!role) return <LoginScreen onLogin={setRole} />;
  if (!ready) return (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100vh",background:G.bg,gap:16 }}>
      <div style={{ fontSize:32 }}>⚡</div>
      <div style={{ fontSize:14,color:G.green,fontWeight:600,...F }}>جاري التحميل...</div>
    </div>
  );

  return (
    <div style={{ background:G.bg, minHeight:"100vh", maxWidth:480, margin:"0 auto", position:"relative" }}>
      <div style={{
        position:"fixed", top:0, left:"50%", transform:"translateX(-50%)",
        width:"100%", maxWidth:480, zIndex:100,
        background:"rgba(10,10,10,0.95)", backdropFilter:"blur(10px)",
        borderBottom:`1px solid ${G.border}`, padding:"8px 20px",
        display:"flex", justifyContent:"space-between", alignItems:"center",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ fontSize:12, fontWeight:700, color:G.green, ...F }}>Yousef OS</div>
          <div style={{
            fontSize:9, fontWeight:700, padding:"2px 8px", borderRadius:20,
            background:role==="admin"?"rgba(0,255,136,0.15)":"rgba(74,158,255,0.15)",
            color:role==="admin"?G.green:G.blue,
            border:`1px solid ${role==="admin"?G.greenBorder:"rgba(74,158,255,0.3)"}`, ...F,
          }}>{role==="admin"?"ADMIN":"EDITOR"}</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <SyncBadge status={syncStatus} />
          <button onClick={()=>{setRole(null);setReady(false);setTab("dashboard");}} style={{
            background:"transparent", border:`1px solid ${G.border}`,
            borderRadius:6, padding:"3px 8px", color:G.grey, fontSize:10, cursor:"pointer", ...F,
          }}>خروج</button>
        </div>
      </div>

      <div style={{ paddingTop:44 }}>
        {tab==="dashboard" && <Dashboard systemsCount={systems.length} liveCount={live} prospectsCount={prospects.filter(p=>!["closed","dead"].includes(p.status)).length} role={role} />}
        {tab==="systems"   && <Systems systems={systems} locks={locks} role={role} onToggle={toggleStage} onAdd={addSystem} onDelete={deleteSystem} onToggleLock={toggleLock} />}
        {tab==="sales" && role==="admin" && <Sales prospects={prospects} onAdd={addProspect} onUpdate={updateProspect} onDelete={deleteProspect} />}
      </div>

      <div style={{
        position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
        width:"100%", maxWidth:480, zIndex:100,
        background:"rgba(10,10,10,0.97)", backdropFilter:"blur(12px)",
        borderTop:`1px solid ${G.border}`, display:"flex",
      }}>
        {TABS.map(t => {
          const active=tab===t.id;
          return (
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              flex:1, padding:"12px 8px 10px", background:"transparent", border:"none", cursor:"pointer",
              display:"flex", flexDirection:"column", alignItems:"center", gap:4,
              borderTop:active?`2px solid ${G.green}`:"2px solid transparent", transition:"all 0.2s",
            }}>
              <span style={{ fontSize:18 }}>{t.emoji}</span>
              <span style={{ fontSize:10, fontWeight:active?700:500, color:active?G.green:G.grey, ...F }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
