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
  folderId: 'brand-kit' | 'brand-logos' | 'brand-style' | 'brand-voice' | 'brand-templates';
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
  { id: 'asset-logo-dark', name: '3HUE official logo dark', kind: 'Logo', folderId: 'brand-logos', status: 'Approved reference', source: 'Supplied logo-dark.png · also used by the workspace', description: 'Primary supplied 3HUE lockup for dark surfaces. Keep clear space around the mark and use this file until the vector master and approved variants are supplied.', updatedAt: 'Supplied today' },
  { id: 'asset-three-doors', name: 'Three Doors concept', kind: 'Image', folderId: 'images', status: 'Approved reference', source: 'Supplied experience concept', description: 'Customer experience image used as the Three Doors landing surface.', updatedAt: 'Supplied today', hue: 'All hues' },
  { id: 'asset-brand-sheet', name: '3HUE Brand Sheet', kind: 'Brand rule', folderId: 'brand-style', status: 'Approved reference', source: 'Supplied source library · brand-sheet.pdf', description: 'Identity, typography, color, UI tokens, verbal identity, naming, and usage guidance. Use this as the starting point for visual decisions.', updatedAt: 'September 9, 2026' },
  { id: 'asset-message-stack', name: 'Message Stack', kind: 'Source document', folderId: 'brand-voice', status: 'Approved reference', source: 'Supplied source library · message-stack.pdf', description: 'Core narrative, positioning, pillars, segment messaging, claims, objections, battlecards, and approved vocabulary.', updatedAt: 'September 9, 2026' },
  { id: 'asset-company-profile', name: 'Company profile and public positioning', kind: 'Source document', folderId: 'brand-voice', status: 'Approved reference', source: 'Supplied source library · company-profile.md + 3hue.net', description: 'Company identity, founder-led delivery model, public positioning, services, industries, and evidence boundaries.', updatedAt: 'September 9, 2026' },
  { id: 'asset-name-origin', name: 'What 3HUE means', kind: 'Brand rule', folderId: 'brand-voice', status: 'Approved reference', source: 'Founder call · September 3, 2026', description: '3HUE is a standard of execution, used as an adjective (“get a 3HUE on it”). It is not an acronym and should not be described as “the three hues of security.”', updatedAt: 'September 9, 2026' },
  { id: 'asset-ship-list', name: 'The Ship List', kind: 'Campaign', folderId: 'campaigns', status: 'Needs review', source: 'Supplied source library · ship-list.html', description: '90-day execution sequence, founder series, outreach, and offer one-pagers. It belongs with campaign planning rather than the brand kit.', updatedAt: 'September 9, 2026' },
  { id: 'asset-youtube-plan', name: 'YouTube channel plan', kind: 'Video plan', folderId: 'video', status: 'Needs review', source: 'Supplied source library · research notes', description: 'CEO Corner direction, channel topics, and video rollout planning. It remains in Video until finished media is supplied.', updatedAt: 'September 9, 2026' },
  { id: 'asset-solution-builder', name: 'Solution Builder reference gallery', kind: 'Source document', folderId: 'archive', status: 'Approved reference', source: 'Observed Builder screenshots', description: 'Historical visual reference for the compact navy shell and guided catalog patterns. It is archived as a product reference, not a reusable brand template.', updatedAt: 'September 9, 2026' },
];

export const brandKitRecords: BrandKitRecord[] = [
  { id: 'brand-primary', label: 'Primary identity', value: '3HUE Executive Consulting LLC · founder-led advisory and managed services firm.', folderId: 'brand-kit', status: 'Approved reference', source: 'Company profile and 3hue.net' },
  { id: 'brand-language', label: 'Brand meaning', value: '3HUE is a standard of execution; use “get a 3HUE on it.” Do not expand the name into an acronym.', folderId: 'brand-voice', status: 'Approved reference', source: 'Founder call · September 3, 2026' },
  { id: 'brand-positioning', label: 'Public positioning', value: 'Enterprise AI needs a governing layer. We build it.', folderId: 'brand-voice', status: 'Approved reference', source: '3hue.net · September 2026' },
  { id: 'brand-visual', label: 'Visual foundation', value: 'Dark navy foundation, cyan navigation accents, restrained orange highlights, generous space, crisp type.', folderId: 'brand-style', status: 'Approved reference', source: 'Design direction and Builder reference' },
  { id: 'brand-colors', label: 'Color guidance', value: 'Cyan accent #44A8D9 is used in the supplied marketing system; pair with dark navy, white, and accessible contrast states.', folderId: 'brand-style', status: 'Needs confirmation', source: 'Supplied keyword map + design direction' },
  { id: 'brand-type', label: 'Typography', value: 'Sora for display, IBM Plex Sans for body copy, and IBM Plex Mono for metadata and labels.', folderId: 'brand-style', status: 'Approved reference', source: 'Marketing folder structure · 02_Brand / Fonts' },
  { id: 'brand-logo-system', label: 'Logo system', value: '3HUE master lockup is the company mark. ISG, OPS, and ITG are service marks and must never replace the company logo. AiVRIC is kept separate.', folderId: 'brand-logos', status: 'Approved reference', source: 'Marketing folder structure · 02_Brand / Logos' },
  { id: 'brand-guardrail', label: 'Claims guardrail', value: 'Carry a source and approval state for claims, statistics, customer stories, metrics, and framework language.', folderId: 'brand-voice', status: 'Approved reference', source: 'Research status and source library' },
  { id: 'brand-proof', label: 'Proof status', value: 'Customer stories and public claims require source and approval checks before reuse.', folderId: 'brand-voice', status: 'Needs confirmation', source: 'Research dossier' },
  { id: 'brand-assets-gap', label: 'Asset gap', value: 'Vector master, service-mark files, AiVRIC SVG, favicons/avatars, and approved templates are documented but not yet supplied here.', folderId: 'brand-kit', status: 'Needs confirmation', source: 'Marketing folder structure · seed list' },
];

export const creatorDrafts: CreatorDraft[] = [
  { id: 'draft-governed-ai', title: 'Who owns AI evidence after deployment?', outputType: 'Social post', folderId: 'social', status: 'Draft', hue: 'Regulated Operator', channel: 'LinkedIn', updatedAt: 'Today · representative draft' },
  { id: 'draft-youtube-ceo-corner', title: 'CEO Corner · operated readiness', outputType: 'Video outline', folderId: 'video', status: 'Needs review', hue: 'Stay Ready', channel: 'YouTube', updatedAt: 'Yesterday · representative draft' },
];

export const creatorOutputTypes: CreatorOutputType[] = ['Social post', 'Content brief', 'Image direction', 'Ad concept', 'Video outline'];
export const creatorChannels = ['LinkedIn', 'YouTube', 'Email', 'Website', 'Paid social'];
