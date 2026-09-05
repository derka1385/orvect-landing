# ORVECT brand kit

Open `gallery.html` for a local, linked review of the full collection. Recommended working identity: ORVECT / Signal. Three original vector directions are supplied. The name remains subject to trademark and domain clearance.

Name and URL research is preliminary and is not trademark clearance.

## Inventory

- `print/orvect-brand-guide-fr.pdf`: guide de marque de six pages entièrement en français, destiné au partage avec un collègue. La version anglaise est conservée. Source : `source/guide_fr.py` ; génération : `source/build.py --guide-fr`.

- `logos/`: 3 concept boards; primary light/dark, two monochrome lockups, three transparent icons, one transparent full lockup. Each in editable SVG and PNG.
- `print/orvect-brand-guide.pdf`: 6-page A4 identity guide covering positioning, mark usage, colours, type, voice and applications.
- `print/orvect-business-card-85x55-3mm-bleed.pdf`: 2 pages, front/back, 85 × 55 mm trim.
- `print/orvect-flyer-a5-3mm-bleed.pdf`: 2 pages, front/back, 148 × 210 mm trim.
- `print/orvect-onepager-a4-3mm-bleed.pdf`: 1 page, 210 × 297 mm trim.
- `print/*.png`: 300 dpi print-page previews, including bleed.
- `social/`: Instagram 1080 × 1080, 1080 × 1350, 1080 × 1920; LinkedIn 1584 × 396, 1128 × 191, 1200 × 627; three 1080 × 1350 carousel cards. Each supplied as exact-pixel PNG and editable SVG.
- `copywriting.md`: EN/FR slogans, bios, launch posts, original manifesto copy, naming routes and evidence rules.
- `source/`: editable Python print/vector master, SVG export script, gallery/review generator, manifest and QA report.
- `previews/`: all six brand guide pages, grouped contact sheets and combined `contact-sheet.jpg`.

## Editing and rebuilding

Space Grotesk is the primary digital display and body typeface, matching the landing page’s locally hosted SIL Open Font License font. Arial / Helvetica is the office and print fallback used in these PDFs for robust embedded output. The SVG and social production artwork supplied here also uses that fallback.

`source/build.py` controls all copy, typography, coordinates, colours, logo geometry and PDF print dimensions. SVG files retain editable text and paths. For fidelity, install Arial or substitute a licensed metric-compatible font before editing. PDFs embed Arial from the local macOS installation; this kit does not redistribute Arial font software. Run `source/build.py --guide-only` to rebuild only the identity guide.

Run with the Codex bundled Python, then `source/export.cjs` with bundled Node to render SVGs. Use Poppler `pdftoppm -r 300 -png` for print previews and `source/review.py` for gallery, contact sheets and QA checks. The script paths in these sources target this workstation and may need adaptation elsewhere.

## Print handoff

Business card, A5 and A4 marketing PDFs contain a 3 mm bleed on all sides and explicit TrimBox and BleedBox. Page sizes including bleed: 91 × 61 mm, 154 × 216 mm, 216 × 303 mm. Backgrounds extend to the bleed edge. The guide is standard A4 with no bleed. PDFs have vector geometry and embedded text.

These files use RGB colour and are production proofs, not certified CMYK/PDF-X press files. Ask the printer to convert using its required ICC profile and verify orange reproduction, rich black, stock, finish and total ink coverage. Print at 100%, using the TrimBox; no automatic page scaling. Front and back pages share top orientation. No printer marks are included; the printer may impose them outside the supplied bleed. Obtain a physical proof before a run.

Contact fields are limited to Nolann Petri and derka1385@yahoo.com. No phone, domain or QR code was invented. No assets have been posted or published.

## Design rationale

Brand and design skill guidance informed the single-message compositions, strict spacing, technical rules and consistent colour roles. The PDF workflow required page rendering and visual checks; social exports were checked for exact dimensions and text bounds. The identity uses original geometric vectors rather than stock images.
