export type CreatorTab = 'Create' | 'Library' | 'Brand kit' | 'Campaigns' | 'Templates';
export type CreatorOutputType = 'Social post' | 'Content brief' | 'Image direction' | 'Ad concept' | 'Video outline';
export type CreatorAssetStatus = 'Approved reference' | 'Draft' | 'Needs review' | 'Published reference';

export type CreatorFolder = {
  id: string;
  label: string;
  parentId?: string;
  description: string;
};

export type CreatorAsset = {
  id: string;
  name: string;
  kind: 'Logo' | 'Brand rule' | 'Source document' | 'Video plan' | 'Campaign' | 'Image' | 'Ad';
  folderId: string;
  status: CreatorAssetStatus;
  source: string;
  description: string;
  updatedAt: string;
  hue?: string;
};

export type BrandKitRecord = {
  id: string;
  label: string;
  value: string;
  status: 'Approved reference' | 'Needs confirmation';
  source: string;
};

export type CreatorDraft = {
  id: string;
  title: string;
  outputType: CreatorOutputType;
  folderId: string;
  status: CreatorAssetStatus;
  hue: string;
  channel: string;
  updatedAt: string;
};

export const creatorFolders: CreatorFolder[] = [
  { id: 'brand-kit', label: 'Brand kit', description: 'Identity, voice, approved proof, and usage rules.' },
  { id: 'brand-logos', label: 'Logos', parentId: 'brand-kit', description: 'Official 3HUE marks and lockups.' },
  { id: 'brand-style', label: 'Colors and typography', parentId: 'brand-kit', description: 'Color, type, and visual direction.' },
  { id: 'brand-voice', label: 'Voice and approved claims', parentId: 'brand-kit', description: 'Approved language, proof, and guardrails.' },
  { id: 'brand-templates', label: 'Templates', parentId: 'brand-kit', description: 'Reusable content and campaign formats.' },
  { id: 'campaigns', label: 'Campaigns', description: 'Campaign briefs, launch plans, and working sets.' },
  { id: 'social', label: 'Social', description: 'Channel-ready posts and social series.' },
  { id: 'video', label: 'Video', description: 'Video outlines, scripts, thumbnails, and plans.' },
  { id: 'ads', label: 'Ads', description: 'Ad concepts, copy, and creative directions.' },
  { id: 'images', label: 'Images', description: 'Approved and working visual assets.' },
  { id: 'archive', label: 'Archive', description: 'Retired drafts and historical campaign material.' },
];

export const creatorAssets: CreatorAsset[] = [
  { id: 'asset-logo-dark', name: '3HUE official logo dark', kind: 'Logo', folderId: 'brand-logos', status: 'Approved reference', source: 'Supplied logo-dark.png', description: 'Primary supplied logo for dark Builder-style surfaces.', updatedAt: 'Supplied today' },
  { id: 'asset-three-doors', name: 'Three Doors concept', kind: 'Image', folderId: 'images', status: 'Approved reference', source: 'Supplied experience concept', description: 'Customer experience image used as the Three Doors landing surface.', updatedAt: 'Supplied today', hue: 'All hues' },
  { id: 'asset-brand-sheet', name: '3HUE Brand Sheet', kind: 'Brand rule', folderId: 'brand-style', status: 'Needs review', source: 'Supplied source library', description: 'Identity, typography, color, UI tokens, and usage guidance.', updatedAt: 'September 9, 2026' },
  { id: 'asset-message-stack', name: 'Message Stack', kind: 'Source document', folderId: 'brand-voice', status: 'Needs review', source: 'Supplied source library', description: 'Core narrative, segment messaging, claims, objections, and vocabulary.', updatedAt: 'September 9, 2026' },
  { id: 'asset-ship-list', name: 'The Ship List', kind: 'Campaign', folderId: 'campaigns', status: 'Needs review', source: 'Supplied source library', description: '90-day execution sequence, founder series, outreach, and offer one-pagers.', updatedAt: 'September 9, 2026' },
  { id: 'asset-youtube-plan', name: 'YouTube channel plan', kind: 'Video plan', folderId: 'video', status: 'Needs review', source: 'Supplied source library', description: 'CEO Corner direction, channel topics, and video rollout planning.', updatedAt: 'September 9, 2026' },
  { id: 'asset-solution-builder', name: 'Solution Builder reference gallery', kind: 'Source document', folderId: 'brand-templates', status: 'Approved reference', source: 'Observed Builder screenshots', description: 'Visual reference for the compact navy shell and guided catalog patterns.', updatedAt: 'September 9, 2026' },
];

export const brandKitRecords: BrandKitRecord[] = [
  { id: 'brand-primary', label: 'Primary identity', value: '3HUE Executive Consulting', status: 'Approved reference', source: 'Company profile and supplied logo' },
  { id: 'brand-language', label: 'Brand meaning', value: 'A standard of execution; “get a 3HUE on it.”', status: 'Approved reference', source: 'Founder call · September 3, 2026' },
  { id: 'brand-visual', label: 'Visual direction', value: 'Dark navy foundation, cyan navigation accents, restrained orange highlights.', status: 'Approved reference', source: 'Design direction and Builder reference' },
  { id: 'brand-guardrail', label: 'Claims guardrail', value: 'Separate source facts, analyst guidance, estimates, and unvalidated claims.', status: 'Approved reference', source: 'Research status and source library' },
  { id: 'brand-proof', label: 'Proof status', value: 'Customer stories and public claims require source and approval checks before reuse.', status: 'Needs confirmation', source: 'Research dossier' },
];

export const creatorDrafts: CreatorDraft[] = [
  { id: 'draft-governed-ai', title: 'Who owns AI evidence after deployment?', outputType: 'Social post', folderId: 'social', status: 'Draft', hue: 'Regulated Operator', channel: 'LinkedIn', updatedAt: 'Today · representative draft' },
  { id: 'draft-youtube-ceo-corner', title: 'CEO Corner · operated readiness', outputType: 'Video outline', folderId: 'video', status: 'Needs review', hue: 'Stay Ready', channel: 'YouTube', updatedAt: 'Yesterday · representative draft' },
];

export const creatorOutputTypes: CreatorOutputType[] = ['Social post', 'Content brief', 'Image direction', 'Ad concept', 'Video outline'];
export const creatorChannels = ['LinkedIn', 'YouTube', 'Email', 'Website', 'Paid social'];
