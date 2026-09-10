'use client';

import { useMemo, useState } from 'react';
import { logoData } from './logo-data';
import {
  Activity,
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
  lens: string;
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
    id: 'f1', category: 'Market shift', lens: 'AI governance',
    title: 'AI governance guidance is moving from principles to operating practice',
    summary: 'New guidance is framing AI risk around ownership, evidence, and repeatable controls—not only policy statements.',
    source: 'NIST AI RMF / GenAI Profile', collected: 'Today · 05:42 CT', segment: 'Provable Vendor', status: 'Unreviewed', importance: 'High',
    implication: 'This is a strong education and executive-brief angle for technology buyers that need proof their controls operate in practice.', action: 'Create an executive brief',
  },
  {
    id: 'f2', category: 'Competitor', lens: 'Competitive landscape',
    title: 'Drata is positioning agent governance as an early-access product',
    summary: 'The public announcement emphasizes discovery, monitoring, and control for AI agents, with availability still described as early access.',
    source: 'Drata newsroom', collected: 'Today · 04:17 CT', segment: 'Provable Vendor', status: 'Unreviewed', importance: 'High',
    implication: 'The market is teaching buyers to expect visibility into AI systems. 3HUE can differentiate on operated readiness and evidence ownership.', action: 'Compare competitor positioning',
  },
  {
    id: 'f3', category: 'Account signal', lens: 'Account movement',
    title: 'A watched portfolio company added a security leadership role',
    summary: 'The role description references customer assurance and a more formal control environment.',
    source: 'HubSpot priority account + public job page', collected: 'Yesterday · 21:06 CT', segment: 'Portfolio', status: 'Reviewed', importance: 'High',
    implication: 'This may be a timing signal for a readiness conversation, but it is not proof of active buying intent.', action: 'Open account brief',
  },
  {
    id: 'f4', category: 'Content opportunity', lens: 'Buyer questions',
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

const lensOptions = ['All lenses', 'AI governance', 'Competitive landscape', 'Account movement', 'Buyer questions'];

function Metric({ label, value, detail, tone = 'cyan' }: { label: string; value: string; detail: string; tone?: 'cyan' | 'orange' | 'navy' }) {
  return <div className="metric-card"><div className={`metric-icon metric-${tone}`}><TrendingUp size={16} /></div><div><p className="eyebrow">{label}</p><p className="metric-value">{value}</p><p className="metric-detail">{detail}</p></div></div>;
}

function Sparkline({ values, color = '#12b8d4' }: { values: number[]; color?: string }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${32 - ((value - min) / Math.max(max - min, 1)) * 24}`).join(' ');
  return <svg className="sparkline" viewBox="0 0 100 36"><title>Trend line</title><path d="M0 32 H100" stroke="currentColor" strokeOpacity=".15" /><polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function Home() {
  const [activeView, setActiveView] = useState<View>('Director');
  const [activeNav, setActiveNav] = useState('Overview');
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [showCustomize, setShowCustomize] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPresent, setShowPresent] = useState(false);
  const [search, setSearch] = useState('');
  const [segment, setSegment] = useState('All segments');
  const [lens, setLens] = useState('All lenses');
  const [visibleWidgets, setVisibleWidgets] = useState(['briefing', 'signals', 'performance', 'coverage', 'content', 'hubspot']);
  const [briefQueue, setBriefQueue] = useState<string[]>([]);
  const [notice, setNotice] = useState('');

  const filteredFindings = useMemo(() => findings.filter((finding) => {
    const searchMatch = !search || `${finding.title} ${finding.summary} ${finding.source}`.toLowerCase().includes(search.toLowerCase());
    const segmentMatch = segment === 'All segments' || finding.segment === segment;
    const lensMatch = lens === 'All lenses' || finding.lens === lens;
    return searchMatch && segmentMatch && lensMatch;
  }), [search, segment, lens]);

  const briefingFindings = useMemo(() => {
    const queued = briefQueue.map((id) => findings.find((finding) => finding.id === id)).filter((finding): finding is Finding => Boolean(finding));
    return queued.length > 0 ? queued : filteredFindings.slice(0, 3);
  }, [briefQueue, filteredFindings]);

  const toggleWidget = (id: string) => setVisibleWidgets((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const announce = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(''), 2600); };
  const addToBrief = (finding: Finding) => {
    const alreadyQueued = briefQueue.includes(finding.id);
    setBriefQueue((current) => alreadyQueued ? current : [...current, finding.id]);
    announce(alreadyQueued ? 'This finding is already in your brief queue.' : 'Added to the shared briefing queue.');
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup"><img className="brand-image" src={logoData} alt="3HUE Executive Consulting" /><span className="brand-divider" aria-hidden="true" /><span className="brand-product-lockup"><span>MARKET</span><strong>INTEL</strong></span></div>
        <nav className="topnav" aria-label="Primary navigation">{navItems.map(({ label }) => <button key={label} className={`topnav-item ${activeNav === label ? 'active' : ''}`} onClick={() => setActiveNav(label)}>{label}{label === 'Research' && <span className="topnav-count">4</span>}</button>)}</nav>
        <div className="topbar-actions"><label className="top-search"><Search size={14} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search intelligence" aria-label="Search intelligence" /></label><button className="topbar-pill" onClick={() => announce('Guide content is ready for the connected workspace.')}>Guide</button><button className="topbar-pill saved-pill" onClick={() => setActiveNav('Briefs')}>Saved <span>{briefQueue.length || 0}</span></button><button className="topbar-pill" onClick={() => setShowSettings(true)}>Schedule</button><button className="topbar-pill topbar-present" onClick={() => setShowPresent(true)}>Present</button><button className="icon-button topbar-icon" aria-label="Notifications" onClick={() => announce('No new high-impact alerts.')}><Bell size={17} /></button><button className="user-chip" onClick={() => setShowSettings(true)}><span className="avatar">NB</span><ChevronDown size={14} /></button></div>
        <div className="mobile-actions"><button className="mobile-overflow-button" aria-label="Open workspace actions" onClick={() => setShowSettings(true)}><Menu size={18} /></button><button className="user-chip" onClick={() => setShowSettings(true)}><span className="avatar">NB</span><ChevronDown size={13} /></button></div>
      </header>

      <section className="context-bar" aria-label="Intelligence scope">
        <div className="context-title"><div className="context-title-line"><p className="eyebrow">Intelligence scope</p><div className="view-switcher" role="tablist" aria-label="Dashboard view">{(['Analyst', 'Director', 'C-suite'] as View[]).map((view) => <button key={view} className={`view-tab ${activeView === view ? 'active' : ''}`} onClick={() => setActiveView(view)} role="tab" aria-selected={activeView === view}>{view}</button>)}</div></div><strong>Markets 3HUE supports</strong></div>
        <div className="context-field"><span>ICP</span><strong>Loaded strategy</strong></div>
        <div className="context-field"><span>Last collection</span><strong>Today · 05:42 CT</strong></div>
        <div className="context-field"><span>Source health</span><strong><span className="status-dot" /> 6 healthy</strong></div>
        <button className="context-button" onClick={() => setShowSettings(true)}><Settings2 size={14} /> Configure scope</button>
      </section>

      <div className="builder-main">
        <section className="content-area">
          <div className="content-heading"><div><p className="eyebrow accent-eyebrow">{activeView} view · Wednesday, September 10, 2026</p><h1>Market intelligence</h1><p className="heading-subtitle">Evidence worth acting on across the markets 3HUE supports.</p><span className="preview-badge"><Activity size={13} /> Review mode · representative data</span></div><div className="heading-actions"><button className="secondary-button" onClick={() => setShowCustomize(true)}><SlidersHorizontal size={15} /> Customize</button><button className="primary-button" onClick={() => announce('Research request started. We will report source coverage when it completes.')}><Sparkles size={15} /> Ask for research</button></div></div>

          <div className="filter-row"><div className="search-box"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search findings, accounts, sources" aria-label="Search findings, accounts, sources" /></div><label className="select-wrap"><Filter size={14} /><select value={segment} onChange={(event) => setSegment(event.target.value)} aria-label="Filter by customer segment"><option>All segments</option><option>Provable Vendor</option><option>Portfolio</option><option>Regulated Operator</option></select><ChevronDown size={13} /></label><span className="filter-note"><Clock3 size={14} /> Next collection in 3h 42m</span></div>
          <div className="chip-row"><span className="chip-label">Market lenses</span>{lensOptions.map((option) => <button key={option} className={`filter-chip ${lens === option ? 'active' : ''}`} onClick={() => setLens(option)}>{option}</button>)}</div>

          <div className="metric-grid"><Metric label="New findings" value="18" detail="+6 since yesterday" tone="cyan" /><Metric label="Priority signals" value="4" detail="2 need review" tone="orange" /><Metric label="3HUE pipeline" value="$184k" detail="12 open opportunities" tone="navy" /><Metric label="Source coverage" value="86%" detail="2 blocked sources" tone="cyan" /></div>

          {visibleWidgets.includes('briefing') && <section className="builder-section"><div className="section-heading"><div><p className="eyebrow orange-eyebrow">Curated intelligence</p><h2>What matters today</h2></div><span className="section-count">{filteredFindings.length} findings</span></div><div className="curated-rail">{filteredFindings.slice(0, 3).map((finding, index) => <button key={finding.id} className={`curated-card ${index === 1 ? 'accent-orange' : ''}`} onClick={() => setSelectedFinding(finding)}><span className="card-accent" /><p className="eyebrow">{finding.category}</p><h3>{finding.title}</h3><p className="card-summary">{finding.summary}</p><div className="card-footer"><span>{finding.source}</span><span className="card-link">View <ArrowUpRight size={13} /></span></div></button>)}{filteredFindings.length === 0 && <div className="empty-state"><Search size={20} /><strong>No findings match those filters.</strong><span>Try another market lens or segment.</span></div>}</div></section>}

          {visibleWidgets.includes('signals') && <section className="builder-section"><div className="section-heading"><div><p className="eyebrow accent-eyebrow">Signal catalog</p><h2>Priority signals</h2></div><button className="text-button" onClick={() => setActiveNav('Research')}>View all <ArrowUpRight size={14} /></button></div><div className="signal-grid">{filteredFindings.map((finding) => <button key={finding.id} className="signal-card" onClick={() => setSelectedFinding(finding)}><div className="signal-card-top"><span className="eyebrow">{finding.category}</span><span className={`status-tag ${finding.status === 'Unreviewed' ? 'unreviewed' : 'reviewed'}`}>{finding.status}</span></div><h3>{finding.title}</h3><p>{finding.summary}</p><div className="signal-card-footer"><span>{finding.collected}</span><span className="signal-card-action">Details <ArrowUpRight size={13} /></span></div></button>)}</div></section>}

          <div className="builder-columns">
            {visibleWidgets.includes('performance') && <section className="panel performance-panel"><div className="panel-heading"><div><p className="eyebrow">3HUE performance</p><h2>Marketing signals</h2></div><span className="connected-pill"><span className="status-dot" /> Supplied snapshot</span></div><div className="performance-layout"><div className="performance-number"><p className="big-number">443</p><p className="metric-detail">active users · supplied 30-day snapshot</p><span className="trend-up"><TrendingUp size={14} /> 12.4%</span></div><Sparkline values={[18, 20, 18, 24, 31, 29, 42, 47, 51]} /></div><div className="performance-bars"><div><span>Organic sessions</span><strong>29</strong><div className="bar-track"><span style={{ width: '38%' }} /></div></div><div><span>New contacts</span><strong>18</strong><div className="bar-track orange-bar"><span style={{ width: '25%' }} /></div></div><div><span>Open pipeline</span><strong>$184k</strong><div className="bar-track navy-bar"><span style={{ width: '64%' }} /></div></div></div><button className="text-button" onClick={() => announce('Performance detail will open after the GA4 and HubSpot connections are verified.')}>Open performance detail <ArrowUpRight size={14} /></button></section>}

            {visibleWidgets.includes('coverage') && <section className="panel coverage-panel"><div className="panel-heading"><div><p className="eyebrow">Coverage health</p><h2>Can we trust today’s view?</h2></div><ShieldCheck size={20} className="cyan-icon" /></div><div className="coverage-score"><div className="score-ring"><span>86</span><small>%</small></div><div><strong>Healthy with gaps</strong><p>Most monitored sources refreshed successfully.</p></div></div><div className="coverage-list"><div className="coverage-row"><span className="status-dot" /> HubSpot CRM <em>Connected</em></div><div className="coverage-row"><span className="status-dot" /> GA4 <em>Connected</em></div><div className="coverage-row warning"><span className="warning-dot" /> Search Console <em>Historical export only</em></div><div className="coverage-row warning"><span className="warning-dot" /> 2 sources <em>Blocked by sign-in</em></div></div><button className="text-button" onClick={() => setActiveNav('Research')}>Review coverage gaps <ArrowUpRight size={14} /></button></section>}
          </div>

          <div className="builder-columns lower-columns">
            {visibleWidgets.includes('content') && <section className="panel content-panel"><div className="panel-heading"><div><p className="eyebrow">Content opportunities</p><h2>Questions worth answering</h2></div><FileText size={20} className="orange-icon" /></div><div className="content-opportunity"><span className="opportunity-rank">01</span><div><strong>Who owns AI evidence after deployment?</strong><p>Buyer question · Regulated Operator · recurring</p></div><button className="small-circle-button" aria-label="Create brief" onClick={() => announce('Brief draft started from this opportunity.')}><Plus size={16} /></button></div><div className="content-opportunity"><span className="opportunity-rank">02</span><div><strong>What does operated readiness change?</strong><p>Message gap · Provable Vendor · rising</p></div><button className="small-circle-button" aria-label="Create brief" onClick={() => announce('Brief draft started from this opportunity.')}><Plus size={16} /></button></div><button className="text-button" onClick={() => setActiveNav('Briefs')}>Open content queue <ArrowUpRight size={14} /></button></section>}

            {visibleWidgets.includes('hubspot') && <section className="panel hubspot-panel"><div className="panel-heading"><div><p className="eyebrow">HubSpot funnel</p><h2>Commercial pulse</h2></div><span className="read-only-pill"><LockKeyhole size={12} /> Read-only</span></div><div className="funnel"><div className="funnel-row"><span>Contacts</span><strong>126</strong><div className="funnel-bar" style={{ width: '100%' }} /></div><div className="funnel-row"><span>Qualified leads</span><strong>31</strong><div className="funnel-bar" style={{ width: '68%' }} /></div><div className="funnel-row"><span>Open opportunities</span><strong>12</strong><div className="funnel-bar" style={{ width: '42%' }} /></div><div className="funnel-row"><span>Closed won</span><strong>$64k</strong><div className="funnel-bar orange-funnel" style={{ width: '24%' }} /></div></div><p className="data-note"><Database size={13} /> Deal value shown · not accounting revenue</p><button className="text-button" onClick={() => announce('Opening HubSpot is available once the connection is verified.')}>Open HubSpot <ExternalLink size={14} /></button></section>}
          </div>
        </section>

        <aside className="brief-rail" aria-label="Research queue"><div className="rail-header"><div><p className="eyebrow">Research queue</p><h2>Shared briefing</h2></div><span className="rail-code">3HUE-MI</span></div><div className="rail-body">{briefQueue.length > 0 ? briefQueue.map((id) => { const finding = findings.find((item) => item.id === id); return finding ? <button key={id} className="rail-item" onClick={() => setSelectedFinding(finding)}><span className="rail-item-dot" /><span><strong>{finding.title}</strong><small>{finding.category} · ready to brief</small></span><ArrowUpRight size={14} /></button> : null; }) : <div className="rail-empty"><FileText size={27} /><strong>Your brief is empty.</strong><span>Add intelligence cards to build a focused briefing.</span></div>}<div className="rail-divider" /><div className="rail-help"><CircleHelp size={15} /><span>Sources and interpretations stay separate until reviewed.</span></div></div><div className="rail-footer"><button className="primary-button rail-primary" onClick={() => announce(briefQueue.length ? 'Brief draft opened with selected findings.' : 'Add a finding before opening a brief draft.')}>Open brief</button><button className="secondary-button rail-secondary" onClick={() => announce('Brief queue saved to your private workspace.')}>Save queue</button></div></aside>
      </div>

      {selectedFinding && <div className="drawer-backdrop"><aside className="detail-drawer" aria-label="Finding details"><div className="drawer-hero"><div><p className="eyebrow">{selectedFinding.category} · {selectedFinding.segment}</p><h2>{selectedFinding.title}</h2><p className="drawer-code">{selectedFinding.source} · {selectedFinding.collected}</p></div><button className="drawer-close" onClick={() => setSelectedFinding(null)} aria-label="Close finding details"><X size={19} /></button></div><div className="drawer-body"><p className="drawer-summary">{selectedFinding.summary}</p><div className="drawer-section"><div className="drawer-section-heading"><p className="eyebrow">What’s included</p></div><ul className="drawer-checklist"><li><Check size={16} />Reported fact and source context</li><li><Check size={16} />Implication for {selectedFinding.segment.toLowerCase()} buyers</li><li><Check size={16} />Recommended marketing response</li><li><Check size={16} />Freshness and confidence markers</li></ul></div><div className="drawer-section"><div className="drawer-section-heading"><p className="eyebrow">Why it matters</p></div><p className="drawer-copy">{selectedFinding.implication}</p></div><div className="drawer-section"><div className="drawer-section-heading"><p className="eyebrow">Market context</p></div><div className="drawer-chips"><span>{selectedFinding.lens}</span><span>{selectedFinding.segment}</span><span>{selectedFinding.importance} priority</span></div></div><div className="drawer-section"><div className="drawer-section-heading"><p className="eyebrow">Evidence</p></div><div className="evidence-card"><ShieldCheck size={17} /><div><strong>{selectedFinding.source}</strong><p>Reported fact and interpretation are separated. Open the original source before publishing.</p><button className="inline-link" onClick={() => announce('Source link is ready for the connected source.')}>View source <ExternalLink size={13} /></button></div></div></div><div className="drawer-section"><div className="drawer-section-heading"><p className="eyebrow">Suggested action</p></div><button className="action-card" onClick={() => announce(`${selectedFinding.action} started.`)}><Sparkles size={16} /><span>{selectedFinding.action}</span><ArrowUpRight size={15} /></button></div><div className="drawer-actions"><button className="secondary-button" onClick={() => announce('Finding saved to your private research.')}>Save finding</button><button className="primary-button" onClick={() => addToBrief(selectedFinding)}>Add to brief</button></div></div></aside></div>}

      {showCustomize && <div className="modal-backdrop"><section className="modal-card customize-modal"><div className="modal-heading"><div><p className="eyebrow accent-eyebrow">{activeView} view</p><h2>Customize dashboard</h2></div><button className="icon-button" onClick={() => setShowCustomize(false)} aria-label="Close customize dialog"><X size={18} /></button></div><p className="modal-copy">Choose the intelligence panels visible in this view. Your layout is personal until an admin publishes a shared dashboard.</p><div className="widget-options">{widgets.map(({ id, label, description, icon: Icon }) => <button key={id} className={`widget-option ${visibleWidgets.includes(id) ? 'enabled' : ''}`} onClick={() => toggleWidget(id)}><span className="widget-icon"><Icon size={17} /></span><span><strong>{label}</strong><small>{description}</small></span><span className={`toggle ${visibleWidgets.includes(id) ? 'on' : ''}`}><span /></span></button>)}</div><div className="modal-footer"><span><LockKeyhole size={14} /> Personal layout</span><button className="primary-button" onClick={() => { setShowCustomize(false); announce('Dashboard layout saved.'); }}><Check size={16} /> Save layout</button></div></section></div>}

      {showPresent && <div className="modal-backdrop presentation-backdrop"><section className="presentation-modal" aria-label="Presentation view"><div className="presentation-header"><div><p className="eyebrow accent-eyebrow">3HUE market intel · {activeView} view</p><h2>Shared briefing</h2><p>Read-only presentation of the intelligence selected for this workspace.</p></div><button className="drawer-close" onClick={() => setShowPresent(false)} aria-label="Close presentation view"><X size={19} /></button></div><div className="presentation-meta"><span><Clock3 size={14} /> Collected today · 05:42 CT</span><span><ShieldCheck size={14} /> Representative data</span><span>{briefingFindings.length} findings</span></div><div className="presentation-grid">{briefingFindings.map((finding) => <article key={finding.id} className="presentation-card"><p className="eyebrow">{finding.category}</p><h3>{finding.title}</h3><p>{finding.summary}</p><div><span>{finding.source}</span><span>{finding.collected}</span></div></article>)}</div><div className="presentation-footer"><span>Sources and interpretations stay separate until reviewed.</span><button className="secondary-button" onClick={() => setShowPresent(false)}>Return to workspace</button></div></section></div>}

      {showSettings && <div className="modal-backdrop"><section className="modal-card settings-modal"><div className="modal-heading"><div><p className="eyebrow accent-eyebrow">Admin settings</p><h2>Connections & access</h2></div><button className="icon-button" onClick={() => setShowSettings(false)} aria-label="Close settings dialog"><X size={18} /></button></div><div className="settings-section"><div className="settings-row"><span className="settings-symbol cyan"><KeyRound size={17} /></span><div><strong>Bring Your AI</strong><p>Add an API key and provider when you are ready. Connections stay inactive until tested.</p></div><button className="secondary-button small-button" onClick={() => announce('Bring Your AI setup is ready for provider mapping.')}>Configure</button></div><div className="settings-row"><span className="settings-symbol orange"><BriefcaseBusiness size={17} /></span><div><strong>HubSpot CRM</strong><p>Read-only account and pipeline data · 12 minute refresh</p></div><span className="connection-state pending">Not connected</span></div><div className="settings-row"><span className="settings-symbol navy"><BarChart3 size={17} /></span><div><strong>GA4 & Search Console</strong><p>Performance and search visibility · historical export available</p></div><span className="connection-state ready">Partially ready</span></div><div className="settings-row"><span className="settings-symbol cyan"><Clock3 size={17} /></span><div><strong>Collection cadence</strong><p>Market, buyer, and account watch refreshes every 4 hours · next collection in 3h 42m</p></div><span className="connection-state ready">Every 4 hours</span></div><div className="settings-row"><span className="settings-symbol cyan"><Mail size={17} /></span><div><strong>Morning digest</strong><p>6:00 a.m. Central · approved recipients only</p></div><span className="connection-state ready">Planned</span></div></div><div className="settings-footnote"><ShieldCheck size={15} /><span>Credentials are stored as protected runtime secrets. This dashboard never displays saved keys.</span></div></section></div>}

      {notice && <output className="toast"><Check size={16} /> {notice}</output>}
    </main>
  );
}
