'use client';

import { useEffect, useMemo, useState, type ChangeEvent, type Dispatch, type SetStateAction } from 'react';
import { logoData } from './logo-data';
import {
  catalogDoors,
  catalogFamilies,
  catalogFrameworks,
  catalogPackages,
  catalogPersonas,
  catalogServices,
  catalogStages,
  catalogTriggers,
  type CatalogFamily,
  type CatalogService,
  type ExperienceDoorId,
  type MaturityStage,
} from './catalog-data';
import {
  brandKitRecords,
  creatorAssets,
  creatorChannels,
  creatorDrafts,
  creatorFolders,
  creatorOutputTypes,
  type BrandKitRecord,
  type CreatorAsset,
  type CreatorDraft,
  type CreatorOutputType,
  type CreatorTab,
} from './creator-data';
import {
  Activity,
  ArrowUpRight,
  ArrowLeft,
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
  FileImage,
  FileText,
  Filter,
  FolderOpen,
  Globe2,
  KeyRound,
  Layers3,
  LineChart,
  LockKeyhole,
  Menu,
  Megaphone,
  PenLine,
  Play,
  Plus,
  Search,
  RefreshCw,
  Route,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  UploadCloud,
  Users,
  Video,
  X,
} from 'lucide-react';

type View = 'Analyst' | 'Director' | 'C-suite';
type ViewSection = 'evidence' | 'signals' | 'coverage' | 'content' | 'performance' | 'hubspot' | 'impact' | 'watchlist';
type ViewAction = 'review' | 'tag' | 'save' | 'brief' | 'approve' | 'hold' | 'acknowledge' | 'present' | 'drilldown';
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
  lensPriority: string[];
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
  segmentShare: string;
  situation: string;
  forcingFunction: string;
  triggerSignals: string[];
  buyingCommittee: string;
  serviceFit: string[];
  messageAngle: string;
  disqualifiers: string[];
  evidence: string;
};
type ExperienceDoor = {
  id: ExperienceDoorId;
  title: string;
  promise: string;
  audience: string;
  triggers: string[];
  tension: string;
  gap: string;
  serviceFamilies: string[];
  decision: string;
  maturityEmphasis: MaturityStage[];
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
    id: 'f1', category: 'Market shift', lens: 'AI adoption and assurance',
    title: 'AI governance guidance is moving from principles to operating practice',
    summary: 'New guidance is framing AI risk around ownership, evidence, and repeatable controls—not only policy statements.',
    source: 'NIST AI RMF / GenAI Profile', collected: 'Today · 05:42 CT', segment: 'Provable Vendor', status: 'Unreviewed', importance: 'High',
    implication: 'This is a strong education and executive-brief angle for technology buyers that need proof their controls operate in practice.', action: 'Create an executive brief',
  },
  {
    id: 'f2', category: 'Competitor', lens: 'Competitor offer changes',
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
    id: 'f4', category: 'Content opportunity', lens: 'Buyer governance pressure',
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
    actions: ['review', 'tag', 'save', 'brief'],
    defaultWidgets: ['briefing', 'signals', 'coverage', 'content'],
    lensPriority: ['AI adoption and assurance', 'Buyer governance pressure', 'Competitor offer changes', 'Technical platform changes', 'Account movement', 'Content maintenance', 'Sector developments', 'Partner ecosystem'],
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
    actions: ['review', 'approve', 'hold', 'brief'],
    defaultWidgets: ['briefing', 'signals', 'performance', 'coverage', 'content', 'hubspot'],
    lensPriority: ['Account movement', 'Buyer governance pressure', 'Competitor offer changes', 'AI adoption and assurance', 'Sector developments', 'Partner ecosystem', 'Technical platform changes', 'Content maintenance'],
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
    lensPriority: ['Buyer governance pressure', 'AI adoption and assurance', 'Account movement', 'Sector developments', 'Competitor offer changes', 'Technical platform changes', 'Partner ecosystem', 'Content maintenance'],
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

const marketLensDefinitions = [
  { id: 'buyer-governance', label: 'Buyer governance pressure', description: 'Dated obligations, customer requirements, board concerns, and assurance pressure.' },
  { id: 'ai-assurance', label: 'AI adoption and assurance', description: 'Concrete AI use cases, evaluation expectations, vendor changes, and governance implications.' },
  { id: 'competitor-offers', label: 'Competitor offer changes', description: 'Changes in competitor scope, packaging, delivery model, or published positioning.' },
  { id: 'account-movement', label: 'Account movement', description: 'CRM, hiring, funding, acquisition, and public account timing signals.' },
  { id: 'sector-developments', label: 'Sector developments', description: 'Primary-source events that change operating complexity or assurance demands.' },
  { id: 'platform-changes', label: 'Technical platform changes', description: 'Documented capability, deprecation, or platform changes affecting controls and evidence.' },
  { id: 'content-maintenance', label: 'Content maintenance', description: 'Source changes that invalidate dated claims, examples, or existing content.' },
  { id: 'partner-ecosystem', label: 'Partner ecosystem', description: 'Confirmed partner, alliance, or channel movement relevant to 3HUE.' },
];

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
  { id: 'provable-vendor', hue: 'HUE 01', name: 'Provable Vendor', tagline: 'Proof creates trust', description: 'AI-native vendors that need customer assurance evidence to win and retain enterprise buyers.', signal: 'AI governance language rising', color: 'cyan', segmentShare: '~60% of ranked segment mix', situation: 'A SaaS, digital-product, or AI-native vendor is being asked to prove security before a deal, renewal, diligence event, or customer expansion.', forcingFunction: 'A customer, insurer, investor, or buyer has leverage and the company lacks an internal owner for the evidence work.', triggerSignals: ['Enterprise deal or renewal blocked by assurance requirements', 'AI rollout creates new customer questions about ownership and control', 'Funding, diligence, or procurement asks for repeatable evidence'], buyingCommittee: 'Founder or CEO sponsor with technology, security, risk, legal, or assurance stakeholders.', serviceFit: ['AI risk and readiness', 'SOC 2 / ISO readiness', 'Risk assessment and governance', 'Managed security and privacy support'], messageAngle: 'Turn scattered readiness work into proof a buyer can understand and trust.', disqualifiers: ['No active assurance pressure or business change', 'No executive owner for the decision'], evidence: 'Supplied forcing-function research; segment share is a strategy estimate, not measured pipeline.' },
  { id: 'portfolio', hue: 'HUE 02', name: 'Portfolio', tagline: 'Readiness creates timing', description: 'Portfolio companies and ownership groups entering a more formal control environment or preparing for a growth event.', signal: 'Security leadership movement', color: 'orange', segmentShare: '~25% of ranked segment mix', situation: 'An investment or ownership group needs a common view of risk, technology, vendors, and readiness across holdings.', forcingFunction: 'Acquisition, lender or investor diligence, board reporting, or a portfolio review exposes inconsistent evidence and operating practices.', triggerSignals: ['New acquisition or integration work', 'Board, lender, or investor reporting is inconsistent', 'Security leadership movement at an operating company'], buyingCommittee: 'Investment or ownership sponsor with portfolio operations, board, and operating-company technology or security leaders.', serviceFit: ['Portfolio-wide risk and vendor governance', 'Board and investor performance reporting', 'Managed programs', 'Enterprise architecture and continuity'], messageAngle: 'Give leaders portfolio-wide visibility and governance without slowing the companies doing the work.', disqualifiers: ['Single-company need with no portfolio or holding-company motion', 'No shared reporting or governance requirement'], evidence: 'Supplied forcing-function research and private-equity market analysis; buying motion remains a hypothesis until CRM validation.' },
  { id: 'regulated-operator', hue: 'HUE 03', name: 'Regulated Operator', tagline: 'Evidence creates confidence', description: 'Regulated and operationally complex organizations that need defensible decisions, ownership, resilience, response, and evidence.', signal: 'Buyer questions recurring', color: 'navy', segmentShare: '~15% of ranked segment mix', situation: 'An operator must keep its control environment defensible while AI, privacy, resilience, incident, or regulatory pressure crosses organizational boundaries.', forcingFunction: 'An examination, audit finding, incident, continuity concern, or remediation deadline exposes the cost of discovering gaps late.', triggerSignals: ['Regulatory examination or remediation deadline', 'Security incident or continuity concern', 'AI, privacy, or customer assurance pressure crossing operational teams'], buyingCommittee: 'Executive sponsor with security, risk, compliance, privacy, technology, operations, or audit owners.', serviceFit: ['Cyber incident response', 'Business continuity and operational resilience', 'Managed detection and response', 'Privacy and AI governance'], messageAngle: 'Make readiness continuous so the organization can operate defensibly when conditions change.', disqualifiers: ['No operational or regulatory trigger', 'Seeking a point tool without accountable operating ownership'], evidence: 'Supplied forcing-function research and public markets/regulated-operator dossier; priority share is directional.' },
];

const experienceDoors: ExperienceDoor[] = [
  { id: 'win-trust', title: 'Win Trust', promise: 'Prove you are ready.', audience: 'For teams that need customer assurance, readiness evidence, or a faster path through diligence.', triggers: ['An enterprise deal or renewal is blocked by assurance requirements.', 'A customer, insurer, or investor is asking for evidence you cannot assemble quickly.', 'AI adoption is creating new customer questions about ownership and control.'], tension: 'The business is ready to grow, but proof is scattered across policies, systems, and people.', gap: 'The gap is between having good intentions and being able to show repeatable evidence when the buyer asks.', serviceFamilies: ['Risk assessment and risk management', 'Information security program and governance', 'Privacy management and data protection', 'ISMS, SSPP, and statement of applicability'], decision: 'Choose the evidence and operating work that turns readiness into buyer confidence.', maturityEmphasis: ['Assess', 'Strengthen', 'Advance'], color: 'cyan' },
  { id: 'gain-control', title: 'Gain Control', promise: 'See and govern what matters.', audience: 'For ownership and operating teams that need shared visibility, leverage, and governance across multiple companies.', triggers: ['A new platform acquisition or portfolio review needs a common view.', 'Board, lender, or investor reporting is inconsistent across holdings.', 'The portfolio needs more control without adding a full internal team.'], tension: 'Important risk and technology decisions are being made company by company without a shared operating picture.', gap: 'The gap is between local activity and portfolio-level oversight that can guide investment, sequencing, and accountability.', serviceFamilies: ['Digital maturity paradigm assessments', 'Managed enterprise architecture programs', 'Vendor and third-party risk management', 'Board and investor performance reporting'], decision: 'Create a repeatable governance rhythm that gives leaders visibility without slowing operators down.', maturityEmphasis: ['Assess', 'Operate', 'Advance'], color: 'orange' },
  { id: 'stay-ready', title: 'Stay Ready', promise: 'Operate defensibly.', audience: 'For regulated and risk-heavy operators that need clear ownership, resilience, response, and evidence that survives scrutiny.', triggers: ['An examiner request, audit finding, or remediation deadline is active.', 'An incident or continuity concern exposes a readiness gap.', 'Regulatory, privacy, or AI adoption pressure is crossing operational boundaries.'], tension: 'The organization cannot afford to discover ownership or evidence gaps during an examination or incident.', gap: 'The gap is between documented plans and an operating model that stays ready when conditions change.', serviceFamilies: ['Cyber incident response programs', 'Business continuity and operational resilience', 'Managed detection and response', 'Privacy management and data protection'], decision: 'Establish the accountable programs and managed practices that make readiness continuous.', maturityEmphasis: ['Strengthen', 'Operate', 'Advance'], color: 'navy' },
];

function ExperienceOverlay({ activeDoorId, onSelectDoor, onClose, onOpenCatalog, onTalkToTeam }: { activeDoorId: ExperienceDoorId; onSelectDoor: (id: ExperienceDoorId) => void; onClose: () => void; onOpenCatalog: () => void; onTalkToTeam: () => void }) {
  const activeDoor = experienceDoors.find((door) => door.id === activeDoorId) ?? experienceDoors[0];
  const maturityStages: MaturityStage[] = ['Assess', 'Strengthen', 'Operate', 'Advance'];
  const [exploring, setExploring] = useState(false);
  const chooseDoor = (id: ExperienceDoorId) => { onSelectDoor(id); setExploring(true); };

  return <div className="experience-shell" role="dialog" aria-modal="true" aria-label="3HUE customer experience">
    <header className="experience-header">
      <div className="experience-brand"><img src={logoData} alt="3HUE Executive Consulting" /><span>MATURITY PARTNER</span></div>
      <nav className="experience-nav" aria-label="Experience sections"><button className="experience-nav-item active">Approach</button><button className="experience-nav-item" onClick={onOpenCatalog}>Customer paths</button><button className="experience-nav-item">Insights</button><button className="experience-nav-item">About</button></nav>
      <div className="experience-header-actions"><button className="experience-ghost-button" onClick={onClose}><ArrowLeft size={14} /> Return to intelligence</button><button className="experience-outline-button" onClick={onTalkToTeam}>Talk to our team <ArrowUpRight size={14} /></button></div>
    </header>
    <main className={`experience-floor ${exploring ? 'with-panel' : ''}`}>
      <img className="experience-backdrop" src="/three-doors-concept.png" alt="3HUE maturity partner concept: three doors leading to one path to maturity" />
      <div className="experience-backdrop-shade" aria-hidden="true" />
      <div className="experience-hotspot-intro"><span>Three doors. One path to maturity.</span><small>Select a path to explore how 3HUE helps teams move from uncertainty to operational confidence.</small></div>
      <div className="experience-hotspots" aria-label="Customer paths">
        {experienceDoors.map((door) => <button key={door.id} className={`experience-hotspot experience-hotspot-${door.id} ${activeDoor.id === door.id ? 'selected' : ''}`} onClick={() => chooseDoor(door.id)} aria-label={`Explore ${door.title}: ${door.promise}`}><span>{door.title}</span><small>{door.promise}</small></button>)}
        <button className="experience-hotspot experience-hotspot-route" onClick={() => setExploring(true)} aria-label="Explore the shared maturity path"><span>See the maturity path</span></button>
      </div>
      <div className="experience-floor-footer"><span>People · perspective · progress</span><span className="experience-floor-legend"><i className="cyan" /> Customer path <i className="orange" /> Maturity route</span></div>
      {exploring && <aside className="experience-detail-panel">
        <div className="experience-detail-toolbar"><span>Customer path · guided exploration</span><button className="experience-detail-close" onClick={() => setExploring(false)} aria-label="Return to Three Doors landing"><ArrowLeft size={14} /> Back to doors</button></div>
        <div className="experience-detail-tabs" role="tablist" aria-label="Customer paths">{experienceDoors.map((door) => <button key={door.id} role="tab" aria-selected={activeDoor.id === door.id} className={activeDoor.id === door.id ? 'active' : ''} onClick={() => onSelectDoor(door.id)}>{door.title}</button>)}</div>
        <div className="experience-detail-body"><p className="experience-kicker">{activeDoor.title} · recommended fit</p><h2>{activeDoor.promise}</h2><p className="experience-detail-audience">{activeDoor.audience}</p><div className="experience-detail-links"><button onClick={onOpenCatalog}><Layers3 size={14} /> Browse service catalog</button><button onClick={onTalkToTeam}>Talk to our team <ArrowUpRight size={14} /></button></div><div className="experience-detail-rule" /><div className="experience-detail-section"><span>What creates urgency</span><ul>{activeDoor.triggers.map((trigger) => <li key={trigger}>{trigger}</li>)}</ul></div><div className="experience-detail-section"><span>The gap to close</span><p>{activeDoor.gap}</p></div><div className="experience-detail-section"><span>Relevant service families</span><div className="experience-detail-family-list">{activeDoor.serviceFamilies.map((family) => <span key={family}>{family}</span>)}</div></div><div className="experience-detail-section"><span>Shared maturity route</span><div className="experience-detail-route">{maturityStages.map((stage) => <span key={stage} className={activeDoor.maturityEmphasis.includes(stage) ? 'active' : ''}>{stage}</span>)}</div></div><div className="experience-detail-next"><span>Next decision</span><strong>{activeDoor.decision}</strong></div></div>
      </aside>}
    </main>
  </div>;
}

function CreatorOverlay({ activeView, onClose, onNotice, assets, setAssets, drafts, setDrafts }: { activeView: View; onClose: () => void; onNotice: (message: string) => void; assets: CreatorAsset[]; setAssets: Dispatch<SetStateAction<CreatorAsset[]>>; drafts: CreatorDraft[]; setDrafts: Dispatch<SetStateAction<CreatorDraft[]>> }) {
  const [tab, setTab] = useState<CreatorTab>('Create');
  const [outputType, setOutputType] = useState<CreatorOutputType>('Social post');
  const [hue, setHue] = useState('Provable Vendor');
  const [channel, setChannel] = useState('LinkedIn');
  const [folderId, setFolderId] = useState('social');
  const [query, setQuery] = useState('');
  const [draftTitle, setDraftTitle] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<CreatorAsset | null>(null);
  const topLevelFolders = creatorFolders.filter((folder) => !folder.parentId);
  const visibleAssets = useMemo(() => assets.filter((asset) => asset.folderId === folderId && (!query || `${asset.name} ${asset.kind} ${asset.description}`.toLowerCase().includes(query.toLowerCase()))), [assets, folderId, query]);
  const visibleDrafts = useMemo(() => drafts.filter((draft) => !query || `${draft.title} ${draft.outputType} ${draft.hue}`.toLowerCase().includes(query.toLowerCase())), [drafts, query]);
  const selectedFolder = creatorFolders.find((folder) => folder.id === folderId) ?? creatorFolders[0];
  const createDraft = () => {
    const title = draftTitle.trim() || `${outputType} for ${hue}`;
    const newDraft: CreatorDraft = { id: `draft-${Date.now()}`, title, outputType, folderId, status: 'Draft', hue, channel, updatedAt: 'Just now · session preview' };
    setDrafts((current) => [newDraft, ...current]);
    setDraftTitle('');
    setTab('Library');
    onNotice(`${outputType} draft saved to ${selectedFolder.label}.`);
  };
  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const newAsset: CreatorAsset = { id: `asset-${Date.now()}`, name: file.name, kind: file.type.startsWith('video/') ? 'Video plan' : file.type.startsWith('image/') ? 'Image' : 'Source document', folderId, status: 'Needs review', source: 'Session upload · private library preview', description: 'Uploaded for review before it can be used in a generated or published asset.', updatedAt: 'Just now' };
    setAssets((current) => [newAsset, ...current]);
    onNotice(`${file.name} added to the private library preview.`);
    event.target.value = '';
  };
  const iconForType = (type: CreatorOutputType) => type === 'Image direction' ? <FileImage size={16} /> : type === 'Video outline' ? <Video size={16} /> : type === 'Ad concept' ? <Megaphone size={16} /> : type === 'Content brief' ? <FileText size={16} /> : <PenLine size={16} />;

  return <div className="creator-shell" role="dialog" aria-modal="true" aria-label="3HUE creator workspace">
    <header className="creator-header"><div className="creator-brand"><img src={logoData} alt="3HUE Executive Consulting" /><div><p className="creator-kicker">MARKETING CREATOR</p><h1>Create with intelligence</h1><p>Turn approved market context into draft social, campaign, image, ad, and video work.</p></div></div><div className="creator-header-meta"><span><LockKeyhole size={13} /> Private library preview</span><span>{activeView} defaults</span><button className="creator-close" onClick={onClose} aria-label="Close creator workspace"><X size={20} /></button></div></header>
    <nav className="creator-tabs" aria-label="Creator workspace sections" role="tablist">{(['Create', 'Library', 'Brand kit', 'Campaigns', 'Templates'] as CreatorTab[]).map((item) => <button key={item} role="tab" aria-selected={tab === item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>{item}</button>)}</nav>
    <div className="creator-body">
      <aside className="creator-sidebar"><div className="creator-sidebar-heading"><span className="eyebrow">Private folders</span><FolderOpen size={16} /></div>{topLevelFolders.map((folder) => <div key={folder.id}><button className={`creator-folder ${folderId === folder.id ? 'active' : ''}`} onClick={() => { setFolderId(folder.id); setTab('Library'); }}><FolderOpen size={15} />{folder.label}</button>{creatorFolders.filter((child) => child.parentId === folder.id).map((child) => <button key={child.id} className={`creator-subfolder ${folderId === child.id ? 'active' : ''}`} onClick={() => { setFolderId(child.id); setTab('Library'); }}>{child.label}</button>)}</div>)}<div className="creator-sidebar-note"><ShieldCheck size={14} /><span>Drafts stay private and are not exposed to Experience or Product catalog.</span></div></aside>
      <main className="creator-main">
        {tab === 'Create' && <section className="creator-create-view"><div className="creator-view-heading"><div><p className="eyebrow accent-eyebrow">Draft studio</p><h2>Make the next useful thing</h2><p>Start from a hue, a market lens, or a finding. Generated output stays a draft until reviewed.</p></div><span className="creator-role-pill"><Sparkles size={14} /> {activeView} workflow</span></div><div className="creator-output-grid">{creatorOutputTypes.map((type) => <button key={type} className={`creator-output-card ${outputType === type ? 'active' : ''}`} onClick={() => setOutputType(type)}>{iconForType(type)}<strong>{type}</strong><span>{type === 'Social post' ? 'Channel-ready point of view' : type === 'Content brief' ? 'Evidence-backed content plan' : type === 'Image direction' ? 'Visual concept with brand guardrails' : type === 'Ad concept' ? 'Message and creative direction' : 'Script and shot-list starting point'}</span></button>)}</div><div className="creator-composer"><div className="creator-composer-heading"><div><p className="eyebrow">{outputType}</p><h3>Set the creative context</h3></div><span className="creator-status-badge draft">Draft only</span></div><div className="creator-form-grid"><label><span>Draft title</span><input value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} placeholder={`e.g. ${outputType} about operated readiness`} /></label><label><span>Target hue / ICP</span><select value={hue} onChange={(event) => setHue(event.target.value)}><option>Provable Vendor</option><option>Portfolio</option><option>Regulated Operator</option><option>Win Trust</option><option>Gain Control</option><option>Stay Ready</option></select></label><label><span>Channel</span><select value={channel} onChange={(event) => setChannel(event.target.value)}>{creatorChannels.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>Save to folder</span><select value={folderId} onChange={(event) => setFolderId(event.target.value)}>{creatorFolders.filter((folder) => !folder.parentId || ['social', 'campaigns', 'video', 'ads', 'images'].includes(folder.id)).map((folder) => <option key={folder.id} value={folder.id}>{folder.label}</option>)}</select></label><label className="creator-form-wide"><span>Starting context</span><textarea placeholder="Add the finding, buyer question, campaign goal, or image direction you want the draft to use." /></label></div><div className="creator-composer-footer"><span><ShieldCheck size={14} /> Source facts and approved claims stay separate from draft language.</span><button className="primary-button" onClick={createDraft}><Sparkles size={15} /> Create draft</button></div></div></section>}
        {tab === 'Library' && <section className="creator-library-view"><div className="creator-view-heading"><div><p className="eyebrow accent-eyebrow">Asset library</p><h2>{selectedFolder.label}</h2><p>{selectedFolder.description}</p></div><label className="creator-upload-button"><UploadCloud size={15} /> Upload to folder<input type="file" onChange={handleUpload} /></label></div><div className="creator-library-toolbar"><label className="creator-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search private assets and drafts" aria-label="Search private assets and drafts" /></label><span>{visibleAssets.length + visibleDrafts.length} records in view</span></div><div className="creator-record-grid">{visibleDrafts.map((draft) => <article className="creator-record-card creator-draft-card" key={draft.id}><div className="creator-record-top"><span className="creator-record-icon">{iconForType(draft.outputType)}</span><span className="creator-status-badge draft">{draft.status}</span></div><h3>{draft.title}</h3><p>{draft.outputType} · {draft.channel} · {draft.hue}</p><small>{draft.updatedAt}</small></article>)}{visibleAssets.map((asset) => <button className="creator-record-card" key={asset.id} onClick={() => setSelectedAsset(asset)}><div className="creator-record-top"><span className="creator-record-icon"><FileText size={16} /></span><span className={`creator-status-badge ${asset.status === 'Approved reference' ? 'approved' : 'review'}`}>{asset.status}</span></div><h3>{asset.name}</h3><p>{asset.kind} · {asset.source}</p><small>{asset.updatedAt}</small></button>)}{visibleAssets.length === 0 && visibleDrafts.length === 0 && <div className="creator-empty"><FolderOpen size={22} /><strong>No records in this folder yet.</strong><span>Upload a source file or create a draft to start the private library.</span></div>}</div>{selectedAsset && <aside className="creator-asset-detail"><div className="creator-detail-heading"><div><p className="eyebrow">{selectedAsset.kind}</p><h3>{selectedAsset.name}</h3></div><button className="icon-button" onClick={() => setSelectedAsset(null)} aria-label="Close asset details"><X size={17} /></button></div><p>{selectedAsset.description}</p><div className="creator-detail-list"><span><strong>Status</strong>{selectedAsset.status}</span><span><strong>Source</strong>{selectedAsset.source}</span><span><strong>Updated</strong>{selectedAsset.updatedAt}</span></div><button className="secondary-button" onClick={() => onNotice('Asset approval workflow is ready for the private storage phase.')}><Check size={15} /> Review asset</button></aside>}</section>}
        {tab === 'Brand kit' && <section className="creator-brand-view"><div className="creator-view-heading"><div><p className="eyebrow accent-eyebrow">Brand kit</p><h2>Give every draft the right starting point</h2><p>Keep identity, voice, proof, and claims guidance close to the work.</p></div><button className="secondary-button" onClick={() => onNotice('Brand-kit upload is ready for the private library phase.')}><Plus size={15} /> Add brand rule</button></div><div className="brand-kit-grid">{brandKitRecords.map((record: BrandKitRecord) => <article className="brand-kit-card" key={record.id}><div className="creator-record-top"><span className="eyebrow">{record.label}</span><span className={`creator-status-badge ${record.status === 'Approved reference' ? 'approved' : 'review'}`}>{record.status}</span></div><strong>{record.value}</strong><small>{record.source}</small></article>)}</div><div className="brand-kit-callout"><ShieldCheck size={17} /><div><strong>Source-aware creation</strong><p>Claims, customer stories, metrics, and framework language should carry their source and approval status into every draft.</p></div></div></section>}
        {tab === 'Campaigns' && <section className="creator-campaign-view"><div className="creator-view-heading"><div><p className="eyebrow accent-eyebrow">Campaign workspace</p><h2>Organize the work around a market motion</h2><p>Connect a hue, lens, service family, content series, and channel plan before drafting.</p></div><button className="primary-button" onClick={() => { setTab('Create'); setOutputType('Content brief'); setFolderId('campaigns'); }}><Plus size={15} /> Start campaign brief</button></div><div className="campaign-board">{['Ship List · 90-day sequence', 'Governed AI adoption', 'Evidence that supports enterprise sales'].map((campaign, index) => <article className="campaign-card" key={campaign}><div className="campaign-card-top"><span className="eyebrow">{index === 0 ? 'Supplied plan' : 'Campaign hypothesis'}</span><span>{index === 0 ? 'Needs review' : 'Draft'}</span></div><h3>{campaign}</h3><p>{index === 0 ? 'Existing source-library execution plan with founder series, outreach, and offer one-pagers.' : 'Use findings, source evidence, and approved brand rules to build a focused campaign motion.'}</p><button className="text-button" onClick={() => { setTab('Create'); setDraftTitle(campaign); setOutputType('Content brief'); }}>Open in creator <ArrowUpRight size={14} /></button></article>)}</div></section>}
        {tab === 'Templates' && <section className="creator-template-view"><div className="creator-view-heading"><div><p className="eyebrow accent-eyebrow">Templates</p><h2>Repeat the formats that work</h2><p>Start with approved structures while keeping the source and claim boundary visible.</p></div></div><div className="template-grid">{['Founder point of view', 'Buyer question carousel', 'Executive decision brief', 'Service family explainer', 'CEO Corner video outline', 'Paid social test'].map((template) => <button className="template-card" key={template} onClick={() => { setTab('Create'); setDraftTitle(template); }}><span className="creator-record-icon"><Layers3 size={16} /></span><strong>{template}</strong><span>Template · needs brand and evidence review</span></button>)}</div></section>}
      </main>
    </div>
  </div>;
}

function CatalogOverlay({ family, setFamily, query, setQuery, door, setDoor, stage, setStage, persona, setPersona, trigger, setTrigger, framework, setFramework, category, setCategory, categories, services, selectedService, setSelectedService, onClose }: { family: CatalogFamily | 'Packages'; setFamily: (family: CatalogFamily | 'Packages') => void; query: string; setQuery: (value: string) => void; door: string; setDoor: (value: string) => void; stage: string; setStage: (value: string) => void; persona: string; setPersona: (value: string) => void; trigger: string; setTrigger: (value: string) => void; framework: string; setFramework: (value: string) => void; category: string; setCategory: (value: string) => void; categories: string[]; services: CatalogService[]; selectedService: CatalogService | null; setSelectedService: (service: CatalogService | null) => void; onClose: () => void }) {
  const evidenceClass = (label: CatalogService['evidenceLabel']) => label === 'Draft catalog record' ? 'draft' : label === 'Confirm price' ? 'confirm' : 'observed';
  const familyLabel = family === 'Packages' ? 'Ready-to-quote bundles' : `${family} services`;
  return <div className="catalog-shell" role="dialog" aria-modal="true" aria-label="3HUE product catalog"><header className="catalog-header"><div className="catalog-brand"><img src={logoData} alt="3HUE Executive Consulting" /><div><p className="catalog-kicker">MARKETING ENABLEMENT</p><h1>Product catalog</h1><p>Understand what 3HUE sells, why it matters, and where each offer creates a useful marketing angle.</p></div></div><button className="catalog-close" onClick={onClose} aria-label="Close product catalog"><X size={20} /></button></header><div className="catalog-disclosure"><ShieldCheck size={15} /><span>Internal discovery catalog. Builder values are observed records and are not an approved public price sheet or final quote.</span></div><nav className="catalog-family-tabs" aria-label="Product families">{catalogFamilies.map((item) => <button key={item} className={family === item ? 'active' : ''} onClick={() => { setFamily(item); setCategory('All categories'); setSelectedService(null); }}>{item === 'ITC Staff Aug' ? 'Staff Aug' : item}</button>)}</nav><main className="catalog-main"><div className="catalog-heading"><div><p className="catalog-kicker">{familyLabel}</p><h2>Find the work behind the story</h2></div><span className="catalog-count">{family === 'Packages' ? `${catalogPackages.length} packages` : `${services.length} services`}</span></div>{family !== 'Packages' && <div className="catalog-filter-panel"><label className="catalog-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search services, codes, triggers" aria-label="Search product catalog" /></label><label><span>Door</span><select value={door} onChange={(event) => setDoor(event.target.value)}><option>All doors</option>{catalogDoors.map((item) => <option key={item.id}>{item.label}</option>)}</select></label><label><span>Stage</span><select value={stage} onChange={(event) => setStage(event.target.value)}><option>All stages</option>{catalogStages.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>Persona</span><select value={persona} onChange={(event) => setPersona(event.target.value)}><option>All personas</option>{catalogPersonas.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>Framework</span><select value={framework} onChange={(event) => setFramework(event.target.value)}><option>All frameworks</option>{catalogFrameworks.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>Trigger</span><select value={trigger} onChange={(event) => setTrigger(event.target.value)}><option>All triggers</option>{catalogTriggers.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label></div>}{family === 'Packages' ? <div className="catalog-package-grid">{catalogPackages.map((item) => <article className="catalog-package-card" key={item.name}><div className="catalog-card-top"><span className="catalog-status observed">Observed bundle</span><span>{item.stage}</span></div><h3>{item.name}</h3><p>{item.description}</p><div className="catalog-package-meta"><strong>{item.pricing}</strong><span>{item.services} configured services · {catalogDoors.find((doorItem) => doorItem.id === item.door)?.label}</span></div><button className="catalog-link-button" onClick={() => { setFamily('ISG'); setCategory('All categories'); }}>Explore underlying services <ArrowUpRight size={14} /></button></article>)}</div> : <div className="catalog-content-grid"><div className="catalog-service-grid">{services.map((service) => <button key={service.code} className="catalog-service-card" onClick={() => setSelectedService(service)}><div className="catalog-card-top"><span className={`catalog-status ${evidenceClass(service.evidenceLabel)}`}>{service.evidenceLabel}</span><span>{service.family}</span></div><h3>{service.name}</h3><p>{service.description}</p><div className="catalog-service-meta"><span>{service.category}</span><strong>{service.price} <small>{service.billing}</small></strong></div><div className="catalog-card-tags">{service.doors.slice(0, 2).map((serviceDoor) => <span key={serviceDoor}>{catalogDoors.find((item) => item.id === serviceDoor)?.label}</span>)}<span>{service.stages[0]}</span></div></button>)}{services.length === 0 && <div className="catalog-empty"><Search size={22} /><strong>No catalog records match those filters.</strong><span>Try a broader door, stage, framework, or search term.</span></div>}</div>{selectedService && <aside className="catalog-detail-panel"><div className="catalog-detail-header"><div><p className="catalog-kicker">{selectedService.family} · {selectedService.category}</p><h2>{selectedService.name}</h2></div><button className="icon-button" onClick={() => setSelectedService(null)} aria-label="Close service details"><X size={17} /></button></div><div className="catalog-detail-body"><div className="catalog-detail-status"><span className={`catalog-status ${evidenceClass(selectedService.evidenceLabel)}`}>{selectedService.evidenceLabel}</span><span className="catalog-code">{selectedService.code}</span></div><p className="catalog-detail-copy">{selectedService.description}</p><div className="catalog-price-panel"><span>Observed Builder value</span><strong>{selectedService.price}</strong><small>{selectedService.billing}{selectedService.priceStatus === 'from' ? ' · starting from' : selectedService.priceStatus === 'confirm' ? ' · confirm before using' : ''}</small></div><div className="catalog-detail-section"><span>Recommended marketing context</span><p>{selectedService.marketingAngle}</p></div><div className="catalog-detail-section"><span>Recommended fit</span><div className="catalog-detail-tags">{selectedService.personas.map((item) => <span key={item}><Users size={12} />{item}</span>)}{selectedService.stages.map((item) => <span key={item}><Route size={12} />{item}</span>)}</div></div><div className="catalog-detail-section"><span>Buyer triggers</span><ul>{selectedService.triggers.map((item) => <li key={item}>{item}</li>)}</ul></div><div className="catalog-detail-section"><span>Framework context</span><div className="catalog-detail-tags">{selectedService.frameworks.map((item) => <span key={item}>{item}</span>)}</div></div></div></aside>}</div>}</main></div>;
}

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
  const [showExperience, setShowExperience] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const [showCreator, setShowCreator] = useState(false);
  const [creatorAssetState, setCreatorAssetState] = useState<CreatorAsset[]>(creatorAssets);
  const [creatorDraftState, setCreatorDraftState] = useState<CreatorDraft[]>(creatorDrafts);
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);
  const [experienceDoorId, setExperienceDoorId] = useState<ExperienceDoorId>('win-trust');
  const [catalogFamily, setCatalogFamily] = useState<CatalogFamily | 'Packages'>('ISG');
  const [catalogQuery, setCatalogQuery] = useState('');
  const [catalogDoor, setCatalogDoor] = useState('All doors');
  const [catalogStage, setCatalogStage] = useState('All stages');
  const [catalogPersona, setCatalogPersona] = useState('All personas');
  const [catalogTrigger, setCatalogTrigger] = useState('All triggers');
  const [catalogFramework, setCatalogFramework] = useState('All frameworks');
  const [catalogCategory, setCatalogCategory] = useState('All categories');
  const [selectedCatalogService, setSelectedCatalogService] = useState<CatalogService | null>(null);
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
  const [expandedIcp, setExpandedIcp] = useState(false);
  const [notice, setNotice] = useState('');

  const activeProfile = viewProfiles[activeView];
  const visibleWidgets = visibleWidgetsByView[activeView];
  const activeLensOptions = activeProfile.lensPriority;

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

  const catalogCategories = useMemo(() => ['All categories', ...new Set(catalogServices.filter((service) => catalogFamily === 'Packages' || service.family === catalogFamily).map((service) => service.category))], [catalogFamily]);
  const filteredCatalogServices = useMemo(() => {
    const normalizedQuery = catalogQuery.trim().toLowerCase();
    return catalogServices.filter((service) => {
      const queryMatch = !normalizedQuery || `${service.name} ${service.description} ${service.code} ${service.family} ${service.category} ${service.triggers.join(' ')}`.toLowerCase().includes(normalizedQuery);
      const familyMatch = catalogFamily === 'Packages' || service.family === catalogFamily;
      const doorMatch = catalogDoor === 'All doors' || service.doors.includes(catalogDoors.find((item) => item.label === catalogDoor)?.id ?? 'win-trust');
      const stageMatch = catalogStage === 'All stages' || service.stages.includes(catalogStage as MaturityStage);
      const personaMatch = catalogPersona === 'All personas' || service.personas.includes(catalogPersona);
      const triggerMatch = catalogTrigger === 'All triggers' || service.triggers.includes(catalogTrigger);
      const frameworkMatch = catalogFramework === 'All frameworks' || service.frameworks.includes(catalogFramework);
      const categoryMatch = catalogCategory === 'All categories' || service.category === catalogCategory;
      return queryMatch && familyMatch && doorMatch && stageMatch && personaMatch && triggerMatch && frameworkMatch && categoryMatch;
    });
  }, [catalogCategory, catalogDoor, catalogFamily, catalogFramework, catalogPersona, catalogQuery, catalogStage, catalogTrigger]);

  const closeCatalog = () => { setShowCatalog(false); setSelectedCatalogService(null); };
  const closeCreator = () => setShowCreator(false);

  useEffect(() => {
    if (!showExperience && !showCatalog && !showCreator) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showCatalog) closeCatalog();
        else if (showCreator) closeCreator();
        else setShowExperience(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [showCatalog, showCreator, showExperience]);

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
  const openExperience = () => { setShowExperience(true); setMobileActionsOpen(false); };
  const openCatalog = () => { setShowCatalog(true); setMobileActionsOpen(false); };
  const openCreator = () => { setShowCreator(true); setMobileActionsOpen(false); };
  const goToIcp = (direction: number) => {
    setActiveIcpIndex((current) => (current + direction + icpProfiles.length) % icpProfiles.length);
  };
  const selectedWorkflow = selectedFinding ? workflowFor(selectedFinding) : null;

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup"><img className="brand-image" src={logoData} alt="3HUE Executive Consulting" /><span className="brand-divider" aria-hidden="true" /><span className="brand-product-lockup"><span>MARKET</span><strong>INTEL</strong></span></div>
        <div className="topnav-cluster"><nav className="topnav" aria-label="Dashboard view" role="tablist">{(['Analyst', 'Director', 'C-suite'] as View[]).map((view) => <button key={view} className={`topnav-item ${activeView === view ? 'active' : ''}`} onClick={() => setActiveView(view)} role="tab" aria-selected={activeView === view}>{view}</button>)}</nav><button className="topbar-pill topbar-customize" onClick={() => setShowCustomize(true)}><SlidersHorizontal size={14} /> Customize</button></div>
        <div className="topbar-actions"><button className="topbar-pill topbar-create" onClick={openCreator}><Sparkles size={14} /> Create</button><button className="topbar-pill" onClick={() => announce('Guide content is ready for the connected workspace.')}>Guide</button><button className="topbar-pill" onClick={openCatalog}>Product catalog</button><button className="topbar-pill topbar-experience" onClick={openExperience}>Experience</button><button className="icon-button topbar-icon" aria-label="Notifications" onClick={() => announce('No new high-impact alerts.')}><Bell size={17} /></button><button className="user-chip" title="Admin intelligence center" aria-label="Open admin intelligence center" onClick={() => openAdmin()}><span className="avatar">NB</span><ChevronDown size={14} /></button></div>
        <div className="mobile-actions"><button className="mobile-overflow-button" aria-label="Open workspace actions" aria-expanded={mobileActionsOpen} onClick={() => setMobileActionsOpen((current) => !current)}><Menu size={18} /></button><button className="user-chip" title="Admin intelligence center" aria-label="Open admin intelligence center" onClick={() => openAdmin()}><span className="avatar">NB</span><ChevronDown size={13} /></button>{mobileActionsOpen && <div className="mobile-action-menu"><button onClick={openCreator}>Create</button><button onClick={() => setShowCustomize(true)}>Customize</button><button onClick={openExperience}>Experience</button><button onClick={openCatalog}>Product catalog</button><button onClick={() => { openAdmin(); setMobileActionsOpen(false); }}>Admin center</button></div>}</div>
      </header>

      <div className="builder-main">
        <section className="content-area">
          <div className="content-heading"><div><p className="eyebrow accent-eyebrow">{activeProfile.eyebrow} · {activeView} view · Wednesday, September 10, 2026</p><h1>{activeProfile.title}</h1><p className="heading-subtitle">{activeProfile.subtitle}</p><span className="preview-badge"><Activity size={13} /> Review mode · representative data</span></div><div className="heading-actions">{hasAction('present') && <button className="primary-button" onClick={() => setShowPresent(true)}><ArrowUpRight size={15} /> Present brief</button>}</div></div>

          <div className="filter-row"><div className="search-box"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search findings, accounts, sources" aria-label="Search findings, accounts, sources" /></div><label className="select-wrap"><Filter size={14} /><select value={segment} onChange={(event) => setSegment(event.target.value)} aria-label="Filter by customer segment"><option>All segments</option><option>Provable Vendor</option><option>Portfolio</option><option>Regulated Operator</option></select><ChevronDown size={13} /></label><span className="filter-note"><Clock3 size={14} /> Next collection in 3h 42m</span></div>
          <div className="chip-row"><span className="chip-label">Market lenses</span><button className={`filter-chip ${lens === 'All lenses' ? 'active' : ''}`} onClick={() => setLens('All lenses')}>All lenses</button>{activeLensOptions.map((option) => <button key={option} className={`filter-chip ${lens === option ? 'active' : ''}`} onClick={() => setLens(option)} title={marketLensDefinitions.find((item) => item.label === option)?.description}>{option}</button>)}</div>

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

        <aside className="icp-rail" aria-label="3HUE ICP rotation"><div className="icp-rail-header"><div><p className="eyebrow">Targeting lens</p><h2>Who we are watching</h2></div><span className="rail-code">3HUE / ICP</span></div><div className="icp-carousel" aria-label="3HUE ICP profiles"><div className="icp-track">{icpProfiles.map((profile, index) => { const offset = (index - activeIcpIndex + icpProfiles.length) % icpProfiles.length; return <button key={profile.id} className={`icp-card icp-card-${profile.color} ${offset === 0 ? 'active' : offset === 1 ? 'next' : 'previous'}`} onClick={() => { setActiveIcpIndex(index); setExpandedIcp(true); }} aria-label={`Open ${profile.name} ICP profile`} aria-pressed={offset === 0}><div className="icp-card-top"><span className="eyebrow">{profile.hue}</span><span className="icp-card-index">{String(index + 1).padStart(2, '0')} / {icpProfiles.length}</span></div><strong>{profile.name}</strong><span className="icp-tagline">{profile.tagline}</span><p>{profile.description}</p><span className="icp-share">{profile.segmentShare}</span><span className="icp-signal"><span className="status-dot" />{profile.signal}</span><span className="icp-card-link">Open profile <ArrowUpRight size={12} /></span></button>; })}</div><div className="icp-dots" aria-label="Choose ICP">{icpProfiles.map((profile, index) => <button key={profile.id} className={`icp-dot ${index === activeIcpIndex ? 'active' : ''}`} onClick={() => { setActiveIcpIndex(index); setExpandedIcp(true); }} aria-label={`Show ${profile.name}`} />)}</div></div><div className="icp-controls"><span className="icp-rotation-status"><span className={`icp-live-dot ${icpPaused ? 'paused' : ''}`} />{icpPaused ? 'Paused' : 'Auto-rotating'}</span><div><button className="icon-button" aria-label="Previous ICP" onClick={() => goToIcp(-1)}><ChevronLeft size={15} /></button><button className="secondary-button small-button" onClick={() => setIcpPaused((current) => !current)}>{icpPaused ? 'Resume' : 'Pause'}</button><button className="icon-button" aria-label="Next ICP" onClick={() => goToIcp(1)}><ChevronRight size={15} /></button></div></div><div className="icp-rail-footer"><Sparkles size={14} /><span>Source facts and guidance are kept visibly separate.</span></div>{expandedIcp && <div className="icp-profile-panel"><div className="icp-profile-heading"><div><p className="eyebrow">{icpProfiles[activeIcpIndex].hue} · source-backed profile</p><h3>{icpProfiles[activeIcpIndex].name}</h3></div><button className="icon-button" onClick={() => setExpandedIcp(false)} aria-label="Close ICP profile"><X size={16} /></button></div><p className="icp-profile-situation">{icpProfiles[activeIcpIndex].situation}</p><div className="icp-profile-grid"><div><span>Forcing function</span><p>{icpProfiles[activeIcpIndex].forcingFunction}</p></div><div><span>Segment estimate</span><p>{icpProfiles[activeIcpIndex].segmentShare}</p></div><div><span>Trigger signals</span><ul>{icpProfiles[activeIcpIndex].triggerSignals.map((item) => <li key={item}>{item}</li>)}</ul></div><div><span>Buying committee</span><p>{icpProfiles[activeIcpIndex].buyingCommittee}</p></div><div><span>Relevant service fit</span><div className="icp-profile-tags">{icpProfiles[activeIcpIndex].serviceFit.map((item) => <span key={item}>{item}</span>)}</div></div><div><span>Marketing angle</span><p>{icpProfiles[activeIcpIndex].messageAngle}</p></div></div><div className="icp-profile-boundary"><strong>Evidence boundary</strong><p>{icpProfiles[activeIcpIndex].evidence}</p><span>Disqualifiers: {icpProfiles[activeIcpIndex].disqualifiers.join(' · ')}</span></div></div>}</aside>
      </div>

      {showExperience && <ExperienceOverlay activeDoorId={experienceDoorId} onSelectDoor={setExperienceDoorId} onClose={() => setShowExperience(false)} onOpenCatalog={openCatalog} onTalkToTeam={() => announce('Conversation request is ready for the next connected workflow.')} />}
      {showCatalog && <CatalogOverlay family={catalogFamily} setFamily={setCatalogFamily} query={catalogQuery} setQuery={setCatalogQuery} door={catalogDoor} setDoor={setCatalogDoor} stage={catalogStage} setStage={setCatalogStage} persona={catalogPersona} setPersona={setCatalogPersona} trigger={catalogTrigger} setTrigger={setCatalogTrigger} framework={catalogFramework} setFramework={setCatalogFramework} category={catalogCategory} setCategory={setCatalogCategory} categories={catalogCategories} services={filteredCatalogServices} selectedService={selectedCatalogService} setSelectedService={setSelectedCatalogService} onClose={closeCatalog} />}
      {showCreator && <CreatorOverlay activeView={activeView} onClose={closeCreator} onNotice={announce} assets={creatorAssetState} setAssets={setCreatorAssetState} drafts={creatorDraftState} setDrafts={setCreatorDraftState} />}

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
