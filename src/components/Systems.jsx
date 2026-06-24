import { useState } from "react";
import { G, F, STAGE_LABELS } from "../theme.js";

export default function Systems({ systems, locks, role, onToggle, onAdd, onDelete, onToggleLock }) {
  const [showAdd, setShowAdd]     = useState(false);
  const [newName, setNewName]     = useState("");
  const [newHealth, setNewHealth] = useState("60");
  const [newPrice, setNewPrice]   = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const live = systems.filter(s=>s.stages.every(x=>x)).length;
  const pct  = Math.round((systems.reduce((a,s)=>a+s.stages.filter(x=>x).length,0)/(systems.length*6))*100);

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAdd({ name:newName.trim(), health:parseInt(newHealth)||60, price:newPrice.trim()||"TBD" });
    setNewName(""); setNewHealth("60"); setNewPrice(""); setShowAdd(false);
  };

  const handleDelete = (id) => {
    if (deletingId===id) { onDelete(id); setDeletingId(null); }
    else { setDeletingId(id); setTimeout(()=>setDeletingId(null),3000); }
  };

  const inputStyle = {
    width:"100%", padding:"10px 12px", background:"#111",
    border:`1px solid ${G.border}`, borderRadius:8, color:G.white, fontSize:13, ...F, marginBottom:12,
  };

  return (
    <div style={{ padding:"24px 16px 80px" }}>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:20, fontWeight:800, color:G.white }}>الأنظمة</div>
        <div style={{ fontSize:12, color:G.grey, marginTop:2 }}>Pipeline tracker للـ 11 نظام</div>
      </div>

      <div style={{ display:"flex", marginBottom:20, background:G.card, border:`1px solid ${G.border}`, borderRadius:12, overflow:"hidden" }}>
        {[{label:"إجمالي",value:systems.length,sub:"systems"},{label:"Live 🟢",value:live,sub:`/ ${systems.length}`},{label:"Progress",value:`${pct}%`,sub:"overall"}].map((item,i)=>(
          <div key={i} style={{ flex:1, textAlign:"center", padding:"14px 8px", borderRight:i<2?`1px solid ${G.border}`:"none" }}>
            <div style={{ fontSize:22, fontWeight:800, color:G.green }}>{item.value}</div>
            <div style={{ fontSize:9, color:G.grey, marginTop:2 }}>{item.label}</div>
            <div style={{ fontSize:9, color:G.grey }}>{item.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"flex", marginBottom:12, background:G.card, border:`1px solid ${G.border}`, borderRadius:8, overflow:"hidden" }}>
        <div style={{ width:8 }} />
        {STAGE_LABELS.map((l,i)=>(
          <div key={i} style={{ flex:1, textAlign:"center", padding:"7px 0", fontSize:9, color:G.grey, fontWeight:700, letterSpacing:"0.06em", borderRight:i<5?`1px solid ${G.border}`:"none" }}>{l}</div>
        ))}
        <div style={{ width: role==="admin" ? 72 : 8 }} />
      </div>

      {systems.map(s => {
        const isDone     = s.stages.every(x=>x);
        const cnt        = s.stages.filter(x=>x).length;
        const isDeleting = deletingId===s.id;
        const isUnlocked = !!locks[s.id];
        const canEdit    = role==="admin" || isUnlocked;

        return (
          <div key={s.id} style={{
            marginBottom:10, padding:"13px 12px", background:G.card, borderRadius:12,
            border:isDeleting?`1px solid ${G.red}`:isDone?`1px solid ${G.greenBorder}`:`1px solid ${G.border}`,
            boxShadow:isDeleting?`0 0 10px ${G.redGlow}`:isDone?`0 0 12px ${G.greenGlow}`:"none",
            opacity: role==="editor" && !isUnlocked ? 0.6 : 1,
            transition:"all 0.25s",
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10, gap:8 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:11, fontWeight:600, color:G.white, lineHeight:1.4 }}>{s.name}</div>
                {s.price && <div style={{ fontSize:10, color:G.grey, marginTop:2 }}>{s.price}</div>}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                <span style={{ fontSize:10, color:isDone?G.green:G.grey }}>{s.health}/70</span>
                {isDone && <span>🟢</span>}
                {role==="admin" && (
                  <button onClick={()=>onToggleLock(s.id)} title={isUnlocked?"قفل للـ Editor":"افتح للـ Editor"} style={{
                    width:24, height:24, borderRadius:6,
                    border:`1px solid ${isUnlocked?G.greenBorder:G.border}`,
                    background:isUnlocked?G.greenGlow:"transparent",
                    color:isUnlocked?G.green:G.grey, cursor:"pointer", ...F, fontSize:12,
                  }}>{isUnlocked?"🔓":"🔒"}</button>
                )}
                {role==="admin" && (
                  isDeleting ? (
                    <div style={{ display:"flex", gap:4 }}>
                      <button onClick={()=>handleDelete(s.id)} style={{ width:24,height:24,borderRadius:6,border:`1px solid ${G.red}`,background:G.redGlow,color:G.red,cursor:"pointer",...F,fontSize:12,fontWeight:700 }}>✓</button>
                      <button onClick={()=>setDeletingId(null)} style={{ width:24,height:24,borderRadius:6,border:`1px solid ${G.border}`,background:"transparent",color:G.grey,cursor:"pointer",...F,fontSize:12 }}>✗</button>
                    </div>
                  ) : (
                    <button onClick={()=>handleDelete(s.id)} style={{ width:24,height:24,borderRadius:6,border:`1px solid ${G.border}`,background:"transparent",color:G.grey,cursor:"pointer",...F,fontSize:14 }}>×</button>
                  )
                )}
              </div>
            </div>
            {role==="editor" && !isUnlocked && (
              <div style={{ fontSize:10, color:G.grey, marginBottom:8, textAlign:"center" }}>🔒 هاد النظام مقفل — انتظر إذن Admin</div>
            )}
            {isDeleting && <div style={{ fontSize:10,color:G.red,marginBottom:8 }}>⚠️ تأكيد الحذف؟</div>}
            <div style={{ display:"flex", gap:5, alignItems:"center" }}>
              {s.stages.map((done,i) => (
                <button key={i} onClick={()=>canEdit&&onToggle(s.id,i)} title={STAGE_LABELS[i]} style={{
                  flex:1, height:30, minWidth:26, borderRadius:"50%",
                  border:done?`1.5px solid ${G.green}`:`1.5px solid ${G.border}`,
                  background:done?G.greenGlow:"transparent",
                  color:done?G.green:G.grey, ...F, fontWeight:700, fontSize:9,
                  cursor:canEdit?"pointer":"not-allowed",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:done?`0 0 7px ${G.greenBorder}`:"none", transition:"all 0.2s",
                }}>{done?"✓":i+1}</button>
              ))}
              <span style={{ fontSize:10, color:isDone?G.green:G.grey, marginLeft:4, flexShrink:0, fontWeight:isDone?700:400 }}>{cnt}/6</span>
            </div>
          </div>
        );
      })}

      {role==="admin" && (
        showAdd ? (
          <div style={{ padding:"16px", background:G.card, border:`1px solid ${G.greenBorder}`, borderRadius:12, marginTop:4 }}>
            <div style={{ fontSize:12, color:G.green, fontWeight:700, marginBottom:14 }}>＋ نظام جديد</div>
            <div style={{ fontSize:10, color:G.grey, marginBottom:6 }}>اسم النظام</div>
            <input placeholder="مثال: DealForge AI Pro" value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAdd()} style={inputStyle} autoFocus />
            <div style={{ fontSize:10, color:G.grey, marginBottom:6 }}>السعر</div>
            <input placeholder="مثال: $3,500+$200/mo" value={newPrice} onChange={e=>setNewPrice(e.target.value)} style={inputStyle} />
            <div style={{ fontSize:10, color:G.grey, marginBottom:6 }}>Health Score /70</div>
            <input type="number" min="0" max="70" value={newHealth} onChange={e=>setNewHealth(e.target.value)} style={{ ...inputStyle, width:80, textAlign:"center", color:G.green, fontWeight:700, direction:"ltr" }} />
            <div style={{ display:"flex", gap:8, marginTop:4 }}>
              <button onClick={handleAdd} style={{ flex:1, padding:"11px", background:newName.trim()?G.green:"#1a3d2b", border:"none", borderRadius:10, color:newName.trim()?G.bg:G.grey, ...F, fontWeight:700, fontSize:13, cursor:"pointer" }}>أضف</button>
              <button onClick={()=>{setShowAdd(false);setNewName("");}} style={{ flex:1, padding:"11px", background:"transparent", border:`1px solid ${G.border}`, borderRadius:10, color:G.grey, ...F, fontSize:13, cursor:"pointer" }}>إلغاء</button>
            </div>
          </div>
        ) : (
          <button onClick={()=>setShowAdd(true)} style={{
            width:"100%", padding:"13px", marginTop:4, background:"transparent",
            border:`1.5px dashed ${G.greenBorder}`, borderRadius:12, color:G.green,
            ...F, fontWeight:600, fontSize:13, cursor:"pointer",
          }}>＋ أضف نظام جديد</button>
        )
      )}
    </div>
  );
}
