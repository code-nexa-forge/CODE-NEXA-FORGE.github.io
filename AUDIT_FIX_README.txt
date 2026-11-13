CODE NEXA FORGE - AUDITED SOURCE UPDATE

IMPORTANT: This archive intentionally does NOT include:
- .env (contains private configuration/secrets)
- database/cnf-users.db (contains account data)
- database/sessions.sqlite (contains session data)
- node_modules (reinstallable dependencies)

HOW TO APPLY ON WINDOWS
1. Stop the running server (Ctrl+C in the terminal).
2. Make a backup copy of your current "CODE NEXA FORGE" project folder.
3. Open the existing project root - the folder that contains server.js.
4. Extract this ZIP directly into that same project root and allow source files to be replaced.
5. IMPORTANT: Keep your existing .env file and the existing database files. This ZIP does not overwrite or delete them.
6. If you are applying this to a completely new folder instead, copy your own .env and database files from your backup. Do not share .env contents.
7. Start the server with: node server.js
8. Hard-refresh the website with Ctrl+F5.

FIXES INCLUDED
- Restored the shared floating NEXA AI widget loader on HTML Lesson 02, HTML Lesson 07, CSS Lesson 08, JavaScript Lesson 01 and Playground.
- Fixed malformed script/template strings that caused page JavaScript to stop early and display source code as page text.
- Removed NEXA widget script tags from student starter-code / iframe preview templates; those scripts belong on the actual CNF page, not inside student examples.
- Moved HTML Lesson 02 side-box animation CSS back inside its style block and removed the stray CSS text after the document.
- Fixed stale JavaScript Lesson 02 course/lesson navigation paths.
- Removed references on the homepage to animation files that are not present in this project archive.
- Removed a stray Markdown code fence from public/css/courses.css.

STATIC VALIDATION RESULTS
- 42 HTML pages scanned.
- 42 inline JavaScript blocks passed Node syntax checks.
- 18 standalone JavaScript files passed Node syntax checks.
- 10 CSS files parsed with no top-level CSS parse errors.
- All 42 HTML pages contain exactly one shared NEXA widget CSS reference and one shared widget JS reference.
- No missing local HTML src/href references found.
- NEXA AI local engine test-nexa.js: all 13 tests passed.

NOTE
Static checks do not replace testing in your own browser and local environment. Please open the listed pages and verify the widget appears and opens correctly while logged in. Authentication, email/OTP delivery, database contents and live server behavior depend on your local .env, database and environment.
