CODE NEXA FORGE — NEXA AI LOCAL KNOWLEDGE UPGRADE
Version: 2.1.0

WHAT CHANGED
- Expanded the curated local knowledge base from 21 to 42 topics.
- Added detailed CSS explanations for Flexbox, Grid, Box Model, Positioning,
  Responsive Design, Animations/Transitions, and Specificity/Cascade.
- Added topics covering browsers, DNS, HTTP/HTTPS, networking, Git, GitHub,
  Express.js, React, mathematics, physics, biology, chemistry, history and geography.
- Default topic answers now provide a structured explanation, practical examples,
  and code samples where curated code is available.
- Added a clearer Flexbox-versus-Grid comparison.
- Improved topic matching so a specific CSS topic is not confused with generic CSS.
- Extended test-nexa.js with new regression tests.
- No external AI API, hosted model, internet search, or external inference service added.

IMPORTANT LIMITATION
NEXA AI remains a local rule-based assistant backed by curated knowledge and
response templates. This upgrade improves coverage and response depth, but it
is not a trained large language model and cannot reliably answer every possible
question or independently learn new facts from arbitrary conversations.

INSTALLATION
1. Stop the running server with Ctrl+C in its terminal.
2. Extract this ZIP to a temporary folder.
3. Copy the included project files into your existing CODE NEXA FORGE folder,
   allowing source files to be replaced.
4. Preserve your existing .env file and database folder. They are intentionally
   excluded from this ZIP to protect credentials, accounts and session data.
5. In the project terminal, run: node test-nexa.js
6. If all tests pass, start the site with: node server.js
7. Open: http://localhost:3000

FILES CHANGED
- nexa/knowledge-base.js
- nexa/nexa-engine.js
- test-nexa.js

The upgrade does not require installing additional npm packages.
