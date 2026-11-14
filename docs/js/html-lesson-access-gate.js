/*
 * CODE NEXA FORGE — HTML lesson access gate
 * A student must complete every earlier HTML lesson quiz before opening a later lesson.
 */
(() => {
  'use strict';

  const path = window.location.pathname;
  if (!path.includes('/html-topics/')) return;

  const fileName = path.split('/').pop() || '';
  const match = fileName.match(/^(\d{2})-/);
  if (!match) return;

  const requestedLesson = Number(match[1]);
  if (requestedLesson <= 1 || requestedLesson > 8) return;

  const lessonFiles = [
    '01-introduction.html',
    '02-document-structure.html',
    '03-html-elements-tags.html',
    '04-headings-paragraphs.html',
    '05-links-images.html',
    '06-lists-tables.html',
    '07-html-forms.html',
    '08-mini-website-project.html'
  ];

  for (let lesson = 1; lesson < requestedLesson; lesson += 1) {
    const key = `html-lesson-${String(lesson).padStart(2, '0')}-completed`;

    if (localStorage.getItem(key) !== 'true') {
      window.location.replace(
        new URL(lessonFiles[lesson - 1], window.location.href).href
      );
      return;
    }
  }
})();
