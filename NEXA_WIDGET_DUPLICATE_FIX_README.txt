CODE NEXA FORGE - NEXA AI WIDGET DUPLICATE FIX

Changes in this update:
1. The homepage keeps its own built-in NEXA AI launcher and chat. The shared floating widget script is no longer loaded on index.html.
2. The dedicated nexa-ai.html page keeps its full-page chat only. The shared floating widget script is no longer loaded there.
3. The legacy ai-assistant.html redirect page no longer loads a widget while redirecting to nexa-ai.html.
4. public/js/nexa-widget.js now has defensive exclusions for /, index.html, nexa-ai.html, and ai-assistant.html. This prevents accidental future inclusion from mounting a second interface.
5. The default Playground HTML sample no longer injects the global NEXA widget into the preview iframe.

Validation performed:
- node --check public/js/nexa-widget.js
- node --check server.js
- node test-nexa.js
- node test-website-assistant.js
- Static scan of all 42 HTML pages: no page has duplicate global widget script tags; homepage, dedicated assistant, and redirect pages are excluded.

The archive intentionally excludes node_modules, .env, and private SQLite/database files. Keep your existing local .env and database files when replacing your project files.
