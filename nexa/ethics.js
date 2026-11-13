
"use strict";

/* ==========================================
   CODE NEXA FORGE
   NEXA AI — ETHICS ENGINE
========================================== */

class NexaEthics {

    constructor() {

        this.rules = {
            respect: true,
            honesty: true,
            privacy: true,
            safety: true,
            educationalPurpose: true
        };

    }

    checkMessage(message) {

        if (typeof message !== "string" || !message.trim()) {
            return {
                allowed: false,
                reason: "empty_message"
            };
        }

        if (message.length > 5000) {
            return {
                allowed: false,
                reason: "message_too_long"
            };
        }

        return {
            allowed: true,
            reason: "safe"
        };

    }

    getSafetyResponse() {

        return "I want to help you safely and responsibly. Please share more context so I can guide you appropriately.";

    }

    shouldBeHonest(confidence) {

        return typeof confidence === "number" &&
               confidence >= 0 &&
               confidence <= 1 &&
               confidence >= 0.7;

    }

    getUncertaintyResponse() {

        return "I am not sufficiently confident about this information. I don't want to mislead you, so please verify it with a reliable source.";

    }

    getPrivacyGuidance() {

        return "Please avoid sharing passwords, verification codes, financial details or other sensitive personal information.";

    }

}

module.exports = NexaEthics;
