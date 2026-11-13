"use strict";

/*
 * NEXA AI — CNF WEBSITE CONVERSATION LAYER
 * English-only, website-focused conversational routing.
 * Course answers remain grounded in nexa/course-knowledge.json.
 */

const GREETING = "Hello! I'm NEXA AI, your learning assistant at CODE NEXA FORGE. I can help you understand web development, explore our HTML, CSS and JavaScript courses, review quizzes and tests, and work through coding projects. What would you like to learn today?";

const INTRODUCTION = "I'm NEXA AI, the dedicated learning assistant of CODE NEXA FORGE. My role is to help students understand this platform's web-development courses, lessons, quizzes, tests, coding exercises and projects. I use the course material and a curated local programming knowledge base to provide clear explanations and practical examples.";

const CAPABILITIES = "I can help you with:\n• HTML, CSS and JavaScript lessons and topics\n• Lesson explanations, examples and code snippets\n• Course outlines, quizzes, test questions and answer explanations\n• Course projects and coding practice\n• Web-development concepts such as websites, hyperlinks, frontend and backend development\n• Introductory programming discussions about Python, Java and C++\n• Guidance on using CODE NEXA FORGE features\n\nI keep conversations focused on learning and this platform. I communicate in English only.";

const SCOPE_REPLY = "I'm focused on CODE NEXA FORGE and web-development learning. I can help with this website's features, HTML, CSS, JavaScript, course lessons, quizzes, tests, projects and related programming concepts. Please ask me something in that area.";

function normalize(text) {
    return String(text || "")
        .toLowerCase()
        .normalize("NFKC")
        .replace(/\b( abhou| abbout| abotu)\b/g, " about")
        .replace(/[’']/g, "'")
        .replace(/[?!.,;:()[\]{}"`]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function getQuickResponse(message) {
    const text = normalize(message);

    if (/^(hi|hello|hey|good morning|good afternoon|good evening)$/.test(text)) {
        return GREETING;
    }

    if (/^(how are you|how are you doing|how is it going|how's it going)$/.test(text)) {
        return "I'm doing well and ready to help you learn. Thanks for asking! What would you like to explore in CODE NEXA FORGE today?";
    }

    if (
        /\b(who are you|what is your name|tell me about yourself|tell me about nexa ai|about nexa ai|your introduction|introduce yourself|tell me about you|describe yourself)\b/.test(text) ||
        /^yourself$/.test(text)
    ) {
        return INTRODUCTION;
    }

    if (/^(what can you do|how can you help|what are your capabilities|what do you know)$/.test(text)) {
        return CAPABILITIES;
    }

    if (
        /\b(what is web development|what is website development|tell me about web development|discuss web development|explain web development|web development meaning)\b/.test(text)
    ) {
        return "Web development is the process of planning, building and maintaining websites and web applications. It commonly includes three parts:\n\n1. Frontend development: the part people see and interact with. HTML provides structure, CSS controls presentation and layout, and JavaScript adds behaviour and interactivity.\n2. Backend development: the server-side logic that handles requests, authentication, business rules and data.\n3. Data storage: databases keep information such as user accounts, course progress and application records.\n\nIn CODE NEXA FORGE, the learning path starts with HTML, continues with CSS, and then introduces JavaScript so students can build interactive web experiences.";
    }

    if (/^(what is a website|what is website|define a website|tell me about websites)$/.test(text)) {
        return "A website is a collection of related web pages and resources that people access through a web browser using a domain name or web address. A page can contain text, images, links, forms and interactive features. HTML structures the content, CSS styles its appearance, and JavaScript can make it interactive.";
    }

    if (/^(what is a hyperlink|what is hyperlink|define hyperlink|tell me about hyperlinks)$/.test(text)) {
        return "A hyperlink is a clickable reference that takes a user to another page, file, section or online resource. In HTML, the anchor element creates a hyperlink. Example:\n\n```html\n<a href=\"https://example.com\">Visit Example</a>\n```\n\nThe href attribute contains the destination, while the text between the opening and closing a tags is the clickable link text.";
    }

    if (/\b(what is programming|what is coding|discuss programming|tell me about programming|explain programming)\b/.test(text)) {
        return "Programming is the process of writing instructions that a computer can execute to perform tasks or solve problems. A program commonly uses variables, data types, conditions, loops, functions and data structures. A developer usually plans a solution, writes code, runs it, tests the result and fixes errors. HTML, CSS and JavaScript are central technologies in the CODE NEXA FORGE web-development learning path.";
    }

    if (/\b(discuss python|tell me about python|what is python|explain python)\b/.test(text)) {
        return "Python is a high-level, general-purpose programming language known for readable syntax. It is used in automation, scripting, data analysis, artificial intelligence, scientific computing and backend development. A simple example is:\n\n```python\nmessage = \"Hello, world!\"\nprint(message)\n```\n\nPython is an introductory programming topic, not one of the three core course tracks currently covered by the CNF HTML, CSS and JavaScript lesson sequence.";
    }

    if (/\b(discuss java|tell me about java|what is java|explain java)\b/.test(text) && !/javascript/.test(text)) {
        return "Java is a general-purpose, class-based programming language. Java source code is compiled into bytecode that runs on the Java Virtual Machine (JVM). It is widely used in enterprise software, backend systems and Android development. Example:\n\n```java\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, world!\");\n    }\n}\n```\n\nJava is different from JavaScript; they are separate programming languages.";
    }

    if (/\b(discuss c\+\+|tell me about c\+\+|what is c\+\+|explain c\+\+)\b/.test(text)) {
        return "C++ is a general-purpose programming language that supports procedural, object-oriented and generic programming. It is often used when performance and low-level control are important, such as in game engines, desktop software and systems programming. Example:\n\n```cpp\n#include <iostream>\n\nint main() {\n    std::cout << \"Hello, world!\";\n    return 0;\n}\n```\n\nC++ is an introductory programming discussion here, rather than a core CNF course track.";
    }

    if (/\b(what is frontend|what is front end|frontend development)\b/.test(text)) {
        return "Frontend development builds the part of a website that users see and interact with. HTML structures the page, CSS controls its visual design and responsive layout, and JavaScript adds dynamic behaviour such as menus, form validation and interactive components.";
    }

    if (/\b(what is backend|what is back end|backend development)\b/.test(text)) {
        return "Backend development handles the server-side part of a website or application. It can process requests, validate data, manage authentication, apply application rules and communicate with databases. In a typical web application, the frontend sends requests to backend routes, and the backend returns data or a result.";
    }

    if (/\b(what is responsive design|responsive web design)\b/.test(text)) {
        return "Responsive web design makes a website adapt to different screen sizes and devices. Common techniques include flexible layouts, relative units, responsive images and CSS media queries. The goal is to keep content readable and usable on phones, tablets and desktops.";
    }

    if (/\b(what is dom|document object model)\b/.test(text)) {
        return "The Document Object Model (DOM) is the browser's object-based representation of an HTML document. JavaScript can use the DOM to select elements, read or change content and attributes, update styles, create elements and respond to events.";
    }

    if (/\b(what is flexbox|explain flexbox|what is css flexbox)\b/.test(text)) {
        return "CSS Flexbox is a one-dimensional layout system. It arranges items along a main axis (row or column) and helps control alignment, spacing, wrapping and item sizing. It is useful for navigation bars, button groups and aligning components. In the CNF CSS course, Flexbox is covered with CSS Grid in Lesson 5.";
    }

    if (/\b(what is css grid|explain css grid|what is grid layout)\b/.test(text)) {
        return "CSS Grid is a two-dimensional layout system that controls rows and columns together. It is useful for page structures, galleries, dashboards and card layouts. In the CNF CSS course, Grid is covered with Flexbox in Lesson 5.";
    }

    if (/\b(how do i start|where should i start|start learning|begin learning|which course first)\b/.test(text)) {
        return "A good starting path in CODE NEXA FORGE is:\n1. HTML: learn page structure, elements, links, images, lists, tables and forms.\n2. CSS: learn styling, the box model, Flexbox, Grid, responsive design and animations.\n3. JavaScript: learn variables, conditions, loops, functions, arrays, objects, DOM events and asynchronous JavaScript.\n\nOpen the HTML course first if you are completely new to web development.";
    }

    if (/\b(what courses|which courses|courses available|what can i learn here|what do you teach here|cnf courses)\b/.test(text)) {
        return "CODE NEXA FORGE currently provides three core web-development learning tracks: HTML, CSS and JavaScript. Each track contains eight lessons, along with course practice, projects and tests. Ask me to list the lessons in any one course.";
    }

    if (/\b(what is a quiz|how do quizzes work|quiz help|course quiz)\b/.test(text)) {
        return "Quizzes are short knowledge checks connected to course lessons. You can ask me to review the questions and explanations available in the CNF source material. For a live attempt and saved score, use the quiz or test interface on the website.";
    }

    if (/\b(how do tests work|what tests are available|course tests|test preparation|prepare for test)\b/.test(text)) {
        return "CODE NEXA FORGE includes course tests for HTML, CSS and JavaScript. I can help you review the available test questions and explain their correct answers from the supplied course material. Use the website's test pages for an official attempt and recorded result.";
    }

    if (/\b(what projects|course projects|project help|how to do projects)\b/.test(text)) {
        return "CODE NEXA FORGE includes practical projects connected to its HTML, CSS and JavaScript learning tracks. I can explain the project instructions available in the course pages and help you plan the structure, write code and troubleshoot issues. Tell me which course project you are working on.";
    }

    if (/\b(what is a certificate|how do i get certificate|course certificate)\b/.test(text)) {
        return "The CODE NEXA FORGE platform includes a progress and certificate experience. Check your Progress page for the completion requirements and certificate status shown by your current account. I can explain the HTML, CSS and JavaScript topics you need to study, but I cannot change your recorded progress.";
    }

    if (/\b(why is my code not working|debug my code|help me debug|fix my code)\b/.test(text)) {
        return "I can help troubleshoot HTML, CSS and JavaScript code. Share the relevant code and the exact error or unexpected result. I will help you isolate the issue, explain why it happens and suggest a correction.";
    }

    return null;
}

function isInScope(message, topicIds = []) {
    const text = normalize(message);
    if (getQuickResponse(text)) return true;
    if (/\b(html|css|javascript|java script|web|website|hyperlink|programming|coding|python|java|c\+\+|flexbox|grid|dom|frontend|backend|node\.?js|api|responsive|browser|developer|code|lesson|course|quiz|test|project|playground|progress|certificate|nexa|cnf)\b/.test(text)) {
        return true;
    }
    const allowed = new Set([
        "programming", "html", "css", "flexbox", "cssGrid", "javascript",
        "java", "python", "cpp", "nodejs", "api", "frontend", "backend"
    ]);
    return topicIds.some(id => allowed.has(id));
}

module.exports = {
    GREETING,
    INTRODUCTION,
    CAPABILITIES,
    SCOPE_REPLY,
    getQuickResponse,
    isInScope,
    normalize
};
