"use strict";

/*
 * CODE NEXA FORGE — SOURCE-GROUNDED COURSE KNOWLEDGE
 * This module answers from course-knowledge.json, extracted from the
 * supplied CNF website lessons, course pages and quiz banks.
 */

const data = require("./course-knowledge.json");

const COURSE_ALIASES = {
    html: ["html", "hypertext markup language"],
    css: ["css", "cascading style sheets", "cascading style sheet"],
    javascript: ["javascript", "java script", "js"]
};

const STOP_WORDS = new Set([
    "what","is","are","the","a","an","of","to","in","on","for","with","and",
    "or","explain","tell","me","about","please","can","you","give","show",
    "teach","describe","detail","detailed","more","how","does","do","i",
    "want","know","understand","from","cnf","course","lesson","module",
    "topic","topics","content","covered","it","this","that","these","those",
    "example","examples","sample","samples","code","program","programming",
    "quiz","test","tests","questions","question","mcq","mcqs","answer","answers",
    "correct","solution","solutions","explanation","explanations","practice",
    "start","take","attempt","my","your","all","list","outline","syllabus","each"
]);

const NUMBER_WORDS = {
    one:1, first:1, two:2, second:2, three:3, third:3, four:4, fourth:4,
    five:5, fifth:5, six:6, sixth:6, seven:7, seventh:7, eight:8, eighth:8
};

function normalize(value) {
    return String(value || "").toLowerCase()
        .replace(/javascript/g, "javascript")
        .replace(/[^a-z0-9+#.\s-]/g, " ")
        .replace(/\s+/g, " ").trim();
}

function tokens(value) {
    return normalize(value).split(" ")
        .filter(word => word.length > 1 && !STOP_WORDS.has(word));
}

function detectCourse(value) {
    const text = normalize(value);
    for (const [course, aliases] of Object.entries(COURSE_ALIASES)) {
        if (aliases.some(alias => new RegExp("(^|\\b)" + alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(\\b|$)", "i").test(text))) {
            return course;
        }
    }

    const courseClues = {
        html: /\b(?:doctype|html tag|html element|document structure|hyperlink|html form|html table|ordered list|unordered list|html heading|html paragraph|semantic html)\b/,
        css: /\b(?:flexbox|css grid|box model|responsive (?:web )?design|media quer(?:y|ies)|typography|css animation|background color|stylesheet|css selector)\b/,
        javascript: /\b(?:javascript|dom|document object model|array|arrays|object|objects|loop|loops|function|functions|async|await|promise|promises|event listener|javascript variable|conditional|fetch api)\b/
    };
    for (const [course, pattern] of Object.entries(courseClues)) {
        if (pattern.test(text)) return course;
    }
    return null;
}

function detectLessonNumber(value) {
    const text = normalize(value);
    const numeric = text.match(/\b(?:lesson|module|chapter)\s*#?\s*(0?[1-8])\b/);
    if (numeric) return Number(numeric[1]);
    const named = text.match(/\b(?:lesson|module|chapter)\s+(one|first|two|second|three|third|four|fourth|five|fifth|six|sixth|seven|seventh|eight|eighth)\b/);
    return named ? NUMBER_WORDS[named[1]] : null;
}

function findHistoryContext(history) {
    if (!Array.isArray(history)) return {};
    for (let i = history.length - 1; i >= 0; i--) {
        const item = history[i];
        if (!item || item.role !== "user" || typeof item.content !== "string") continue;
        const course = detectCourse(item.content);
        const lesson = detectLessonNumber(item.content);
        if (course || lesson) return { course, lesson };
    }
    return {};
}

function lessonList(course) {
    return data.courses[course].lessons
        .map(lesson => {
            const title = lesson.title
                .replace(/^CNF\/\s*\|\s*/i, "")
                .replace(/\s*\|\s*CNF\/?\s*$/i, "")
                .replace(/^Lesson\s+\d+\s*[—-]\s*/i, "")
                .trim();
            return `${String(lesson.number).padStart(2,"0")}. ${title}`;
        })
        .join("\n");
}

function getBestLesson(course, message) {
    const lessons = data.courses[course].lessons;
    const number = detectLessonNumber(message);
    if (number) return lessons.find(lesson => lesson.number === number) || null;

    const words = tokens(message).filter(word => !["html","css","javascript","js"].includes(word));
    if (!words.length) return null;

    let best = null;
    let bestScore = 0;
    for (const lesson of lessons) {
        const title = normalize(lesson.title);
        const headings = lesson.headings.map(normalize);
        const sectionTitles = lesson.sections.map(section => normalize(section.heading));
        const content = normalize(lesson.content);
        let score = 0;
        for (const word of words) {
            if (title.includes(word)) score += 7;
            if (headings.some(h => h.includes(word))) score += 4;
            if (sectionTitles.some(h => h.includes(word))) score += 5;
            if (content.includes(word)) score += 1;
        }
        if (score > bestScore) {
            best = lesson;
            bestScore = score;
        }
    }
    return bestScore >= 3 ? best : null;
}

function selectSections(lesson, message) {
    const words = tokens(message);
    const ranked = lesson.sections.map((section, index) => {
        const heading = normalize(section.heading);
        const body = normalize(section.content);
        let score = 0;
        for (const word of words) {
            if (heading.includes(word)) score += 8;
            if (body.includes(word)) score += 1;
        }
        if (/responsive/.test(normalize(message)) &&
            /media|viewport|mobile-first|flexible widths|responsive images/.test(heading)) {
            score += 20;
        }
        return { section, index, score };
    }).filter(item => item.score > 0)
      .sort((a,b) => b.score - a.score || a.index - b.index);
    return ranked.slice(0, 3).sort((a,b) => a.index-b.index).map(item => item.section);
}

function formatLesson(course, lesson, message) {
    const courseName = course.toUpperCase();
    const explicitNumber = detectLessonNumber(message);
    const sections = explicitNumber ? lesson.sections.slice(0, 5) : selectSections(lesson, message);
    let output = `${courseName} — ${lesson.title}\nSource: ${lesson.source}\n`;
    if (sections.length) {
        output += "\n" + sections.map(section =>
            `${section.heading}\n${section.content.replace(/\s+/g, " ").trim()}`
        ).join("\n\n");
    } else {
        output += "\n" + lesson.content.slice(0, 3600);
    }

    if (/code|example|sample|snippet|program/i.test(message) && lesson.codeExamples.length) {
        output += "\n\nCode examples from this lesson:\n" +
            lesson.codeExamples.slice(0, 3).map((code, i) =>
                `Example ${i + 1}:\n\`\`\`\n${code.slice(0, 1800)}\n\`\`\``
            ).join("\n\n");
    }
    if (output.length > 6500) output = output.slice(0, 6500) + "\n\n[Response shortened. Ask about a specific section for more detail.]";
    return output;
}

function formatQuizList(course) {
    const quizzes = data.courses[course].quizzes;
    if (!quizzes.length) return `I could not find a quiz bank for ${course.toUpperCase()} in the supplied CNF files.`;
    return `${course.toUpperCase()} tests available in the supplied CNF project:\n` +
        quizzes.map((quiz, i) => `${i + 1}. ${quiz.title} — ${quiz.questions.length} questions`).join("\n") +
        "\n\nAsk for a test by its title or level to review its questions.";
}

function chooseQuiz(course, message) {
    const quizzes = data.courses[course].quizzes;
    const text = normalize(message);
    let best = null, score = 0;
    for (const quiz of quizzes) {
        const title = normalize(quiz.title);
        const id = normalize(quiz.id.replace(/_/g, " "));
        let s = 0;
        for (const word of tokens(text)) {
            if (title.includes(word)) s += 5;
            if (id.includes(word)) s += 3;
        }
        if (s > score) { score = s; best = quiz; }
    }
    if (/\b(beginner|intermediate|final|fundamental|advanced|revision|complete|forms|elements)\b/.test(text) && best) return best;
    return score >= 3 ? best : null;
}

function formatQuiz(course, quiz, message) {
    const reveal = /\b(answer|answers|correct|solution|solutions|explanation|explanations|answer key)\b/i.test(message);
    const questions = quiz.questions.map((q, index) => {
        const questionText = q.question.replace(/^(?:(?:question\s*)?\d+\s*[:.)-]\s*)+/i, "");
        let item = `${index + 1}. ${questionText}\n` +
            q.options.map((option, i) => `   ${String.fromCharCode(65+i)}. ${option}`).join("\n");
        if (reveal) {
            item += `\n   Correct answer: ${String.fromCharCode(65 + q.correctIndex)}. ${q.options[q.correctIndex]}`;
            if (q.explanation) item += `\n   Explanation: ${q.explanation}`;
        }
        return item;
    });
    return `${course.toUpperCase()} — ${quiz.title}\n` +
        (quiz.source ? `Source: ${quiz.source}\n` : "") +
        `Questions in source quiz: ${quiz.questions.length}\n\n` +
        questions.join("\n\n") +
        (reveal ? "" : "\n\nAsk me for the answer key and explanations when you are ready.");
}

function findCourseResponse(message, history = []) {
    const text = normalize(message);
    const context = findHistoryContext(history);
    const explicitCourse = detectCourse(message);
    const isFollowUp = /^(?:give me (?:an? )?)?(?:more|examples?|explain (?:it|that|each (?:example|part|step))|show (?:me )?(?:the )?code|code|why|how about that|what about that|tell me more)\b/i.test(text);
    const course = explicitCourse || (isFollowUp ? context.course : null);
    const lessonNumber = detectLessonNumber(message) || (isFollowUp ? context.lesson : null);

    if (!course) return null;
    const pack = data.courses[course];
    if (!pack) return null;

    if (/\b(quiz|test|tests|mcq|mcqs|question bank|practice questions|answer key)\b/i.test(text)) {
        if (lessonNumber) {
            const lesson = pack.lessons.find(item => item.number === lessonNumber);
            if (lesson && lesson.quiz) return formatQuiz(course, lesson.quiz, message);
        }
        const quiz = chooseQuiz(course, message);
        return quiz ? formatQuiz(course, quiz, message) : formatQuizList(course);
    }

    if (/\b(project|projects|mini website|final project|project help)\b/i.test(text)) {
        const page = pack.pages.find(item => /projects\.html$/i.test(item.source));
        if (page) return `${course.toUpperCase()} course projects\nSource: ${page.source}\n\n${page.content.slice(0, 5000)}`;
    }

    if (lessonNumber) {
        const lesson = pack.lessons.find(item => item.number === lessonNumber);
        return lesson ? formatLesson(course, lesson, message) : null;
    }

    if (/\b(lessons|course outline|syllabus|topics covered|what do you teach|what (?:will|can) i learn|what is taught|what does .{0,25} teach|course overview|all topics|course contents)\b/i.test(text)) {
        return `${course.toUpperCase()} — lessons included in CODE NEXA FORGE:\n${lessonList(course)}`;
    }

    const lesson = getBestLesson(course, message);
    if (lesson) return formatLesson(course, lesson, message);

    return null;
}

module.exports = {
    data,
    detectCourse,
    detectLessonNumber,
    findCourseResponse
};
