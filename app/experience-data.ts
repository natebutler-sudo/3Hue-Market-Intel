export type ExperienceDoorId = 'win-trust' | 'gain-control' | 'stay-ready';
export type MaturityStage = 'Assess' | 'Strengthen' | 'Operate' | 'Advance';

export type LobbyDoor = {
  id: ExperienceDoorId;
  title: string;
  promise: string;
  audience: string;
  icp: string;
  triggers: string[];
  tension: string;
  gap: string;
  serviceFamilies: string[];
  decision: string;
  maturityEmphasis: MaturityStage[];
  color: 'cyan' | 'orange' | 'navy';
};

export const LOBBY_CONTENT = {
  eyebrow: 'Your maturity partner',
  heading: ['Three doors.', 'One path to maturity.'],
  headingAccent: 'One path',
  subline: ['Advisory. Oversight. Operational confidence.', "Built for what's next."],
  stages: ['Assess', 'Strengthen', 'Operate', 'Advance'] as MaturityStage[],
  doors: [
    {
      id: 'win-trust',
      title: 'Win Trust',
      promise: 'Prove you are ready.',
      audience: 'For teams that need customer assurance, readiness evidence, or a faster path through diligence.',
      icp: 'SaaS & AI vendors',
      triggers: ['An enterprise deal or renewal is blocked by assurance requirements.', 'A customer, insurer, or investor is asking for evidence you cannot assemble quickly.', 'AI adoption is creating new customer questions about ownership and control.'],
      tension: 'The business is ready to grow, but proof is scattered across policies, systems, and people.',
      gap: 'The gap is between having good intentions and being able to show repeatable evidence when the buyer asks.',
      serviceFamilies: ['Risk assessment and risk management', 'Information security program and governance', 'Privacy management and data protection', 'ISMS, SSPP, and statement of applicability'],
      decision: 'Choose the evidence and operating work that turns readiness into buyer confidence.',
      maturityEmphasis: ['Assess', 'Strengthen', 'Advance'],
      color: 'cyan',
    },
    {
      id: 'gain-control',
      title: 'Gain Control',
      promise: 'See and govern what matters.',
      audience: 'For ownership and operating teams that need shared visibility, leverage, and governance across multiple companies.',
      icp: 'Portfolio owners',
      triggers: ['A new platform acquisition or portfolio review needs a common view.', 'Board, lender, or investor reporting is inconsistent across holdings.', 'The portfolio needs more control without adding a full internal team.'],
      tension: 'Important risk and technology decisions are being made company by company without a shared operating picture.',
      gap: 'The gap is between local activity and portfolio-level oversight that can guide investment, sequencing, and accountability.',
      serviceFamilies: ['Digital maturity paradigm assessments', 'Managed enterprise architecture programs', 'Vendor and third-party risk management', 'Board and investor performance reporting'],
      decision: 'Create a repeatable governance rhythm that gives leaders visibility without slowing operators down.',
      maturityEmphasis: ['Assess', 'Operate', 'Advance'],
      color: 'orange',
    },
    {
      id: 'stay-ready',
      title: 'Stay Ready',
      promise: 'Operate defensibly.',
      audience: 'For regulated and risk-heavy operators that need clear ownership, resilience, response, and evidence that survives scrutiny.',
      icp: 'Regulated operators',
      triggers: ['An examiner request, audit finding, or remediation deadline is active.', 'An incident or continuity concern exposes a readiness gap.', 'Regulatory, privacy, or AI adoption pressure is crossing operational boundaries.'],
      tension: 'The organization cannot afford to discover ownership or evidence gaps during an examination or incident.',
      gap: 'The gap is between documented plans and an operating model that stays ready when conditions change.',
      serviceFamilies: ['Cyber incident response programs', 'Business continuity and operational resilience', 'Managed detection and response', 'Privacy management and data protection'],
      decision: 'Establish the accountable programs and managed practices that make readiness continuous.',
      maturityEmphasis: ['Strengthen', 'Operate', 'Advance'],
      color: 'navy',
    },
  ] as LobbyDoor[],
} as const;

export type LobbyGeometry = {
  width: number;
  height: number;
  doorways: Record<ExperienceDoorId, {
    center: { x: number; y: number };
    frame: { left: number; top: number; right: number; bottom: number };
    sign: { x: number; y: number; angle: number };
  }>;
  tower: { x: number; y: number };
  rings: Array<{ x: number; y: number }>;
};

const plateScale = 2880 / 1672;
const old = (value: number) => Math.round(value * plateScale * 10) / 10;

export const LOBBY_GEOMETRY: LobbyGeometry = {
  width: 2880,
  height: 1621,
  doorways: {
    'win-trust': { center: { x: old(333), y: old(537) }, frame: { left: old(220), top: old(330), right: old(450), bottom: old(665) }, sign: { x: old(338), y: old(390), angle: 0 } },
    'gain-control': { center: { x: old(748), y: old(535) }, frame: { left: old(665), top: old(355), right: old(840), bottom: old(650) }, sign: { x: old(748), y: old(401), angle: 0 } },
    'stay-ready': { center: { x: old(1357), y: old(540) }, frame: { left: old(1260), top: old(345), right: old(1445), bottom: old(660) }, sign: { x: old(1353), y: old(398), angle: 0 } },
  },
  tower: { x: old(969), y: old(225) },
  rings: [116, 193, 266, 334].map((y) => ({ x: old(969), y: old(y) })),
};

export const LOBBY_IMAGE_SOURCES = {
  sizes: `max(100vw, ${Math.round((100 * LOBBY_GEOMETRY.width / LOBBY_GEOMETRY.height) * 100) / 100}vh)`,
  avif: ['/lobby-plate-828.avif 828w', '/lobby-plate-1280.avif 1280w', '/lobby-plate-1920.avif 1920w', '/lobby-plate-2880.avif 2880w'].join(', '),
  webp: ['/lobby-plate-828.webp 828w', '/lobby-plate-1280.webp 1280w', '/lobby-plate-1920.webp 1920w', '/lobby-plate-2880.webp 2880w'].join(', '),
  jpeg: ['/lobby-plate-828.jpg 828w', '/lobby-plate-1280.jpg 1280w', '/lobby-plate-1920.jpg 1920w', '/lobby-plate-2880.jpg 2880w'].join(', '),
};

// 32×18 blurred scene preview; 337 encoded bytes, kept inline so the lobby never flashes a blank canvas.
export const LOBBY_PLACEHOLDER_DATA_URI = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABsSFBcUERsXFhceHBsgKEIrKCUlKFE6PTBCYFVlZF9VXVtqeJmBanGQc1tdhbWGkJ6jq62rZ4C8ybqmx5moq6T/2wBDARweHigjKE4rK06kbl1upKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/wAARCAASACADASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAAIDAQQF/8QAHRAAAwACAgMAAAAAAAAAAAAAAAECAzESISIyUf/EABUBAQEAAAAAAAAAAAAAAAAAAAEA/8QAFhEBAQEAAAAAAAAAAAAAAAAAABEB/9oADAMBAAIRAxEAPwDwJgeZ7KY0mM4+BTGUlxJzPkUUtvsXIktDREsWzrjQARYyF+wAWjH/2Q==';
