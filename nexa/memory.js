
"use strict";

/* ==========================================
   CODE NEXA FORGE
   NEXA AI — CONVERSATION MEMORY
========================================== */

class NexaMemory {

    constructor(maxMessages = 30) {
        this.maxMessages = maxMessages;
        this.sessions = new Map();
    }

    getHistory(sessionId) {

        if (!this.sessions.has(sessionId)) {
            this.sessions.set(sessionId, []);
        }

        return this.sessions.get(sessionId);
    }

    addMessage(sessionId, role, content) {

        if (!sessionId || !content) {
            return false;
        }

        if (!["user", "assistant"].includes(role)) {
            return false;
        }

        const history = this.getHistory(sessionId);

        history.push({
            role,
            content: String(content),
            timestamp: new Date().toISOString()
        });

        while (history.length > this.maxMessages) {
            history.shift();
        }

        return true;
    }

    getRecentMessages(sessionId, limit = 10) {

        const history = this.getHistory(sessionId);

        return history.slice(-limit);
    }

    clearMemory(sessionId) {

        if (!sessionId) {
            return false;
        }

        return this.sessions.delete(sessionId);
    }

    clearAllMemory() {
        this.sessions.clear();
    }

}

module.exports = NexaMemory;
