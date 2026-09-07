# ORVECT — Vision page design audit

Date: 7 September 2026. Scope: `vision.html`. Baseline: commit `54ca99b`.

This is a refinement of the existing page, not a new visual concept. The initial audit was performed locally before changes, at all six requested viewport sizes, including the complete page and the founder section. The original narrative remains: intended Volkswagen Group focus → licensed depth → workshop validation → founder.

## What was already strong

- The opening statement (“Start focused. Think beyond.”) is short, recognisable and appropriate to the product's stage. Its left-aligned two-tone hierarchy works.
- Graphite, Mineral White, Signal Orange and Space Grotesk already form a coherent identity. The logo and the active navigation underline need no redesign.
- A text-only manufacturer list avoids implying endorsement through customer-logo styling. The disclaimer directly below it is important and remains visible.
- The three roadmap stages communicate a real sequence without fabricated metrics or completion percentages.
- The founder section is human, factual and uncluttered. It does not need a portrait, stock imagery or another card.
- The language control, mobile navigation and full-width backgrounds already work. No horizontal overflow or JavaScript exception was found in the baseline inspection.

## Problems found

### P0 — visually damaging

No P0 issue found. The baseline is usable and visually coherent. This work does not describe a functioning page as broken.

### P1 — meaningful refinement

1. **Artificial height in the founder section.** The inherited `min-height: 100svh` creates a 900 px section at 1440 × 900 and a 1024 px section on portrait tablet, despite relatively little content. The blank tail weakens the transition to the footer.
2. **Tablet columns become unnecessarily narrow.** At 768 px the hero still uses two columns separated by a 12% gap; the main statement wraps unevenly and the supporting explanation becomes tall. The roadmap also remains in three narrow columns at that width.
3. **Roadmap stages have equal emphasis.** NOW, NEXT and THEN all use orange, without a visual connection. The reader has to infer the sequence from three otherwise similar columns.
4. **Spacing and typographic hierarchy vary between sections.** The hero and founder use slightly different column anchors, broad gaps and separate font rules. Some labels inherit monospaced styling while the body uses Space Grotesk.
5. **The first viewport does not explicitly name the domain.** “04 / THE DIRECTION” is a remnant of the former one-page site. It conveys less than a concise automotive-intelligence label on this independent page.
6. **The final action is incomplete.** The founder provides a contact-card download, but starting a conversation requires returning to the header or using the footer email address.

### P2 — optional polish adopted

- The muted half of the headline uses an intermediate grey rather than the brand's Alloy. It can be clearer while remaining secondary.
- Borders are stronger than necessary in the manufacturer band and footer.
- Scroll entrance effects repeatedly hide/show text. Static visibility better suits a restrained, evidence-oriented page.
- Navigation can stay available on desktop without becoming a floating container. On mobile it should continue scrolling normally to preserve reading space.

## Changes made

| Change | Why | ORVECT principle |
| --- | --- | --- |
| Added a stylesheet loaded only by Vision and scoped under `.vision-page` | Keep the refinement isolated from the other three pages | Coherence, controlled scope |
| Kept full-width backgrounds and shared gutters; aligned hero and founder to the same grid | Reinforce shared vertical anchors without restoring boxed margins | Precision |
| Retuned the headline slightly and used Alloy for its second line | Preserve its impact while improving secondary contrast | Hierarchy, restraint |
| Set explicit reading widths and line heights | Make supporting copy easier to scan, particularly on tablet | Clarity |
| Replaced the old page-index labels with “AUTOMOTIVE INTELLIGENCE / THE VISION” and “THE FOUNDER” | Orient visitors to an independent Vision page | Directness |
| Reduced the manufacturer band's density and softened separators | Keep the list legible without making it look like an endorsement wall | Credibility |
| Connected the existing roadmap stages with a thin line and square markers | Show sequence using the existing content; orange marks only NOW | Direction, signal |
| Switched the hero/founder to one column and the roadmap to a vertical path at 900 px and below | Avoid cramped tablet columns; carry the sequence naturally onto mobile | Responsive intent |
| Removed the founder's mandatory viewport height | Let content determine the section's length and bring the footer back into the rhythm | Restraint |
| Added a direct email CTA beside the existing contact-card download | Make the next action clear, without adding a lead-capture form | Intentional interaction |
| Kept the header attached and sticky above 900 px; kept it in normal flow below | Keep navigation available on desktop without consuming mobile reading space | Product structure |
| Disabled repeated text entrance transforms on Vision only | Keep factual content visible and reduce visual distraction | Quiet confidence |
| Used a nearly imperceptible mineral overlay on a graphite variation | Add restrained surface depth without glow or visual clutter | Industrial character |

At 1440 × 900, the founder section is approximately 555 px after refinement instead of 900 px. At 768 × 1024 it is approximately 633 px instead of 1024 px. These are layout measurements, not product metrics. Mobile keeps content-driven height; the new contact action adds useful space rather than forcing an arbitrary reduction.

The new labels use existing English/French/Swedish translation infrastructure. Four dictionary entries were added; existing translations and other pages' designs were not rewritten. No new animation library or runtime dependency was introduced.

## Things deliberately NOT changed

- The headline, narrative, manufacturer names, qualifications about intended scope, founder biography and roadmap commitments.
- Existing logo geometry, language selector, shared navigation destinations and full-width layout.
- The order of information and the left-aligned editorial direction.
- Accurate prototype and evidence language. There are no new partnerships, endorsements, customer logos, testimonials, KPIs, live-data claims or performance promises.
- No literal car, AI orb, schematic ECU flow or new 3D graphic was added. An architectural diagram would introduce a different story here; the roadmap is the only sequence that benefits from a visual connection.
- No purple/blue gradient, glass panels, heavy shadow, rounded-card system, particles, pulsing indicator or scroll-jacking.
- No new persistent mobile header. Its space cost outweighs its benefit on this page.

### Microcopy observations

Licensed data and workshop validation appear in the hero, roadmap and founder copy. The repetition is noticeable, but each occurrence serves a different purpose: scope, sequence and founder priority. It was retained rather than replaced by more promotional language. The long scope disclaimer remains fully visible rather than being hidden in an accordion.

## Visual QA and before/after evidence

All screenshots use French, the same local browser, Space Grotesk and device scale factor 1. Full-page captures use `prefers-reduced-motion: reduce` for both versions so off-screen entrance effects cannot conceal content. Normal-motion viewport and founder captures are also included in `docs/vision-page/`.

| Viewport | Before | After |
| --- | --- | --- |
| 1440 × 900 | [Viewport](vision-page/before-1440.png) · [Full page](vision-page/before-1440-full.png) | [Viewport](vision-page/after-1440.png) · [Full page](vision-page/after-1440-full.png) |
| 1280 × 800 | [Viewport](vision-page/before-1280.png) · [Full page](vision-page/before-1280-full.png) | [Viewport](vision-page/after-1280.png) · [Full page](vision-page/after-1280-full.png) |
| 1024 × 768 | [Viewport](vision-page/before-1024.png) · [Full page](vision-page/before-1024-full.png) | [Viewport](vision-page/after-1024.png) · [Full page](vision-page/after-1024-full.png) |
| 768 × 1024 | [Viewport](vision-page/before-768.png) · [Full page](vision-page/before-768-full.png) | [Viewport](vision-page/after-768.png) · [Full page](vision-page/after-768-full.png) |
| 430 × 932 | [Viewport](vision-page/before-430.png) · [Full page](vision-page/before-430-full.png) | [Viewport](vision-page/after-430.png) · [Full page](vision-page/after-430-full.png) |
| 390 × 844 | [Viewport](vision-page/before-390.png) · [Full page](vision-page/before-390-full.png) | [Viewport](vision-page/after-390.png) · [Full page](vision-page/after-390-full.png) |

Validation: screenshots inspected for hierarchy, line wrapping, spacing, alignment, borders and CTA placement; runtime layout checks across the six viewports and all three languages; one h1 and correct navigation state; keyboard focus visibility; 48 px contact actions; sticky desktop header; reduced-motion content visibility; other pages do not load `vision.css`; no horizontal overflow or JavaScript errors. `node --check v1/i18n.js` and `git diff --check` pass. This is a static HTML/CSS/JS site without a package build or TypeScript configuration, so no unrelated frontend build is applicable.

Browser scope: desktop Chrome with responsive viewports. These checks are not a claim of physical-device testing in Safari or on an iPhone.
