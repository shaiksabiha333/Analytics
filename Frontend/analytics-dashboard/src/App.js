import { useState, useEffect} from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// ─── Animated Counter ───────────────────────────────────────────────────────
function AnimatedCounter({ target, prefix = "", suffix = "", decimals = 0 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseFloat(target);
    const duration = 1800;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return (
    <span>{prefix}{decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString()}{suffix}</span>
  );
}

// ─── KPI Card ────────────────────────────────────────────────────────────────
function KPICard({ icon, label, value, prefix, suffix, decimals, change, positive, gradient }) {
  return (
    <div className="kpi-card" style={{ background: gradient }}>
      <div className="kpi-top">
        <div className="kpi-icon">{icon}</div>
        <span className={`kpi-badge ${positive ? "pos" : "neg"}`}>
          {positive ? "▲" : "▼"} {Math.abs(change)}%
        </span>
      </div>
      <div className="kpi-value">
        <AnimatedCounter target={value} prefix={prefix} suffix={suffix} decimals={decimals} />
      </div>
      <div className="kpi-label">{label}</div>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
const NAV = [
  { icon: "⊞", label: "Dashboard" },
  { icon: "📧", label: "Campaigns" },
  { icon: "👥", label: "Contacts" },
  { icon: "🗒️", label: "Email Templates" },
  { icon: "⚙️", label: "Automation" },
  { icon: "📊", label: "Analytics", active: true },
  { icon: "📋", label: "Reports" },
  { icon: "🔧", label: "Settings" },
  { icon: "💳", label: "Billing" },
  { icon: "🔑", label: "API Keys" },
];

function Sidebar({ collapsed, setCollapsed }) {
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-logo">
        <div className="logo-icon">✉</div>
        {!collapsed && (
          <div>
            <div className="logo-title">Mail<span> Nova</span></div>
            <div className="logo-sub">MailNova</div>
          </div>
        )}
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? "›" : "‹"}
        </button>
      </div>
      <nav className="sidebar-nav">
        {NAV.map((item) => (
          <div key={item.label} className={`nav-item ${item.active ? "active" : ""}`}>
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
          </div>
        ))}
      </nav>
      {!collapsed && (
        <div className="upgrade-card">
          <div className="upgrade-icon">🚀</div>
          <div className="upgrade-title">Enterprise Analytics</div>
          <div className="upgrade-sub">Advanced Reporting Access</div>
          <button className="upgrade-btn">Upgrade Now</button>
        </div>
      )}
    </aside>
  );
}

// ─── Campaign Table ───────────────────────────────────────────────────────────
const CAMPAIGNS = [
  { name: "Summer Sale Campaign", sent: "45,200", open: "72.4%", ctr: "28.1%", bounce: "1.8%", revenue: "$12,400", status: "Active" },
  { name: "Newsletter #24", sent: "38,900", open: "68.7%", ctr: "22.3%", bounce: "2.1%", revenue: "$8,750", status: "Completed" },
  { name: "Product Launch", sent: "52,100", open: "65.2%", ctr: "19.8%", bounce: "2.9%", revenue: "$15,300", status: "Completed" },
  { name: "Black Friday Promo", sent: "61,800", open: "78.3%", ctr: "31.4%", bounce: "1.5%", revenue: "$22,100", status: "Scheduled" },
  { name: "Welcome Series", sent: "12,400", open: "84.1%", ctr: "35.7%", bounce: "0.9%", revenue: "$4,210", status: "Active" },
];

const STATUS_COLOR = { Active: "#22C55E", Completed: "#6C63FF", Scheduled: "#F59E0B" };

function CampaignTable() {
  return (
    <div className="card full-width">
      <div className="card-header">
        <h3 className="card-title">🏆 Top Performing Campaigns</h3>
        <button className="export-btn small">Export CSV</button>
      </div>
      <div className="table-wrap">
        <table className="analytics-table">
          <thead>
            <tr>
              {["Campaign", "Sent", "Open Rate", "CTR", "Bounce Rate", "Revenue", "Status"].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CAMPAIGNS.map((c) => (
              <tr key={c.name}>
                <td className="campaign-name">{c.name}</td>
                <td>{c.sent}</td>
                <td><span className="rate-green">{c.open}</span></td>
                <td><span className="rate-orange">{c.ctr}</span></td>
                <td><span className="rate-red">{c.bounce}</span></td>
                <td className="revenue">{c.revenue}</td>
                <td>
                  <span className="status-badge" style={{ background: STATUS_COLOR[c.status] + "22", color: STATUS_COLOR[c.status], border: `1px solid ${STATUS_COLOR[c.status]}44` }}>
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Activity Feed ────────────────────────────────────────────────────────────
const ACTIVITIES = [
  { icon: "📬", text: "Newsletter Campaign reached 10,000 opens.", time: "2 min ago", color: "#22C55E" },
  { icon: "🤖", text: "Welcome Automation generated 350 leads.", time: "18 min ago", color: "#6C63FF" },
  { icon: "📈", text: "CTR increased by 3.2% this week.", time: "1 hr ago", color: "#F59E0B" },
  { icon: "📉", text: "Bounce Rate decreased by 0.8%.", time: "3 hr ago", color: "#8B5CF6" },
  { icon: "📄", text: "Monthly Report generated successfully.", time: "1 day ago", color: "#EF4444" },
];

function ActivityFeed() {
  return (
    <div className="card">
      <div className="card-header"><h3 className="card-title">⚡ Recent Activity</h3></div>
      <div className="activity-list">
        {ACTIVITIES.map((a, i) => (
          <div key={i} className="activity-item">
            <div className="activity-dot" style={{ background: a.color }}>{a.icon}</div>
            <div className="activity-content">
              <div className="activity-text">{a.text}</div>
              <div className="activity-time">{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Geographic Table ─────────────────────────────────────────────────────────
const GEO = [
  { flag: "🇺🇸", country: "USA", opens: "98,400", ctr: "24.3%" },
  { flag: "🇮🇳", country: "India", opens: "72,100", ctr: "21.8%" },
  { flag: "🇬🇧", country: "UK", opens: "43,500", ctr: "19.2%" },
  { flag: "🇨🇦", country: "Canada", opens: "28,900", ctr: "22.7%" },
  { flag: "🇩🇪", country: "Germany", opens: "21,300", ctr: "18.5%" },
];

function GeoCard() {
  return (
    <div className="card">
      <div className="card-header"><h3 className="card-title">🌍 Top Engagement Regions</h3></div>
      <table className="geo-table">
        <thead><tr><th>Country</th><th>Opens</th><th>CTR</th></tr></thead>
        <tbody>
          {GEO.map((g) => (
            <tr key={g.country}>
              <td>{g.flag} {g.country}</td>
              <td>{g.opens}</td>
              <td><span className="rate-purple">{g.ctr}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Automation Metrics ───────────────────────────────────────────────────────
const AUTO_METRICS = [
  { label: "Workflows Executed", value: 142, max: 200, color: "#6C63FF" },
  { label: "Emails Triggered", value: 48920, max: 60000, color: "#F59E0B" },
  { label: "Successful Deliveries", value: 47200, max: 60000, color: "#22C55E" },
  { label: "Automation Revenue", value: 18400, max: 25000, color: "#EF4444" },
];

function AutomationCard() {
  return (
    <div className="card">
      <div className="card-header"><h3 className="card-title">🤖 Automation Performance</h3></div>
      <div className="auto-list">
        {AUTO_METRICS.map((m) => (
          <div key={m.label} className="auto-item">
            <div className="auto-row">
              <span className="auto-label">{m.label}</span>
              <span className="auto-val" style={{ color: m.color }}>
                {m.value.toLocaleString()}
              </span>
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${(m.value / m.max) * 100}%`, background: m.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Audience Insights ────────────────────────────────────────────────────────
const AUDIENCE = [
  { label: "New Subscribers", value: "12,840", icon: "🆕", color: "#6C63FF" },
  { label: "Returning", value: "98,200", icon: "🔁", color: "#F59E0B" },
  { label: "Unsubscribed", value: "3,410", icon: "🚪", color: "#EF4444" },
  { label: "Active Contacts", value: "204,890", icon: "✅", color: "#22C55E" },
];

function AudienceCard() {
  return (
    <div className="card">
      <div className="card-header"><h3 className="card-title">👥 Audience Insights</h3></div>
      <div className="audience-grid">
        {AUDIENCE.map((a) => (
          <div key={a.label} className="audience-item" style={{ borderLeft: `3px solid ${a.color}` }}>
            <div className="audience-icon">{a.icon}</div>
            <div className="audience-val" style={{ color: a.color }}>{a.value}</div>
            <div className="audience-label">{a.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Quick Actions ────────────────────────────────────────────────────────────
const ACTIONS = [
  { icon: "📄", label: "Generate Report", color: "#6C63FF" },
  { icon: "📥", label: "Export CSV", color: "#F59E0B" },
  { icon: "📑", label: "Export PDF", color: "#22C55E" },
  { icon: "💡", label: "Campaign Insights", color: "#EF4444" },
  { icon: "🔥", label: "Email Heatmap", color: "#F97316" },
  { icon: "👤", label: "Audience Report", color: "#8B5CF6" },
];

function QuickActions() {
  return (
    <div className="card">
      <div className="card-header"><h3 className="card-title">⚡ Quick Actions</h3></div>
      <div className="actions-grid">
        {ACTIONS.map((a) => (
          <button key={a.label} className="action-btn" style={{ "--accent": a.color }}>
            <span className="action-icon" style={{ background: a.color + "22", color: a.color }}>{a.icon}</span>
            <span className="action-label">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Chart Data ───────────────────────────────────────────────────────────────
const last30Days = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);

const performanceData = {
  labels: last30Days.filter((_, i) => i % 3 === 0),
  datasets: [
    { label: "Emails Sent", data: [8200, 7900, 9100, 8700, 9400, 9800, 10200, 9600, 10800, 11200], borderColor: "#6C63FF", backgroundColor: "rgba(108,99,255,0.08)", fill: true, tension: 0.4, pointRadius: 3 },
    { label: "Opened", data: [5600, 5400, 6200, 5900, 6400, 6700, 6900, 6500, 7400, 7800], borderColor: "#22C55E", backgroundColor: "rgba(34,197,94,0.08)", fill: true, tension: 0.4, pointRadius: 3 },
    { label: "Clicked", data: [1800, 1700, 2000, 1900, 2100, 2200, 2300, 2100, 2400, 2600], borderColor: "#F59E0B", backgroundColor: "rgba(245,158,11,0.08)", fill: true, tension: 0.4, pointRadius: 3 },
    { label: "Converted", data: [600, 580, 700, 660, 740, 780, 810, 760, 850, 920], borderColor: "#EF4444", backgroundColor: "rgba(239,68,68,0.08)", fill: true, tension: 0.4, pointRadius: 3 },
  ],
};

const doughnutData = {
  labels: ["Opened", "Clicked", "Unsubscribed", "Bounced", "Spam Reports"],
  datasets: [{ data: [68, 22, 5, 3, 2], backgroundColor: ["#22C55E", "#F59E0B", "#EF4444", "#6C63FF", "#8B5CF6"], borderWidth: 2, borderColor: "#fff" }],
};

const openRateData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [{ label: "Open Rate %", data: [52, 58, 63, 67, 68, 72], backgroundColor: "rgba(108,99,255,0.75)", borderRadius: 8, borderSkipped: false }],
};

const ctrData = {
  labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"],
  datasets: [{ label: "CTR %", data: [16, 17.5, 18, 19.2, 20.1, 21, 21.7, 22.4], borderColor: "#F59E0B", backgroundColor: "rgba(245,158,11,0.15)", fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: "#F59E0B" }],
};

const bounceData = {
  labels: ["Hard Bounce", "Soft Bounce", "Invalid Email", "Blocked Domain"],
  datasets: [{ label: "Bounce %", data: [0.8, 0.9, 0.4, 0.3], backgroundColor: ["#EF4444", "#F59E0B", "#8B5CF6", "#6C63FF"], borderRadius: 6 }],
};

const deviceData = {
  labels: ["Desktop", "Mobile", "Tablet"],
  datasets: [{ data: [48, 42, 10], backgroundColor: ["#6C63FF", "#F59E0B", "#22C55E"], borderWidth: 2, borderColor: "#fff" }],
};

const CHART_OPTIONS = (title) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: true, position: "bottom", labels: { boxWidth: 12, color: "#64748B", font: { size: 11 } } }, title: { display: false } },
  scales: { x: { grid: { color: "#F1F5F9" }, ticks: { color: "#64748B", font: { size: 10 } } }, y: { grid: { color: "#F1F5F9" }, ticks: { color: "#64748B", font: { size: 10 } } } },
});

const DOUGHNUT_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "68%",
  plugins: { legend: { position: "bottom", labels: { boxWidth: 12, color: "#64748B", font: { size: 11 } } } },
};

const BOUNCE_OPTIONS = {
  indexAxis: "y",
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { x: { grid: { color: "#F1F5F9" }, ticks: { color: "#64748B", font: { size: 10 }, callback: (v) => v + "%" } }, y: { grid: { display: false }, ticks: { color: "#64748B", font: { size: 11 } } } },
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AnalyticsDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/analytics"
      );

      console.log("Backend Data:", response.data);

      setAnalytics(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchAnalytics();
}, []);
  return (
    <>
      <style>{CSS}</style>
      <div className={`app-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        <main className="main-content">
          {/* Header */}
          <div className="page-header">
            <div>
              <h1 className="page-title">Welcome Back, Admin 👋</h1>
              <p className="page-sub">Analytics & Reports Overview — Track campaign performance and engagement metrics.</p>
            </div>
            <div className="header-actions">
              <select className="date-select" value={dateRange} onChange={e => setDateRange(e.target.value)}>
                {["Today", "Last 7 Days", "Last 30 Days", "Last 90 Days"].map(d => (
                  <option key={d}>{d}</option>
                ))}
              </select>
              <button className="export-btn">⬇ Export Report</button>
            </div>
          </div>

          {loading ? (
            <div className="skeleton-grid">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton-card" />)}
            </div>
          ) : (
            <>
              {/* KPI Row */}
              <div className="kpi-grid">
  <KPICard
    icon="✈️"
    label="Total Emails Sent"
    value={analytics?.kpis?.totalEmailsSent || 0}
    change={18.4}
    positive
    gradient="linear-gradient(135deg,#6C63FF,#8B5CF6)"
  />

  <KPICard
  icon="📬"
  label="Open Rate"
  value={analytics?.kpis?.openRate || 0}
  suffix="%"
  decimals={1}
  change={5.2}
  positive
  gradient="linear-gradient(135deg,#22C55E,#16a34a)"
/>

<KPICard
  icon="🖱️"
  label="CTR"
  value={analytics?.kpis?.ctr || 0}
  suffix="%"
  decimals={1}
  change={3.1}
  positive
  gradient="linear-gradient(135deg,#F59E0B,#D97706)"
/>

<KPICard
  icon="⚠️"
  label="Bounce Rate"
  value={analytics?.kpis?.bounceRate || 0}
  suffix="%"
  decimals={1}
  change={0.8}
  positive={false}
  gradient="linear-gradient(135deg,#EF4444,#dc2626)"
/>

<KPICard
  icon="🎯"
  label="Conversion Rate"
  value={analytics?.kpis?.conversionRate || 0}
  suffix="%"
  decimals={1}
  change={2.9}
  positive
  gradient="linear-gradient(135deg,#8B5CF6,#6C63FF)"
/>

<KPICard
  icon="💰"
  label="Revenue Generated"
  value={analytics?.kpis?.revenue || 0}
  prefix="$"
  change={14.2}
  positive
  gradient="linear-gradient(135deg,#F59E0B,#6C63FF)"
/>
</div>

              {/* Performance + Doughnut */}
              <div className="two-col">
                <div className="card span-2">
                  <div className="card-header">
                    <h3 className="card-title">📈 Campaign Performance Trends</h3>
                    <span className="card-sub">Last 30 Days</span>
                  </div>
                  <div style={{ height: 280 }}>
                    <Line data={performanceData} options={CHART_OPTIONS()} />
                  </div>
                </div>
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">🍩 Email Engagement Distribution</h3>
                  </div>
                  <div style={{ position: "relative", height: 240 }}>
                    <Doughnut data={doughnutData} options={DOUGHNUT_OPTIONS} />
                    <div className="doughnut-center">
                      <div className="doughnut-label">Total</div>
                      <div className="doughnut-val">100%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Campaign Table */}
              <CampaignTable />

              {/* Open Rate + CTR + Bounce */}
              <div className="three-col">
                <div className="card">
                  <div className="card-header"><h3 className="card-title">📊 Open Rate Performance</h3></div>
                  <div style={{ height: 220 }}>
                    <Bar data={openRateData} options={{ ...CHART_OPTIONS(), plugins: { legend: { display: false } } }} />
                  </div>
                </div>
                <div className="card">
                  <div className="card-header"><h3 className="card-title">🖱️ CTR Trends</h3></div>
                  <div style={{ height: 220 }}>
                    <Line data={ctrData} options={{ ...CHART_OPTIONS(), plugins: { legend: { display: false } } }} />
                  </div>
                </div>
                <div className="card">
                  <div className="card-header"><h3 className="card-title">⚠️ Bounce Rate Monitoring</h3></div>
                  <div style={{ height: 220 }}>
                    <Bar data={bounceData} options={BOUNCE_OPTIONS} />
                  </div>
                </div>
              </div>

              {/* Audience + Geo + Device */}
              <div className="three-col">
                <AudienceCard />
                <GeoCard />
                <div className="card">
                  <div className="card-header"><h3 className="card-title">📱 Device Usage</h3></div>
                  <div style={{ height: 210 }}>
                    <Pie data={deviceData} options={{ ...DOUGHNUT_OPTIONS, cutout: "0%" }} />
                  </div>
                </div>
              </div>

              {/* Automation + Activity + Quick Actions */}
              <div className="three-col">
                <AutomationCard />
                <ActivityFeed />
                <QuickActions />
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Segoe UI', system-ui, sans-serif;
    background: #F0F2F8;
    color: #1E293B;
  }

  .app-shell {
    display: grid;
    grid-template-columns: 260px 1fr;
    min-height: 100vh;
    transition: grid-template-columns 0.3s ease;
  }
  .app-shell.sidebar-collapsed {
    grid-template-columns: 72px 1fr;
  }

  /* SIDEBAR — dark navy matching the video */
  .sidebar {
    background: #1a1f2e;
    border-right: none;
    display: flex;
    flex-direction: column;
    padding: 20px 12px;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    transition: all 0.3s ease;
    box-shadow: 4px 0 20px rgba(0,0,0,0.25);
  }
  .sidebar-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 6px 24px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    margin-bottom: 12px;
    position: relative;
  }
  .logo-icon {
    width: 38px; height: 38px;
    background: linear-gradient(135deg, #6C63FF, #8B5CF6);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; color: #fff; flex-shrink: 0;
  }
  .logo-title { font-size: 14px; font-weight: 700; color: #fff; line-height: 1.2; }
  .logo-title span { color: #F59E0B; }
  .logo-sub { font-size: 10px; color: rgba(255,255,255,0.45); }
  .collapse-btn {
    position: absolute; right: -4px;
    background: #6C63FF; color: #fff;
    border: none; border-radius: 50%;
    width: 22px; height: 22px; cursor: pointer;
    font-size: 14px; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 8px rgba(108,99,255,0.4);
    transition: background 0.2s;
  }
  .collapse-btn:hover { background: #5a52d5; }
  .sidebar-nav { flex: 1; display: flex; flex-direction: column; gap: 4px; }
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 10px;
    cursor: pointer; color: rgba(255,255,255,0.5); font-size: 13.5px;
    transition: all 0.2s;
  }
  .nav-item:hover { background: rgba(255,255,255,0.07); color: #fff; }
  .nav-item.active { background: linear-gradient(135deg, #6C63FF, #8B5CF6); color: #fff; font-weight: 600; box-shadow: 0 4px 14px rgba(108,99,255,0.4); }
  .nav-icon { font-size: 16px; min-width: 20px; text-align: center; }

  .upgrade-card {
    background: linear-gradient(135deg, #F59E0B, #D97706);
    border-radius: 14px; padding: 16px; margin-top: 16px; text-align: center; color: #fff;
    box-shadow: 0 4px 20px rgba(245,158,11,0.35);
  }
  .upgrade-icon { font-size: 22px; margin-bottom: 6px; }
  .upgrade-title { font-weight: 700; font-size: 13px; }
  .upgrade-sub { font-size: 11px; opacity: 0.85; margin: 4px 0 10px; }
  .upgrade-btn {
    background: rgba(255,255,255,0.25); border: 1px solid rgba(255,255,255,0.4);
    color: #fff; border-radius: 8px; padding: 6px 16px; font-size: 12px; cursor: pointer;
    transition: background 0.2s;
  }
  .upgrade-btn:hover { background: rgba(255,255,255,0.4); }

  /* MAIN */
  .main-content {
    padding: 28px 32px;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  /* HEADER */
  .page-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    flex-wrap: wrap; gap: 16px;
  }
  .page-title { font-size: 24px; font-weight: 800; color: #1a1f2e; }
  .page-sub { font-size: 13px; color: #64748B; margin-top: 4px; }
  .header-actions { display: flex; align-items: center; gap: 12px; }
  .date-select {
    padding: 9px 14px; border: 1px solid #E2E8F0; border-radius: 10px;
    font-size: 13px; color: #1E293B; background: #fff; cursor: pointer;
    outline: none;
  }
  .export-btn {
    padding: 9px 18px; background: linear-gradient(135deg, #6C63FF, #8B5CF6);
    color: #fff; border: none; border-radius: 10px; font-size: 13px; font-weight: 600;
    cursor: pointer; box-shadow: 0 4px 12px rgba(108,99,255,0.35);
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .export-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(108,99,255,0.45); }
  .export-btn.small { padding: 6px 12px; font-size: 12px; }

  /* SKELETON */
  .skeleton-grid { display: grid; grid-template-columns: repeat(6,1fr); gap: 16px; }
  .skeleton-card {
    height: 110px; background: linear-gradient(90deg, #E8ECF5 25%, #D8DEEE 50%, #E8ECF5 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 16px;
  }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  /* KPI */
  .kpi-grid { display: grid; grid-template-columns: repeat(6,1fr); gap: 16px; }
  .kpi-card {
    border-radius: 18px; padding: 20px; color: #fff;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .kpi-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.22); }
  .kpi-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .kpi-icon { font-size: 22px; }
  .kpi-badge { font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 20px; }
  .kpi-badge.pos { background: rgba(255,255,255,0.25); }
  .kpi-badge.neg { background: rgba(0,0,0,0.2); }
  .kpi-value { font-size: 26px; font-weight: 800; line-height: 1; }
  .kpi-label { font-size: 11px; opacity: 0.85; margin-top: 6px; font-weight: 500; }

  /* CARDS */
  .card {
    background: #fff; border-radius: 18px; padding: 22px;
    border: 1px solid #E8ECF5;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
    transition: box-shadow 0.2s;
  }
  .card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.09); }
  .card-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 18px;
  }
  .card-title { font-size: 15px; font-weight: 700; color: #1a1f2e; }
  .card-sub { font-size: 12px; color: #94A3B8; }

  /* GRIDS */
  .two-col { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; align-items: start; }
  .three-col { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
  .full-width { width: 100%; }
  .span-2 { grid-column: span 1; }

  /* DOUGHNUT CENTER */
  .doughnut-center {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -60%);
    text-align: center; pointer-events: none;
  }
  .doughnut-label { font-size: 11px; color: #64748B; font-weight: 500; }
  .doughnut-val { font-size: 22px; font-weight: 800; color: #1a1f2e; }

  /* TABLE */
  .table-wrap { overflow-x: auto; }
  .analytics-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .analytics-table th {
    padding: 10px 14px; text-align: left; color: #64748B; font-weight: 600;
    border-bottom: 2px solid #F0F2F8; white-space: nowrap;
  }
  .analytics-table td { padding: 12px 14px; border-bottom: 1px solid #F8FAFC; }
  .analytics-table tr:last-child td { border-bottom: none; }
  .analytics-table tr:hover td { background: #F8F9FE; }
  .campaign-name { font-weight: 600; color: #1a1f2e; }
  .revenue { font-weight: 700; color: #6C63FF; }
  .rate-green { color: #22C55E; font-weight: 700; }
  .rate-orange { color: #F59E0B; font-weight: 700; }
  .rate-red { color: #EF4444; font-weight: 700; }
  .rate-purple { color: #6C63FF; font-weight: 700; }
  .status-badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }

  /* GEO TABLE */
  .geo-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .geo-table th { padding: 8px 10px; color: #64748B; font-weight: 600; text-align: left; border-bottom: 2px solid #F0F2F8; }
  .geo-table td { padding: 10px 10px; border-bottom: 1px solid #F8FAFC; }
  .geo-table tr:last-child td { border-bottom: none; }

  /* ACTIVITY */
  .activity-list { display: flex; flex-direction: column; gap: 14px; }
  .activity-item { display: flex; gap: 12px; align-items: flex-start; }
  .activity-dot {
    width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 16px;
    opacity: 0.85;
  }
  .activity-text { font-size: 13px; color: #1a1f2e; font-weight: 500; }
  .activity-time { font-size: 11px; color: #94A3B8; margin-top: 2px; }

  /* AUDIENCE */
  .audience-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .audience-item {
    background: #F8F9FE; border-radius: 12px; padding: 14px 12px;
    transition: transform 0.2s;
  }
  .audience-item:hover { transform: translateY(-2px); }
  .audience-icon { font-size: 18px; margin-bottom: 6px; }
  .audience-val { font-size: 18px; font-weight: 800; }
  .audience-label { font-size: 11px; color: #64748B; margin-top: 2px; }

  /* AUTOMATION */
  .auto-list { display: flex; flex-direction: column; gap: 16px; }
  .auto-row { display: flex; justify-content: space-between; margin-bottom: 6px; }
  .auto-label { font-size: 13px; color: #64748B; }
  .auto-val { font-size: 14px; font-weight: 800; }
  .progress-bar-bg { background: #F0F2F8; border-radius: 20px; height: 7px; overflow: hidden; }
  .progress-bar-fill { height: 100%; border-radius: 20px; transition: width 1s ease; }

  /* QUICK ACTIONS */
  .actions-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .action-btn {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; background: #F8F9FE; border: 1px solid #E8ECF5;
    border-radius: 12px; cursor: pointer; font-size: 13px; color: #1a1f2e; font-weight: 500;
    transition: all 0.2s; text-align: left;
  }
  .action-btn:hover { border-color: var(--accent); color: var(--accent); background: #fff; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
  .action-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
  .action-label { font-size: 12px; }

  /* RESPONSIVE */
  @media (max-width: 1280px) {
    .kpi-grid { grid-template-columns: repeat(3,1fr); }
    .two-col { grid-template-columns: 1fr; }
    .three-col { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 900px) {
    .kpi-grid { grid-template-columns: repeat(2,1fr); }
    .three-col { grid-template-columns: 1fr; }
    .main-content { padding: 20px 16px; }
  }
  @media (max-width: 600px) {
    .kpi-grid { grid-template-columns: 1fr; }
    .app-shell { grid-template-columns: 1fr; }
    .sidebar { display: none; }
    .page-header { flex-direction: column; }
  }
`;