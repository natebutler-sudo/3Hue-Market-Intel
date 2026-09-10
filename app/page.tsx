'use client';

import { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Database,
  ExternalLink,
  FileText,
  Filter,
  Globe2,
  KeyRound,
  LayoutDashboard,
  LineChart,
  LockKeyhole,
  Mail,
  Menu,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';

type View = 'Analyst' | 'Director' | 'C-suite';

type Finding = {
  id: string;
  category: string;
  title: string;
  summary: string;
  source: string;
  collected: string;
  segment: string;
  status: 'Unreviewed' | 'Reviewed';
  importance: 'High' | 'Medium';
  implication: string;
  action: string;
};

const findings: Finding[] = [
  {
    id: 'f1', category: 'Market shift',
    title: 'AI governance guidance is moving from principles to operating practice',
    summary: 'New guidance is framing AI risk around ownership, evidence, and repeatable controls—not only policy statements.',
    source: 'NIST AI RMF / GenAI Profile', collected: 'Today · 05:42 CT', segment: 'Provable Vendor', status: 'Unreviewed', importance: 'High',
    implication: 'This is a strong education and executive-brief angle for technology buyers that need proof their controls operate in practice.', action: 'Create an executive brief',
  },
  {
    id: 'f2', category: 'Competitor',
    title: 'Drata is positioning agent governance as an early-access product',
    summary: 'The public announcement emphasizes discovery, monitoring, and control for AI agents, with availability still described as early access.',
    source: 'Drata newsroom', collected: 'Today · 04:17 CT', segment: 'Provable Vendor', status: 'Unreviewed', importance: 'High',
    implication: 'The market is teaching buyers to expect visibility into AI systems. 3HUE can differentiate on operated readiness and evidence ownership.', action: 'Compare competitor positioning',
  },
  {
    id: 'f3', category: 'Account signal',
    title: 'A watched portfolio company added a security leadership role',
    summary: 'The role description references customer assurance and a more formal control environment.',
    source: 'HubSpot priority account + public job page', collected: 'Yesterday · 21:06 CT', segment: 'Portfolio', status: 'Reviewed', importance: 'High',
    implication: 'This may be a timing signal for a readiness conversation, but it is not proof of active buying intent.', action: 'Open account brief',
  },
  {
    id: 'f4', category: 'Content opportunity',
    title: 'Buyers keep asking who owns AI evidence after deployment',
    summary: 'Recurring questions point to a gap between an AI policy and the practical work of keeping evidence current.',
    source: 'Buyer-question watchlist', collected: 'Yesterday · 17:32 CT', segment: 'Regulated Operator', status: 'Reviewed', importance: 'Medium',
    implication: 'A short LinkedIn series or video outline could turn the question into a useful point of view without making a legal claim.', action: 'Draft a content outline',
  },
];

const widgets = [
  { id: 'briefing', label: "Today's briefing", description: 'Fresh findings and actions', icon: Sparkles },
  { id: 'signals', label: 'Priority signals', description: 'Accounts and competitors', icon: Activity },
  { id: 'performance', label: '3HUE performance', description: 'Web, search, and CRM', icon: LineChart },
  { id: 'coverage', label: 'Coverage health', description: 'Sources and collection', icon: ShieldCheck },
  { id: 'content', label: 'Content opportunities', description: 'Questions worth answering', icon: FileText },
  { id: 'hubspot', label: 'HubSpot funnel', description: 'Read-only CRM rollup', icon: BriefcaseBusiness },
];

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Research', icon: Search },
  { label: 'Accounts', icon: Users },
  { label: 'Competitors', icon: Globe2 },
  { label: 'Briefs', icon: FileText },
];

function Metric({ label, value, detail, tone = 'cyan' }: { label: string; value: string; detail: string; tone?: 'cyan' | 'orange' | 'navy' }) {
  return <div className="metric-card"><div className={`metric-icon metric-${tone}`}><TrendingUp size={17} /></div><div><p className="eyebrow">{label}</p><p className="metric-value">{value}</p><p className="metric-detail">{detail}</p></div></div>;
}

function Sparkline({ values, color = '#12b8d4' }: { values: number[]; color?: string }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${32 - ((value - min) / Math.max(max - min, 1)) * 24}`).join(' ');
  return <svg className="sparkline" viewBox="0 0 100 36"><title>Trend line</title><path d="M0 32 H100" stroke="currentColor" strokeOpacity=".11" /><polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function Home() {
  const [activeView, setActiveView] = useState<View>('Director');
  const [activeNav, setActiveNav] = useState('Overview');
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [showCustomize, setShowCustomize] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [search, setSearch] = useState('');
  const [segment, setSegment] = useState('All segments');
  const [visibleWidgets, setVisibleWidgets] = useState(['briefing', 'signals', 'performance', 'coverage', 'content', 'hubspot']);
  const [notice, setNotice] = useState('');

  const filteredFindings = useMemo(() => findings.filter((finding) => {
    const searchMatch = !search || `${finding.title} ${finding.summary} ${finding.source}`.toLowerCase().includes(search.toLowerCase());
    const segmentMatch = segment === 'All segments' || finding.segment === segment;
    return searchMatch && segmentMatch;
  }), [search, segment]);

  const toggleWidget = (id: string) => setVisibleWidgets((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const announce = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(''), 2600); };

  return (
    <main className="app-shell">
      <div className="app-topline" />
      <header className="topbar">
        <div className="brand-lockup"><div className="brand-mark"><span /><span /><span /></div><div><p className="brand-name">3HUE</p><p className="brand-product">MARKET INTEL</p></div></div>
        <div className="topbar-center"><div className="view-switcher" role="tablist" aria-label="Dashboard view">{(['Analyst', 'Director', 'C-suite'] as View[]).map((view) => <button key={view} className={`view-tab ${activeView === view ? 'active' : ''}`} onClick={() => setActiveView(view)} role="tab" aria-selected={activeView === view}>{view}</button>)}</div></div>
        <div className="topbar-actions"><span className="freshness"><span className="live-dot" /> Updated 18 min ago</span><button className="icon-button" aria-label="Notifications" onClick={() => announce('No new high-impact alerts.')}><Bell size={18} /></button><button className="user-chip" onClick={() => setShowSettings(true)}><span className="avatar">NB</span><span className="user-name">Nate Butler</span><ChevronDown size={15} /></button></div>
      </header>

      <div className="mobile-nav-row"><button className="icon-button" aria-label="Open navigation"><Menu size={19} /></button><span>{activeNav}</span><button className="icon-button" aria-label="Open settings" onClick={() => setShowSettings(true)}><Settings2 size={18} /></button></div>

      <div className="workspace">
        <aside className="sidebar"><div className="sidebar-label">Workspace</div><nav className="sidebar-nav" aria-label="Primary navigation">{navItems.map(({ label, icon: Icon }) => <button key={label} className={`nav-item ${activeNav === label ? 'selected' : ''}`} onClick={() => setActiveNav(label)}><Icon size={17} /><span>{label}</span>{label === 'Research' && <span className="nav-count">4</span>}</button>)}</nav><div className="sidebar-label sidebar-label-spaced">Admin</div><nav className="sidebar-nav" aria-label="Administration"><button className="nav-item" onClick={() => setShowSettings(true)}><Settings2 size={17} /><span>Connections</span></button><button className="nav-item" onClick={() => announce('Coverage report queued for the next collection run.')}><ShieldCheck size={17} /><span>Coverage health</span></button></nav><div className="sidebar-bottom"><div className="sidebar-help"><CircleHelp size={16} /><span>Guide</span></div><div className="sidebar-status"><span className="status-dot" /> 6 sources healthy</div></div></aside>

        <section className="content-area">
          <div className="content-heading"><div><p className="eyebrow accent-eyebrow">{activeView} view · Wednesday, September 10, 2026</p><h1>Good morning, Nate.</h1><p className="heading-subtitle">Here’s what changed across the markets 3HUE supports.</p></div><div className="heading-actions"><button className="secondary-button" onClick={() => setShowCustomize(true)}><SlidersHorizontal size={16} /> Customize</button><button className="primary-button" onClick={() => announce('Research request started. We will report source coverage when it completes.')}><Sparkles size={16} /> Ask for research</button></div></div>
          <div className="filter-row"><div className="search-box"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search findings, accounts, sources" aria-label="Search findings, accounts, sources" /></div><label className="select-wrap"><Filter size={15} /><select value={segment} onChange={(event) => setSegment(event.target.value)} aria-label="Filter by customer segment"><option>All segments</option><option>Provable Vendor</option><option>Portfolio</option><option>Regulated Operator</option></select><ChevronDown size={14} /></label><span className="filter-note"><Clock3 size={14} /> Next collection in 3h 42m</span></div>
          <div className="metric-grid"><Metric label="New findings" value="18" detail="+6 since yesterday" tone="cyan" /><Metric label="Priority signals" value="4" detail="2 need review" tone="orange" /><Metric label="3HUE pipeline" value="$184k" detail="12 open opportunities" tone="navy" /><Metric label="Source coverage" value="86%" detail="2 blocked sources" tone="cyan" /></div>

          <div className="dashboard-grid">
            {visibleWidgets.includes('briefing') && <section className="panel briefing-panel"><div className="panel-heading"><div><p className="eyebrow">Morning briefing</p><h2>What matters today</h2></div><span className="review-pill"><span className="status-dot" /> 2 unreviewed</span></div><div className="briefing-callout"><div className="callout-icon"><Sparkles size={19} /></div><div><strong>AI governance is becoming an operating conversation.</strong><p>Three sources point to buyers asking who owns evidence after deployment. That opens a content and executive-education opportunity for 3HUE.</p></div><ArrowUpRight size={18} className="muted-icon" /></div><div className="briefing-list">{filteredFindings.slice(0, 3).map((finding) => <button key={finding.id} className="briefing-row" onClick={() => setSelectedFinding(finding)}><span className={`finding-dot ${finding.importance === 'High' ? 'high' : ''}`} /><span className="briefing-row-title">{finding.title}</span><span className={`status-tag ${finding.status === 'Unreviewed' ? 'unreviewed' : 'reviewed'}`}>{finding.status}</span><ArrowUpRight size={15} /></button>)}</div><button className="text-button" onClick={() => setActiveNav('Research')}>View all findings <ArrowUpRight size={14} /></button></section>}

            {visibleWidgets.includes('signals') && <section className="panel signals-panel"><div className="panel-heading"><div><p className="eyebrow">Priority signals</p><h2>Watchlist activity</h2></div><button className="more-button" aria-label="More signal options">•••</button></div><div className="signal-summary"><div><p className="big-number">4</p><p className="metric-detail">high-impact signals</p></div><Sparkline values={[20, 28, 24, 35, 42, 48, 58]} color="#f0783c" /></div><div className="signal-list"><div className="signal-item"><span className="signal-icon orange"><BriefcaseBusiness size={15} /></span><div><strong>Account leadership change</strong><p>1 priority account · 2h ago</p></div><span className="signal-arrow">↗</span></div><div className="signal-item"><span className="signal-icon cyan"><Globe2 size={15} /></span><div><strong>Competitor offer movement</strong><p>Drata · today</p></div><span className="signal-arrow">↗</span></div><div className="signal-item"><span className="signal-icon navy"><AlertTriangle size={15} /></span><div><strong>Requirement update</strong><p>Official source · today</p></div><span className="signal-arrow">↗</span></div></div><button className="text-button" onClick={() => setActiveNav('Accounts')}>Open watchlists <ArrowUpRight size={14} /></button></section>}

            {visibleWidgets.includes('performance') && <section className="panel performance-panel"><div className="panel-heading"><div><p className="eyebrow">3HUE performance</p><h2>Marketing signals</h2></div><span className="connected-pill"><span className="status-dot" /> GA4 connected</span></div><div className="performance-layout"><div className="performance-number"><p className="big-number">443</p><p className="metric-detail">active users · last 30 days</p><span className="trend-up"><TrendingUp size={14} /> 12.4%</span></div><Sparkline values={[18, 20, 18, 24, 31, 29, 42, 47, 51]} /></div><div className="performance-bars"><div><span>Organic sessions</span><strong>29</strong><div className="bar-track"><span style={{ width: '38%' }} /></div></div><div><span>New contacts</span><strong>18</strong><div className="bar-track orange-bar"><span style={{ width: '25%' }} /></div></div><div><span>Open pipeline</span><strong>$184k</strong><div className="bar-track navy-bar"><span style={{ width: '64%' }} /></div></div></div><button className="text-button" onClick={() => announce('Performance detail will open after the GA4 and HubSpot connections are verified.')}>Open performance detail <ArrowUpRight size={14} /></button></section>}

            {visibleWidgets.includes('coverage') && <section className="panel coverage-panel"><div className="panel-heading"><div><p className="eyebrow">Coverage health</p><h2>Can we trust today’s view?</h2></div><ShieldCheck size={20} className="cyan-icon" /></div><div className="coverage-score"><div className="score-ring"><span>86</span><small>%</small></div><div><strong>Healthy with gaps</strong><p>Most monitored sources refreshed successfully.</p></div></div><div className="coverage-list"><div className="coverage-row"><span className="status-dot" /> HubSpot CRM <em>Connected</em></div><div className="coverage-row"><span className="status-dot" /> GA4 <em>Connected</em></div><div className="coverage-row warning"><span className="warning-dot" /> Search Console <em>Historical export only</em></div><div className="coverage-row warning"><span className="warning-dot" /> 2 sources <em>Blocked by sign-in</em></div></div><button className="text-button" onClick={() => setActiveNav('Coverage health')}>Review coverage gaps <ArrowUpRight size={14} /></button></section>}

            {visibleWidgets.includes('content') && <section className="panel content-panel"><div className="panel-heading"><div><p className="eyebrow">Content opportunities</p><h2>Questions worth answering</h2></div><FileText size={20} className="orange-icon" /></div><div className="content-opportunity"><span className="opportunity-rank">01</span><div><strong>Who owns AI evidence after deployment?</strong><p>Buyer question · Regulated Operator · recurring</p></div><button className="small-circle-button" aria-label="Create brief" onClick={() => announce('Brief draft started from this opportunity.')}><Plus size={16} /></button></div><div className="content-opportunity"><span className="opportunity-rank">02</span><div><strong>What does operated readiness change?</strong><p>Message gap · Provable Vendor · rising</p></div><button className="small-circle-button" aria-label="Create brief" onClick={() => announce('Brief draft started from this opportunity.')}><Plus size={16} /></button></div><button className="text-button" onClick={() => setActiveNav('Briefs')}>Open content queue <ArrowUpRight size={14} /></button></section>}

            {visibleWidgets.includes('hubspot') && <section className="panel hubspot-panel"><div className="panel-heading"><div><p className="eyebrow">HubSpot funnel</p><h2>Commercial pulse</h2></div><span className="read-only-pill"><LockKeyhole size={12} /> Read-only</span></div><div className="funnel"><div className="funnel-row"><span>Contacts</span><strong>126</strong><div className="funnel-bar" style={{ width: '100%' }} /></div><div className="funnel-row"><span>Qualified leads</span><strong>31</strong><div className="funnel-bar" style={{ width: '68%' }} /></div><div className="funnel-row"><span>Open opportunities</span><strong>12</strong><div className="funnel-bar" style={{ width: '42%' }} /></div><div className="funnel-row"><span>Closed won</span><strong>$64k</strong><div className="funnel-bar orange-funnel" style={{ width: '24%' }} /></div></div><p className="data-note"><Database size={13} /> Deal value shown · not accounting revenue</p><button className="text-button" onClick={() => announce('Opening HubSpot is available once the connection is verified.')}>Open HubSpot <ExternalLink size={14} /></button></section>}
          </div>
        </section>
      </div>

      {selectedFinding && <div className="drawer-backdrop"><aside className="detail-drawer" aria-label="Finding details"><div className="drawer-top"><span className={`status-tag ${selectedFinding.status === 'Unreviewed' ? 'unreviewed' : 'reviewed'}`}>{selectedFinding.status}</span><button className="icon-button" onClick={() => setSelectedFinding(null)} aria-label="Close finding details"><X size={18} /></button></div><p className="eyebrow accent-eyebrow">{selectedFinding.category} · {selectedFinding.segment}</p><h2>{selectedFinding.title}</h2><p className="drawer-summary">{selectedFinding.summary}</p><div className="drawer-meta"><div><span>Source</span><strong>{selectedFinding.source}</strong></div><div><span>Collected</span><strong>{selectedFinding.collected}</strong></div></div><div className="drawer-section"><p className="eyebrow">Why it matters</p><p>{selectedFinding.implication}</p></div><div className="drawer-section"><p className="eyebrow">Suggested action</p><div className="action-card"><Sparkles size={16} /><span>{selectedFinding.action}</span><ArrowUpRight size={15} /></div></div><div className="evidence-card"><ShieldCheck size={17} /><div><strong>Evidence linked</strong><p>Reported fact and interpretation are separated. Open the original source before publishing.</p><button className="inline-link" onClick={() => announce('Source link is ready for the connected source.')}>View source <ExternalLink size={13} /></button></div></div><div className="drawer-actions"><button className="secondary-button" onClick={() => announce('Finding saved to your private research.')}>Save finding</button><button className="primary-button" onClick={() => announce('Added to the shared briefing queue.')}>Add to brief</button></div></aside></div>}

      {showCustomize && <div className="modal-backdrop"><section className="modal-card customize-modal"><div className="modal-heading"><div><p className="eyebrow accent-eyebrow">{activeView} view</p><h2>Customize dashboard</h2></div><button className="icon-button" onClick={() => setShowCustomize(false)} aria-label="Close customize dialog"><X size={18} /></button></div><p className="modal-copy">Choose the widgets that should be visible in this view. Your layout is personal until an admin publishes a shared dashboard.</p><div className="widget-options">{widgets.map(({ id, label, description, icon: Icon }) => <button key={id} className={`widget-option ${visibleWidgets.includes(id) ? 'enabled' : ''}`} onClick={() => toggleWidget(id)}><span className="widget-icon"><Icon size={17} /></span><span><strong>{label}</strong><small>{description}</small></span><span className={`toggle ${visibleWidgets.includes(id) ? 'on' : ''}`}><span /></span></button>)}</div><div className="modal-footer"><span><LockKeyhole size={14} /> Personal layout</span><button className="primary-button" onClick={() => { setShowCustomize(false); announce('Dashboard layout saved.'); }}><Check size={16} /> Save layout</button></div></section></div>}

      {showSettings && <div className="modal-backdrop"><section className="modal-card settings-modal"><div className="modal-heading"><div><p className="eyebrow accent-eyebrow">Admin settings</p><h2>Connections & access</h2></div><button className="icon-button" onClick={() => setShowSettings(false)} aria-label="Close settings dialog"><X size={18} /></button></div><div className="settings-section"><div className="settings-row"><span className="settings-symbol cyan"><KeyRound size={17} /></span><div><strong>Bring Your AI</strong><p>Add an API key and provider when you are ready. Connections stay inactive until tested.</p></div><button className="secondary-button small-button" onClick={() => announce('Bring Your AI setup is ready for provider mapping.')}>Configure</button></div><div className="settings-row"><span className="settings-symbol orange"><BriefcaseBusiness size={17} /></span><div><strong>HubSpot CRM</strong><p>Read-only account and pipeline data · 12 minute refresh</p></div><span className="connection-state pending">Not connected</span></div><div className="settings-row"><span className="settings-symbol navy"><BarChart3 size={17} /></span><div><strong>GA4 & Search Console</strong><p>Performance and search visibility · historical export available</p></div><span className="connection-state ready">Partially ready</span></div><div className="settings-row"><span className="settings-symbol cyan"><Mail size={17} /></span><div><strong>Morning digest</strong><p>6:00 a.m. Central · approved recipients only</p></div><span className="connection-state ready">Planned</span></div></div><div className="settings-footnote"><ShieldCheck size={15} /><span>Credentials are stored as protected runtime secrets. This dashboard never displays saved keys.</span></div></section></div>}

      {notice && <output className="toast"><Check size={16} /> {notice}</output>}
    </main>
  );
}
