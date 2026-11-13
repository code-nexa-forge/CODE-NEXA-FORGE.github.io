
/* =========================================
   NEXA AI - GLOBAL CHAT WIDGET
   CODE NEXA FORGE
========================================= */

(() => {
    "use strict";

    const currentPage = window.location.pathname.toLowerCase();
    const pageName = currentPage.split("/").filter(Boolean).pop() || "";

    // These pages already provide their own NEXA experience:
    // - index.html: bespoke homepage launcher and chat window
    // - nexa-ai.html: dedicated full-page assistant interface
    // - ai-assistant.html: redirect-only compatibility page
    // Never mount the global floating widget on any of them.
    if (
        currentPage === "/" ||
        pageName === "index.html" ||
        pageName === "nexa-ai.html" ||
        pageName === "ai-assistant.html"
    ) {
        return;
    }

    if (document.getElementById("nexa-global-widget")) {
        return;
    }

    const chatHistory = [];
    let isWaiting = false;

    const widget = document.createElement("div");
    widget.id = "nexa-global-widget";

    widget.innerHTML = `
        <button
            class="nexa-global-launcher"
            type="button"
            aria-label="Open NEXA AI chat"
            aria-expanded="false"
            title="Chat with NEXA AI"
        >✦</button>

        <section
            class="nexa-global-chat"
            role="dialog"
            aria-label="NEXA AI chat"
            aria-hidden="true"
        >
            <header class="nexa-global-header">
                <div class="nexa-global-brand">
                    <div class="nexa-global-avatar">✦</div>
                    <div>
                        <div class="nexa-global-title">NEXA AI</div>
                        <div class="nexa-global-status">● Ready to assist</div>
                    </div>
                </div>

                <div class="nexa-global-actions">
                    <button class="nexa-global-minimize"
                        type="button" aria-label="Minimize chat">−</button>
                    <button class="nexa-global-close"
                        type="button" aria-label="Close chat">×</button>
                </div>
            </header>

            <div class="nexa-global-scope">
                <strong>CODE NEXA FORGE Learning Assistant</strong>
                <span>Ask about this website, HTML, CSS, JavaScript, lessons, quizzes, tests and projects. English only.</span>
            </div>

            <div class="nexa-global-messages" aria-live="polite">
                <div class="nexa-global-message nexa-global-bot">
                    Hello! I'm NEXA AI, your CODE NEXA FORGE learning assistant. What would you like to learn today?
                </div>
            </div>

            <div class="nexa-global-suggestions">
                <button type="button" data-message="Teach me HTML">
                    Learn HTML
                </button>
                <button type="button" data-message="List all HTML course lessons">
                    Explore courses
                </button>
                <button type="button" data-message="Explain CSS Flexbox with an example">
                    Learn CSS
                </button>
            </div>

            <form class="nexa-global-input-area">
                <input
                    class="nexa-global-input"
                    type="text"
                    placeholder="Ask about CODE NEXA FORGE..."
                    autocomplete="off"
                    aria-label="Type your message"
                    maxlength="12000"
                    required
                >

                <button class="nexa-global-send"
                    type="submit" aria-label="Send message">➤</button>
            </form>

            <a class="nexa-global-full-link" href="/nexa-ai.html">
                Open Full NEXA AI Experience ↗
            </a>
        </section>
    `;

    document.body.appendChild(widget);

    const launcher = widget.querySelector(".nexa-global-launcher");
    const chat = widget.querySelector(".nexa-global-chat");
    const closeButton = widget.querySelector(".nexa-global-close");
    const minimizeButton = widget.querySelector(".nexa-global-minimize");
    const form = widget.querySelector(".nexa-global-input-area");
    const input = widget.querySelector(".nexa-global-input");
    const sendButton = widget.querySelector(".nexa-global-send");
    const messages = widget.querySelector(".nexa-global-messages");
    const suggestions = widget.querySelectorAll(
        ".nexa-global-suggestions button"
    );

    function openChat() {
        chat.classList.add("nexa-global-open");
        chat.setAttribute("aria-hidden", "false");
        launcher.setAttribute("aria-expanded", "true");
        input.focus();
    }

    function closeChat() {
        chat.classList.remove("nexa-global-open");
        chat.setAttribute("aria-hidden", "true");
        launcher.setAttribute("aria-expanded", "false");
    }

    launcher.addEventListener("click", () => {
        chat.classList.contains("nexa-global-open")
            ? closeChat()
            : openChat();
    });

    closeButton.addEventListener("click", closeChat);
    minimizeButton.addEventListener("click", closeChat);

    function addMessage(message, sender) {
        const bubble = document.createElement("div");

        bubble.className =
            "nexa-global-message " +
            (sender === "user" ? "nexa-global-user" : "nexa-global-bot");

        bubble.textContent = message;

        messages.appendChild(bubble);
        messages.scrollTop = messages.scrollHeight;

        return bubble;
    }

    function showTyping() {
        const typing = document.createElement("div");

        typing.className = "nexa-global-typing";
        typing.setAttribute("aria-label", "NEXA AI is thinking");
        typing.innerHTML = "<span></span><span></span><span></span>";

        messages.appendChild(typing);
        messages.scrollTop = messages.scrollHeight;

        return typing;
    }

    async function sendMessage(message) {
        const cleanMessage = message.trim();

        if (!cleanMessage || isWaiting) {
            return;
        }

        isWaiting = true;

        addMessage(cleanMessage, "user");
        input.value = "";
        input.disabled = true;
        sendButton.disabled = true;

        chatHistory.push({
            role: "user",
            content: cleanMessage
        });

        const typing = showTyping();

        try {
            const response = await fetch("/api/nexa-ai/chat", {
                method: "POST",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messages: chatHistory.slice(-20)
                })
            });

            const data = await response.json().catch(() => null);

            if (response.status === 401) {
                throw new Error("Please log in to your CODE NEXA FORGE account before using NEXA AI.");
            }

            if (!response.ok || !data || data.success === false) {
                throw new Error(
                    data?.error ||
                    `NEXA AI request failed (HTTP ${response.status}).`
                );
            }

            if (!data || typeof data.reply !== "string" || !data.reply.trim()) {
                throw new Error("NEXA AI returned an invalid response.");
            }

            chatHistory.push({
                role: "assistant",
                content: data.reply
            });

            addMessage(data.reply, "bot");

        } catch (error) {
            // Keep the failed message out of conversation history.
            if (chatHistory.length && chatHistory[chatHistory.length - 1].role === "user") {
                chatHistory.pop();
            }

            addMessage(
                "I couldn't complete that request. " + error.message,
                "bot"
            );

            console.error("NEXA AI connection error:", error);

        } finally {
            typing.remove();

            isWaiting = false;
            input.disabled = false;
            sendButton.disabled = false;
            input.focus();
        }
    }

    form.addEventListener("submit", event => {
        event.preventDefault();
        sendMessage(input.value);
    });

    suggestions.forEach(button => {
        button.addEventListener("click", () => {
            sendMessage(button.dataset.message || "");
        });
    });

    document.addEventListener("keydown", event => {
        if (
            event.key === "Escape" &&
            chat.classList.contains("nexa-global-open")
        ) {
            closeChat();
            launcher.focus();
        }
    });

})();
