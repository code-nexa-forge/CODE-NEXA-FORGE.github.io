"use strict";

/* ==========================================
   CODE NEXA FORGE
   NEXA AI — CORE CONVERSATIONAL ENGINE
   Independent local, rule-based assistant
========================================== */

const knowledgeBase = require("./knowledge-base");
const courseKnowledge = require("./course-knowledge");
const websiteAssistant = require("./website-assistant");
const LanguageEngine = require("./language-engine");
const NexaMemory = require("./memory");
const NexaEthics = require("./ethics");
const personality = require("../nexa-personality");
const hybridConfig = require("./hybrid-config");

class NexaEngine {
    constructor() {
        this.name = "NEXA AI";
        this.version = "2.3.0";
        this.identity = knowledgeBase.identity;
        this.language = new LanguageEngine();
        this.memory = new NexaMemory(40);
        this.ethics = new NexaEthics();
        this.architecture = hybridConfig;
        this.languagePreferences = new Map();
    }

    getContext(previousMessages, sessionId) {
        const requestHistory = Array.isArray(previousMessages)
            ? previousMessages
            : this.memory.getRecentMessages(sessionId, 30);

        for (let index = requestHistory.length - 1; index >= 0; index--) {
            const item = requestHistory[index];
            if (!item || item.role !== "user" || typeof item.content !== "string") {
                continue;
            }

            const found = knowledgeBase.findTopics(item.content);
            if (found.length === 1) {
                return { topic: found[0], ambiguousTopics: [] };
            }
            if (found.length > 1) {
                return { topic: null, ambiguousTopics: found.slice(0, 3) };
            }
        }

        return { topic: null, ambiguousTopics: [] };
    }

    generateResponse(message, sessionId = "default", previousMessages = null) {
        const validation = this.ethics.checkMessage(message);

        if (!validation.allowed) {
            if (validation.reason === "message_too_long") {
                return "Your message is too long. Please keep it under 5000 characters.";
            }
            return "Please enter a message so we can start chatting.";
        }

        const cleanMessage = this.language.normalizeMessage(message);
        const detectedLanguage = this.language.detectLanguage(cleanMessage);
        const requestedLanguage = this.language.detectRequestedResponseLanguage(cleanMessage);

        // NEXA communicates in English only. Reject non-English input and
        // explicit requests for another response language before intent routing.
        if (
            (detectedLanguage !== "en" && detectedLanguage !== "unknown") ||
            detectedLanguage === "unknown" ||
            (requestedLanguage && requestedLanguage !== "en")
        ) {
            const languageNotice = "Sorry, I can only communicate in English.";
            this.memory.addMessage(sessionId, "user", cleanMessage);
            this.memory.addMessage(sessionId, "assistant", languageNotice);
            return languageNotice;
        }

        const intent = this.language.detectIntent(cleanMessage);
        const currentTopics = knowledgeBase.findTopics(cleanMessage);
        const context = this.getContext(previousMessages, sessionId);
        this.memory.addMessage(sessionId, "user", cleanMessage);
        let reply = null;

        switch (intent) {
            case "greeting":
                reply = websiteAssistant.GREETING;
                break;

            case "wellbeing":
                reply = websiteAssistant.getQuickResponse(cleanMessage);
                break;

            case "identity":
                reply = websiteAssistant.INTRODUCTION;
                break;

            case "capabilities":
                reply = websiteAssistant.CAPABILITIES;
                break;

            case "thanks":
                reply = "You're welcome! If you'd like, we can explore the topic further with an explanation or an example.";
                break;

            case "goodbye":
                reply = "Goodbye! Keep learning, building and mastering with CODE NEXA FORGE.";
                break;

            case "help": {
                const courseHistory = Array.isArray(previousMessages)
                    ? previousMessages
                    : this.memory.getRecentMessages(sessionId, 30);
                reply = courseKnowledge.findCourseResponse(cleanMessage, courseHistory) ||
                    websiteAssistant.getQuickResponse(cleanMessage) ||
                    "Ask me about CODE NEXA FORGE courses, lessons, quizzes, tests, projects or web-development concepts.";
                break;
            }

            default: {
                const isContextFollowUp =
                    this.language.isFollowUp(cleanMessage) ||
                    ["examples", "explain", "explain_examples", "followup"].includes(intent);

                let contextTopic = null;

                // Prefer answers grounded in the actual CNF lesson and quiz files.
                const courseHistory = Array.isArray(previousMessages)
                    ? previousMessages
                    : this.memory.getRecentMessages(sessionId, 30);
                const courseReply = courseKnowledge.findCourseResponse(
                    cleanMessage,
                    courseHistory
                );

                if (courseReply) {
                    reply = courseReply;
                    break;
                }

                const quickReply = websiteAssistant.getQuickResponse(cleanMessage);
                if (quickReply) {
                    reply = quickReply;
                    break;
                }

                const allowedTopicIds = new Set([
                    "programming", "html", "css", "flexbox", "cssGrid",
                    "javascript", "java", "python", "cpp", "nodejs",
                    "api", "frontend", "backend"
                ]);
                const scopedTopics = currentTopics.filter(id => allowedTopicIds.has(id));
                if (
                    scopedTopics.length === 0 &&
                    isContextFollowUp &&
                    context.topic &&
                    allowedTopicIds.has(context.topic)
                ) {
                    scopedTopics.push(context.topic);
                }

                if (!websiteAssistant.isInScope(cleanMessage, scopedTopics)) {
                    reply = websiteAssistant.SCOPE_REPLY;
                    break;
                }

                if (scopedTopics.length === 1) {
                    contextTopic = scopedTopics[0];
                } else if (scopedTopics.length === 0 && isContextFollowUp && context.topic && allowedTopicIds.has(context.topic)) {
                    contextTopic = context.topic;
                }
                if (
                    isContextFollowUp &&
                    scopedTopics.length === 0 &&
                    context.ambiguousTopics.length > 1
                ) {
                    const names = context.ambiguousTopics
                        .map(id => knowledgeBase.getTopic(id).title)
                        .join(" or ");
                    reply = "Which topic do you mean: " + names + "? I want to make sure I give you the right explanation.";
                    break;
                }

                if (
                    intent === "examples" &&
                    scopedTopics.length > 1
                ) {
                    const names = scopedTopics
                        .slice(0, 3)
                        .map(id => knowledgeBase.getTopic(id).title)
                        .join(" or ");
                    reply = "Would you like examples of " + names + "? Please choose one so I can focus the answer.";
                    break;
                }

                reply = knowledgeBase.getTopicResponse(cleanMessage, {
                    intent,
                    contextTopic
                });

                if (!reply && scopedTopics.length > 1) {
                    reply = scopedTopics.slice(0, 3).map(id => {
                        const topic = knowledgeBase.getTopic(id);
                        return topic.title + ":\n" + topic.definition;
                    }).join("\n\n");
                }

                if (!reply && isContextFollowUp && contextTopic) {
                    reply = knowledgeBase.getTopicResponse(cleanMessage, {
                        intent: intent === "general" ? "followup" : intent,
                        contextTopic
                    });
                }

                if (!reply) {
                    reply = "I don't have enough verified information in my local knowledge base to answer that accurately yet. You can try asking about a supported topic, or rephrase the question with a little more detail.";
                }
                break;
            }
        }

        this.memory.addMessage(sessionId, "assistant", reply);

        return reply;
    }

    getPreferredLanguage(sessionId = "default") {
        return this.languagePreferences.get(sessionId) || null;
    }

    getSystemStatus() {
        return { name: this.name, version: this.architecture.version, architecture: this.architecture.architecture, inferenceProvider: this.architecture.inference.provider, externalAiApis: this.architecture.inference.externalAiApis, hostedModel: this.architecture.inference.hostedModel, automaticTranslationReady: this.architecture.language.automaticTranslationReady, knowledgeSource: this.architecture.knowledge.primary };
    }

    getConversation(sessionId = "default") {
        return this.memory.getRecentMessages(sessionId, 40);
    }

    clearSession(sessionId = "default") {
        this.memory.clearMemory(sessionId);
        this.languagePreferences.delete(sessionId);
    }
}

module.exports = NexaEngine;
