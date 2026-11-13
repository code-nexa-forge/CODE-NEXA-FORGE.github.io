CODE NEXA FORGE — GitHub-ready source package (2.4.3)

SECURITY
- The real .env file, SQLite user database, session database, node_modules, and private Library uploads are intentionally excluded.
- Never commit secrets, database files, session files, or uploaded PDFs.
- Configure SESSION_SECRET privately in the hosting provider's environment settings.
- The repository is source storage; GitHub Pages cannot run this Express/Node.js backend.

LOCAL RUN
1. Install Node.js.
2. Copy .env.example to .env.
3. Put a newly generated random value in SESSION_SECRET in .env.
4. Run: npm install
5. Run: npm start
6. Open: http://localhost:3000

OWNER ADMIN
- The one-time make-admin.js script only promotes the email configured in OWNER_ADMIN_EMAIL.
- Set OWNER_ADMIN_EMAIL privately in the hosting environment (or local .env); it is not hardcoded into public source.
- First create the owner account using that email, then run: node make-admin.js
- This changes the database where the command is executed. It does not modify a separate production database automatically.

PRODUCTION STORAGE
The app supports these environment variables for a persistent disk:
- CNF_DATABASE_PATH=/var/data/cnf-users.db
- CNF_SESSION_DIR=/var/data/sessions
- CNF_LIBRARY_DIR=/var/data/library
Mount persistent storage at /var/data before using SQLite, sessions, and Library uploads in production.


STUDENT SUPPORT EMAIL (v2.4.4)
--------------------------------
- Students can open /contact-support.html without signing in.
- Requests are sent to SUPPORT_EMAIL, or GMAIL_USER when SUPPORT_EMAIL is not set.
- Replies to the notification email go directly to the student's submitted email address.
- Configure GMAIL_USER, GMAIL_APP_PASSWORD and optionally SUPPORT_EMAIL as private environment variables.
- GMAIL_APP_PASSWORD must be a Google App Password, not the normal Google account password.
- Never commit .env, database files, uploaded student PDFs, or node_modules.
- The contact endpoint includes server-side validation, a honeypot field and a basic per-process IP rate limit.
