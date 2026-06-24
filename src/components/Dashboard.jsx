import { useState, useEffect } from "react";
import { G, F, TIME_BLOCKS } from "../theme.js";

function getBlock() {
  const h = new Date().getHours();
  return TIME_BLOCKS.find(b => b.hours.includes(h)) ?? null;
}

const DEPT_TASKS = {
  sales:   ["Prospecting على LinkedIn","Outreach message مخصصة","Follow-up بعد 3 أيام","راجع الـ Sales CRM"],
  build:   ["بناء workflow جديد على n8n","اختبار بـ PowerShell POST","تصحيح bugs + edge cases","حفظ JSON backup"],
  content: ["LinkedIn post (3x/أسبوع)","Instagram story (2-3/يوم)","Canva/Claude Design","CapCut reel (1x/أسبوع)"],
  ops:     ["Railway health check","مراجعة Telegram alerts","Credit balance check","Backup verification"],
};

export default function Dashboard({ systemsCount, liveCount, prospectsCount }) {
  const [time, setTime] = useState(new Date());
  const [block, setBlock] = useState(getBlock());

  useEffect(() => {
    const t = setInterval(() => { setTime(new Date()); setBlock(getBlock()); }, 1000);
    return () => clearInterval(t);
  }, []);

  const dayNames = ["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
  const day = dayNames[time.getDay()];
  const timeStr = time.toLocaleTimeString("ar", { hour:"2-digit", minute:"2-digit" });

  const stats = [
    { label:"الأنظمة",      value:`${liveCount}/${systemsCount}`, sub:"Live / Total", color: G.green },
    { label:"Prospects",    value:prospectsCount,                  sub:"في الـ Pipeline", color: G.blue },
    { label:"Target",       value:"$2,500",                       sub:"أول صفقة",      color: G.orange },
  ];

  return (
    <div style={{ padding: "0 0 80px" }}>

      {/* Header */}
      <div style={{ padding:"24px 20px 0", marginBottom:20 }}>
        <div style={{ fontSize:11, color:G.grey, letterSpacing:"0.1em", marginBottom:4 }}>
          {day} · {timeStr}
        </div>
        <div style={{ fontSize:22, fontWeight:800, color:G.white, lineHeight:1.2 }}>
          Yousef OS
        </div>
        <div style={{ fontSize:12, color:G.grey, marginTop:2 }}>
          AI Automation Specialist · n8n Expert
        </div>
      </div>

      {/* Current Block */}
      {block ? (
        <div style={{
          margin:"0 16px 20px",
          padding:"16px",
          background:`linear-gradient(135deg, rgba(0,255,136,0.08), rgba(0,255,136,0.03))`,
          border:`1px solid ${G.greenBorder}`,
          borderRadius:14,
        }}>
          <div style={{ fontSize:10, color:G.green, fontWeight:700, letterSpacing:"0.1em", marginBottom:6 }}>
            ● الوقت الحالي
          </div>
          <div style={{ fontSize:18, fontWeight:700, color:G.white, marginBottom:4 }}>
            {block.emoji} {block.ar} — {block.time}
          </div>
          <div style={{ fontSize:12, color:G.grey, marginBottom:12 }}>{block.desc}</div>
          <div style={{ fontSize:10, color:G.grey, fontWeight:600, marginBottom:8, letterSpacing:"0.08em" }}>
            المهام:
          </div>
          {(DEPT_TASKS[block.dept] || []).map((t, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background:G.green, flexShrink:0 }} />
              <div style={{ fontSize:12, color:G.white }}>{t}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          margin:"0 16px 20px", padding:"16px",
          background:G.card, border:`1px solid ${G.border}`, borderRadius:14,
          textAlign:"center", color:G.grey, fontSize:13,
        }}>
          🌙 وقت الراحة
        </div>
      )}

      {/* Stats Row */}
      <div style={{ display:"flex", gap:10, margin:"0 16px 20px" }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            flex:1, padding:"14px 10px",
            background:G.card, border:`1px solid ${G.border}`, borderRadius:12,
            textAlign:"center",
          }}>
            <div style={{ fontSize:20, fontWeight:800, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:10, color:G.white, fontWeight:600, marginTop:2 }}>{s.label}</div>
            <div style={{ fontSize:9, color:G.grey, marginTop:1 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Daily Schedule */}
      <div style={{ margin:"0 16px 20px" }}>
        <div style={{ fontSize:11, color:G.grey, fontWeight:600, letterSpacing:"0.1em", marginBottom:12 }}>
          الإيقاع اليومي
        </div>
        {TIME_BLOCKS.map(b => {
          const isActive = block?.id === b.id;
          return (
            <div key={b.id} style={{
              display:"flex", alignItems:"center", gap:12,
              padding:"12px 14px", marginBottom:8,
              background: isActive ? "rgba(0,255,136,0.06)" : G.card,
              border: isActive ? `1px solid ${G.greenBorder}` : `1px solid ${G.border}`,
              borderRadius:10, transition:"all 0.3s",
            }}>
              <div style={{ fontSize:18 }}>{b.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:600, color: isActive ? G.green : G.white }}>
                  {b.ar} <span style={{ color:G.grey, fontWeight:400 }}>· {b.time}</span>
                </div>
                <div style={{ fontSize:11, color:G.grey, marginTop:2 }}>{b.desc}</div>
              </div>
              {isActive && (
                <div style={{
                  width:8, height:8, borderRadius:"50%", background:G.green,
                  boxShadow:`0 0 8px ${G.green}`,
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Links */}
      <div style={{ margin:"0 16px" }}>
        <div style={{ fontSize:11, color:G.grey, fontWeight:600, letterSpacing:"0.1em", marginBottom:12 }}>
          روابط سريعة
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {[
            { label:"Calendly", url:"https://calendly.com/yousefskeikarn8n/30min", emoji:"📅" },
            { label:"LinkedIn",  url:"https://linkedin.com/in/yousef-skeikar-71a161404/", emoji:"💼" },
            { label:"Portfolio", url:"https://yousef-skeikar.framer.ai", emoji:"🌍" },
            { label:"Railway",   url:"https://railway.app", emoji:"⚙️" },
          ].map((l, i) => (
            <a key={i} href={l.url} target="_blank" rel="noreferrer" style={{
              display:"flex", alignItems:"center", gap:8, padding:"11px 12px",
              background:G.card, border:`1px solid ${G.border}`, borderRadius:10,
              textDecoration:"none", color:G.white, fontSize:12, fontWeight:600,
            }}>
              <span>{l.emoji}</span> {l.label}
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}
