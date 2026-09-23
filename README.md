# Phantom Sight

A mystical single-page web application featuring a hidden input mask for an "oracle" effect.

## How it works

1. The user asks a question on the first screen.
2. The oracle displays a phrase.
3. The user types their response, utilizing a hidden masking mechanic:
   - In normal mode, typing works normally.
   - Pressing `.` (dot) activates hidden mode. The dot itself displays the NEXT character of the phrase.
   - While in hidden mode, any character typed is captured silently as the real answer, while the UI displays the next characters in the oracle's phrase.
   - Pressing `.` (dot) again deactivates hidden mode (and displays the next phrase character).
   - Once hidden mode is off, typing any key auto-completes the remaining phrase character by character, or the user can press TAB to fill the rest instantly.

## Tech Stack
- Vanilla HTML
- Vanilla CSS (with CSS variables and custom animations)
- Vanilla JS (modularized)
- No dependencies
