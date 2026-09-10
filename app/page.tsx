'use client';

import { useEffect, useMemo, useState } from 'react';
import { logoData } from './logo-data';
import {
  Activity,
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Database,
  DatabaseZap,
  ExternalLink,
  FileText,
  Filter,
  Globe2,
  KeyRound,
  LineChart,
  LockKeyhole,
  Menu,
  Play,
  Plus,
  Search,
  RefreshCw,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';

type View = 'Analyst' | 'Director' | 'C-suite';
type ViewSection = 'evidence' | 'signals' | 'coverage' | 'content' | 'performance' | 'hubspot' | 'impact' | 'watchlist';
type ViewAction = 'research' | 'review' | 'tag' | 'save' | 'brief' | 'approve' | 'hold' | 'schedule' | 'acknowledge' | 'present' | 'drilldown';
type ViewMetric = { id: string; label: string; detail: string; tone: 'cyan' | 'orange' | 'navy' };
type ViewProfile = {
  eyebrow: string;
  title: string;
  subtitle: string;
  density: 'dense' | 'standard' | 'compact';
  metrics: ViewMetric[];
  sections: ViewSection[];
  actions: ViewAction[];
  defaultWidgets: string[];
};
type FindingWorkflow = {
  reviewState: 'Unreviewed' | 'Reviewed';
  decisionState: 'Pending' | 'Approved' | 'Held';
  saved: boolean;
  tags: string[];
  lastAction?: string;
};
type IcpProfile = {
  id: string;
  hue: string;
  name: string;
  tagline: string;
  description: string;
  signal: string;
  color: 'cyan' | 'orange' | 'navy';
};
type AdminTab = 'overview' | 'sources' | 'watchlists' | 'runs';
type SourceStatus = 'Connected' | 'Partially ready' | 'Connector pending' | 'Manual import' | 'Not connected';

type SourceConnection = {
  id: string;
  name: string;
  category: string;
  description: string;
  status: SourceStatus;
  lastRefresh: string;
  coverage: string;
};

type ResearchRun = {
  id: string;
  label: string;
  source: string;
  started: string;
  status: 'Complete' | 'Partial' | 'Queued';
  findings: string;
};

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

const viewProfiles: Record<View, ViewProfile> = {
  Analyst: {
    eyebrow: 'Evidence workbench',
    title: 'Evidence workbench',
    subtitle: 'Investigate, validate, and prepare intelligence before it becomes a decision.',
    density: 'dense',
    metrics: [
      { id: 'new-findings', label: 'New findings', detail: '+6 since yesterday', tone: 'cyan' },
      { id: 'unreviewed', label: 'Unreviewed', detail: 'Needs evidence review', tone: 'orange' },
      { id: 'coverage', label: 'Evidence coverage', detail: '2 blocked sources', tone: 'cyan' },
      { id: 'saved', label: 'Saved findings', detail: 'Ready for team review', tone: 'navy' },
    ],
    sections: ['evidence', 'signals', 'coverage', 'content'],
    actions: ['research', 'review', 'tag', 'save', 'brief'],
    defaultWidgets: ['briefing', 'signals', 'coverage', 'content'],
  },
  Director: {
    eyebrow: 'Operating scorecard',
    title: 'Market intelligence',
    subtitle: 'Prioritize movement, coordinate action, and prepare approved executive briefs.',
    density: 'standard',
    metrics: [
      { id: 'priority', label: 'Priority signals', detail: '2 need review', tone: 'orange' },
      { id: 'icp-movement', label: 'ICP movement', detail: '3 watched segments', tone: 'cyan' },
      { id: 'pipeline', label: '3HUE pipeline', detail: '12 open opportunities', tone: 'navy' },
      { id: 'coverage', label: 'Source coverage', detail: '2 blocked sources', tone: 'cyan' },
    ],
    sections: ['evidence', 'signals', 'performance', 'hubspot', 'content', 'coverage'],
    actions: ['research', 'review', 'approve', 'hold', 'brief', 'schedule'],
    defaultWidgets: ['briefing', 'signals', 'performance', 'coverage', 'content', 'hubspot'],
  },
  'C-suite': {
    eyebrow: 'Decision brief',
    title: 'Executive decision brief',
    subtitle: 'Understand validated movement, business impact, risks, and recommended decisions quickly.',
    density: 'compact',
    metrics: [
      { id: 'market-shifts', label: 'Market shifts', detail: '3 validated today', tone: 'cyan' },
      { id: 'business-impact', label: 'Business impact', detail: '2 signals to decide', tone: 'orange' },
      { id: 'pipeline-exposure', label: 'Pipeline exposure', detail: '$184k open pipeline', tone: 'navy' },
      { id: 'confidence', label: 'Evidence confidence', detail: 'Healthy with gaps', tone: 'cyan' },
    ],
    sections: ['impact', 'watchlist', 'hubspot', 'coverage'],
    actions: ['drilldown', 'acknowledge', 'save', 'present'],
    defaultWidgets: ['briefing', 'performance', 'hubspot', 'coverage'],
  },
};

const initialWorkflowByFindingId: Record<string, FindingWorkflow> = findings.reduce((workflow, finding) => {
  workflow[finding.id] = { reviewState: finding.status, decisionState: 'Pending', saved: false, tags: [] };
  return workflow;
}, {} as Record<string, FindingWorkflow>);

const widgets = [
  { id: 'briefing', label: "Today's briefing", description: 'Fresh findings and actions', icon: Sparkles },
  { id: 'signals', label: 'Priority signals', description: 'Accounts and competitors', icon: Activity },
  { id: 'performance', label: '3HUE performance', description: 'Web, search, and CRM', icon: LineChart },
  { id: 'coverage', label: 'Coverage health', description: 'Sources and collection', icon: ShieldCheck },
  { id: 'content', label: 'Content opportunities', description: 'Questions worth answering', icon: FileText },
  { id: 'hubspot', label: 'HubSpot funnel', description: 'Read-only CRM rollup', icon: BriefcaseBusiness },
];

const lensOptions = ['All lenses', 'AI governance', 'Competitive landscape', 'Account movement', 'Buyer questions'];

const sourceConnections: SourceConnection[] = [
  { id: 'hubspot', name: 'HubSpot CRM', category: 'Revenue', description: 'Read-only accounts, contacts, pipeline, and lifecycle context.', status: 'Connected', lastRefresh: '12 min ago', coverage: '126 contacts · 12 opportunities' },
  { id: 'ga4', name: 'Google Analytics 4', category: 'Performance', description: 'Web activity and conversion signals for the 3HUE site.', status: 'Connected', lastRefresh: '28 min ago', coverage: '30-day supplied snapshot' },
  { id: 'search-console', name: 'Search Console', category: 'Search', description: 'Query, page, and visibility trends for organic discovery.', status: 'Partially ready', lastRefresh: 'Historical export', coverage: 'Historical queries only' },
  { id: 'ubersuggest', name: 'Ubersuggest', category: 'Search', description: 'Keyword demand, competitor gaps, and content opportunities.', status: 'Manual import', lastRefresh: 'No refresh yet', coverage: 'Import CSV or report' },
  { id: 'youtube', name: 'YouTube', category: 'Content', description: 'Channel, video, and audience signals for owned content.', status: 'Connector pending', lastRefresh: 'No refresh yet', coverage: 'Channel authorization required' },
  { id: 'vidiq', name: 'vidIQ', category: 'Content', description: 'Video demand, keyword scores, and competitive channel context.', status: 'Connector pending', lastRefresh: 'No refresh yet', coverage: 'Provider authorization required' },
  { id: 'linkedin', name: 'LinkedIn', category: 'Social', description: 'Company, post, and conversation signals for market movement.', status: 'Not connected', lastRefresh: 'No refresh yet', coverage: 'Account access required' },
  { id: 'reddit', name: 'Reddit', category: 'Social', description: 'Unfiltered buyer language and emerging problem themes.', status: 'Not connected', lastRefresh: 'No refresh yet', coverage: 'Account access required' },
  { id: 'tiktok', name: 'TikTok', category: 'Social', description: 'Short-form topic velocity and audience language.', status: 'Not connected', lastRefresh: 'No refresh yet', coverage: 'Account access required' },
  { id: 'bring-your-ai', name: 'Bring Your AI', category: 'Intelligence', description: 'Provider key and model routing for approved research workflows.', status: 'Not connected', lastRefresh: 'No refresh yet', coverage: 'Provider mapping required' },
];

const initialWatchlists = [
  { id: 'wl-1', name: 'ICP: Provable Vendor', detail: 'AI-native vendors that need customer assurance evidence', sources: 'Search · LinkedIn · HubSpot' },
  { id: 'wl-2', name: 'ICP: Portfolio', detail: 'Portfolio companies entering a more formal control environment', sources: 'HubSpot · Jobs · Public web' },
  { id: 'wl-3', name: 'ICP: Regulated Operator', detail: 'Operators whose AI use creates evidence and governance pressure', sources: 'Search · Reddit · YouTube' },
  { id: 'wl-4', name: 'AI governance / customer assurance', detail: 'Market language around ownership, proof, and operating readiness', sources: 'Search · News · Social' },
  { id: 'wl-5', name: '3HUE competitors', detail: 'Positioning, product movement, and buyer-facing claims', sources: 'Public web · YouTube · LinkedIn' },
];

const initialResearchRuns: ResearchRun[] = [
  { id: 'run-1', label: 'Morning market collection', source: 'Search · CRM · public web', started: 'Today · 05:42 CT', status: 'Complete', findings: '18 findings' },
  { id: 'run-2', label: 'Competitor positioning refresh', source: 'Public web · YouTube', started: 'Yesterday · 17:32 CT', status: 'Partial', findings: '6 findings · 2 blocked sources' },
  { id: 'run-3', label: 'Next scheduled collection', source: 'All approved watchlists', started: 'In 3h 42m', status: 'Queued', findings: 'Awaiting run' },
];

const icpProfiles: IcpProfile[] = [
  { id: 'provable-vendor', hue: 'HUE 01', name: 'Provable Vendor', tagline: 'Proof creates trust', description: 'AI-native vendors that need customer assurance evidence to win and retain enterprise buyers.', signal: 'AI governance language rising', color: 'cyan' },
  { id: 'portfolio', hue: 'HUE 02', name: 'Portfolio', tagline: 'Readiness creates timing', description: 'Portfolio companies entering a more formal control environment or preparing for a growth event.', signal: 'Security leadership movement', color: 'orange' },
  { id: 'regulated-operator', hue: 'HUE 03', name: 'Regulated Operator', tagline: 'Evidence creates confidence', description: 'Operators whose AI use creates pressure around ownership, controls, and customer-facing proof.', signal: 'Buyer questions recurring', color: 'navy' },
];

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
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [showCustomize, setShowCustomize] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPresent, setShowPresent] = useState(false);
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');
  const [sourceFilter, setSourceFilter] = useState('All sources');
  const [watchlistDraft, setWatchlistDraft] = useState('');
  const [watchlistItems, setWatchlistItems] = useState(initialWatchlists);
  const [researchRuns, setResearchRuns] = useState(initialResearchRuns);
  const [search, setSearch] = useState('');
  const [segment, setSegment] = useState('All segments');
  const [lens, setLens] = useState('All lenses');
  const [visibleWidgetsByView, setVisibleWidgetsByView] = useState<Record<View, string[]>>({
    Analyst: viewProfiles.Analyst.defaultWidgets,
    Director: viewProfiles.Director.defaultWidgets,
    'C-suite': viewProfiles['C-suite'].defaultWidgets,
  });
  const [workflowByFindingId, setWorkflowByFindingId] = useState(initialWorkflowByFindingId);
  const [briefQueue, setBriefQueue] = useState<string[]>([]);
  const [activeIcpIndex, setActiveIcpIndex] = useState(0);
  const [icpPaused, setIcpPaused] = useState(false);
  const [notice, setNotice] = useState('');

  const activeProfile = viewProfiles[activeView];
  const visibleWidgets = visibleWidgetsByView[activeView];

  useEffect(() => {
    if (icpPaused) return;
    const timer = window.setInterval(() => {
      setActiveIcpIndex((current) => (current + 1) % icpProfiles.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [icpPaused]);

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

  const toggleWidget = (id: string) => setVisibleWidgetsByView((current) => ({
    ...current,
    [activeView]: current[activeView].includes(id) ? current[activeView].filter((item) => item !== id) : [...current[activeView], id],
  }));
  const announce = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(''), 2600); };
  const workflowFor = (finding: Finding) => workflowByFindingId[finding.id] ?? { reviewState: finding.status, decisionState: 'Pending' as const, saved: false, tags: [] };
  const updateWorkflow = (finding: Finding, patch: Partial<FindingWorkflow>, message: string) => {
    setWorkflowByFindingId((current) => ({ ...current, [finding.id]: { ...workflowFor(finding), ...patch, lastAction: message } }));
    announce(message);
  };
  const hasAction = (action: ViewAction) => activeProfile.actions.includes(action);
  const hasSection = (section: ViewSection) => activeProfile.sections.includes(section);
  const metricValue = (metricId: string) => {
    if (metricId === 'new-findings') return String(filteredFindings.length + 14);
    if (metricId === 'unreviewed') return String(Object.values(workflowByFindingId).filter((item) => item.reviewState === 'Unreviewed').length);
    if (metricId === 'saved') return String(Object.values(workflowByFindingId).filter((item) => item.saved).length);
    if (metricId === 'market-shifts') return String(filteredFindings.filter((finding) => finding.category === 'Market shift' || finding.category === 'Competitor').length);
    if (metricId === 'business-impact') return String(filteredFindings.filter((finding) => finding.importance === 'High').length);
    if (metricId === 'confidence') return '86%';
    if (metricId === 'icp-movement') return '3';
    if (metricId === 'pipeline' || metricId === 'pipeline-exposure') return '$184k';
    if (metricId === 'priority') return String(filteredFindings.filter((finding) => finding.importance === 'High').length);
    if (metricId === 'coverage') return '86%';
    return '—';
  };
  const openAdmin = (tab: AdminTab = 'overview') => { setAdminTab(tab); setShowSettings(true); };
  const filteredSources = sourceConnections.filter((source) => sourceFilter === 'All sources' || source.category === sourceFilter);
  const statusClass = (status: SourceStatus) => status === 'Connected' ? 'connected' : status === 'Partially ready' ? 'partial' : status === 'Manual import' ? 'manual' : status === 'Connector pending' ? 'pending' : 'offline';
  const queueResearchRun = () => {
    const run: ResearchRun = { id: `run-${Date.now()}`, label: 'On-demand intelligence collection', source: 'Approved watchlists', started: 'Queued just now', status: 'Queued', findings: 'Awaiting run' };
    setResearchRuns((current) => [run, ...current]);
    setAdminTab('runs');
    announce('Research run queued. Source coverage will be reported when it completes.');
  };
  const addWatchlist = () => {
    const name = watchlistDraft.trim();
    if (!name) { announce('Enter a watchlist name first.'); return; }
    setWatchlistItems((current) => [...current, { id: `wl-${Date.now()}`, name, detail: 'New local watchlist · configure sources and audience context next', sources: 'Needs source selection' }]);
    setWatchlistDraft('');
    announce('Watchlist saved locally in this preview.');
  };
  const addToBrief = (finding: Finding) => {
    const alreadyQueued = briefQueue.includes(finding.id);
    setBriefQueue((current) => alreadyQueued ? current : [...current, finding.id]);
    announce(alreadyQueued ? 'This finding is already in your brief queue.' : 'Added to the shared briefing queue.');
  };
  const goToIcp = (direction: number) => {
    setActiveIcpIndex((current) => (current + direction + icpProfiles.length) % icpProfiles.length);
  };
  const selectedWorkflow = selectedFinding ? workflowFor(selectedFinding) : null;

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup"><img className="brand-image" src={logoData} alt="3HUE Executive Consulting" /><span className="brand-divider" aria-hidden="true" /><span className="brand-product-lockup"><span>MARKET</span><strong>INTEL</strong></span></div>
        <nav className="topnav" aria-label="Dashboard view" role="tablist">{(['Analyst', 'Director', 'C-suite'] as View[]).map((view) => <button key={view} className={`topnav-item ${activeView === view ? 'active' : ''}`} onClick={() => setActiveView(view)} role="tab" aria-selected={activeView === view}>{view}</button>)}</nav>
        <div className="topbar-actions"><label className="top-search"><Search size={14} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search intelligence" aria-label="Search intelligence" /></label><button className="topbar-pill" onClick={() => announce('Guide content is ready for the connected workspace.')}>Guide</button><button className="topbar-pill saved-pill" onClick={() => announce('Saved briefing queue is ready.')}>Saved <span>{briefQueue.length || 0}</span></button><button className="topbar-pill" onClick={() => openAdmin('runs')}>Schedule</button><button className="topbar-pill topbar-present" onClick={() => setShowPresent(true)}>Present</button><button className="icon-button topbar-icon" aria-label="Notifications" onClick={() => announce('No new high-impact alerts.')}><Bell size={17} /></button><button className="user-chip" title="Admin intelligence center" aria-label="Open admin intelligence center" onClick={() => openAdmin()}><span className="avatar">NB</span><ChevronDown size={14} /></button></div>
        <div className="mobile-actions"><button className="mobile-overflow-button" aria-label="Open workspace actions" onClick={() => openAdmin()}><Menu size={18} /></button><button className="user-chip" title="Admin intelligence center" aria-label="Open admin intelligence center" onClick={() => openAdmin()}><span className="avatar">NB</span><ChevronDown size={13} /></button></div>
      </header>

      <section className="context-bar" aria-label="Market context">
        <div className="context-title"><strong>Markets 3HUE supports</strong></div>
        <div className="context-field"><span>ICP</span><strong>Loaded strategy</strong></div>
        <div className="context-field"><span>Last collection</span><strong>Today · 05:42 CT</strong></div>
        <div className="context-field"><span>Source health</span><strong><span className="status-dot" /> 6 healthy</strong></div>
        <button className="context-button" onClick={() => setShowSettings(true)}><Settings2 size={14} /> Configure scope</button>
      </section>

      <div className="builder-main">
        <section className="content-area">
          <div className="content-heading"><div><p className="eyebrow accent-eyebrow">{activeProfile.eyebrow} · {activeView} view · Wednesday, September 10, 2026</p><h1>{activeProfile.title}</h1><p className="heading-subtitle">{activeProfile.subtitle}</p><span className="preview-badge"><Activity size={13} /> Review mode · representative data</span></div><div className="heading-actions"><button className="secondary-button" onClick={() => setShowCustomize(true)}><SlidersHorizontal size={15} /> Customize</button>{hasAction('research') && <button className="primary-button" onClick={() => announce('Research request started. We will report source coverage when it completes.')}><Sparkles size={15} /> Ask for research</button>}{hasAction('schedule') && <button className="primary-button" onClick={() => openAdmin('runs')}><Clock3 size={15} /> Schedule collection</button>}{hasAction('present') && <button className="primary-button" onClick={() => setShowPresent(true)}><ArrowUpRight size={15} /> Present brief</button>}</div></div>

          <div className="filter-row"><div className="search-box"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search findings, accounts, sources" aria-label="Search findings, accounts, sources" /></div><label className="select-wrap"><Filter size={14} /><select value={segment} onChange={(event) => setSegment(event.target.value)} aria-label="Filter by customer segment"><option>All segments</option><option>Provable Vendor</option><option>Portfolio</option><option>Regulated Operator</option></select><ChevronDown size={13} /></label><span className="filter-note"><Clock3 size={14} /> Next collection in 3h 42m</span></div>
          <div className="chip-row"><span className="chip-label">Market lenses</span>{lensOptions.map((option) => <button key={option} className={`filter-chip ${lens === option ? 'active' : ''}`} onClick={() => setLens(option)}>{option}</button>)}</div>

          <div className={`view-workspace view-workspace-${activeView.toLowerCase().replace('-', '')} density-${activeProfile.density}`}>
          <div className="metric-grid">{activeProfile.metrics.map((metric) => <Metric key={metric.id} label={metric.label} value={metricValue(metric.id)} detail={metric.detail} tone={metric.tone} />)}</div>

          {activeView === 'Director' && <>

          {visibleWidgets.includes('briefing') && <section className="builder-section"><div className="section-heading"><div><p className="eyebrow orange-eyebrow">Curated intelligence</p><h2>What matters today</h2></div><span className="section-count">{filteredFindings.length} findings</span></div><div className="curated-rail">{filteredFindings.slice(0, 3).map((finding, index) => <button key={finding.id} className={`curated-card ${index === 1 ? 'accent-orange' : ''}`} onClick={() => setSelectedFinding(finding)}><span className="card-accent" /><p className="eyebrow">{finding.category}</p><h3>{finding.title}</h3><p className="card-summary">{finding.summary}</p><div className="card-footer"><span>{finding.source}</span><span className="card-link">View <ArrowUpRight size={13} /></span></div></button>)}{filteredFindings.length === 0 && <div className="empty-state"><Search size={20} /><strong>No findings match those filters.</strong><span>Try another market lens or segment.</span></div>}</div></section>}

          {visibleWidgets.includes('signals') && <section className="builder-section"><div className="section-heading"><div><p className="eyebrow accent-eyebrow">Signal catalog</p><h2>Priority signals</h2></div><button className="text-button" onClick={() => announce('The full signal catalog is ready for review.')}>View all <ArrowUpRight size={14} /></button></div><div className="signal-grid">{filteredFindings.map((finding) => { const workflow = workflowFor(finding); return <button key={finding.id} className="signal-card" onClick={() => setSelectedFinding(finding)}><div className="signal-card-top"><span className="eyebrow">{finding.category}</span><span className={`status-tag ${workflow.reviewState === 'Unreviewed' ? 'unreviewed' : 'reviewed'}`}>{workflow.reviewState}</span></div><h3>{finding.title}</h3><p>{finding.summary}</p><div className="signal-card-footer"><span>{finding.collected}</span><span className="signal-card-action">Details <ArrowUpRight size={13} /></span></div></button>; })}</div></section>}

          <div className="builder-columns">
            {visibleWidgets.includes('performance') && <section className="panel performance-panel"><div className="panel-heading"><div><p className="eyebrow">3HUE performance</p><h2>Marketing signals</h2></div><span className="connected-pill"><span className="status-dot" /> Supplied snapshot</span></div><div className="performance-layout"><div className="performance-number"><p className="big-number">443</p><p className="metric-detail">active users · supplied 30-day snapshot</p><span className="trend-up"><TrendingUp size={14} /> 12.4%</span></div><Sparkline values={[18, 20, 18, 24, 31, 29, 42, 47, 51]} /></div><div className="performance-bars"><div><span>Organic sessions</span><strong>29</strong><div className="bar-track"><span style={{ width: '38%' }} /></div></div><div><span>New contacts</span><strong>18</strong><div className="bar-track orange-bar"><span style={{ width: '25%' }} /></div></div><div><span>Open pipeline</span><strong>$184k</strong><div className="bar-track navy-bar"><span style={{ width: '64%' }} /></div></div></div><button className="text-button" onClick={() => announce('Performance detail will open after the GA4 and HubSpot connections are verified.')}>Open performance detail <ArrowUpRight size={14} /></button></section>}

            {visibleWidgets.includes('coverage') && <section className="panel coverage-panel"><div className="panel-heading"><div><p className="eyebrow">Coverage health</p><h2>Can we trust today’s view?</h2></div><ShieldCheck size={20} className="cyan-icon" /></div><div className="coverage-score"><div className="score-ring"><span>86</span><small>%</small></div><div><strong>Healthy with gaps</strong><p>Most monitored sources refreshed successfully.</p></div></div><div className="coverage-list"><div className="coverage-row"><span className="status-dot" /> HubSpot CRM <em>Connected</em></div><div className="coverage-row"><span className="status-dot" /> GA4 <em>Connected</em></div><div className="coverage-row warning"><span className="warning-dot" /> Search Console <em>Historical export only</em></div><div className="coverage-row warning"><span className="warning-dot" /> 2 sources <em>Blocked by sign-in</em></div></div><button className="text-button" onClick={() => announce('Coverage gaps are ready for review.')}>Review coverage gaps <ArrowUpRight size={14} /></button></section>}
          </div>

          <div className="builder-columns lower-columns">
            {visibleWidgets.includes('content') && <section className="panel content-panel"><div className="panel-heading"><div><p className="eyebrow">Content opportunities</p><h2>Questions worth answering</h2></div><FileText size={20} className="orange-icon" /></div><div className="content-opportunity"><span className="opportunity-rank">01</span><div><strong>Who owns AI evidence after deployment?</strong><p>Buyer question · Regulated Operator · recurring</p></div><button className="small-circle-button" aria-label="Create brief" onClick={() => announce('Brief draft started from this opportunity.')}><Plus size={16} /></button></div><div className="content-opportunity"><span className="opportunity-rank">02</span><div><strong>What does operated readiness change?</strong><p>Message gap · Provable Vendor · rising</p></div><button className="small-circle-button" aria-label="Create brief" onClick={() => announce('Brief draft started from this opportunity.')}><Plus size={16} /></button></div><button className="text-button" onClick={() => announce('Content queue is ready for review.')}>Open content queue <ArrowUpRight size={14} /></button></section>}

            {visibleWidgets.includes('hubspot') && <section className="panel hubspot-panel"><div className="panel-heading"><div><p className="eyebrow">HubSpot funnel</p><h2>Commercial pulse</h2></div><span className="read-only-pill"><LockKeyhole size={12} /> Read-only</span></div><div className="funnel"><div className="funnel-row"><span>Contacts</span><strong>126</strong><div className="funnel-bar" style={{ width: '100%' }} /></div><div className="funnel-row"><span>Qualified leads</span><strong>31</strong><div className="funnel-bar" style={{ width: '68%' }} /></div><div className="funnel-row"><span>Open opportunities</span><strong>12</strong><div className="funnel-bar" style={{ width: '42%' }} /></div><div className="funnel-row"><span>Closed won</span><strong>$64k</strong><div className="funnel-bar orange-funnel" style={{ width: '24%' }} /></div></div><p className="data-note"><Database size={13} /> Deal value shown · not accounting revenue</p><button className="text-button" onClick={() => announce('Opening HubSpot is available once the connection is verified.')}>Open HubSpot <ExternalLink size={14} /></button></section>}
          </div>
          </>}

          {activeView === 'Analyst' && <div className="role-view analyst-view">
            {visibleWidgets.includes('briefing') && <section className="builder-section analyst-evidence-section"><div className="section-heading"><div><p className="eyebrow orange-eyebrow">Fresh evidence</p><h2>Investigate before you publish</h2></div><span className="section-count">{filteredFindings.length} findings</span></div><div className="curated-rail">{filteredFindings.slice(0, 3).map((finding, index) => { const workflow = workflowFor(finding); return <button key={finding.id} className={`curated-card analyst-card ${index === 1 ? 'accent-orange' : ''}`} onClick={() => setSelectedFinding(finding)}><span className="card-accent" /><div className="analyst-card-meta"><span className="eyebrow">{finding.category}</span><span className={`status-tag ${workflow.reviewState === 'Unreviewed' ? 'unreviewed' : 'reviewed'}`}>{workflow.reviewState}</span></div><h3>{finding.title}</h3><p className="card-summary">{finding.summary}</p><div className="analyst-evidence-meta"><span>{finding.source}</span><span>{finding.collected}</span><span>{workflow.decisionState}</span></div></button>; })}{filteredFindings.length === 0 && <div className="empty-state"><Search size={20} /><strong>No findings match those filters.</strong><span>Try another market lens or segment.</span></div>}</div></section>}
            {visibleWidgets.includes('signals') && <section className="builder-section"><div className="section-heading"><div><p className="eyebrow accent-eyebrow">Signal catalog</p><h2>Evidence to review</h2></div><button className="text-button" onClick={() => announce('The full evidence catalog is ready for review.')}>View all <ArrowUpRight size={14} /></button></div><div className="signal-grid">{filteredFindings.map((finding) => { const workflow = workflowFor(finding); return <button key={finding.id} className="signal-card analyst-signal-card" onClick={() => setSelectedFinding(finding)}><div className="signal-card-top"><span className="eyebrow">{finding.category}</span><span className={`status-tag ${workflow.reviewState === 'Unreviewed' ? 'unreviewed' : 'reviewed'}`}>{workflow.reviewState}</span></div><h3>{finding.title}</h3><p>{finding.summary}</p><div className="signal-card-footer"><span>{finding.source}</span><span className="signal-card-action">Review <ArrowUpRight size={13} /></span></div></button>; })}</div></section>}
            <div className="builder-columns analyst-columns">{visibleWidgets.includes('coverage') && <section className="panel coverage-panel"><div className="panel-heading"><div><p className="eyebrow">Source and coverage health</p><h2>Can we trust today’s view?</h2></div><ShieldCheck size={20} className="cyan-icon" /></div><div className="coverage-score"><div className="score-ring"><span>86</span><small>%</small></div><div><strong>Healthy with gaps</strong><p>Most monitored sources refreshed successfully.</p></div></div><div className="coverage-list"><div className="coverage-row"><span className="status-dot" /> HubSpot CRM <em>Connected</em></div><div className="coverage-row"><span className="status-dot" /> GA4 <em>Connected</em></div><div className="coverage-row warning"><span className="warning-dot" /> Search Console <em>Historical export only</em></div><div className="coverage-row warning"><span className="warning-dot" /> 2 sources <em>Blocked by sign-in</em></div></div><button className="text-button" onClick={() => openAdmin('sources')}>Review coverage gaps <ArrowUpRight size={14} /></button></section>}{visibleWidgets.includes('content') && <section className="panel content-panel"><div className="panel-heading"><div><p className="eyebrow">Content opportunities</p><h2>Questions worth answering</h2></div><FileText size={20} className="orange-icon" /></div><div className="content-opportunity"><span className="opportunity-rank">01</span><div><strong>Who owns AI evidence after deployment?</strong><p>Buyer question · Regulated Operator · recurring</p></div><button className="small-circle-button" aria-label="Create brief" onClick={() => announce('Brief draft started from this opportunity.')}><Plus size={16} /></button></div><div className="content-opportunity"><span className="opportunity-rank">02</span><div><strong>What does operated readiness change?</strong><p>Message gap · Provable Vendor · rising</p></div><button className="small-circle-button" aria-label="Create brief" onClick={() => announce('Brief draft started from this opportunity.')}><Plus size={16} /></button></div><button className="text-button" onClick={() => announce('Content queue is ready for review.')}>Open content queue <ArrowUpRight size={14} /></button></section>}</div>
          </div>}

          {activeView === 'C-suite' && <div className="role-view csuite-view">
            {visibleWidgets.includes('briefing') && <section className="builder-section decision-section"><div className="section-heading"><div><p className="eyebrow orange-eyebrow">Decision signals</p><h2>What deserves an executive decision</h2></div><button className="text-button" onClick={() => setShowPresent(true)}>Open presentation <ArrowUpRight size={14} /></button></div><div className="decision-grid">{filteredFindings.slice(0, 3).map((finding) => { const workflow = workflowFor(finding); return <button className="decision-card" key={finding.id} onClick={() => setSelectedFinding(finding)}><div className="decision-card-top"><span className="eyebrow">{finding.category}</span><span className={`admin-status ${workflow.decisionState === 'Approved' ? 'connected' : workflow.decisionState === 'Held' ? 'manual' : 'pending'}`}>{workflow.decisionState}</span></div><h3>{finding.title}</h3><p>{finding.implication}</p><div className="decision-card-footer"><span>{finding.source}</span><span>Open evidence <ArrowUpRight size={13} /></span></div></button>; })}</div></section>}
            {visibleWidgets.includes('briefing') && <section className="panel impact-panel"><div className="panel-heading"><div><p className="eyebrow accent-eyebrow">Business impact</p><h2>Risks and opportunities</h2></div><Sparkles size={20} className="cyan-icon" /></div><div className="impact-list"><div><span className="impact-label">Opportunity</span><strong>Lead the evidence ownership conversation</strong><p>Turn the buyer question into an executive education angle for regulated operators.</p></div><div><span className="impact-label risk">Risk</span><strong>Competitors are teaching agent governance expectations</strong><p>Maintain differentiation around operated readiness and evidence ownership.</p></div><div><span className="impact-label">Recommended decision</span><strong>Approve a focused executive brief</strong><p>Use the approved findings as the basis for the next customer-facing conversation.</p></div></div></section>}
            {visibleWidgets.includes('briefing') && <section className="panel watchlist-panel"><div className="panel-heading"><div><p className="eyebrow">Watchlist movement</p><h2>ICP signals by segment</h2></div><span className="connected-pill"><span className="status-dot" /> 3 active lenses</span></div><div className="watchlist-movement"><div><strong>Provable Vendor</strong><span className="movement-up">Rising</span><p>AI governance and customer assurance language increasing.</p></div><div><strong>Portfolio</strong><span className="movement-steady">Steady</span><p>Security leadership movement remains a timing signal.</p></div><div><strong>Regulated Operator</strong><span className="movement-up">Rising</span><p>Buyer questions focus on evidence after deployment.</p></div></div></section>}
            <div className="builder-columns csuite-columns">{visibleWidgets.includes('performance') && <section className="panel performance-panel"><div className="panel-heading"><div><p className="eyebrow">Executive scorecard</p><h2>Marketing signals</h2></div><span className="connected-pill"><span className="status-dot" /> Supplied snapshot</span></div><div className="performance-layout"><div className="performance-number"><p className="big-number">443</p><p className="metric-detail">active users · supplied 30-day snapshot</p><span className="trend-up"><TrendingUp size={14} /> 12.4%</span></div><Sparkline values={[18, 20, 18, 24, 31, 29, 42, 47, 51]} /></div><div className="performance-bars"><div><span>Organic sessions</span><strong>29</strong><div className="bar-track"><span style={{ width: '38%' }} /></div></div><div><span>New contacts</span><strong>18</strong><div className="bar-track orange-bar"><span style={{ width: '25%' }} /></div></div><div><span>Open pipeline</span><strong>$184k</strong><div className="bar-track navy-bar"><span style={{ width: '64%' }} /></div></div></div></section>}{visibleWidgets.includes('hubspot') && <section className="panel hubspot-panel"><div className="panel-heading"><div><p className="eyebrow">Pipeline exposure</p><h2>Commercial pulse</h2></div><span className="read-only-pill"><LockKeyhole size={12} /> Read-only</span></div><div className="funnel"><div className="funnel-row"><span>Contacts</span><strong>126</strong><div className="funnel-bar" style={{ width: '100%' }} /></div><div className="funnel-row"><span>Qualified leads</span><strong>31</strong><div className="funnel-bar" style={{ width: '68%' }} /></div><div className="funnel-row"><span>Open opportunities</span><strong>12</strong><div className="funnel-bar" style={{ width: '42%' }} /></div><div className="funnel-row"><span>Closed won</span><strong>$64k</strong><div className="funnel-bar orange-funnel" style={{ width: '24%' }} /></div></div><p className="data-note"><Database size={13} /> Deal value shown · not accounting revenue</p></section>}</div>
            {visibleWidgets.includes('coverage') && <section className="panel coverage-panel"><div className="panel-heading"><div><p className="eyebrow">Source confidence</p><h2>Can we trust this brief?</h2></div><ShieldCheck size={20} className="cyan-icon" /></div><div className="coverage-score"><div className="score-ring"><span>86</span><small>%</small></div><div><strong>Healthy with gaps</strong><p>Open the evidence trail before publishing a claim.</p></div></div><div className="coverage-list"><div className="coverage-row"><span className="status-dot" /> HubSpot CRM <em>Connected</em></div><div className="coverage-row"><span className="status-dot" /> GA4 <em>Connected</em></div><div className="coverage-row warning"><span className="warning-dot" /> Search Console <em>Historical export only</em></div></div><button className="text-button" onClick={() => openAdmin('sources')}>Review source confidence <ArrowUpRight size={14} /></button></section>}
          </div>}
          </div>
        </section>

        <aside className="icp-rail" aria-label="3HUE ICP rotation"><div className="icp-rail-header"><div><p className="eyebrow">Targeting lens</p><h2>Who we are watching</h2></div><span className="rail-code">3HUE / ICP</span></div><div className="icp-carousel" aria-label="3HUE ICP profiles"><div className="icp-track">{icpProfiles.map((profile, index) => { const offset = (index - activeIcpIndex + icpProfiles.length) % icpProfiles.length; return <button key={profile.id} className={`icp-card icp-card-${profile.color} ${offset === 0 ? 'active' : offset === 1 ? 'next' : 'previous'}`} onClick={() => setActiveIcpIndex(index)} aria-label={`Show ${profile.name} ICP`} aria-pressed={offset === 0}><div className="icp-card-top"><span className="eyebrow">{profile.hue}</span><span className="icp-card-index">{String(index + 1).padStart(2, '0')} / {icpProfiles.length}</span></div><strong>{profile.name}</strong><span className="icp-tagline">{profile.tagline}</span><p>{profile.description}</p><span className="icp-signal"><span className="status-dot" />{profile.signal}</span></button>; })}</div><div className="icp-dots" aria-label="Choose ICP">{icpProfiles.map((profile, index) => <button key={profile.id} className={`icp-dot ${index === activeIcpIndex ? 'active' : ''}`} onClick={() => setActiveIcpIndex(index)} aria-label={`Show ${profile.name}`} />)}</div></div><div className="icp-controls"><span className="icp-rotation-status"><span className={`icp-live-dot ${icpPaused ? 'paused' : ''}`} />{icpPaused ? 'Paused' : 'Auto-rotating'}</span><div><button className="icon-button" aria-label="Previous ICP" onClick={() => goToIcp(-1)}><ChevronLeft size={15} /></button><button className="secondary-button small-button" onClick={() => setIcpPaused((current) => !current)}>{icpPaused ? 'Resume' : 'Pause'}</button><button className="icon-button" aria-label="Next ICP" onClick={() => goToIcp(1)}><ChevronRight size={15} /></button></div></div><div className="icp-rail-footer"><Sparkles size={14} /><span>Rotates through the three 3HUE targeting lenses.</span></div></aside>
      </div>

      {selectedFinding && selectedWorkflow && <div className="drawer-backdrop"><aside className="detail-drawer" aria-label="Finding details"><div className="drawer-hero"><div><p className="eyebrow">{selectedFinding.category} · {selectedFinding.segment}</p><h2>{selectedFinding.title}</h2><p className="drawer-code">{selectedFinding.source} · {selectedFinding.collected}</p></div><button className="drawer-close" onClick={() => setSelectedFinding(null)} aria-label="Close finding details"><X size={19} /></button></div><div className="drawer-body"><p className="drawer-summary">{selectedFinding.summary}</p><div className="drawer-section"><div className="drawer-section-heading"><p className="eyebrow">Workflow state</p></div><div className="drawer-chips"><span>{selectedWorkflow.reviewState}</span><span>{selectedWorkflow.decisionState}</span>{selectedWorkflow.saved && <span>Saved</span>}{selectedWorkflow.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div><div className="drawer-section"><div className="drawer-section-heading"><p className="eyebrow">What’s included</p></div><ul className="drawer-checklist"><li><Check size={16} />Reported fact and source context</li><li><Check size={16} />Implication for {selectedFinding.segment.toLowerCase()} buyers</li><li><Check size={16} />Recommended marketing response</li><li><Check size={16} />Freshness and confidence markers</li></ul></div><div className="drawer-section"><div className="drawer-section-heading"><p className="eyebrow">Why it matters</p></div><p className="drawer-copy">{selectedFinding.implication}</p></div><div className="drawer-section"><div className="drawer-section-heading"><p className="eyebrow">Market context</p></div><div className="drawer-chips"><span>{selectedFinding.lens}</span><span>{selectedFinding.segment}</span><span>{selectedFinding.importance} priority</span></div></div><div className="drawer-section"><div className="drawer-section-heading"><p className="eyebrow">Evidence</p></div><div className="evidence-card"><ShieldCheck size={17} /><div><strong>{selectedFinding.source}</strong><p>Reported fact and interpretation are separated. Open the original source before publishing.</p><button className="inline-link" onClick={() => announce('Source link is ready for the connected source.')}>View source <ExternalLink size={13} /></button></div></div></div><div className="drawer-section"><div className="drawer-section-heading"><p className="eyebrow">Suggested action</p></div><button className="action-card" onClick={() => announce(`${selectedFinding.action} started.`)}><Sparkles size={16} /><span>{selectedFinding.action}</span><ArrowUpRight size={15} /></button></div><div className="drawer-actions">{hasAction('review') && <button className="secondary-button" onClick={() => updateWorkflow(selectedFinding, { reviewState: 'Reviewed' }, 'Finding marked reviewed across all views.')}><Check size={15} /> Mark reviewed</button>}{hasAction('approve') && <button className="primary-button" onClick={() => updateWorkflow(selectedFinding, { decisionState: 'Approved', reviewState: 'Reviewed' }, 'Finding approved for executive view.')}><Check size={15} /> Approve</button>}{hasAction('hold') && <button className="secondary-button" onClick={() => updateWorkflow(selectedFinding, { decisionState: 'Held' }, 'Finding held for more evidence.')}><Clock3 size={15} /> Hold</button>}{hasAction('tag') && <button className="secondary-button" onClick={() => updateWorkflow(selectedFinding, { tags: [...selectedWorkflow.tags, 'Analyst review'] }, 'Analyst review tag added.')}><Plus size={15} /> Tag</button>}{hasAction('save') && <button className="secondary-button" onClick={() => updateWorkflow(selectedFinding, { saved: true }, 'Finding saved to the shared workspace.')}><Check size={15} /> Save</button>}{hasAction('brief') && <button className="primary-button" onClick={() => addToBrief(selectedFinding)}>Add to brief</button>}{hasAction('acknowledge') && <button className="secondary-button" onClick={() => updateWorkflow(selectedFinding, { lastAction: 'Acknowledged by C-suite' }, 'Signal acknowledged for the executive view.')}><Check size={15} /> Acknowledge</button>}</div></div></aside></div>}

      {showCustomize && <div className="modal-backdrop"><section className="modal-card customize-modal"><div className="modal-heading"><div><p className="eyebrow accent-eyebrow">{activeView} view</p><h2>Customize dashboard</h2></div><button className="icon-button" onClick={() => setShowCustomize(false)} aria-label="Close customize dialog"><X size={18} /></button></div><p className="modal-copy">Choose the intelligence panels visible in this view. Your layout is personal until an admin publishes a shared dashboard.</p><div className="widget-options">{widgets.map(({ id, label, description, icon: Icon }) => <button key={id} className={`widget-option ${visibleWidgets.includes(id) ? 'enabled' : ''}`} onClick={() => toggleWidget(id)}><span className="widget-icon"><Icon size={17} /></span><span><strong>{label}</strong><small>{description}</small></span><span className={`toggle ${visibleWidgets.includes(id) ? 'on' : ''}`}><span /></span></button>)}</div><div className="modal-footer"><span><LockKeyhole size={14} /> Personal layout</span><button className="primary-button" onClick={() => { setShowCustomize(false); announce('Dashboard layout saved.'); }}><Check size={16} /> Save layout</button></div></section></div>}

      {showPresent && <div className="modal-backdrop presentation-backdrop"><section className="presentation-modal" aria-label="Presentation view"><div className="presentation-header"><div><p className="eyebrow accent-eyebrow">3HUE market intel · {activeView} view</p><h2>Shared briefing</h2><p>Read-only presentation of the intelligence selected for this workspace.</p></div><button className="drawer-close" onClick={() => setShowPresent(false)} aria-label="Close presentation view"><X size={19} /></button></div><div className="presentation-meta"><span><Clock3 size={14} /> Collected today · 05:42 CT</span><span><ShieldCheck size={14} /> Representative data</span><span>{briefingFindings.length} findings</span></div><div className="presentation-grid">{briefingFindings.map((finding) => <article key={finding.id} className="presentation-card"><p className="eyebrow">{finding.category}</p><h3>{finding.title}</h3><p>{finding.summary}</p><div><span>{finding.source}</span><span>{finding.collected}</span></div></article>)}</div><div className="presentation-footer"><span>Sources and interpretations stay separate until reviewed.</span><button className="secondary-button" onClick={() => setShowPresent(false)}>Return to workspace</button></div></section></div>}

      {showSettings && <div className="modal-backdrop admin-backdrop"><section className="admin-modal" aria-label="Admin intelligence center"><div className="admin-shell"><header className="admin-header"><div><p className="eyebrow accent-eyebrow">Workspace administration</p><h2>Admin intelligence center</h2><p>Control source access, watchlists, collection cadence, and evidence quality from one place.</p></div><button className="icon-button" onClick={() => setShowSettings(false)} aria-label="Close admin intelligence center"><X size={18} /></button></header><nav className="admin-tabs" aria-label="Admin sections" role="tablist">{([['overview', 'Overview'], ['sources', 'Sources'], ['watchlists', 'Watchlists'], ['runs', 'Research runs']] as [AdminTab, string][]).map(([tab, label]) => <button key={tab} className={`admin-tab ${adminTab === tab ? 'active' : ''}`} onClick={() => setAdminTab(tab)} role="tab" aria-selected={adminTab === tab}>{label}</button>)}</nav><div className="admin-body">
        {adminTab === 'overview' && <div className="admin-view"><div className="admin-summary-grid"><div className="admin-stat"><span className="admin-stat-icon cyan"><Globe2 size={16} /></span><div><p className="eyebrow">Sources</p><strong>10</strong><small>approved providers</small></div></div><div className="admin-stat"><span className="admin-stat-icon green"><ShieldCheck size={16} /></span><div><p className="eyebrow">Ready / partial</p><strong>3</strong><small>usable coverage paths</small></div></div><div className="admin-stat"><span className="admin-stat-icon orange"><DatabaseZap size={16} /></span><div><p className="eyebrow">Watchlists</p><strong>{watchlistItems.length}</strong><small>ICP and market lenses</small></div></div><div className="admin-stat"><span className="admin-stat-icon navy"><Play size={16} /></span><div><p className="eyebrow">Pending runs</p><strong>{researchRuns.filter((run) => run.status === 'Queued').length}</strong><small>next run in 3h 42m</small></div></div></div><div className="admin-grid"><section className="admin-panel"><div className="admin-panel-heading"><div><p className="eyebrow accent-eyebrow">Evidence quality</p><h3>What the workspace can prove</h3></div><button className="text-button" onClick={() => setAdminTab('sources')}>Review sources <ArrowUpRight size={14} /></button></div><div className="admin-evidence-table"><div className="admin-evidence-row admin-evidence-heading"><span>Signal</span><span>Freshness</span><span>Evidence state</span></div><div className="admin-evidence-row"><div><strong>Keyword demand snapshot</strong><small>Search · Ubersuggest</small></div><span>Observed today</span><span className="admin-status manual">Needs source connection</span></div><div className="admin-evidence-row"><div><strong>AI governance explainer</strong><small>YouTube · owned channel</small></div><span>Supplied snapshot</span><span className="admin-status partial">Representative data</span></div><div className="admin-evidence-row"><div><strong>Who owns AI evidence?</strong><small>Social · Reddit</small></div><span>Account access required</span><span className="admin-status pending">Hypothesis</span></div></div></section><section className="admin-panel admin-cadence-panel"><div className="admin-panel-heading"><div><p className="eyebrow orange-eyebrow">Collection cadence</p><h3>Next research run</h3></div><Clock3 size={19} className="orange-icon" /></div><div className="admin-next-run"><strong>Every 4 hours</strong><span>3h 42m</span></div><p>Last successful collection completed today at 05:42 CT. Two providers remain blocked by sign-in or connector setup.</p><button className="primary-button" onClick={queueResearchRun}><Play size={14} /> Start research run</button><button className="text-button" onClick={() => setAdminTab('runs')}>View run history <ArrowUpRight size={14} /></button></section></div><div className="admin-callout"><KeyRound size={16} /><div><strong>Credentials stay out of GitHub</strong><p>OAuth tokens, API keys, and provider secrets belong in protected runtime configuration. This preview only records connection state and evidence quality.</p></div><button className="secondary-button small-button" onClick={() => setAdminTab('sources')}>Manage sources</button></div></div>}

        {adminTab === 'sources' && <div className="admin-view"><div className="admin-view-heading"><div><p className="eyebrow accent-eyebrow">Source registry</p><h3>Connect the intelligence surface</h3><p>Review what is available, what needs authorization, and where a manual import can keep the team moving.</p></div><div className="admin-view-actions"><label className="admin-select"><Filter size={13} /><select value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value)} aria-label="Filter source category"><option>All sources</option><option>Revenue</option><option>Performance</option><option>Search</option><option>Content</option><option>Social</option><option>Intelligence</option></select><ChevronDown size={13} /></label><button className="primary-button" onClick={() => setAdminTab('runs')}><RefreshCw size={14} /> Review collection</button></div></div><div className="admin-source-list">{filteredSources.map((source) => <article key={source.id} className="admin-source-card"><div className={`admin-source-icon ${statusClass(source.status)}`}>{source.id === 'bring-your-ai' ? <KeyRound size={17} /> : source.category === 'Social' ? <Globe2 size={17} /> : source.category === 'Revenue' ? <BriefcaseBusiness size={17} /> : <Database size={17} />}</div><div className="admin-source-meta"><div className="admin-source-title"><div><h4>{source.name}</h4><span>{source.category}</span></div><span className={`admin-status ${statusClass(source.status)}`}>{source.status}</span></div><p>{source.description}</p><div className="admin-source-foot"><span>{source.coverage}</span><span>Last refresh · {source.lastRefresh}</span></div></div><div className="admin-source-actions"><button className="secondary-button small-button" onClick={() => announce(source.status === 'Connected' ? `${source.name} is already connected in this preview.` : `Connection setup is ready for ${source.name}; provider authorization is not active in this preview.`)}>{source.status === 'Connected' ? 'Review' : 'Connect'}</button><button className="icon-button" aria-label={`Queue refresh for ${source.name}`} onClick={() => announce(`Refresh queued for ${source.name}.`)}><RefreshCw size={14} /></button></div></article>)}</div><div className="admin-callout"><ShieldCheck size={16} /><div><strong>Provider authorization is intentionally explicit</strong><p>Live OAuth/API setup is the next wiring step. No credentials are collected or displayed in this front-end preview.</p></div></div></div>}

        {adminTab === 'watchlists' && <div className="admin-view"><div className="admin-view-heading"><div><p className="eyebrow accent-eyebrow">Targeting system</p><h3>Watchlists and ICP lenses</h3><p>Keep the market context tight by telling the collector who and what matters before it searches.</p></div><span className="preview-badge"><Database size={13} /> Local preview state</span></div><div className="admin-input-row"><input value={watchlistDraft} onChange={(event) => setWatchlistDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') addWatchlist(); }} placeholder="Add a watchlist or ICP lens" aria-label="Add a watchlist or ICP lens" /><button className="primary-button" onClick={addWatchlist}><Plus size={14} /> Add watchlist</button></div><div className="admin-watchlist-list">{watchlistItems.map((watchlist) => <article className="admin-watchlist-item" key={watchlist.id}><span className="watchlist-index">{String(watchlistItems.indexOf(watchlist) + 1).padStart(2, '0')}</span><div><strong>{watchlist.name}</strong><p>{watchlist.detail}</p><small>{watchlist.sources}</small></div><button className="icon-button" aria-label={`Review ${watchlist.name}`} onClick={() => announce(`${watchlist.name} is ready for source and audience configuration.`)}><ArrowUpRight size={15} /></button></article>)}</div><div className="admin-callout"><SlidersHorizontal size={16} /><div><strong>Next step: add audience rules</strong><p>Each watchlist can later carry source filters, geography, named accounts, competitor sets, and AI research instructions.</p></div></div></div>}

        {adminTab === 'runs' && <div className="admin-view"><div className="admin-view-heading"><div><p className="eyebrow accent-eyebrow">Collection operations</p><h3>Research run history</h3><p>Track freshness and gaps before a signal becomes a decision or a customer-facing claim.</p></div><button className="primary-button" onClick={queueResearchRun}><Play size={14} /> Start research run</button></div><div className="admin-run-list">{researchRuns.map((run) => <article className="admin-run-row" key={run.id}><span className={`admin-run-status ${run.status.toLowerCase()}`}><span />{run.status}</span><div><strong>{run.label}</strong><p>{run.source}</p></div><span>{run.started}</span><span>{run.findings}</span><button className="icon-button" aria-label={`Review ${run.label}`} onClick={() => announce(`${run.label} details are ready for review.`)}><ArrowUpRight size={15} /></button></article>)}</div><div className="admin-callout"><Clock3 size={16} /><div><strong>Cadence is set to every 4 hours</strong><p>The next run should refresh approved watchlists and report which sources were complete, partial, blocked, or manually supplied.</p></div><button className="secondary-button small-button" onClick={() => announce('Cadence configuration is ready for the next wiring step.')}>Configure cadence</button></div></div>}
      </div><footer className="admin-footer"><span><ShieldCheck size={14} /> Representative workspace state · no live credentials shown</span><button className="secondary-button small-button" onClick={() => { setShowSettings(false); announce('Admin center closed.'); }}>Done</button></footer></div></section></div>}

      {notice && <output className="toast"><Check size={16} /> {notice}</output>}
    </main>
  );
}
