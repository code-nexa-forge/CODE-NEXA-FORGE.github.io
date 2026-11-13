"use strict";

const assert = require("assert");
const NexaEngine = require("./nexa/nexa-engine");
const LanguageEngine = require("./nexa/language-engine");

const engine = new NexaEngine();
const language = new LanguageEngine();
const session = "website-assistant-policy-tests";

function expectContains(label, actual, expected) {
    assert(String(actual).toLowerCase().includes(expected.toLowerCase()), `${label}: missing "${expected}" in:\n${actual}`);
    console.log("PASS:", label);
}
function expectEquals(label, actual, expected) {
    assert.strictEqual(actual, expected, `${label}: unexpected response`);
    console.log("PASS:", label);
}

const prompts = [
    ["hi", "Hello!"],
    ["hello", "Hello!"],
    ["how are you", "doing well"],
    ["who are you", "NEXA AI"],
    ["tell me abhou yourself", "CODE NEXA FORGE"],
    ["tell me about NEXA AI", "learning assistant"],
    ["your introduction", "NEXA AI"],
    ["tell me about web development", "Frontend development"],
    ["what is web development", "HTML"],
    ["what is a website", "collection of related web pages"],
    ["what is a hyperlink", "anchor element"],
    ["discuss about programming", "instructions that a computer can execute"],
    ["discuss about python", "high-level"],
    ["discuss about java", "Java Virtual Machine"],
    ["tell me about C++", "general-purpose programming language"],
    ["what can I learn here", "HTML, CSS and JavaScript"],
    ["where should I start", "Open the HTML course first"],
    ["what is frontend development", "HTML structures"],
    ["what is backend development", "server-side"],
    ["what is responsive design", "media queries"],
    ["what is DOM", "Document Object Model"],
    ["what is Flexbox", "one-dimensional"],
    ["what is CSS Grid", "two-dimensional"],
    ["how do I debug my code", "Share the relevant code"]
];

for (const [prompt, expected] of prompts) {
    expectContains(prompt, engine.generateResponse(prompt, session), expected);
}

expectContains("HTML course lesson outline", engine.generateResponse("List all HTML course lessons", session), "HTML Lists & Tables");
expectContains("CSS lesson 5 source", engine.generateResponse("Explain CSS lesson 5", session), "one-dimensional");
expectContains("JavaScript lesson 7 source", engine.generateResponse("Explain JavaScript lesson 7", session), "Document Object Model");
expectContains("HTML lesson 6 source", engine.generateResponse("Explain HTML lesson 6", session), "ordered list");
expectContains("CSS official test bank", engine.generateResponse("Show me the CSS beginner test questions", session), "Questions in source quiz: 10");
expectContains("JavaScript final test answer key", engine.generateResponse("Give me the JavaScript final test answer key", session), "A Promise");
expectContains("HTML forms lesson quiz answers", engine.generateResponse("Show the HTML Forms quiz answers", session), "form element");
expectContains("CSS projects", engine.generateResponse("Help me with the CSS course project", session), "six projects");

for (const phrase of [
    "salam kya haal hai",
    "aap kaise hain",
    "کیا حال ہے",
    "¿Cómo estás?",
    "Bonjour, comment allez-vous?",
    "こんにちは",
    "你好"
]) {
    expectEquals(`English-only rejection: ${phrase}`,
        engine.generateResponse(phrase, session),
        "Sorry, I can only communicate in English.");
}

expectEquals("Explicit request for Urdu response",
    engine.generateResponse("Please answer in Urdu", session),
    "Sorry, I can only communicate in English.");

expectContains("Out-of-scope topic redirected",
    engine.generateResponse("Tell me about ancient Roman emperors", session),
    "focused on CODE NEXA FORGE");

assert.strictEqual(language.detectLanguage("how are you"), "en");
assert.strictEqual(language.detectLanguage("aap kaise hain"), "roman-ur");
console.log("All website-assistant policy tests passed.");
