import { useState } from "react";
import { G, F, PROSPECT_STATUSES, PLATFORMS } from "../theme.js";

const EMPTY_FORM = {
  name:"", company:"", platform:"LinkedIn",
  status:"new", notes:"", value:"", nextAction:"",
};

function StatusBadge({ statusId }) {
  const s = PROSPECT_STATUSES.find(x => x.id === statusId) || PROSPECT_STATUSES[0];
  return (
    <span style={{
      display:"inline-block", padding:"3px 10px", borderRadius:20,
      fontSize:10, fontWeight:700, color:s.color, background:s.bg,
      border:`1px solid ${s.color}33`,
    }}>{s.label}</span>
  );
}

function ProspectCard({ p, onEdit, onDelete, onStatusChange }) {
  const [deleting, setDeleting] = useState(false);
  const s = PROSPECT_STATUSES.find(x => x.id === p.status) || PROSPECT_STATUSES[0];

  return (
    <div style={{
      marginBottom:10, padding:"14px",
      background:G.card, borderRadius:12,
      border:`1px solid ${p.status==="closed"?G.greenBorder:p.status==="dead"?`rgba(255,68,85,0.3)`:G.border}`,
      boxShadow: p.status==="closed"?`0 0 10px ${G.greenGlow}`:p.status==="dead"?`0 0 8px ${G.redGlow}`:"none",
    }}>
      {/* Top row */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:700, color:G.white }}>{p.name}</div>
          <div style={{ fontSize:11, color:G.grey, marginTop:1 }}>{p.company} · {p.platform}</div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6, flexShrink:0 }}>
          <StatusBadge statusId={p.status} />
          {p.value && <div style={{ fontSize:11, color:G.green, fontWeight:700 }}>{p.value}</div>}
        </div>
      </div>

      {/* Next Action */}
      {p.nextAction && (
        <div style={{
          padding:"8px 10px", background:"rgba(0,255,136,0.05)",
          border:`1px solid rgba(0,255,136,0.15)`, borderRadius:8, marginBottom:8,
        }}>
          <div style={{ fontSize:9, color:G.green, fontWeight:700, marginBottom:2 }}>NEXT ACTION</div>
          <div style={{ fontSize:11, color:G.white }}>{p.nextAction}</div>
        </div>
      )}

      {/* Notes */}
      {p.notes && (
        <div style={{ fontSize:11, color:G.grey, marginBottom:10, lineHeight:1.5 }}>{p.notes}</div>
      )}

      {/* Status quick-change */}
      <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:10 }}>
        {PROSPECT_STATUSES.map(st => (
          <button key={st.id} onClick={()=>onStatusChange(p.id, st.id)} style={{
            padding:"4px 8px", borderRadius:20, border:`1px solid ${st.id===p.status?st.color:G.border}`,
            background: st.id===p.status ? st.bg : "transparent",
            color: st.id===p.status ? st.color : G.grey,
            fontSize:9, fontWeight:700, cursor:"pointer", ...F,
          }}>{st.label}</button>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display:"flex", gap:8 }}>
        <button onClick={()=>onEdit(p)} style={{
          flex:1, padding:"8px", background:"transparent",
          border:`1px solid ${G.border}`, borderRadius:8,
          color:G.grey, fontSize:11, fontWeight:600, cursor:"pointer", ...F,
        }}>✏️ تعديل</button>
        {deleting ? (
          <div style={{ display:"flex", gap:4 }}>
            <button onClick={()=>onDelete(p.id)} style={{ padding:"8px 12px", borderRadius:8, border:`1px solid ${G.red}`, background:G.redGlow, color:G.red, fontSize:11, fontWeight:700, cursor:"pointer", ...F }}>حذف</button>
            <button onClick={()=>setDeleting(false)} style={{ padding:"8px 12px", borderRadius:8, border:`1px solid ${G.border}`, background:"transparent", color:G.grey, fontSize:11, cursor:"pointer", ...F }}>لا</button>
          </div>
        ) : (
          <button onClick={()=>setDeleting(true)} style={{
            padding:"8px 14px", background:"transparent",
            border:`1px solid ${G.border}`, borderRadius:8,
            color:G.grey, fontSize:11, cursor:"pointer", ...F,
          }}>🗑️</button>
        )}
      </div>
    </div>
  );
}

function ProspectForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const set = (k, v) => setForm(f => ({...f, [k]:v}));

  const labelStyle = { fontSize:10, color:G.grey, marginBottom:5, display:"block" };
  const inputStyle = {
    width:"100%", padding:"10px 12px", background:"#111",
    border:`1px solid ${G.border}`, borderRadius:8,
    color:G.white, fontSize:13, ...F, marginBottom:12,
  };

  return (
    <div style={{
      padding:"16px", background:G.card,
      border:`1px solid ${G.greenBorder}`, borderRadius:14, marginBottom:16,
    }}>
      <div style={{ fontSize:13, fontWeight:700, color:G.green, marginBottom:16 }}>
        {initial ? "✏️ تعديل Prospect" : "＋ Prospect جديد"}
      </div>

      <label style={labelStyle}>الاسم *</label>
      <input placeholder="اسم الشخص" value={form.name} onChange={e=>set("name",e.target.value)} style={inputStyle} />

      <label style={labelStyle}>الشركة</label>
      <input placeholder="اسم الشركة" value={form.company} onChange={e=>set("company",e.target.value)} style={inputStyle} />

      <div style={{ display:"flex", gap:10, marginBottom:12 }}>
        <div style={{ flex:1 }}>
          <label style={labelStyle}>المنصة</label>
          <select value={form.platform} onChange={e=>set("platform",e.target.value)} style={{ ...inputStyle, marginBottom:0, cursor:"pointer" }}>
            {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div style={{ flex:1 }}>
          <label style={labelStyle}>الحالة</label>
          <select value={form.status} onChange={e=>set("status",e.target.value)} style={{ ...inputStyle, marginBottom:0, cursor:"pointer" }}>
            {PROSPECT_STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <label style={labelStyle}>القيمة المتوقعة</label>
      <input placeholder="مثال: $2,500+$200/mo" value={form.value} onChange={e=>set("value",e.target.value)} style={inputStyle} />

      <label style={labelStyle}>الخطوة الجاية</label>
      <input placeholder="مثال: Follow up الثلاثاء" value={form.nextAction} onChange={e=>set("nextAction",e.target.value)} style={inputStyle} />

      <label style={labelStyle}>ملاحظات</label>
      <textarea placeholder="أي تفاصيل مهمة..." value={form.notes} onChange={e=>set("notes",e.target.value)} rows={3} style={{ ...inputStyle, resize:"vertical" }} />

      <div style={{ display:"flex", gap:8 }}>
        <button onClick={()=>form.name.trim()&&onSave(form)} style={{
          flex:1, padding:"12px", borderRadius:10,
          background:form.name.trim()?G.green:"#1a3d2b", border:"none",
          color:form.name.trim()?G.bg:G.grey, ...F, fontWeight:700, fontSize:13,
          cursor:form.name.trim()?"pointer":"default",
        }}>حفظ</button>
        <button onClick={onCancel} style={{
          flex:1, padding:"12px", borderRadius:10, background:"transparent",
          border:`1px solid ${G.border}`, color:G.grey, ...F, fontSize:13, cursor:"pointer",
        }}>إلغاء</button>
      </div>
    </div>
  );
}

export default function Sales({ prospects, onAdd, onUpdate, onDelete }) {
  const [showForm,   setShowForm]   = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [filter,     setFilter]     = useState("all");

  const handleSave = (form) => {
    if (editing) {
      onUpdate({ ...editing, ...form });
      setEditing(null);
    } else {
      onAdd({ ...form, id: Date.now().toString(), createdAt: new Date().toISOString() });
      setShowForm(false);
    }
  };

  const handleEdit = (p) => { setEditing(p); setShowForm(false); };

  const filtered = filter === "all"
    ? prospects
    : prospects.filter(p => p.status === filter);

  const counts = {};
  PROSPECT_STATUSES.forEach(s => { counts[s.id] = prospects.filter(p=>p.status===s.id).length; });
  const pipeline = prospects.filter(p=>!["closed","dead"].includes(p.status)).length;

  return (
    <div style={{ padding:"24px 16px 80px" }}>

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
        <div>
          <div style={{ fontSize:20, fontWeight:800, color:G.white }}>Sales CRM</div>
          <div style={{ fontSize:12, color:G.grey, marginTop:2 }}>{pipeline} في الـ Pipeline · {counts.closed||0} مغلقة</div>
        </div>
        {!showForm && !editing && (
          <button onClick={()=>setShowForm(true)} style={{
            padding:"10px 16px", background:G.green, border:"none", borderRadius:10,
            color:G.bg, ...F, fontWeight:700, fontSize:12, cursor:"pointer",
          }}>＋ جديد</button>
        )}
      </div>

      {/* Form */}
      {showForm && <ProspectForm onSave={handleSave} onCancel={()=>setShowForm(false)} />}
      {editing  && <ProspectForm initial={editing} onSave={handleSave} onCancel={()=>setEditing(null)} />}

      {/* Status Summary */}
      <div style={{ display:"flex", gap:6, overflowX:"auto", marginBottom:16, paddingBottom:4 }}>
        <button onClick={()=>setFilter("all")} style={{
          padding:"6px 12px", borderRadius:20, border:`1px solid ${filter==="all"?G.green:G.border}`,
          background:filter==="all"?G.greenGlow:"transparent",
          color:filter==="all"?G.green:G.grey, fontSize:10, fontWeight:700, cursor:"pointer", ...F,
          whiteSpace:"nowrap", flexShrink:0,
        }}>الكل ({prospects.length})</button>
        {PROSPECT_STATUSES.map(s => (
          <button key={s.id} onClick={()=>setFilter(s.id)} style={{
            padding:"6px 12px", borderRadius:20,
            border:`1px solid ${filter===s.id?s.color:G.border}`,
            background:filter===s.id?s.bg:"transparent",
            color:filter===s.id?s.color:G.grey,
            fontSize:10, fontWeight:700, cursor:"pointer", ...F,
            whiteSpace:"nowrap", flexShrink:0,
          }}>{s.label} {counts[s.id]?`(${counts[s.id]})`:""}</button>
        ))}
      </div>

      {/* Prospects */}
      {filtered.length === 0 ? (
        <div style={{
          textAlign:"center", padding:"40px 20px",
          background:G.card, border:`1.5px dashed ${G.border}`, borderRadius:14,
        }}>
          <div style={{ fontSize:28, marginBottom:10 }}>💼</div>
          <div style={{ fontSize:13, color:G.grey }}>
            {filter==="all" ? "ما في prospects بعد — ابدأ بإضافة أول واحد!" : `ما في prospects بهالحالة`}
          </div>
        </div>
      ) : (
        filtered.map(p => (
          <ProspectCard
            key={p.id} p={p}
            onEdit={handleEdit}
            onDelete={onDelete}
            onStatusChange={(id,status)=>onUpdate({...prospects.find(x=>x.id===id), status})}
          />
        ))
      )}
    </div>
  );
}
