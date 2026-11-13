"use strict";

/* NEXA AI hybrid architecture settings. No external AI inference provider. */
module.exports = Object.freeze({
    architecture: "independent-hybrid",
    version: "2.3.0",
    inference: Object.freeze({ provider: "local-rule-engine", externalAiApis: false, hostedModel: false }),
    knowledge: Object.freeze({ primary: "curated-local+cnf-course-files", optionalUpdates: true, requireSourceVerification: true }),
    language: Object.freeze({ detection: "local-heuristics", translationModel: null, automaticTranslationReady: false }),
    memory: Object.freeze({ scope: "per-session", persistence: "current-engine-memory" }),
    network: Object.freeze({ enabledForKnowledgeUpdates: false, enabledForInference: false })
});
