# REID_OS

Reid Maxim's retro-computing portfolio, connecting a 3D-printed NFC floppy business card to software projects and academic work. Buildless HTML, CSS and JavaScript for GitHub Pages.

## Preview and checks

```sh
python -m http.server 8000
python tests/check_site.py
node tests/boot-behavior.mjs
node --check archive.js
```

Serve over HTTP so the SVG boot artwork can be accessed from its containing page. All site paths are relative and work under `/Reid_Maxim/`.

## Deployment

Production: https://reidmaxim.github.io/Reid_Maxim/

Existing workflow: GitHub Pages deploys the root of `main`. Use a reviewed branch/PR and allow Pages to complete before checking the public site. No framework, API key, paid service, or build step is required.

## Protected introduction

Pre-release baseline: `baseline/pre-summit-2026-11-14`, commit `d538c866f56fa140ed2986958ff0fbf98bd470e4`.

That production commit includes the merged intro fix after Mission 006A. This release preserves `script.js`, `intro/workstation.svg`, and the existing boot-specific CSS. No Mission 005A camera pivot is introduced. Tests compare normalized source hashes to the baseline. Changing approved animation timing, choreography or artwork requires explicit owner direction.

## Content maintenance

- Keep the six selected projects and distinguish repository implementation from a working deployed demo.
- `archive.js` progressively enhances the static archive with accessible filter buttons; all entries remain available without JavaScript.
- Only two reviewed supplied PDFs are mirrored in `documents/`; existing public coursework is linked at its source. Never upload raw credentials, student records, or unreviewed screenshots.
- The red-team book is an AI-assisted compilation. The CTF document is a conversation log. Study aids and teaching materials are not original academic papers.
- Concept illustrations are labeled; `assets/chessreview.jpg` is a genuine capture of the public demo on November 14, 2026.

## Asset slots and next work

1. Add a reviewed call-center demonstration recording URL to `call-center.html`. The evidence log is already linked; no fake repository or demo is supplied.
2. Replace the NFC concept illustration with a photograph of the printed card when available.
3. Capture Blockwalk and PokéRogue Analytics screenshots when a suitable public demo or extension setup is available.
4. Creature Creator's public page currently fails on `js/world.js:184` with `Unexpected token '.'`. Its source remains linked; restore the demo button only after that separate application is fixed and tested.
5. Revise the cyberwarfare essay's IHL claim and check its citations before issuing a revised paper. The original remains intact with a linked reading-context correction.
6. The statistics/ransomware research paper was not located in the reviewed sources or reachable academic Git history. Do not substitute a new paper for it.

## QA scope

Desktop and mobile visual checks, five-width overflow measurements, archive controls, contact/navigation, boot Skip/Replay and completion, repeat visit, and console checks were performed in the browser. Reduced-motion bypass and timeout behavior were tested in a Node VM; OS/browser reduced-motion emulation and physical NFC hardware were not tested. Mailto syntax was verified without sending mail.
