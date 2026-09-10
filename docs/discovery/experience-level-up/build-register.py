"""Preserve the supplied documents and build a lossless, initially unrun register.

Only run against the eight user-supplied originals. Does not change application files.
Existing review observations must be migrated before regenerating this register.
"""
from pathlib import Path
import hashlib
import json
import re
import shutil
import sys

ROOT = Path(__file__).resolve().parent
SOURCE = Path(sys.argv[1])
SPECS = [
    ('G', 'LEVELUP.md', None, 'Governing sequence and shared restrictions'),
    ('1', '1-clean-plate.md', 5, 'Clean image, approval gate and responsive assets'),
    ('2a', '2a-baseline-stage-labels.md', 5, 'LOBBY_CONTENT, LOBBY_GEOMETRY, stage, labels and image loading'),
    ('2b', '2b-baseline-dialog-panel.md', 6, 'Dialog, panels, focus, contact destinations and maturity path'),
    ('3', '3-phones-tablets.md', 7, 'Composed phone/tablet layouts, touch, safe areas and logos'),
    ('4', '4-motion-routes.md', 8, 'Camera placement, guided climb, plates, routing and boot cover'),
    ('5', '5-kiosk-share.md', 6, 'Kiosk projection, shared aggregates, screenshots, metadata, share pages and icons'),
    ('6', '6-walk-dashboard.md', 6, 'Walk, dashboard accessibility, carousel and conditional idle tour'),
]


def cases(text):
    return list(dict.fromkeys(re.findall(r'\b\d{3,4}×\d{3,4}(?:@2x)?\b', text)))


def overrides(phase, text):
    ids = []
    if any(s in text for s in ['Provable Vendors', 'Portfolio Companies', 'Regulated Operators']):
        ids.append('O1')
    if 'Booking link:' in text or 'booking link' in text.lower() or 'bookingUrl' in text:
        ids.append('O2')
    if any(s in text for s in ['dashboard URL', 'Back steps panel, lobby, dashboard', 'Return to intelligence', 'Back returns to the dashboard', 'dashboard and lobby to history']):
        ids.append('O3')
    return ids


manifest, instructions, checks = [], [], []
(ROOT / 'source').mkdir(parents=True, exist_ok=True)
for phase, name, count, target in SPECS:
    src, dst = SOURCE / name, ROOT / 'source' / name
    raw = src.read_bytes()
    shutil.copyfile(src, dst)
    assert dst.read_bytes() == raw
    digest = hashlib.sha256(raw).hexdigest()
    manifest.append({'file': f'source/{name}', 'sha256': digest, 'bytes': len(raw), 'phase': phase})
    lines = raw.decode('utf-8-sig').splitlines()
    marker = next((i for i, line in enumerate(lines) if line == '**Done when**'), None) if phase != 'G' else None
    check_end = next((i for i in range((marker or 0) + 1, len(lines)) if lines[i].startswith('Do not change anything')), len(lines)) if marker is not None else None
    phase_checks = []
    if marker is not None:
        for i in range(marker + 1, check_end):
            if lines[i].startswith('- '):
                item_lines = [lines[i]]
                j = i + 1
                while j < check_end and lines[j].strip() and not lines[j].startswith('- '):
                    item_lines.append(lines[j])
                    j += 1
                text = '\n'.join(item_lines)
                phase_checks.append({
                    'id': f'P{phase}-D{len(phase_checks)+1:02}', 'phase': phase,
                    'source': f'source/{name}', 'lineStart': i+1, 'lineEnd': j,
                    'sourceInstruction': text, 'expected': text, 'target': target,
                    'viewports': cases(text), 'overrideIds': overrides(phase, text),
                    'status': 'Not run', 'measuredResult': 'Phase not yet accepted or implemented.',
                    'evidence': [], 'candidateReview': 'Not run', 'publishedReview': 'Not run',
                    'subconditionsPolicy': 'Every clause in sourceInstruction is mandatory; listed viewports are additive, not a substitute for the full instruction.'
                })
        assert len(phase_checks) == count, (name, len(phase_checks), count)
        checks.extend(phase_checks)

    # Retain every nonblank source line in paragraph/list-item blocks, including
    # measurements, formulas, restrictions and the governing file's embedded copies.
    # Acceptance bullets are separately tracked above; no summary substitutes for them.
    start = 0
    blocks = []
    while start < len(lines):
        if not lines[start].strip():
            start += 1
            continue
        end = start + 1
        while end < len(lines) and lines[end].strip() and not re.match(r'^(?:- |\d+\. |#{1,6} )', lines[end]):
            end += 1
        blocks.append((start, end, '\n'.join(lines[start:end])))
        start = end
    for index, (start, end, text) in enumerate(blocks, 1):
        in_checklist = marker is not None and marker < start < check_end
        instructions.append({
            'id': f'P{phase}-I{index:03}', 'phase': phase, 'source': f'source/{name}',
            'lineStart': start+1, 'lineEnd': end, 'sourceInstruction': text,
            'expected': text, 'target': target,
            'kind': 'acceptance-reference' if in_checklist else ('governing-source' if phase == 'G' else 'implementation-instruction'),
            'sourceClaimsVerified': False if phase == 'G' else None,
            'viewports': cases(text), 'overrideIds': overrides(phase, text),
            'status': 'Not run', 'measuredResult': None, 'evidence': [],
        })
    coverage = [i for start, end, _ in blocks for i in range(start, end)]
    assert set(coverage) == {i for i, line in enumerate(lines) if line.strip()}

assert len(checks) == 43
size = next(x for x in checks if x['id'] == 'P1-D04')
size.update(status='Fail', candidateReview='Fail',
    measuredResult='Candidate 1:1672×941, 2,154,762 bytes; height deviation +0.5px. Aspect ratio passes but minimum dimensions fail (248px too narrow;139px too short). Implementer stopped as required. This is not an accepted plate.',
    evidence=['reviews/phase-1-candidate-01.md'])
for item in instructions:
    if item['phase'] == '1' and item['sourceInstruction'].startswith('**Size.**'):
        item.update(status='Fail', measuredResult=size['measuredResult'], evidence=size['evidence'])
    if item['kind'] == 'acceptance-reference':
        canonical = next(check for check in checks if check['source'] == item['source'] and check['lineStart'] == item['lineStart'])
        item['acceptanceId'] = canonical['id']
        item['countAsSeparateAcceptance'] = False
        for field in ['status', 'measuredResult', 'evidence', 'candidateReview', 'publishedReview']:
            item[field] = canonical[field]

assert sum(item['kind'] == 'acceptance-reference' for item in instructions) == 43

data = {
    'schemaVersion': 1, 'phaseOrder': ['1','2a','2b','3','4','5','6'],
    'allowedStatuses': ['Pass','Fail','Not run'],
    'currentPhase': '1', 'phaseStatus': 'Stopped: mandatory native-size failure',
    'acceptanceBulletCount': len(checks), 'sourceManifest': manifest,
    'overrideLedger': 'overrides.md', 'instructions': instructions, 'acceptance': checks,
    'reviewPolicy': 'Independent candidate and live reviews per phase. No next phase until acceptance. User image OK remains a separate required gate. Earlier criteria re-run after phases4 and6. Unavailable checks remain Not run. Conditional idle tour only after required checks pass.'
}
(ROOT / 'requirements.json').write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
md = ['# Original acceptance register', '',
      'All 43 source bullets are retained verbatim below, including every clause and viewport. The full instruction register is in [requirements.json](requirements.json). Apply only the [three approved overrides](overrides.md); the original text stays unchanged.', '',
      'A failed image requirement is recorded as Fail even though stopping complies with the document. Nothing about the candidate is accepted by inference. Unrun checks remain Not run.', '']
for phase, name, count, target in SPECS[1:]:
    md += [f'## Phase {phase} — {name}', '', f'Target: {target}.', '']
    for item in (c for c in checks if c['phase'] == phase):
        md += [f"### {item['id']} — {item['status']}", '',
               f"Source: [{name}, line {item['lineStart']}]({item['source']}#L{item['lineStart']}).", '',
               item['sourceInstruction'], '',
               f"Measured result: {item['measuredResult']}", '',
               f"Candidate guardian: {item['candidateReview']}. Published guardian: {item['publishedReview']}.", '']
        if item['overrideIds']:
            md += ['Applicable override references: ' + ', '.join(item['overrideIds']) + '. Full override ledger governs all phases.', '']
        if item['evidence']:
            md += ['Evidence: ' + ', '.join(f'[{p}]({p})' for p in item['evidence']), '']
(ROOT / 'acceptance.md').write_text('\n'.join(md), encoding='utf-8')
(ROOT / 'source-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
print(json.dumps({'files': len(manifest), 'instructionBlocks': len(instructions), 'originalAcceptanceBullets': len(checks), 'failed': 1, 'notRun': 42}))
