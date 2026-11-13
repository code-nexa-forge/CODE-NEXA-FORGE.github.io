CODE NEXA FORGE — HTML LESSON PROGRESSION FIX

What changed:
- Added an early HTML lesson access gate for lessons 02–08.
- Each later lesson checks that every earlier lesson has been completed.
- A student who opens a later lesson directly is redirected to the earliest incomplete lesson.
- Existing lesson quizzes, completion UI, styles, and shared quiz guard are preserved.
- Existing quiz passing remains 3/3 for HTML lessons.

Important:
- This progression uses browser localStorage, matching the existing lesson completion system.
- Keep your own .env and database files in your project; they are intentionally not included in this ZIP.
- Do not overwrite your .env or database folder when applying this update.
- Browser-side checks improve normal navigation but are not tamper-proof server-side access control.
