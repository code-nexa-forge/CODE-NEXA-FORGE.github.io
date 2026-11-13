
/*
 * CODE NEXA FORGE — Shared Quiz Reset + Lesson Progression Guard
 * Handles quiz reset, lesson completion, and next-lesson locking.
 * Keep this file loaded after each lesson's original scripts.
 */

(() => {
  'use strict';

  const fileName = window.location.pathname.split('/').pop() || '';
  const match = fileName.match(/^(\d{2})-/);
  const lessonNumber = match ? Number(match[1]) : 0;

  const course = window.location.pathname.includes('/css-topics/')
    ? 'css'
    : window.location.pathname.includes('/html-topics/')
      ? 'html'
      : '';

  if (!course || !lessonNumber) return;

  const storageKey = `${course}-lesson-${String(lessonNumber).padStart(2, '0')}-completed`;
  const nextNumber = lessonNumber + 1;
  const nextPrefix = `${String(nextNumber).padStart(2, '0')}-`;
  const isFinalLesson = lessonNumber === 8;

  const quizResult =
    document.getElementById('quizResult') ||
    document.getElementById('quizFeedback');

  const quizInputs = Array.from(
    document.querySelectorAll('input[type="radio"], input[type="checkbox"]')
  ).filter(input => /^q\d+$/i.test(input.name || ''));

  const hasQuiz = quizInputs.length > 0;

  const nextLinks = isFinalLesson
    ? []
    : Array.from(document.querySelectorAll('a[href]')).filter(link => {
        const href = (link.getAttribute('href') || '').split(/[?#]/)[0];
        const text = (link.textContent || '').trim();

        return (
          href.startsWith(nextPrefix) ||
          (/^(next|continue to|final lesson)/i.test(text) &&
            href &&
            !href.startsWith('#'))
        );
      });

  const completeButton =
    document.getElementById('completeLesson') ||
    document.getElementById('completeBtn') ||
    document.getElementById('completeLessonBtn');

  const defaultCompleteText = completeButton
    ? (completeButton.textContent || '').trim()
    : '';

  /* =========================================
     PREMIUM RESET BUTTON STYLING
  ========================================= */

  function addResetStyles() {
    if (document.getElementById('cnf-reset-premium-styles')) return;

    const style = document.createElement('style');
    style.id = 'cnf-reset-premium-styles';

    style.textContent = `
      .cnf-quiz-reset {
        position: relative !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 10px !important;

        min-height: 46px !important;
        padding: 12px 20px 12px 38px !important;
        margin: 10px 8px !important;

        background: linear-gradient(
          135deg,
          #10291e,
          #173d2b
        ) !important;

        color: #c6ff72 !important;
        -webkit-text-fill-color: #c6ff72 !important;

        border: 1px solid rgba(173, 255, 91, 0.38) !important;
        border-radius: 12px !important;

        font-family: inherit !important;
        font-size: 13px !important;
        font-weight: 700 !important;
        letter-spacing: 0.4px !important;

        text-shadow: 0 0 10px rgba(198, 255, 114, 0.16) !important;

        cursor: pointer !important;
        overflow: hidden !important;
        isolation: isolate !important;

        box-shadow:
          0 5px 18px rgba(0, 0, 0, 0.25),
          inset 0 1px 0 rgba(255, 255, 255, 0.07) !important;

        transition:
          background 0.3s ease,
          border-color 0.3s ease,
          box-shadow 0.3s ease,
          transform 0.3s ease !important;
      }

      .cnf-quiz-reset::before {
        content: "" !important;
        position: absolute !important;

        left: 14px !important;
        top: 50% !important;

        width: 9px !important;
        height: 9px !important;

        border-radius: 50% !important;
        background: #ff9638 !important;

        box-shadow:
          0 0 7px #ff9638,
          0 0 15px rgba(255, 150, 56, 0.75) !important;

        transform: translateY(-50%) !important;
        animation: cnfOrangeDotMove 1.5s ease-in-out infinite !important;
      }

      .cnf-quiz-reset::after {
        content: "" !important;
        position: absolute !important;

        left: 10px !important;
        top: 50% !important;

        width: 17px !important;
        height: 17px !important;

        border-radius: 50% !important;
        background: rgba(255, 150, 56, 0.12) !important;

        transform: translateY(-50%) !important;
        animation: cnfOrangeGlow 1.5s ease-in-out infinite !important;

        pointer-events: none !important;
      }

      .cnf-quiz-reset:hover {
        background: linear-gradient(
          135deg,
          #173d2b,
          #24543a
        ) !important;

        color: #d8ff9b !important;
        -webkit-text-fill-color: #d8ff9b !important;

        border-color: rgba(198, 255, 114, 0.8) !important;

        box-shadow:
          0 7px 24px rgba(0, 0, 0, 0.3),
          0 0 16px rgba(173, 255, 91, 0.12) !important;

        transform: translateY(-3px) !important;
      }

      .cnf-quiz-reset:active {
        transform: translateY(0) scale(0.97) !important;
      }

      .cnf-quiz-reset:focus-visible {
        outline: 2px solid #c6ff72 !important;
        outline-offset: 4px !important;
      }

      @keyframes cnfOrangeDotMove {
        0%, 100% {
          transform: translateY(-50%) translateY(-5px);
        }

        50% {
          transform: translateY(-50%) translateY(5px);
        }
      }

      @keyframes cnfOrangeGlow {
        0%, 100% {
          opacity: 0.35;
          transform: translateY(-50%) scale(0.8);
        }

        50% {
          opacity: 1;
          transform: translateY(-50%) scale(1.25);
        }
      }

      @media (max-width: 600px) {
        .cnf-quiz-reset {
          min-height: 44px !important;
          padding: 11px 16px 11px 35px !important;
          font-size: 12px !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* =========================================
     NEXT LESSON LOCKING
  ========================================= */

  function setNextLocked(locked) {
    nextLinks.forEach(link => {
      if (locked) {
        link.classList.add('cnf-locked-next');
        link.setAttribute('aria-disabled', 'true');
        link.setAttribute('tabindex', '-1');
        link.setAttribute(
          'title',
          'Pass the current lesson quiz to unlock the next lesson.'
        );
      } else {
        link.classList.remove('cnf-locked-next', 'locked');
        link.removeAttribute('aria-disabled');
        link.removeAttribute('tabindex');
        link.removeAttribute('title');

        link.style.pointerEvents = 'auto';
        link.style.opacity = '1';
        link.style.filter = 'none';
      }
    });
  }

  /* =========================================
     LESSON COMPLETION
  ========================================= */

  function markCompleted() {
    localStorage.setItem(storageKey, 'true');
    setNextLocked(false);

    if (completeButton) {
      completeButton.disabled = true;
      completeButton.textContent = '✓ Lesson Completed';
      completeButton.setAttribute('aria-label', 'Lesson completed');
    }
  }

  function lockCompleteButton() {
    if (!completeButton) return;

    completeButton.disabled = true;

    if (defaultCompleteText) {
      completeButton.textContent = defaultCompleteText;
    }
  }

  /* =========================================
     QUIZ RESULT DETECTION
  ========================================= */

  function passedQuiz() {
    if (localStorage.getItem(storageKey) === 'true') {
      return true;
    }

    const text = (quizResult?.textContent || '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();

    if (!text) {
      return !!(
        completeButton &&
        completeButton.disabled === false &&
        hasQuiz
      );
    }

    if (
      /please answer|try again|review the lesson|need at least|keep practicing|not passed|incorrect/.test(text)
    ) {
      return false;
    }

    const scoreMatch = text.match(
      /(?:score|scored)\s*(?:is\s*)?(\d+)\s*\/\s*3/
    );

    if (scoreMatch) {
      const score = Number(scoreMatch[1]);
      return course === 'html' ? score === 3 : score >= 2;
    }

    return /you passed|perfect score|perfect!|excellent!|great work|lesson completed successfully/.test(text);
  }

  function evaluateQuiz() {
    window.setTimeout(() => {
      if (isFinalLesson) return;

      if (passedQuiz()) {
        markCompleted();
      } else {
        setNextLocked(localStorage.getItem(storageKey) !== 'true');
      }
    }, 0);
  }

  /* =========================================
     RESET QUIZ CONTROL
  ========================================= */

  function createResetButton() {
    if (!hasQuiz) return;

    addResetStyles();

    // Remove any extra reset buttons to guarantee only one exists.
    const existingButtons = Array.from(
      document.querySelectorAll('.cnf-quiz-reset')
    );

    existingButtons.slice(1).forEach(button => button.remove());

    if (existingButtons.length > 0) return;

    const quizSubmit =
      document.getElementById('checkQuiz') ||
      document.getElementById('submitQuiz') ||
      document.querySelector('#quizForm button[type="submit"]') ||
      Array.from(document.querySelectorAll('button')).find(button =>
        /check my answers|submit answers/i.test(button.textContent || '')
      );

    if (!quizSubmit) return;

    const resetButton = document.createElement('button');

    resetButton.type = 'button';
    resetButton.className = 'cnf-quiz-reset';
    resetButton.textContent = '↻ Reset Quiz';
    resetButton.setAttribute('aria-label', 'Reset quiz');

    resetButton.addEventListener('click', () => {
      // Clear all quiz selections.
      quizInputs.forEach(input => {
        input.checked = false;
      });

      // Remove the saved completion status.
      localStorage.removeItem(storageKey);

      // Lock lesson completion again.
      lockCompleteButton();

      // Lock the next lesson.
      setNextLocked(true);

      // Reset the quiz result message.
      if (quizResult) {
        quizResult.textContent =
          'Quiz reset. Select your answers and try again.';

        quizResult.style.display = 'block';
      }

      if (completeButton) {
        completeButton.removeAttribute('aria-label');
      }

      // Clear any previous unlock status message.
      document.querySelectorAll('.cnf-quiz-status').forEach(status => {
        status.remove();
      });

      resetButton.blur();
    });

    quizSubmit.insertAdjacentElement('afterend', resetButton);
  }

  /* =========================================
     QUIZ EVENT LISTENERS
  ========================================= */

  if (hasQuiz) {
    createResetButton();

    const checkButton =
      document.getElementById('checkQuiz') ||
      document.getElementById('submitQuiz');

    if (checkButton) {
      checkButton.addEventListener('click', evaluateQuiz);
    }

    const quizForm = document.getElementById('quizForm');

    if (quizForm) {
      quizForm.addEventListener('submit', evaluateQuiz);
    }
  }

  /* =========================================
     INITIAL PROGRESSION STATE
  ========================================= */

  if (localStorage.getItem(storageKey) === 'true') {
    if (!isFinalLesson) {
      markCompleted();
    }
  } else {
    if (!isFinalLesson) {
      lockCompleteButton();
    }

    setNextLocked(true);
  }

  /* =========================================
     PREVENT UNLOCKED NAVIGATION WITHOUT PASS
  ========================================= */

  nextLinks.forEach(link => {
    link.addEventListener(
      'click',
      event => {
        if (localStorage.getItem(storageKey) !== 'true') {
          event.preventDefault();
          event.stopImmediatePropagation();

          setNextLocked(true);

          let status = document.querySelector('.cnf-quiz-status');

          if (!status) {
            status = document.createElement('span');
            status.className = 'cnf-quiz-status';

            status.textContent =
              '🔒 Pass the current lesson quiz to unlock the next lesson.';

            const reset = document.querySelector('.cnf-quiz-reset');

            (reset?.parentElement || link.parentElement || document.body)
              .appendChild(status);
          }
        }
      },
      true
    );
  });

})();
/* ==========================================
   CNF — LESSON-WISE RESET QUIZ THEMES
========================================== */

(function () {
    "use strict";

    const lessonThemes = {
        1: {
            bg: "#172554",
            text: "#60a5fa",
            border: "#2563eb",
            dot: "#60a5fa"
        },
        2: {
            bg: "#2e1065",
            text: "#c084fc",
            border: "#9333ea",
            dot: "#c084fc"
        },
        3: {
            bg: "#042f2e",
            text: "#5eead4",
            border: "#0d9488",
            dot: "#5eead4"
        },
        4: {
            bg: "#052e16",
            text: "#86efac",
            border: "#16a34a",
            dot: "#86efac"
        },
        5: {
            bg: "#422006",
            text: "#fcd34d",
            border: "#d97706",
            dot: "#fcd34d"
        },
        6: {
            bg: "#083344",
            text: "#67e8f9",
            border: "#0891b2",
            dot: "#67e8f9"
        },
        7: {
            bg: "#052e16",
            text: "#a3e635",
            border: "#65a30d",
            dot: "#a3e635"
        },
        8: {
            bg: "#242321",
            text: "#ff8b45",
            border: "#e74735",
            dot: "#ff8b45"
        }
    };

    function getLessonNumber() {
        const match = window.location.pathname.match(/(\d{2})-/);
        return match ? Number(match[1]) : null;
    }

    function applyResetTheme() {
        const lessonNumber = getLessonNumber();
        const theme = lessonThemes[lessonNumber];

        if (!theme) return;

        const buttons = document.querySelectorAll(".cnf-quiz-reset");

        buttons.forEach(button => {
            button.style.setProperty("--reset-bg", theme.bg);
            button.style.setProperty("--reset-text", theme.text);
            button.style.setProperty("--reset-border", theme.border);
            button.style.setProperty("--reset-dot", theme.dot);

            button.style.setProperty("position", "relative");
            button.style.setProperty("display", "inline-flex");
            button.style.setProperty("align-items", "center");
            button.style.setProperty("justify-content", "center");
            button.style.setProperty("padding", "13px 20px 13px 35px");
            button.style.setProperty("border-radius", "6px");
            button.style.setProperty("border", `1px solid ${theme.border}`);
            button.style.setProperty("background", theme.bg, "important");
            button.style.setProperty("color", theme.text, "important");
            button.style.setProperty("font-weight", "800");
            button.style.setProperty("font-size", "12px");
            button.style.setProperty("cursor", "pointer");
            button.style.setProperty("overflow", "hidden");
            button.style.setProperty("transition", "all .3s ease");
        });
    }

    const style = document.createElement("style");

    style.textContent = `
        .cnf-quiz-reset::before {
            content: "";
            position: absolute;
            left: 13px;
            top: 50%;
            transform: translateY(-50%);
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--reset-dot);
            box-shadow: 0 0 10px var(--reset-dot);
            animation: cnfResetDotMove 1.4s ease-in-out infinite;
        }

        .cnf-quiz-reset:hover {
            transform: translateY(-3px);
            background: var(--reset-text) !important;
            color: var(--reset-bg) !important;
            box-shadow: 0 7px 20px #00000025;
        }

        @keyframes cnfResetDotMove {
            0%, 100% {
                margin-left: 0;
                opacity: 1;
            }
            50% {
                margin-left: 7px;
                opacity: .55;
            }
        }
    `;

    document.head.appendChild(style);

    applyResetTheme();

    const observer = new MutationObserver(applyResetTheme);

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();