CODE NEXA FORGE — NEXA AI LOCAL ENGINE UPGRADE
================================================
Release: NEXA AI 2.0.0
Scope: Local knowledge engine and chat API integration

WHAT THIS UPDATE CHANGES
------------------------
1. The chat API now passes the earlier messages from the active conversation
   into the NEXA engine. Previously, the API passed only the newest message,
   so follow-ups such as "examples" could not refer to the earlier topic.
2. NEXA now resolves contextual follow-ups such as:
      YOU: HTML
      YOU: examples
   The second message is understood as a request for HTML examples.
3. The knowledge base now stores structured topic definitions, explanations,
   examples and selected code samples.
4. Added curated information for programming, HTML, CSS, JavaScript, AI,
   Machine Learning, Deep Learning, databases, cybersecurity, operating
   systems, Python, Node.js, APIs, frontend/backend, CPU and RAM, plus
   general science, technology, computers and the internet.
5. Added supported comparisons, including AI vs Machine Learning,
   HTML vs CSS, HTML vs JavaScript, CSS vs JavaScript, frontend vs backend,
   and RAM vs CPU.
6. Added basic recognition of common Roman Urdu request phrases such as
   "misal do", "samjhao", "kya hai" and "farq batao". Answers are still
   primarily in English; automatic translation is not implemented.
7. Updated test-nexa.js with automated checks for identity, definitions,
   examples, contextual follow-ups, comparisons and unknown topics.
8. Removed the unused OpenAI SDK dependency. The local NEXA source code does
   not call an external AI model or AI API.

IMPORTANT CAPABILITY LIMITATION
-------------------------------
This is an independent local, rule-based conversational engine supported by
a curated knowledge base. It is NOT a trained large language model. It can
answer supported topics, compare selected concepts, provide stored examples
and use the active conversation history for follow-up requests. It cannot
reliably answer every possible question, create new knowledge from nowhere,
browse current information or translate arbitrary languages. Unknown topics
receive an honest limitation message rather than a fabricated answer.

Conversation context comes from the messages supplied by the active chat.
It is not permanent personal memory and may reset when a new chat is started,
the page is refreshed, or the server restarts.

HOW TO APPLY SAFELY
-------------------
1. Stop the currently running server with Ctrl+C.
2. Make a backup copy of your existing CODE NEXA FORGE folder.
3. Extract this ZIP.
4. Merge the included "CODE NEXA FORGE" folder into your existing project
   folder and allow the updated source files to replace the old versions.
5. KEEP your existing .env file and database files. This package deliberately
   excludes .env, SQLite database files, session databases and node_modules.
   Do not delete your existing database or overwrite it with an empty one.
6. In the project root, run:
      npm install
7. Start the server:
      node server.js
8. Open:
      http://localhost:3000
   Log in before testing NEXA AI.

FILES UPDATED
-------------
- server.js
- nexa/nexa-engine.js
- nexa/language-engine.js
- nexa/knowledge-base.js
- package.json
- package-lock.json
- test-nexa.js
- NEXA_AI_FIX_README.txt

LOCAL ENGINE TEST
-----------------
Run this from the project root:
      node test-nexa.js

The test script should finish with:
      All NEXA AI local engine tests passed.

Then test these messages in the website chat:
1. HTML
2. examples
3. Can you give me a real-world example of Machine Learning?
4. What is the difference between AI and Machine Learning?
5. HTML aur CSS ka farq batao

SECURITY
--------
Never share your .env file, session secret, email app password, API keys or
database files in a public place. The delivered ZIP excludes those files.
If the .env file in the earlier uploaded archive contained real credentials,
rotate those credentials as a precaution.
