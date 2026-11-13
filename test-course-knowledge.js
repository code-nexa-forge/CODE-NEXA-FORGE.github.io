"use strict";

const assert = require("assert");
const NexaEngine = require("./nexa/nexa-engine");
const courseKnowledge = require("./nexa/course-knowledge");

const engine = new NexaEngine();
const id = "cnf-course-test";

const totalLessons = Object.values(courseKnowledge.data.courses)
    .reduce((sum, course) => sum + course.lessons.length, 0);
assert.strictEqual(totalLessons, 24, "CNF must contain all 24 source lessons");

function check(label, response, expected) {
    assert(
        String(response).toLowerCase().includes(expected.toLowerCase()),
        `${label}: expected response to include "${expected}"`
    );
    console.log("PASS:", label);
}

check("HTML lesson outline", engine.generateResponse("List the HTML course lessons", id), "HTML Lists & Tables");
check("CSS lesson 5 source", engine.generateResponse("Explain CSS lesson 5", id), "one-dimensional");
check("JavaScript lesson 7 source", engine.generateResponse("Explain JavaScript lesson 7", id), "Document Object Model");
check("HTML lesson 6 source", engine.generateResponse("Explain HTML lesson 6", id), "ordered list");
check("CSS quiz questions", engine.generateResponse("Show me the CSS beginner test questions", id), "What does CSS stand for?");
check("CSS quiz question count", engine.generateResponse("Show me the CSS beginner test questions", id), "Questions in source quiz: 10");
check("JavaScript final answer key", engine.generateResponse("Give me the JavaScript final test answer key", id), "A Promise");
check("HTML form quiz answers", engine.generateResponse("Show the HTML Forms quiz answers", id), "The form element groups controls");
check("CSS project source", engine.generateResponse("Help me with the CSS course project", id), "Finish all six projects");
check("CSS lesson quiz questions", engine.generateResponse("Show the CSS lesson 5 quiz questions", id), "display: grid");
check("HTML lesson quiz answer key", engine.generateResponse("Give me the HTML lesson 6 quiz answers", id), "colspan");
check("JavaScript lesson quiz answer key", engine.generateResponse("Show JavaScript lesson 7 quiz answers", id), "addEventListener()");
const followupEngine = new NexaEngine();
const followupId = "cnf-course-followup-test";
const lessonResponse = followupEngine.generateResponse("Explain CSS lesson 5", followupId);
const followupResponse = followupEngine.generateResponse("examples", followupId);
check("Course lesson follow-up context", followupResponse, "Flexbox");
check("Course lesson source citation path", lessonResponse, "/courses/css-topics/05-flexbox-grid.html");


// Verify that every source lesson and every lesson quiz can be reached.
for (const course of Object.keys(courseKnowledge.data.courses)) {
    for (const lesson of courseKnowledge.data.courses[course].lessons) {
        const response = engine.generateResponse(
            `Explain ${course} lesson ${lesson.number}`,
            `${id}-${course}-${lesson.number}`
        );
        assert(response.includes(lesson.title), `${course} lesson ${lesson.number} was not retrieved`);

        const quizResponse = engine.generateResponse(
            `Show ${course} lesson ${lesson.number} quiz questions`,
            `${id}-quiz-${course}-${lesson.number}`
        );
        assert(
            quizResponse.includes("Questions in source quiz: 3"),
            `${course} lesson ${lesson.number} quiz was not retrieved`
        );
        assert(lesson.quiz.questions.every(q => Number.isInteger(q.correctIndex)),
            `${course} lesson ${lesson.number} must have a source answer key`);
    }
}
console.log("PASS: All 24 source lessons and all 72 lesson-quiz questions are reachable.");

console.log("\nAll CNF course knowledge tests passed.");
