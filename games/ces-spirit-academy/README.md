# CES Spirit Academy

Offline English Form 2 CES learning RPG (Wizard-and-Black-Cat-Wiz–inspired play loop).

## Play
Open the folder in a browser:
- Prefer opening `index.html` **from the `ces-spirit-academy` folder** so `art/bg_*.webp` backgrounds load.
- Chrome / Edge recommended.

## Features
- **Trainer Login**: Class + Student No. + display name + optional PIN; per-player local saves
- **Home base**: raise one of 5 Spirits (Gold/Wood/Water/Fire/Earth), Care actions, Train Move FX, inventory
- **Quest Map**: 8 stages (Module 2.1 then 2.2) with turn-based answer-to-cast battles
- **Practice** quiz + **Daily Quest** (HK calendar day streak)
- **Blind box** after 10 correct in a qualifying run
- Question bank: modules **2.1 and 2.2 only**

## Storage keys
- Roster: `cesSpiritAcademy_roster_v1`
- Player: `cesSpiritAcademy_v1::<CLASS>-<No>`
- Session: `cesSpiritAcademy_session_v1`

## Spirits
Player Spirits (Gold, Wood, Water, Fire, Earth) use cutouts at `art/spirits/*.webp`. Hatchling through Apex share that artwork and grow with the on-screen scale and glow. Open `index.html` from this folder so the relative paths resolve.

## Season leaderboard
Correct CES answers are worth 10 season points. The client only talks to an Apps Script web app, not the Google Sheet. Set `const LEADERBOARD_URL` in `games/ces-spirit-academy/index.html` (one line, just after the spirit art paths) to the deployed `/exec` URL. Leave it empty until that URL exists — the game still plays and the board says it is not connected.

## Foes
Quest stages use anime-style monster portraits under `art/foes/*.webp` (wolves, dragons, lion guardian, twin hound). Open `index.html` from this folder so relative art paths resolve.
