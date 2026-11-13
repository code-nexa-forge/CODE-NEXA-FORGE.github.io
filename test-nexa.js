"use strict";

const assert = require("assert");
const NexaEngine = require("./nexa/nexa-engine");
const LanguageEngine = require("./nexa/language-engine");

const engine = new NexaEngine();
const language = new LanguageEngine();
const session = "nexa-core-regression";

function includes(label, actual, expected) {
    assert(String(actual).toLowerCase().includes(expected.toLowerCase()),
        `${label} failed. Expected "${expected}", received:\n${actual}`);
    console.log("PASS:", label);
}
function equals(label, actual, expected) {
    assert.strictEqual(actual, expected, `${label} failed.`);
    console.log("PASS:", label);
}

includes("NEXA identity", engine.generateResponse("Introduce yourself", session), "NEXA AI");
includes("Greeting", engine.generateResponse("Hello", session), "CODE NEXA FORGE");
includes("Wellbeing", engine.generateResponse("How are you?", session), "doing well");
includes("Typo-tolerant introduction", engine.generateResponse("Tell me abhou yourself", session), "learning assistant");
includes("HTML definition", engine.generateResponse("What is HTML?", session), "HyperText Markup Language");
includes("HTML examples", engine.generateResponse("HTML with examples", session), "<h1>");
includes("CSS definition", engine.generateResponse("What is CSS?", session), "Cascading Style Sheets");
includes("JavaScript definition", engine.generateResponse("What is JavaScript?", session), "JavaScript");
includes("Flexbox explanation", engine.generateResponse("What is Flexbox?", session), "one-dimensional");
includes("Grid explanation", engine.generateResponse("What is CSS Grid?", session), "two-dimensional");
includes("Python introduction", engine.generateResponse("Discuss about Python", session), "high-level");
includes("Java introduction", engine.generateResponse("Discuss about Java", session), "Java Virtual Machine");
includes("C++ introduction", engine.generateResponse("Tell me about C++", session), "general-purpose");
includes("Website explanation", engine.generateResponse("What is a website?", session), "web pages");
includes("Hyperlink explanation", engine.generateResponse("What is a hyperlink?", session), "anchor element");
includes("Web development explanation", engine.generateResponse("What is web development?", session), "Frontend development");

const followupEngine = new NexaEngine();
const first = followupEngine.generateResponse("What is HTML?", "follow-up");
const second = followupEngine.generateResponse("Give me examples", "follow-up");
includes("Contextual follow-up", second, "examples of HTML");
includes("Contextual code", second, "<!DOCTYPE html>");

equals("Roman Urdu response policy",
    engine.generateResponse("Mujhe HTML samjhao", session),
    "Sorry, I can only communicate in English.");
equals("Urdu script response policy",
    engine.generateResponse("آپ کیسے ہیں؟", session),
    "Sorry, I can only communicate in English.");
equals("Spanish response policy",
    engine.generateResponse("Hola, ¿cómo estás?", session),
    "Sorry, I can only communicate in English.");
equals("Requested non-English response policy",
    engine.generateResponse("Please reply in Spanish", session),
    "Sorry, I can only communicate in English.");
includes("Out-of-scope redirection",
    engine.generateResponse("Tell me about ancient Roman emperors", session),
    "focused on CODE NEXA FORGE");

includes("English language detection", language.detectLanguage("Hello, how are you?"), "en");
includes("Roman Urdu language detection", language.detectLanguage("Mujhe HTML samjhao aur examples do"), "roman-ur");
includes("Urdu script language detection", language.detectLanguage("آپ کیسے ہیں اور کیا کر رہے ہیں؟"), "ur");
includes("Hindi language detection", language.detectLanguage("आप कैसे हैं?"), "hi");
includes("Arabic language detection", language.detectLanguage("مرحبا كيف حالك"), "ar");
includes("Chinese language detection", language.detectLanguage("你好，你好吗"), "zh");
includes("Japanese language detection", language.detectLanguage("こんにちは"), "ja");
includes("Korean language detection", language.detectLanguage("안녕하세요"), "ko");
includes("Russian language detection", language.detectLanguage("Привет, как дела"), "ru");
includes("Spanish language detection", language.detectLanguage("Hola, gracias por favor"), "es");
includes("French language detection", language.detectLanguage("Bonjour, merci beaucoup"), "fr");
includes("German language detection", language.detectLanguage("Hallo, danke bitte"), "de");

const status = engine.getSystemStatus();
includes("Independent hybrid architecture", status.architecture, "independent-hybrid");
assert.strictEqual(status.externalAiApis, false);
assert.strictEqual(status.hostedModel, false);
console.log("PASS: Local engine remains independent of external AI APIs and hosted models");

console.log("\nAll NEXA AI conversational tests passed.");
