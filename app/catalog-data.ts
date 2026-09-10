import sourceCatalog from '../docs/discovery/solution-builder-catalog-2026-09-09/catalog.json';
import { LOBBY_CONTENT, type ExperienceDoorId, type MaturityStage } from './experience-data';

export type { ExperienceDoorId, MaturityStage } from './experience-data';
export type CatalogFamily = 'ISG' | 'ITG' | 'ITC Staff Aug' | 'Professional Services';
export type CatalogEvidenceLabel = 'Observed Builder record' | 'Draft catalog record' | 'Confirm price';

export type CatalogService = {
  family: CatalogFamily;
  category: string;
  name: string;
  code: string;
  description: string;
  price: string;
  billing: string;
  priceStatus?: 'from' | 'confirm';
  catalogStatus?: 'draft';
  doors: ExperienceDoorId[];
  stages: MaturityStage[];
  personas: string[];
  triggers: string[];
  frameworks: string[];
  marketingAngle: string;
  evidenceLabel: CatalogEvidenceLabel;
};

export type CatalogPackage = {
  name: string;
  services: number;
  pricing: string;
  description: string;
  door: ExperienceDoorId;
  stage: MaturityStage;
};

type SourceService = Omit<CatalogService, 'doors' | 'stages' | 'personas' | 'triggers' | 'frameworks' | 'marketingAngle' | 'evidenceLabel'>;

const frameworkNames = ['ISO 27001', 'ISO 27701', 'SOC 2', 'NIST CSF', 'HIPAA', 'PCI DSS', 'CMMC', 'GDPR', 'CCPA/CPRA', 'ISO 22301', 'NIST RMF'];
const triggerNames = [
  'Enterprise deal or renewal blocked by assurance requirements',
  'Investor, lender, or acquirer diligence',
  'Regulatory examination, audit finding, or remediation deadline',
  'AI rollout or customer assurance question',
  'Security incident, continuity concern, or response readiness gap',
  'Technology modernization or delivery-capacity gap',
];

const includesAny = (value: string, words: string[]) => words.some((word) => value.includes(word));

function classifyDoors(service: SourceService): ExperienceDoorId[] {
  const text = `${service.name} ${service.category} ${service.description}`.toLowerCase();
  const doors = new Set<ExperienceDoorId>();
  if (includesAny(text, ['portfolio', 'board', 'investor', 'vendor', 'enterprise architecture', 'project management', 'ppm', 'vcio', 'dmp'])) doors.add('gain-control');
  if (includesAny(text, ['incident', 'resilience', 'continuity', 'mdr', 'mxdr', 'security controls', 'privacy', 'regulator', 'risk', 'ciso', 'soc /', 'threat'])) doors.add('stay-ready');
  if (includesAny(text, ['soc 2', 'iso', 'assurance', 'audit', 'rfp', 'customer', 'readiness', 'policy', 'evidence', 'compliance', 'secure'])) doors.add('win-trust');
  if (doors.size === 0) doors.add(service.family === 'ITG' ? 'gain-control' : 'win-trust');
  return [...doors];
}

function classifyStages(service: SourceService): MaturityStage[] {
  const text = `${service.name} ${service.category} ${service.description}`.toLowerCase();
  const stages = new Set<MaturityStage>();
  if (includesAny(text, ['assessment', 'assessment', 'analysis', 'mapping', 'inventory', 'audit', 'gap', 'dmp'])) stages.add('Assess');
  if (includesAny(text, ['development', 'review', 'update', 'implementation', 'architecture', 'plan', 'policy', 'program', 'deployment', 'engineering'])) stages.add('Strengthen');
  if (includesAny(text, ['managed', 'support', 'as-a-service', 'operations', 'monitoring', 'command', 'retainer', 'administration', 'staff'])) stages.add('Operate');
  if (includesAny(text, ['advisory', 'strategy', 'reporting', 'analytics', 'roadmap', 'leadership', 'principal', 'architect'])) stages.add('Advance');
  if (stages.size === 0) stages.add('Strengthen');
  return [...stages];
}

function classifyPersonas(doors: ExperienceDoorId[]): string[] {
  return doors.map((door) => door === 'win-trust' ? 'Provable Vendor' : door === 'gain-control' ? 'Portfolio' : 'Regulated Operator');
}

function classifyTriggers(service: SourceService, doors: ExperienceDoorId[]): string[] {
  const text = `${service.name} ${service.category} ${service.description}`.toLowerCase();
  const triggers = triggerNames.filter((trigger, index) => {
    if (index === 0) return doors.includes('win-trust') || includesAny(text, ['customer', 'assurance', 'soc 2', 'iso', 'rfp']);
    if (index === 1) return doors.includes('gain-control') || includesAny(text, ['portfolio', 'investor', 'board', 'vendor', 'project']);
    if (index === 2) return doors.includes('stay-ready') || includesAny(text, ['risk', 'privacy', 'audit', 'compliance', 'regulator']);
    if (index === 3) return includesAny(text, ['ai', 'data', 'privacy', 'customer', 'governance']);
    if (index === 4) return includesAny(text, ['incident', 'response', 'resilience', 'continuity', 'mdr', 'security']);
    return includesAny(text, ['engineering', 'infrastructure', 'project', 'architecture', 'staff', 'managed']);
  });
  return triggers.length ? triggers.slice(0, 3) : [triggerNames[0]];
}

function classifyFrameworks(service: SourceService): string[] {
  const text = `${service.name} ${service.category} ${service.description}`.toLowerCase();
  const matches = frameworkNames.filter((framework) => text.includes(framework.toLowerCase().replace('ccpa/cpra', 'ccpa')));
  if (matches.length) return matches.slice(0, 4);
  if (service.family === 'ITG') return ['NIST CSF', 'ISO 27001'];
  if (service.family === 'ITC Staff Aug') return ['NIST CSF'];
  return ['NIST CSF', 'SOC 2'];
}

function marketingAngle(service: SourceService, doors: ExperienceDoorId[], stages: MaturityStage[]): string {
  const doorLabel = doors[0] === 'win-trust' ? 'proof that can move a deal' : doors[0] === 'gain-control' ? 'visibility and leverage across the portfolio' : 'defensible operating confidence';
  const stageLabel = stages[0].toLowerCase();
  return `Position this as a ${stageLabel} move toward ${doorLabel}. Lead with the buyer trigger, then explain the evidence or operating outcome this service supports.`;
}

export const catalogServices: CatalogService[] = (sourceCatalog.services as SourceService[]).map((service) => {
  const doors = classifyDoors(service);
  const stages = classifyStages(service);
  return {
    ...service,
    doors,
    stages,
    personas: classifyPersonas(doors),
    triggers: classifyTriggers(service, doors),
    frameworks: classifyFrameworks(service),
    marketingAngle: marketingAngle(service, doors, stages),
    evidenceLabel: service.catalogStatus === 'draft' ? 'Draft catalog record' : service.priceStatus === 'confirm' ? 'Confirm price' : 'Observed Builder record',
  };
});

export const catalogPackages: CatalogPackage[] = [
  { name: 'SOC 2 Readiness', services: 4, pricing: '$51,470 first year', description: 'Policies, risk assessment, incident response planning, and audit support for a first-time SOC 2 Type II candidate.', door: 'win-trust', stage: 'Strengthen' },
  { name: 'ISO 27001 Certification Readiness', services: 4, pricing: '$45,310 first year', description: 'ISMS scope and SoA, policy library, risk assessment, and management review facilitation.', door: 'win-trust', stage: 'Strengthen' },
  { name: 'ISO 27701 Privacy Readiness', services: 4, pricing: '$40,425 first year', description: 'Privacy maturity, program CONOPS, data mapping, and DPIA support for a certification-track privacy program.', door: 'win-trust', stage: 'Strengthen' },
  { name: 'PCI-DSS Readiness', services: 4, pricing: '$31,790 first year', description: 'Controls gap assessment, policy library, vulnerability management, and scanner tuning for PCI scope.', door: 'stay-ready', stage: 'Strengthen' },
  { name: 'Incident Response Fast Start', services: 4, pricing: '$31,800 first year', description: 'Plan, playbooks, tabletop exercise, and standing incident command in one response-readiness path.', door: 'stay-ready', stage: 'Operate' },
  { name: 'Privacy Leadership Launch', services: 3, pricing: '$58,340 first year · $108,980 TCV', description: 'Maturity assessment followed by fractional privacy leadership and a managed program.', door: 'stay-ready', stage: 'Operate' },
  { name: 'MXDR Complete Protection', services: 3, pricing: '$94,965 first year · $284,895 TCV', description: 'Full-platform XDR with SIEM retention and annual endpoint-controls validation, quoted per node.', door: 'stay-ready', stage: 'Operate' },
];

export const catalogFamilies: Array<CatalogFamily | 'Packages'> = ['ISG', 'ITG', 'ITC Staff Aug', 'Professional Services', 'Packages'];
export const catalogDoors: Array<{ id: ExperienceDoorId; label: string }> = LOBBY_CONTENT.doors.map(({ id, title }) => ({ id, label: title }));
export const catalogStages: MaturityStage[] = ['Assess', 'Strengthen', 'Operate', 'Advance'];
export const catalogPersonas = ['Provable Vendor', 'Portfolio', 'Regulated Operator'];
export const catalogFrameworks = frameworkNames;
export const catalogTriggers = triggerNames;
