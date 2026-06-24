import { useState, useEffect } from "react";
import { db } from "./firebase.js";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { G, F, SYSTEMS_DEFAULT } from "./theme.js";
import Dashboard from "./components/Dashboard.jsx";
import Systems   from "./components/Systems.jsx";
import Sales     from "./components/Sales.jsx";

const DOC_SYSTEMS   = doc(db, "yousef-os", "systems");
const DOC_PROSPECTS = doc(db, "yousef-os", "prospects");

const TABS = [
  { id:"dashboard", label:"اليوم",    emoji:"🏠" },
  { id:"systems",   label:"الأنظمة", emoji:"⚙️" },
  { id:"sales",     label:"Sales",   emoji:"💼" },
];

function SyncBadge({ status }) {
  const map = {
    syncing: { color:"#FF8C42", label:"جاري الحفظ..." },
    synced:  { color:G.green,   label:"محفوظ ✓"       },
    error:   { color:G.red,     label:"خطأ في الحفظ"  },
    loading: { color:G.grey,    label:"جاري التحميل..." },
  };
  const m = map[status] || map.synced;
  return (
    <div style={{ fontSize:10, color:m.color, fontWeight:600 }}>{m.label}</div>
  );
}

export default function App() {
  const [tab,        setTab]        = useState("dashboard");
  const [systems,    setSystems]    = useState(SYSTEMS_DEFAULT);
  const [prospects,  setProspects]  = useState([]);
  const [syncStatus, setSyncStatus] = useState("loading");
  const [ready,      setReady]      = useState(false);

  // ── Load from Firebase on mount ──
  useEffect(() => {
    const unsubSys = onSnapshot(DOC_SYSTEMS, snap => {
      if (snap.exists()) {
        const data = snap.data().list;
        if (Array.isArray(data) && data.length > 0) setSystems(data);
      }
      setReady(true);
      setSyncStatus("synced");
    }, () => { setReady(true); setSyncStatus("error"); });

    const unsubPro = onSnapshot(DOC_PROSPECTS, snap => {
      if (snap.exists()) {
        const data = snap.data().list;
        if (Array.isArray(data)) setProspects(data);
      }
    }, () => {});

    return () => { unsubSys(); unsubPro(); };
  }, []);

  // ── Save systems to Firebase ──
  const saveSystems = async (data) => {
    setSyncStatus("syncing");
    try {
      await setDoc(DOC_SYSTEMS, { list: data, updatedAt: new Date().toISOString() });
      setSyncStatus("synced");
    } catch { setSyncStatus("error"); }
  };

  // ── Save prospects to Firebase ──
  const saveProspects = async (data) => {
    setSyncStatus("syncing");
    try {
      await setDoc(DOC_PROSPECTS, { list: data, updatedAt: new Date().toISOString() });
      setSyncStatus("synced");
    } catch { setSyncStatus("error"); }
  };

  // Systems actions
  const toggleStage = (id, idx) => {
    const updated = systems.map(s =>
      s.id !== id ? s : { ...s, stages: s.stages.map((v,i) => i===idx ? (v?0:1) : v) }
    );
    setSystems(updated);
    saveSystems(updated);
  };

  const addSystem = (newSys) => {
    const updated = [...systems, { ...newSys, id: Date.now(), stages:[0,0,0,0,0,0] }];
    setSystems(updated);
    saveSystems(updated);
  };

  const deleteSystem = (id) => {
    const updated = systems.filter(s => s.id !== id);
    setSystems(updated);
    saveSystems(updated);
  };

  // Prospects actions
  const addProspect = (p) => {
    const updated = [p, ...prospects];
    setProspects(updated);
    saveProspects(updated);
  };

  const updateProspect = (p) => {
    const updated = prospects.map(x => x.id === p.id ? p : x);
    setProspects(updated);
    saveProspects(updated);
  };

  const deleteProspect = (id) => {
    const updated = prospects.filter(x => x.id !== id);
    setProspects(updated);
    saveProspects(updated);
  };

  const live = systems.filter(s => s.stages.every(x=>x)).length;

  if (!ready) {
    return (
      <div style={{
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        height:"100vh", background:G.bg, gap:16,
      }}>
        <div style={{ fontSize:32 }}>⚡</div>
        <div style={{ fontSize:14, color:G.green, fontWeight:600, ...F }}>جاري التحميل...</div>
        <div style={{ fontSize:11, color:G.grey, ...F }}>Connecting to Firebase</div>
      </div>
    );
  }

  return (
    <div style={{ background:G.bg, minHeight:"100vh", maxWidth:480, margin:"0 auto", position:"relative" }}>

      {/* Status Bar */}
      <div style={{
        position:"fixed", top:0, left:"50%", transform:"translateX(-50%)",
        width:"100%", maxWidth:480, zIndex:100,
        background:"rgba(10,10,10,0.95)", backdropFilter:"blur(10px)",
        borderBottom:`1px solid ${G.border}`,
        padding:"8px 20px",
        display:"flex", justifyContent:"space-between", alignItems:"center",
      }}>
        <div style={{ fontSize:12, fontWeight:700, color:G.green, ...F }}>Yousef OS</div>
        <SyncBadge status={syncStatus} />
      </div>

      {/* Page Content */}
      <div style={{ paddingTop:44 }}>
        {tab === "dashboard" && (
          <Dashboard
            systemsCount={systems.length}
            liveCount={live}
            prospectsCount={prospects.filter(p=>!["closed","dead"].includes(p.status)).length}
          />
        )}
        {tab === "systems" && (
          <Systems
            systems={systems}
            onToggle={toggleStage}
            onAdd={addSystem}
            onDelete={deleteSystem}
          />
        )}
        {tab === "sales" && (
          <Sales
            prospects={prospects}
            onAdd={addProspect}
            onUpdate={updateProspect}
            onDelete={deleteProspect}
          />
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{
        position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
        width:"100%", maxWidth:480, zIndex:100,
        background:"rgba(10,10,10,0.97)", backdropFilter:"blur(12px)",
        borderTop:`1px solid ${G.border}`,
        display:"flex",
      }}>
        {TABS.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              flex:1, padding:"12px 8px 10px",
              background:"transparent", border:"none", cursor:"pointer",
              display:"flex", flexDirection:"column", alignItems:"center", gap:4,
              borderTop: active ? `2px solid ${G.green}` : "2px solid transparent",
              transition:"all 0.2s",
            }}>
              <span style={{ fontSize:18 }}>{t.emoji}</span>
              <span style={{ fontSize:10, fontWeight:active?700:500, color:active?G.green:G.grey, ...F }}>
                {t.label}
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
}
