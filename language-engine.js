"use strict";

/*
 * NEXA AI — MULTILINGUAL ROUTING FOUNDATION
 * Local deterministic language identification and intent routing.
 * This module detects languages; it is not a machine-translation model.
 */

const LANGUAGE_NAMES = {
    en: "English", ur: "Urdu", "roman-ur": "Roman Urdu", hi: "Hindi",
    ar: "Arabic", zh: "Chinese", ja: "Japanese", ko: "Korean",
    ru: "Russian", es: "Spanish", fr: "French", de: "German",
    pt: "Portuguese", it: "Italian", tr: "Turkish"
};

const LANGUAGE_ALIASES = {
    english: "en", urdu: "ur", "roman urdu": "roman-ur", "roman-urdu": "roman-ur",
    hindi: "hi", arabic: "ar", chinese: "zh", mandarin: "zh",
    japanese: "ja", korean: "ko", russian: "ru", spanish: "es",
    french: "fr", german: "de", portuguese: "pt", italian: "it", turkish: "tr"
};

class LanguageEngine {
    normalizeMessage(message) {
        if (typeof message !== "string") return "";
        return message.normalize("NFKC")
            .replace(/\babbout\b/gi, "about")
            .replace(/\babhou\b/gi, "about")
            .replace(/\babotu\b/gi, "about")
            .replace(/\s+/g, " ").trim().slice(0, 5000);
    }

    cleanForMatching(message) {
        return this.normalizeMessage(message).toLowerCase()
            .replace(/[’']/g, "'")
            .replace(/[?!.,;:()[\]{}"`]/g, " ")
            .replace(/\s+/g, " ").trim();
    }

    detectLanguage(message) {
        const value = this.normalizeMessage(message);
        if (!value) return "unknown";
        // Japanese kana takes priority over shared Han characters.
        if (/[\u3040-\u30ff]/.test(value)) return "ja";
        if (/[\uAC00-\uD7AF]/.test(value)) return "ko";
        if (/[\u4e00-\u9fff]/.test(value)) return "zh";
        if (/[\u0900-\u097F]/.test(value)) return "hi";
        if (/[\u0400-\u04FF]/.test(value)) return "ru";
        if (/[\u0600-\u06FF]/.test(value)) {
            // Urdu-specific letters distinguish most Urdu-script messages from Arabic.
            return /[ٹڈڑںھہےپچگژ]|کیا|ہیں|ہے|اور|میں|آپ|تم/.test(value) ? "ur" : "ar";
        }

        const text = value.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
        const romanUrduWords = /\b(aur|hai|hain|ho|kya|kyun|kaise|kaisa|kaisi|kese|kesay|mujhe|mujh|tum|aap|ap|mera|meri|mere|hamara|hamari|batao|btao|bataiye|samjhao|samjha|karna|karo|chahiye|nahi|nahin|haan|acha|achha|theek|masla|zindagi|ilm|misal|farq|ky|ke|ki|ko|se|mein|main|salam|assalamualaikum|shukriya|yar|yaar)\b/g;
        const romanMatches = (text.match(romanUrduWords) || []).length;
        if (romanMatches >= 2 || /\b(kya|hai|hain|mujhe|batao|btao|samjhao|salam|assalamualaikum|shukriya)\b/.test(text)) {
            return "roman-ur";
        }

        const languageHints = [
            ["es", /\b(hola|gracias|que|como|porque|tambien|necesito|puedes|explica|por favor)\b/],
            ["fr", /\b(bonjour|merci|comment|pourquoi|avec|besoin|vous|explique|s'il vous plait)\b/],
            ["de", /\b(hallo|danke|warum|bitte|und|ich|nicht|erklare|was ist)\b/],
            ["pt", /\b(ola|obrigado|obrigada|voce|porque|preciso|explique|por favor)\b/],
            ["it", /\b(ciao|grazie|perche|come|bisogno|spiega|per favore)\b/],
            ["tr", /\b(merhaba|tesekkur|lutfen|neden|nasıl|anlat|nedir)\b/]
        ];
        for (const [code, pattern] of languageHints) if (pattern.test(text)) return code;
        // A remaining non-Latin alphabetic script should never be silently treated as English.
        if (/[^\u0000-\u024F\s\d\p{P}]/u.test(value)) return "unknown";
        return "en";
    }

    getLanguageName(code) {
        return LANGUAGE_NAMES[code] || "the detected language";
    }

    detectRequestedResponseLanguage(message) {
        const text = this.cleanForMatching(message);
        const match = text.match(/(?:reply|respond|answer|speak|talk|write|baat|jawab)\s+(?:to me\s+)?(?:in|using|mein|main)\s+([a-z -]{2,24})/i);
        if (!match) return null;
        const requested = match[1].trim().replace(/\b(please|from now on|only)\b/g, "").trim();
        return LANGUAGE_ALIASES[requested] || null;
    }

    detectIntent(message) {
        const text = this.cleanForMatching(message);
        if (!text) return "unknown";
        const exactOrStarts = phrases => phrases.some(p => text === p || text.startsWith(p + " "));

        if (exactOrStarts(["hi", "hello", "hey", "salam", "assalamualaikum", "good morning", "good afternoon", "good evening", "hola", "bonjour", "hallo", "ciao", "merhaba", "namaste", "adaab"])) return "greeting";
        if (exactOrStarts(["how are you", "how are you doing", "how is it going", "how's it going"])) return "wellbeing";
        if (exactOrStarts(["who are you", "what is your name", "tell me about yourself", "introduce yourself", "describe yourself", "your introduction", "tum kon ho", "aap kon hain", "apna taaruf karao", "apna introduction do", "aap kaun ho", "तुम कौन हो", "आप कौन हैं", "من أنت", "你是谁", "あなたは誰ですか"])) return "identity";
        if (exactOrStarts(["what can you do", "how can you help", "what are your capabilities", "tum kya kar sakte ho", "aap kya kar sakte hain"])) return "capabilities";
        if (exactOrStarts(["thank you", "thanks", "shukriya", "jazakallah", "gracias", "merci", "danke", "obrigado", "grazie"])) return "thanks";
        if (exactOrStarts(["bye", "goodbye", "allah hafiz", "khuda hafiz", "see you", "hasta luego", "au revoir", "auf wiedersehen"])) return "goodbye";
        if (exactOrStarts(["help", "i need help", "can you help me", "please help me", "madad karo", "meri madad karo"])) return "help";
        if (/\b(compare|comparison|difference|differences|differentiate|versus|vs|farq|mukabla|muqabla)\b/.test(text)) return "comparison";
        if (/\b(explain|describe|break down|walk me through)\b.*\b(each|every|these|those|the)\b.*\b(examples?|ones?)\b/.test(text)) return "explain_examples";
        if (/\b(example|examples|for example|real world|real-world|sample|misal|misalein|misalain|namoonay)\b/.test(text)) return "examples";
        if (/\b(explain|elaborate|in detail|more detail|tell me more|go deeper|how does .+ work|samjhao|samjhaen|tafseel|detail se|samjha do|wazahat)\b/.test(text)) return "explain";
        if (/^(more|explain more|tell me more|why|how|how so|what about it|what about that|continue|and then)$/.test(text)) return "followup";
        if (/\b(what is|what are|define|definition of|meaning of|who is|who was|kya hai|ka matlab|matlab kya|kiya hota hai)\b/.test(text)) return "definition";
        return "general";
    }

    isFollowUp(message) {
        const text = this.cleanForMatching(message);
        return /^(examples?|give me examples?|show me examples?|more|explain more|tell me more|why|how|how so|what about it|what about that|continue|and then|code example|sample code|aur batao|mazeed samjhao)$/.test(text) ||
            (/\b(it|that|this|those|them|yeh|ye|is ko|us ko|isko|usko)\b/.test(text) && /\b(explain|example|show|describe|more|why|how|samjhao|batao)\b/.test(text));
    }
}

LanguageEngine.LANGUAGE_NAMES = LANGUAGE_NAMES;
module.exports = LanguageEngine;
