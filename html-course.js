
document.addEventListener("DOMContentLoaded", () => {

    const page = document.querySelector(".intro-page, .structure-page");
    if (!page) return;

    const isLesson02 = page.classList.contains("structure-page");

    // LESSON EDITOR
    const editor = page.querySelector("#htmlEditor");
    const preview = page.querySelector("#htmlPreview");
    const runButton = page.querySelector("#runHTML");
    const resetButton = page.querySelector("#resetHTML");

    const starterCode = isLesson02
        ? `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
</head>
<body>
    <h1>Welcome to My Website</h1>
    <p>I understand HTML document structure!</p>
</body>
</html>`
        : `<!DOCTYPE html>
<html>
<head>
    <title>My First Website</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>I am learning HTML.</p>
</body>
</html>`;

    if (editor && preview) {
        editor.value = starterCode;
        preview.srcdoc = starterCode;

        if (runButton) {
            runButton.addEventListener("click", () => {
                preview.srcdoc = editor.value;
            });
        }

        if (resetButton) {
            resetButton.addEventListener("click", () => {
                editor.value = starterCode;
                preview.srcdoc = starterCode;
            });
        }
    }

    // QUIZ SYSTEM
    const checkButton = page.querySelector("#checkQuiz");
    const result = page.querySelector("#quizResult");

    if (checkButton && result) {
        checkButton.addEventListener("click", () => {

            const questions = page.querySelectorAll(".quiz-question");
            let score = 0;
            let unanswered = 0;

            questions.forEach((question, index) => {
                const correctAnswer = question.dataset.answer;
                const selected = question.querySelector(
                    `input[name="q${index + 1}"]:checked`
                );

                if (!selected) {
                    unanswered++;
                    return;
                }

                if (selected.value === correctAnswer) {
                    score++;
                }
            });

            if (unanswered > 0) {
                result.textContent =
                    `Please answer all questions. ${unanswered} remaining.`;
                return;
            }

            result.textContent =
                `Your Score: ${score} / ${questions.length}`;

            if (score === questions.length) {
                result.textContent += " — Perfect Score! 🎉";
            } else {
                result.textContent += " — Keep practicing! 💪";
            }
        });
    }

    // LESSON COMPLETION SYSTEM
    const completeButton = page.querySelector("#completeLesson");
    const message = page.querySelector("#completionMessage");

    if (completeButton && message) {

        const storageKey = isLesson02
            ? "html-lesson-02-completed"
            : "html-lesson-01-completed";

        const lessonName = isLesson02
            ? "Document Structure"
            : "Introduction to HTML";

        function updateCompletion() {
            const completed = localStorage.getItem(storageKey) === "true";

            if (completed) {
                completeButton.textContent = "✓ Lesson Completed";
                completeButton.disabled = true;
                message.textContent =
                    `Excellent! You completed ${lessonName}. 🎉`;
            }
        }

        completeButton.addEventListener("click", () => {
            localStorage.setItem(storageKey, "true");
            updateCompletion();
        });

        updateCompletion();
    }

    console.log("CODE NEXA FORGE lesson system loaded!");
});

// ==========================================
// LESSON 03 — HTML ELEMENTS & TAGS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const page = document.querySelector(".elements-page");
    if (!page) return;

    // LIVE HTML EDITOR
    const editor = page.querySelector("#htmlEditor");
    const preview = page.querySelector("#htmlPreview");
    const runButton = page.querySelector("#runHTML");
    const resetButton = page.querySelector("#resetHTML");

    const starterCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>HTML Elements</title>
</head>
<body>
    <div>
        <h1>Welcome to HTML!</h1>
        <p>I am learning HTML elements.</p>
        <button>Click Me</button>
    </div>
</body>
</html>`;

    if (editor && preview) {
        editor.value = starterCode;
        preview.srcdoc = starterCode;

        if (runButton) {
            runButton.addEventListener("click", () => {
                preview.srcdoc = editor.value;
            });
        }

        if (resetButton) {
            resetButton.addEventListener("click", () => {
                editor.value = starterCode;
                preview.srcdoc = starterCode;
            });
        }
    }

    // QUIZ SYSTEM
    const checkButton = page.querySelector("#checkQuiz");
    const result = page.querySelector("#quizResult");

    if (checkButton && result) {
        checkButton.addEventListener("click", () => {

            const questions = page.querySelectorAll(".quiz-question");
            let score = 0;
            let unanswered = 0;

            questions.forEach((question, index) => {
                const correctAnswer = question.dataset.answer;
                const selected = question.querySelector(
                    `input[name="q${index + 1}"]:checked`
                );

                if (!selected) {
                    unanswered++;
                    return;
                }

                if (selected.value === correctAnswer) {
                    score++;
                }
            });

            if (unanswered > 0) {
                result.textContent =
                    `Answer all questions first. ${unanswered} remaining.`;
                return;
            }

            result.textContent =
                `Your Score: ${score} / ${questions.length}`;

            result.style.color =
                score === questions.length ? "#36e6a0" : "#f5c76b";

            if (score === questions.length) {
                result.textContent += " — Perfect Score! 🎉";
            } else {
                result.textContent += " — Keep practicing! 💪";
            }
        });
    }

    // LESSON COMPLETION
    const completeButton = page.querySelector("#completeLesson");
    const message = page.querySelector("#completionMessage");

    if (completeButton && message) {

        const storageKey = "html-lesson-03-completed";

        function updateCompletion() {
            const completed = localStorage.getItem(storageKey) === "true";

            if (completed) {
                completeButton.textContent = "✓ Lesson Completed";
                completeButton.disabled = true;
                message.textContent =
                    "Excellent! You completed HTML Elements & Tags. 🎉";
            }
        }

        completeButton.addEventListener("click", () => {
            localStorage.setItem(storageKey, "true");
            updateCompletion();
        });

        updateCompletion();
    }

    console.log("Lesson 03 system loaded!");
});

// LESSON 04 — HTML HEADINGS & PARAGRAPHS

document.addEventListener("DOMContentLoaded", () => {
    const page = document.querySelector(".typography-page");
    if (!page) return;

    const editor = page.querySelector("#htmlEditor");
    const preview = page.querySelector("#htmlPreview");
    const runButton = page.querySelector("#runHTML");
    const resetButton = page.querySelector("#resetHTML");

    const starterCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Typography Page</title>
</head>
<body>
    <h1>Welcome to My Website</h1>
    <h2>Learning HTML</h2>
    <p>HTML helps us create the structure of websites.</p>
    <p><strong>Important:</strong> Practice makes you better!</p>
    <p><em>Keep learning and building.</em></p>
</body>
</html>`;

    if (editor && preview) {
        editor.value = starterCode;
        preview.srcdoc = starterCode;

        if (runButton) {
            runButton.addEventListener("click", () => {
                preview.srcdoc = editor.value;
            });
        }

        if (resetButton) {
            resetButton.addEventListener("click", () => {
                editor.value = starterCode;
                preview.srcdoc = starterCode;
            });
        }
    }

    // QUIZ SYSTEM
    const checkButton = page.querySelector("#checkQuiz");
    const result = page.querySelector("#quizResult");

    if (checkButton && result) {
        checkButton.addEventListener("click", () => {
            const questions = page.querySelectorAll(".quiz-question");
            let score = 0;
            let unanswered = 0;

            questions.forEach((question, index) => {
                const correctAnswer = question.dataset.answer;
                const selected = question.querySelector(
                    `input[name="q${index + 1}"]:checked`
                );

                if (!selected) {
                    unanswered++;
                    return;
                }

                if (selected.value === correctAnswer) {
                    score++;
                }
            });

            if (unanswered > 0) {
                result.textContent =
                    `Answer all questions first. ${unanswered} remaining.`;
                return;
            }

            result.textContent = `Your Score: ${score} / ${questions.length}`;

            if (score === questions.length) {
                result.textContent += " — Perfect Score! 🎉";
                result.style.color = "#38e8ff";
            } else {
                result.textContent += " — Keep practicing! 💪";
                result.style.color = "#f5c76b";
            }
        });
    }

    // LESSON COMPLETION
    const completeButton = page.querySelector("#completeLesson");
    const message = page.querySelector("#completionMessage");

    if (completeButton && message) {
        const storageKey = "html-lesson-04-completed";

        function updateCompletion() {
            const completed = localStorage.getItem(storageKey) === "true";

            if (completed) {
                completeButton.textContent = "✓ Lesson Completed";
                completeButton.disabled = true;
                message.textContent =
                    "Excellent! You completed Headings & Paragraphs. 🎉";
            }
        }

        completeButton.addEventListener("click", () => {
            localStorage.setItem(storageKey, "true");
            updateCompletion();
        });

        updateCompletion();
    }

    console.log("Lesson 04 system loaded!");
});
