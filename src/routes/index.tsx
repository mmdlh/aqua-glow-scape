import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Activity, BellRing, CircleGauge, Droplets, Factory, Gauge, Settings, ShieldCheck, Waves, Wrench, Zap } from "lucide-react";
import plantBackground from "@/assets/wastewater-plant-bg.jpg";
import { PlatformButton } from "@/components/PlatformButton";
import { WaterChart } from "@/components/WaterChart";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "综合态势｜清源智控" },
    { name: "description", content: "全流程水质、工艺、能耗、设备与预警智能监控平台。" },
    { property: "og:title", content: "清源智控｜污水处理智慧平台" },
    { property: "og:description", content: "实时掌握污水处理厂运行态势与关键指标。" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}), component: Dashboard,
});

type PageKey = "overview" | "quality" | "process" | "energy" | "equipment" | "alerts";
const nav: { key: PageKey; label: string; icon: typeof Activity }[] = [
  { key: "overview", label: "综合态势", icon: CircleGauge }, { key: "quality", label: "水质监测", icon: Droplets }, { key: "process", label: "工艺运行", icon: Factory },
  { key: "energy", label: "能耗分析", icon: Zap }, { key: "equipment", label: "设备运维", icon: Wrench }, { key: "alerts", label: "预警中心", icon: BellRing },
];

function Dashboard() {
  const [page, setPage] = useState<PageKey>("overview");
  const [now, setNow] = useState("");
  useEffect(() => { const tick = () => setNow(new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium", timeStyle: "medium", hour12: false }).format(new Date())); tick(); const id = window.setInterval(tick, 1000); return () => window.clearInterval(id); }, []);
  return <main className="platform-shell" style={{ backgroundImage: `linear-gradient(var(--scene-wash),var(--scene-wash)),url(${plantBackground})` }}>
    <header className="topbar">
      <nav className="nav-side">{nav.slice(0,3).map(n => <PlatformButton key={n.key} active={page===n.key} icon={<n.icon />} onClick={() => setPage(n.key)}>{n.label}</PlatformButton>)}</nav>
      <div className="brand"><div className="brand-mark"><Waves /></div><div><h1>清源智控</h1><p>WASTEWATER INTELLIGENCE PLATFORM</p></div></div>
      <nav className="nav-side nav-right">{nav.slice(3).map(n => <PlatformButton key={n.key} active={page===n.key} icon={<n.icon />} onClick={() => setPage(n.key)}>{n.label}</PlatformButton>)}</nav>
    </header>
    <div className="subbar"><span><i className="status-dot" />系统运行正常</span><strong>{nav.find(n => n.key===page)?.label}</strong><span>{now || "2026年9月24日 10:18:00"}</span></div>
    <section className="dashboard-stage animate-fade-in" key={page}>{page === "overview" && <Overview />}{page === "quality" && <Quality />}{page === "process" && <Process />}{page === "energy" && <Energy />}{page === "equipment" && <Equipment />}{page === "alerts" && <Alerts />}</section>
  </main>;
}

function Card({ title, extra, children, className="" }: { title: string; extra?: ReactNode; children: ReactNode; className?: string }) { return <article className={`glass-card ${className}`}><div className="card-head"><h2>{title}</h2>{extra}</div>{children}</article>; }
function Metric({ label, value, unit, trend, tone="cyan" }: { label:string; value:string; unit:string; trend:string; tone?:string }) { return <div className={`metric metric-${tone}`}><div className="metric-top"><span>{label}</span><Gauge /></div><div><strong>{value}</strong><em>{unit}</em></div><p>{trend}</p></div>; }
const Tag = ({ children, tone="ok" }: { children: ReactNode; tone?: string }) => <span className={`tag tag-${tone}`}><i />{children}</span>;

function Overview() { return <div className="overview-layout">
  <div className="metric-row wide"><Metric label="今日处理水量" value="42,860" unit="m³" trend="↑ 8.2% 较昨日"/><Metric label="出水达标率" value="99.86" unit="%" trend="连续达标 128 天" tone="lime"/><Metric label="吨水综合能耗" value="0.274" unit="kWh" trend="↓ 5.4% 节能运行" tone="gold"/><Metric label="在线设备" value="236/241" unit="台" trend="98.0% 在线率" tone="blue"/></div>
  <Card title="全厂实时水量趋势" extra={<Tag>实时更新</Tag>} className="overview-trend"><WaterChart kind="flow" className="chart-lg" /></Card>
  <Card title="处理达标指数" className="overview-ring"><div className="score-orbit"><div><strong>98.7</strong><span>综合指数</span></div></div><div className="score-list"><p><span>COD 去除率</span><b>96.8%</b></p><p><span>氨氮去除率</span><b>98.2%</b></p><p><span>总磷去除率</span><b>94.6%</b></p></div></Card>
  <Card title="实时水质监测" className="overview-table"><DataTable rows={[['进水口','COD','286.4 mg/L','正常'],['生化池','DO','2.84 mg/L','正常'],['二沉池','SS','8.2 mg/L','正常'],['总排口','氨氮','1.21 mg/L','优质']]} /></Card>
  <Card title="厂区运行脉搏" extra={<span className="tiny-label">负荷率 82%</span>} className="overview-pulse"><div className="pulse-strip">{['进水泵房','细格栅','生化池','二沉池','深度处理','出水口'].map((x,i)=><div key={x}><i style={{height:`${42+i*8}%`}}/><span>{x}</span></div>)}</div></Card>
</div>; }

function Quality() { return <div className="quality-layout">
  <div className="quality-sidebar"><Metric label="出水 COD" value="21.4" unit="mg/L" trend="限值 50 mg/L"/><Metric label="出水氨氮" value="1.21" unit="mg/L" trend="限值 5 mg/L" tone="lime"/><Metric label="出水总磷" value="0.24" unit="mg/L" trend="限值 0.5 mg/L" tone="gold"/></div>
  <Card title="24小时出水水质趋势" extra={<Tag>一级 A 标准</Tag>} className="quality-main"><WaterChart kind="quality" className="chart-xl"/></Card>
  <Card title="污染物去除能力" className="quality-radar"><WaterChart kind="radar" className="chart-lg"/></Card>
  <Card title="采样点实时记录" className="quality-table"><DataTable rows={[['S01 进水渠','COD','286.4','10:16'],['S04 缺氧池','ORP','-86.2','10:15'],['S07 好氧池','DO','2.84','10:15'],['S11 总排口','pH','7.24','10:16'],['S12 总排口','TN','8.32','10:14']]} /></Card>
</div>; }

function Process() { const steps=[['01','进水提升','4.28万m³'],['02','预处理','格栅差 8mm'],['03','生化反应','MLSS 3.6g/L'],['04','二次沉淀','泥位 1.8m'],['05','深度处理','浊度 0.8NTU'],['06','消毒出水','余氯 0.41mg/L']]; return <div className="process-layout">
  <Card title="全流程工艺链" extra={<Tag>稳定运行</Tag>} className="process-flow"><div className="flow-line">{steps.map((s,i)=><div className="flow-node" key={s[0]}><span>{s[0]}</span><Factory/><strong>{s[1]}</strong><small>{s[2]}</small>{i<5&&<b>›</b>}</div>)}</div></Card>
  <Card title="各工段实时负荷" className="process-chart"><WaterChart kind="bars" className="chart-lg"/></Card>
  <Card title="关键池体参数" className="process-grid"><div className="pool-grid">{[['A²/O-1池','DO 2.84','正常'],['A²/O-2池','MLSS 3.62','正常'],['二沉池-1','SV30 28%','正常'],['二沉池-2','泥位 1.84','关注'],['高密池','PAM 3.2','正常'],['滤布滤池','压差 0.18','正常']].map(x=><div key={x[0]}><span>{x[0]}</span><strong>{x[1]}</strong><Tag tone={x[2]==='关注'?'warn':'ok'}>{x[2]}</Tag></div>)}</div></Card>
  <Card title="运行调控记录" className="process-log"><Timeline items={['09:42  好氧池曝气频率调至 42Hz','08:18  回流比自动修正为 75%','06:30  1#细格栅完成反冲洗','04:12  碳源投加泵流量下调 3%']} /></Card>
</div>; }

function Energy() { return <div className="energy-layout">
  <div className="energy-title"><p>ENERGY EFFICIENCY</p><h2>今日节能 <strong>1,284</strong> kWh</h2><span>折合减碳 0.72 吨</span></div>
  <div className="metric-row"><Metric label="总用电量" value="11,746" unit="kWh" trend="预算内 92.4%"/><Metric label="峰值功率" value="728" unit="kW" trend="发生于 14:00" tone="gold"/><Metric label="光伏发电" value="2,168" unit="kWh" trend="厂内消纳 100%" tone="lime"/></div>
  <Card title="全天用能曲线与预测" className="energy-curve"><WaterChart kind="energy" className="chart-xl"/></Card>
  <Card title="能耗结构" className="energy-donut"><WaterChart kind="donut" className="chart-lg"/></Card>
  <Card title="工段单耗排行" className="energy-rank"><RankList /></Card>
</div>; }

function Equipment() { return <div className="equipment-layout">
  <div className="equipment-hero glass-card"><div><p>设备健康指数</p><strong>94.8</strong><span>优秀</span></div><ShieldCheck /></div>
  <Card title="设备健康能力图" className="equipment-radar"><WaterChart kind="radar" className="chart-lg"/></Card>
  <Card title="在线设备矩阵" extra={<span className="tiny-label">236 / 241</span>} className="equipment-matrix"><div className="device-matrix">{Array.from({length:36},(_,i)=><span key={i} className={i===7||i===29?'warn':i===18?'off':''} title={`设备 ${i+1}`}/>)}</div><div className="matrix-key"><span><i/>运行</span><span><i className="warn"/>关注</span><span><i className="off"/>离线</span></div></Card>
  <Card title="维护作业排程" className="equipment-table"><DataTable rows={[['P-203提升泵','振动巡检','今日 14:30','待执行'],['BL-08鼓风机','润滑保养','明日 09:00','已排程'],['M-114搅拌机','电流检测','9月26日','已排程'],['UV-02消毒组','灯管清洁','9月28日','待确认']]} /></Card>
  <Card title="设备工况摘要" className="equipment-status"><div className="status-stack">{[['泵类设备','48/49',98],['风机设备','12/12',100],['搅拌设备','34/35',97],['加药设备','28/29',96] as const].map(([name, count, rate])=><div key={name}><span>{name}</span><b>{count}</b><progress value={rate} max="100"/><em>{rate}%</em></div>)}</div></Card>
</div>; }

function Alerts() { return <div className="alert-layout">
  <div className="alert-kpis"><div><BellRing/><span>当前预警</span><strong>5</strong></div><div><Activity/><span>今日已处置</span><strong>18</strong></div><div><ShieldCheck/><span>闭环率</span><strong>97.3%</strong></div></div>
  <Card title="24小时预警分布" className="alert-bars"><WaterChart kind="alerts" className="chart-lg"/></Card>
  <Card title="风险来源构成" className="alert-pie"><WaterChart kind="donut" className="chart-lg"/></Card>
  <Card title="实时预警事件" extra={<Tag tone="warn">5 项待处置</Tag>} className="alert-feed"><div className="alert-list">{[['高','二沉池-2 泥位接近上限','10:12','处理中'],['中','P-203提升泵振动偏高','09:48','已派单'],['中','出水总磷短时上扬','09:21','观察中'],['低','UV-02累计运行时长提醒','08:35','待确认'],['低','药剂储量低于35%','07:58','已派单']].map((x,i)=><div key={x[1]}><span className={`level level-${i===0?'high':i<3?'mid':'low'}`}>{x[0]}</span><strong>{x[1]}</strong><time>{x[2]}</time><Tag tone={i===0?'warn':'ok'}>{x[3]}</Tag></div>)}</div></Card>
</div>; }

function DataTable({ rows }:{ rows:string[][] }) { return <div className="data-table"><div className="table-row table-head"><span>监测对象</span><span>指标/任务</span><span>实时值/时间</span><span>状态</span></div>{rows.map((r,i)=><div className="table-row" key={i}>{r.map((c,j)=><span key={j}>{j===3?<Tag tone={c.includes('待')||c.includes('关注')?'warn':'ok'}>{c}</Tag>:c}</span>)}</div>)}</div>; }
function Timeline({ items }:{items:string[]}) { return <div className="timeline">{items.map(x=><div key={x}><i/><span>{x}</span></div>)}</div>; }
function RankList(){return <div className="rank-list">{[['提升泵站',0.082,92],['生化曝气',0.076,84],['污泥脱水',0.051,62],['深度处理',0.038,47]].map((x,i)=><div key={String(x[0])}><b>0{i+1}</b><span>{x[0]}</span><div><i style={{width:`${x[2]}%`}}/></div><em>{x[1]} kWh/m³</em></div>)}</div>}
