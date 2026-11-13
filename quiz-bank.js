"use strict";

/*
========================================
 CODE NEXA FORGE
 SECURE SERVER-SIDE HTML QUIZ BANK
========================================

 IMPORTANT:
 This file must NEVER be placed inside
 the public folder.
*/

const PASS_PERCENTAGE = 60;

const quizzes = {

    html_basics: {
        course: "HTML",
        title: "HTML Fundamentals",
        duration: 5 * 60,
        questions: [
            {
                q: "What does HTML stand for?",
                o: [
                    "Hyper Text Markup Language",
                    "High Text Machine Language",
                    "Hyper Tool Multi Language",
                    "Home Text Markup Language"
                ],
                a: 0,
                e: "HTML stands for Hyper Text Markup Language."
            },
            {
                q: "Which declaration defines an HTML5 document?",
                o: [
                    "<html>",
                    "<!DOCTYPE html>",
                    "<head>",
                    "<!HTML5>"
                ],
                a: 1,
                e: "DOCTYPE tells the browser to use HTML5 standards mode."
            },
            {
                q: "Which section contains metadata and the page title?",
                o: [
                    "<body>",
                    "<footer>",
                    "<head>",
                    "<main>"
                ],
                a: 2,
                e: "The head contains metadata and the document title."
            },
            {
                q: "Which tag contains the visible page content?",
                o: [
                    "<body>",
                    "<meta>",
                    "<title>",
                    "<head>"
                ],
                a: 0,
                e: "The body contains the content displayed on the page."
            },
            {
                q: "Which attribute sets the language of an HTML document?",
                o: [
                    "charset",
                    "lang",
                    "language-type",
                    "dir-name"
                ],
                a: 1,
                e: "The lang attribute on the html element declares the language."
            }
        ]
    },

    html_elements: {
        course: "HTML",
        title: "HTML Elements",
        duration: 5 * 60,
        questions: [
            {
                q: "Which tag creates the largest heading level?",
                o: [
                    "<h6>",
                    "<head>",
                    "<h1>",
                    "<heading>"
                ],
                a: 2,
                e: "H1 is the highest-level heading."
            },
            {
                q: "Which tag creates a paragraph?",
                o: [
                    "<paragraph>",
                    "<p>",
                    "<text>",
                    "<para>"
                ],
                a: 1,
                e: "The p element represents a paragraph."
            },
            {
                q: "Which attribute specifies an image file?",
                o: [
                    "href",
                    "link",
                    "src",
                    "alt"
                ],
                a: 2,
                e: "The src attribute specifies the image resource."
            },
            {
                q: "Which tag creates an ordered list?",
                o: [
                    "<ul>",
                    "<li>",
                    "<dl>",
                    "<ol>"
                ],
                a: 3,
                e: "The ol element creates an ordered list."
            },
            {
                q: "Which element creates a hyperlink?",
                o: [
                    "<a>",
                    "<linkto>",
                    "<href>",
                    "<url>"
                ],
                a: 0,
                e: "The anchor element creates a hyperlink."
            }
        ]
    },

    html_forms: {
        course: "HTML",
        title: "HTML Forms",
        duration: 5 * 60,
        questions: [
            {
                q: "Which element creates an HTML form?",
                o: [
                    "<input>",
                    "<form>",
                    "<label>",
                    "<fieldset>"
                ],
                a: 1,
                e: "The form element groups controls for submitting data."
            },
            {
                q: "Which input type hides typed characters?",
                o: [
                    "text",
                    "hidden",
                    "password",
                    "private"
                ],
                a: 2,
                e: "Password inputs mask the characters typed by the user."
            },
            {
                q: "Which attribute makes a field compulsory?",
                o: [
                    "required",
                    "must",
                    "needed",
                    "validate"
                ],
                a: 0,
                e: "The required attribute prevents submission until the field is filled."
            },
            {
                q: "Which tag describes a form control?",
                o: [
                    "<caption>",
                    "<label>",
                    "<name>",
                    "<describe>"
                ],
                a: 1,
                e: "Label provides a caption for a form control."
            },
            {
                q: "Which input type creates a checkbox?",
                o: [
                    "check",
                    "select",
                    "tick",
                    "checkbox"
                ],
                a: 3,
                e: "Use type=checkbox for a checkbox control."
            }
        ]
    },

    html_advanced: {
        course: "HTML",
        title: "HTML Advanced Practice",
        duration: 5 * 60,
        questions: [
            {
                q: "Which element represents the main content of a page?",
                o: [
                    "<main>",
                    "<aside>",
                    "<small>",
                    "<summary>"
                ],
                a: 0,
                e: "Main represents the dominant content of the document."
            },
            {
                q: "Which element is used for self-contained content such as a blog post?",
                o: [
                    "<section>",
                    "<article>",
                    "<span>",
                    "<div>"
                ],
                a: 1,
                e: "Article represents self-contained, independently distributable content."
            },
            {
                q: "What is the purpose of alt text on an image?",
                o: [
                    "Change image size",
                    "Add a border",
                    "Describe the image",
                    "Create a link"
                ],
                a: 2,
                e: "Alt text provides a text alternative for an image."
            },
            {
                q: "Which attribute opens a link in a new tab?",
                o: [
                    "new",
                    "tab",
                    "window",
                    'target="_blank"'
                ],
                a: 3,
                e: "target=_blank requests that the link open in a new browsing context."
            },
            {
                q: "Which element represents navigation links?",
                o: [
                    "<nav>",
                    "<menuitem>",
                    "<route>",
                    "<links>"
                ],
                a: 0,
                e: "The nav element represents a section of navigation links."
            }
        ]
    },

    html_revision: {
        course: "HTML",
        title: "Quick Revision",
        duration: 5 * 60,
        questions: [
            {
                q: "Which tag creates a line break?",
                o: [
                    "<break>",
                    "<br>",
                    "<lb>",
                    "<line>"
                ],
                a: 1,
                e: "The br element creates a line break."
            },
            {
                q: "Which tag defines a table row?",
                o: [
                    "<td>",
                    "<th>",
                    "<tr>",
                    "<table-row>"
                ],
                a: 2,
                e: "The tr element defines a table row."
            },
            {
                q: "Which attribute provides an image description?",
                o: [
                    "alt",
                    "src",
                    "href",
                    "title-only"
                ],
                a: 0,
                e: "The alt attribute provides alternative text."
            },
            {
                q: "Which tag marks important text?",
                o: [
                    "<mark>",
                    "<em>",
                    "<strong>",
                    "<small>"
                ],
                a: 2,
                e: "Strong represents text of strong importance."
            },
            {
                q: "Which element creates an unordered list?",
                o: [
                    "<ol>",
                    "<ul>",
                    "<li>",
                    "<dl>"
                ],
                a: 1,
                e: "The ul element creates an unordered list."
            }
        ]
    }

};

/*
========================================
 COMPLETE HTML TEST
 Combines Fundamentals, Elements, Forms
========================================
*/

quizzes.html_complete = {
    course: "HTML",
    title: "Complete HTML Test",
    duration: 15 * 60,
    questions: [
        ...quizzes.html_basics.questions,
        ...quizzes.html_elements.questions,
        ...quizzes.html_forms.questions
    ]
};

/*
========================================
 SERVER-SIDE HELPER FUNCTIONS
========================================
*/

// Get quiz including private answer keys.
// Use this ONLY inside server-side code.
function getQuiz(quizId) {
    return quizzes[quizId] || null;
}

// Return questions WITHOUT correct answers.
// Safe to send to the browser.
function getPublicQuiz(quizId) {
    const quiz = getQuiz(quizId);

    if (!quiz) return null;

    return {
        quizId,
        course: quiz.course,
        title: quiz.title,
        duration: quiz.duration,
        totalQuestions: quiz.questions.length,

        questions: quiz.questions.map(question => ({
            q: question.q,
            o: [...question.o]
        }))
    };
}

// Return official quiz information.
function getQuizList() {
    return Object.entries(quizzes).map(([quizId, quiz]) => ({
        quizId,
        course: quiz.course,
        title: quiz.title,
        totalQuestions: quiz.questions.length,
        duration: quiz.duration
    }));
}

// Calculate result on the server.
function calculateQuizResult(quizId, answers) {
    const quiz = getQuiz(quizId);

    if (!quiz) {
        throw new Error("Invalid quiz ID.");
    }

    if (!Array.isArray(answers)) {
        throw new Error("Answers must be an array.");
    }

    if (answers.length !== quiz.questions.length) {
        throw new Error("Invalid number of submitted answers.");
    }

    let score = 0;

    const review = quiz.questions.map((question, index) => {

        const submittedAnswer = answers[index];

        if (
            submittedAnswer !== null &&
            (
                !Number.isInteger(submittedAnswer) ||
                submittedAnswer < 0 ||
                submittedAnswer >= question.o.length
            )
        ) {
            throw new Error("Invalid answer selection.");
        }

        const correct = submittedAnswer === question.a;

        if (correct) {
            score++;
        }

        return {
            question: question.q,
            selectedAnswer: submittedAnswer,
            correctAnswer: question.a,
            options: [...question.o],
            correct,
            explanation: question.e
        };
    });

    const totalQuestions = quiz.questions.length;

    const percentage = Math.round(
        (score / totalQuestions) * 100
    );

    return {
        quizId,
        course: quiz.course,
        title: quiz.title,
        score,
        totalQuestions,
        percentage,
        passed: percentage >= PASS_PERCENTAGE,
        passPercentage: PASS_PERCENTAGE,
        review
    };
}

module.exports = {
    PASS_PERCENTAGE,
    getQuiz,
    getPublicQuiz,
    getQuizList,
    calculateQuizResult
};
