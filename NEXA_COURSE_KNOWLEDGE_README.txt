CODE NEXA FORGE — NEXA AI COURSE KNOWLEDGE UPDATE
Version: 2.3.0

WHAT WAS ADDED
- Source-grounded knowledge extracted from the supplied CNF website archive.
- All 24 HTML, CSS and JavaScript lesson pages (8 per course).
- All 24 lesson quizzes and their answer keys (72 lesson questions).
- The official course test banks found in the source project:
  * HTML: 6 tests, 40 questions total.
  * CSS: 3 tests, 30 questions total.
  * JavaScript: 3 tests, 30 questions total.
- HTML, CSS and JavaScript course overview, project and test pages.
- Lesson lookup, topic lookup, course outlines, quiz review, answer keys,
  project-page help and lesson follow-up context.
- CNF course content is checked before the older general knowledge base.
- External AI APIs and hosted models remain disabled.

IMPORTANT SOURCE LIMITS
- Answers are based on the course content found in this archive. NEXA should
  not claim a topic is taught by CNF if it is not present in these files.
- Some lesson quizzes do not include written explanations in their source;
  NEXA can show their source answer key but does not invent an explanation.
- Language detection exists, but automatic translation / fluent multilingual
  generation is not enabled by this update. Course source text is English.
- This is a local retrieval and rule-based assistant, not a trained LLM.

FILES ADDED / UPDATED
Added:
  nexa/course-knowledge.json
  nexa/course-knowledge.js
  test-course-knowledge.js
  NEXA_COURSE_KNOWLEDGE_README.txt

Updated:
  nexa/nexa-engine.js
  nexa/knowledge-base.js
  nexa/hybrid-config.js
  test-nexa.js
  package.json
  package-lock.json

TESTING
Run:
  node test-nexa.js
  node test-course-knowledge.js

Or run both:
  npm test

SECURITY / INSTALLATION
- This distribution intentionally excludes .env, node_modules, database/cnf-users.db
  and database/sessions.sqlite.
- Keep your existing .env file and do not share its secrets.
- Keep your existing database files if you want to preserve accounts and sessions.
- In your existing project folder, replace the included source files with these
  updated versions. Do not delete your existing .env or database folder.
- If node_modules is missing, run npm install.
- Start the website with node server.js.
