"use strict";

/*
 * CODE NEXA FORGE
 * NEXA AI — STRUCTURED LOCAL KNOWLEDGE BASE
 *
 * Curated local knowledge and response templates.
 * This is not a trained large language model and does not
 * automatically know facts that are not included here.
 */

const identity = {
  name: "NEXA AI",
  creator: "CODE NEXA FORGE",
  purpose: "An independent learning, knowledge and assistance system.",
  personality: "Friendly, respectful, patient, honest and educational.",
  capabilities: [
    "Explain supported topics in clear language.",
    "Provide practical examples and beginner-friendly code.",
    "Compare related concepts.",
    "Support learning in programming, technology and general subjects."
  ],
  limitations: [
    "Its answers come from its local knowledge base and programmed logic.",
    "It may not know recent events or facts that have not been added.",
    "It should say when information is unavailable rather than inventing an answer."
  ]
};

const topics = {
  programming: {
    title: "Programming",
    keywords: ["programming", "coding", "software development", "write code"],
    definition: "Programming is the process of designing and writing instructions that a computer can execute.",
    details: "A typical workflow is to understand a problem, plan a solution, write code, run it, test the result and fix errors. Core concepts include variables, data types, conditions, loops, functions, data structures and algorithms.",
    examples: [
      "A web developer uses JavaScript to make a sign-up form interactive.",
      "A data analyst uses Python to process a spreadsheet.",
      "A software developer uses Java or C++ to build applications."
    ]
  },
  html: {
    title: "HTML",
    keywords: ["html", "hypertext markup language"],
    definition: "HTML stands for HyperText Markup Language. It is the standard markup language used to structure content on web pages.",
    details: "HTML elements define headings, paragraphs, links, images, lists, forms and page sections. Most elements use an opening tag and a closing tag. Semantic elements such as header, main, section and footer describe the purpose of content.",
    examples: [
      "A heading: <h1>Welcome</h1>",
      "A paragraph: <p>This is a paragraph.</p>",
      "A link: <a href=\"https://example.com\">Visit the website</a>",
      "A button: <button type=\"button\">Click me</button>"
    ],
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My First Page</title>
</head>
<body>
  <h1>Hello, world!</h1>
  <p>This is my first HTML page.</p>
  <a href="https://example.com">Visit example.com</a>
</body>
</html>`
  },
  css: {
    title: "CSS",
    keywords: ["css", "cascading style sheets", "stylesheet", "style sheet"],
    definition: "CSS stands for Cascading Style Sheets. It controls the visual presentation of HTML, including colors, typography, spacing, layouts, responsive behavior and animations.",
    details: "A CSS rule contains a selector and a declaration block. The selector chooses which elements to style; declarations set properties and values. The cascade determines which applicable declaration wins. CSS can be written in an external stylesheet, a style element or an inline style attribute.",
    examples: [
      "Change text color with color: cyan;",
      "Add outer spacing with margin: 20px;",
      "Create a flexible layout with display: flex;",
      "Adapt a layout with a media query."
    ],
    code: `h1 {
  color: #00d9ff;
  font-size: 2rem;
}

.card {
  padding: 20px;
  border-radius: 12px;
  display: flex;
  gap: 1rem;
}`
  },
  flexbox: {
    title: "CSS Flexbox",
    keywords: ["flexbox", "flex box", "css flexbox", "display flex", "justify-content", "align-items", "flex-direction", "flex-wrap"],
    definition: "CSS Flexbox is a one-dimensional layout system for arranging items in a row or a column.",
    details: "Set display: flex on a parent to create a flex container. Its direct children become flex items. flex-direction sets the main axis. justify-content distributes items along the main axis, while align-items aligns them along the cross axis. flex-wrap allows items to move onto another line.",
    whenToUse: "Use Flexbox when arranging items in one direction, such as a navigation bar, toolbar, button row or aligned card content. Use Grid when you need deliberate control of rows and columns together.",
    examples: [
      "A navigation bar with a logo on the left and links on the right.",
      "A row of buttons with consistent gaps.",
      "Vertically centering an icon beside text.",
      "Allowing cards to wrap on narrow screens."
    ],
    code: `.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}`
  },
  cssGrid: {
    title: "CSS Grid",
    keywords: ["css grid", "grid layout", "display grid", "grid-template-columns", "grid-template-rows"],
    definition: "CSS Grid is a two-dimensional layout system that arranges items in rows and columns.",
    details: "Set display: grid on a parent. Use grid-template-columns and grid-template-rows to define tracks, and gap to set spacing. The fr unit distributes available space between flexible tracks. Grid is useful for dashboards, galleries and page layouts.",
    whenToUse: "Choose Grid when both rows and columns matter. Choose Flexbox when the main task is arranging items along one axis.",
    examples: [
      "A photo gallery with three equal columns.",
      "A dashboard with a sidebar and main content area.",
      "A responsive card grid using repeat(auto-fit, minmax(220px, 1fr))."
    ],
    code: `.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}`
  },
  javascript: {
    title: "JavaScript",
    keywords: ["javascript", "java script", "js", "ecmascript"],
    definition: "JavaScript is a programming language widely used to add behavior and interactivity to websites.",
    details: "In browsers, JavaScript can respond to events, update the Document Object Model (DOM), validate forms and request data from APIs. It is also used outside browsers through runtimes such as Node.js. JavaScript and Java are different programming languages.",
    examples: [
      "Show a message when a button is clicked.",
      "Check whether a required form field is empty.",
      "Fetch data from an API and display it on a page."
    ],
    code: `const button = document.querySelector("#helloButton");

button.addEventListener("click", () => {
  alert("Hello from JavaScript!");
});`
  },
  java: {
    title: "Java",
    keywords: ["java", "java programming", "java language", "jvm", "jdk", "object oriented java"],
    definition: "Java is a general-purpose, class-based programming language. Java source code is commonly compiled into bytecode that runs on the Java Virtual Machine (JVM).",
    details: "Java is widely used for enterprise software, backend services, Android development and other applications. Important concepts include classes, objects, methods, interfaces, inheritance, exceptions and collections. The JDK provides tools for developing and compiling Java programs.",
    examples: [
      "Build a command-line calculator.",
      "Create backend services for a web application.",
      "Model students and courses with classes and objects."
    ],
    code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, world!");
    }
}`
  },
  python: {
    title: "Python",
    keywords: ["python", "python programming", "python language"],
    definition: "Python is a high-level, general-purpose programming language known for readable syntax.",
    details: "Python uses indentation to define code blocks. It supports procedural, object-oriented and functional programming styles. It is used in automation, web development, data analysis, scientific computing and machine learning. Common building blocks include variables, conditions, loops, functions, modules and classes.",
    examples: [
      "Automate repetitive file-management tasks.",
      "Analyze data with libraries such as pandas.",
      "Build a web API with a Python web framework.",
      "Write scripts that process text or CSV files."
    ],
    code: `name = "Student"
print("Hello,", name)

for number in range(1, 4):
    print(number)`
  },
  cpp: {
    title: "C++",
    keywords: ["c++", "cpp", "cplusplus", "c plus plus", "cpp programming"],
    definition: "C++ is a general-purpose programming language that supports procedural, object-oriented and generic programming. It is commonly used when performance and control over system resources are important.",
    details: "C++ is used in game engines, desktop software, embedded systems and performance-sensitive applications. Its concepts include variables, types, functions, classes, templates, pointers, references and the Standard Library. Modern C++ also provides tools such as smart pointers and containers to help manage resources safely.",
    examples: [
      "Create a command-line calculator.",
      "Build performance-sensitive parts of a game engine.",
      "Work with data structures such as vectors and maps."
    ],
    code: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, world!" << endl;
    return 0;
}`
  },
    science: {
    title: "Science",
    keywords: ["science", "scientific method"],
    definition: "Science is the systematic study of the natural and physical world through observation, testable explanations, experiments and evidence.",
    details: "Scientific work often involves asking a question, forming a hypothesis, collecting observations or experimental data, analyzing results and sharing conclusions that others can evaluate. Scientific explanations can be revised when strong new evidence appears."
  },
  technology: {
    title: "Technology",
    keywords: ["technology", "technologies", "tech"],
    definition: "Technology is the practical application of knowledge, tools and methods to solve problems or achieve useful goals.",
    details: "Technology includes computers, communication networks, medical devices, transport systems and many other tools. It can improve efficiency and access to services, while also creating challenges involving privacy, security, cost and social impact."
  },
  internet: {
    title: "The Internet",
    keywords: ["internet", "world wide web", "www"],
    definition: "The internet is a worldwide network of interconnected computer networks that exchange data using shared communication standards such as TCP/IP. The World Wide Web is one service that operates over the internet.",
    details: "When a browser opens a website, it may use DNS to find an address, connect to a server, send an HTTP or HTTPS request and render the response."
  },
  computer: {
    title: "Computer",
    keywords: ["computer", "computers", "computer system"],
    definition: "A computer is an electronic device that processes data according to instructions.",
    details: "A typical computer includes a processor, memory, storage and input/output devices. The CPU executes instructions, RAM temporarily holds data in use, and storage keeps data when power is off."
  },
  artificialIntelligence: {
    title: "Artificial Intelligence (AI)",
    keywords: ["artificial intelligence", "ai"],
    definition: "Artificial Intelligence is a field of computer science concerned with building systems that perform tasks commonly associated with human intelligence, such as recognizing patterns, understanding language, planning and making decisions.",
    details: "AI includes rule-based systems, search, machine learning and other approaches. An AI system is not necessarily conscious or human-like. Its abilities depend on its design, data, tools and limitations."
  },
  machineLearning: {
    title: "Machine Learning (ML)",
    keywords: ["machine learning", "ml"],
    definition: "Machine Learning is a branch of AI in which systems use data and algorithms to identify patterns and make predictions or decisions.",
    details: "A common workflow is to collect and prepare data, choose an algorithm, train a model, evaluate it on data it has not seen and monitor its performance after deployment.",
    examples: [
      "An email service classifies likely spam messages.",
      "A music app recommends songs based on listening patterns.",
      "A keyboard predicts a likely next word from typing context."
    ]
  },
  deepLearning: {
    title: "Deep Learning",
    keywords: ["deep learning", "neural network", "neural networks"],
    definition: "Deep Learning is a subfield of Machine Learning that uses neural networks with multiple processing layers to learn patterns from data.",
    details: "Deep learning is used in image recognition, speech recognition and language processing. Training can require substantial data and computing resources."
  },
  database: {
    title: "Database",
    keywords: ["database", "databases", "sqlite", "mysql", "sql database"],
    definition: "A database is an organized collection of data that can be stored, managed, searched and updated.",
    details: "A relational database organizes information into tables containing rows and columns. Applications use databases for user accounts, orders, lessons and quiz results. SQL is commonly used to query and change relational data."
  },
  cybersecurity: {
    title: "Cybersecurity",
    keywords: ["cybersecurity", "cyber security", "online security"],
    definition: "Cybersecurity is the practice of protecting devices, networks, applications and information from unauthorized access, misuse, disruption or damage.",
    details: "Useful practices include unique passwords, multi-factor authentication, security updates, backups and caution with unexpected links or attachments."
  },
  operatingSystem: {
    title: "Operating System",
    keywords: ["operating system", "windows", "linux", "macos", "android", "ios"],
    definition: "An operating system is system software that manages a device's hardware and provides services for applications.",
    details: "It manages processes, memory, files, devices and user interaction. Examples include Windows, Linux, macOS, Android and iOS."
  },
  nodejs: {
    title: "Node.js",
    keywords: ["node.js", "nodejs", "node js"],
    definition: "Node.js is a JavaScript runtime that allows JavaScript code to run outside a web browser.",
    details: "It is commonly used to build servers, web APIs, command-line tools and development utilities. Node.js includes APIs for files, networking and asynchronous operations."
  },
  api: {
    title: "API",
    keywords: ["api", "application programming interface"],
    definition: "An API is a defined way for software components to communicate.",
    details: "A web API commonly lets a client send a request to a server and receive structured data. HTTP methods such as GET, POST, PUT, PATCH and DELETE are often used to describe operations."
  },
  frontend: {
    title: "Frontend Development",
    keywords: ["frontend", "front end", "client side"],
    definition: "Frontend development focuses on the parts of an application that users see and interact with.",
    details: "Web frontends commonly use HTML for structure, CSS for presentation and JavaScript for behavior. Accessibility, responsive design and usability are important parts of frontend work."
  },
  backend: {
    title: "Backend Development",
    keywords: ["backend", "back end", "server side"],
    definition: "Backend development focuses on server-side logic, data storage, authentication and APIs that support an application.",
    details: "Common technologies include Node.js, Python, Java, databases and web frameworks. A backend validates requests, applies application rules and communicates with data stores or other services."
  },
  islam: {
    title: "Islam",
    keywords: ["islam", "islamic", "muslim", "muslims", "quran", "qur'an", "allah", "prophet muhammad", "five pillars"],
    definition: "Islam is a monotheistic religion whose central belief is the worship of one God, Allah. Muslims regard the Quran as their holy scripture and Muhammad (peace be upon him) as the final prophet.",
    details: "The Five Pillars commonly describe core acts of worship: Shahada (declaration of faith), Salah (prayer), Zakat (obligatory charity), Sawm (fasting in Ramadan) and Hajj (pilgrimage to Makkah for those able to perform it). Muslims also look to the Sunnah, the teachings and example of Prophet Muhammad. Islamic beliefs, legal schools and practices include different interpretations, so detailed religious rulings should be explained with their scholarly context.",
    examples: [
      "Muslims perform the five daily prayers (Salah).",
      "Fasting during Ramadan is an important act of worship.",
      "Zakat is an obligatory form of charity under defined conditions."
    ]
  },
  mathematics: {
    title: "Mathematics",
    keywords: ["mathematics", "math", "mathematical", "algebra", "geometry", "calculus"],
    definition: "Mathematics is the study of patterns, quantities, structures, shapes and logical relationships.",
    details: "Major areas include arithmetic, algebra, geometry, trigonometry, statistics and calculus. Mathematical reasoning uses definitions and logical steps to establish results."
  },
  physics: {
    title: "Physics",
    keywords: ["physics", "force", "motion", "energy", "gravity", "newton laws"],
    definition: "Physics is the natural science that studies matter, energy, motion, forces, space and time.",
    details: "Classical mechanics describes motion and forces. Thermodynamics studies heat and energy transfer. Electromagnetism describes electric and magnetic fields. Modern physics includes relativity and quantum mechanics."
  },
  dns: {
    title: "DNS (Domain Name System)",
    keywords: ["dns", "domain name system", "domain name lookup"],
    definition: "DNS stands for Domain Name System. It translates human-readable domain names, such as example.com, into IP addresses that computers use to locate servers.",
    details: "When a browser needs to reach a domain, it asks a DNS resolver for the corresponding record. The resolver may use cached data or query DNS servers to find the answer. Common record types include A and AAAA for IP addresses, CNAME for aliases, and MX for mail routing.",
    examples: [
      "A browser looks up example.com and receives an IP address.",
      "An MX record identifies mail servers for a domain."
    ]
  },
  express: {
    title: "Express.js",
    keywords: ["express.js", "express", "express framework", "node express"],
    definition: "Express.js is a web application framework for Node.js. It provides routing and middleware tools for building web servers and APIs.",
    details: "An Express application defines routes for HTTP methods and paths. Middleware functions can inspect requests, parse data, authenticate users, log activity and pass control to the next middleware. Route handlers send responses to clients.",
    examples: [
      "Create a GET route that returns JSON.",
      "Use middleware to parse JSON request bodies.",
      "Protect a route with authentication middleware."
    ],
    code: `const express = require("express");\nconst app = express();\napp.get("/api/hello", (req, res) => {\n  res.json({ message: "Hello" });\n});\napp.listen(3000);`
  },
  biology: {
    title: "Biology",
    keywords: ["biology", "cell", "cells", "dna", "genetics", "ecosystem"],
    definition: "Biology is the scientific study of living organisms and their structure, function, growth, evolution and interactions.",
    details: "Biology ranges from molecules and cells to organisms, populations and ecosystems. DNA stores hereditary information, and evolution describes changes in inherited traits in populations over generations."
  },
  chemistry: {
    title: "Chemistry",
    keywords: ["chemistry", "atom", "atoms", "molecule", "molecules", "chemical reaction"],
    definition: "Chemistry is the science of matter, including its composition, structure, properties and the changes it undergoes in chemical reactions.",
    details: "Atoms contain protons, neutrons and electrons. Atoms can bond to form molecules and compounds. Chemical reactions rearrange atoms by breaking and forming bonds."
  },
  history: {
    title: "History",
    keywords: ["history", "historical event", "ancient history", "world history"],
    definition: "History is the study of the human past using evidence such as documents, artifacts, buildings, oral accounts and other records.",
    details: "Historians evaluate sources, compare perspectives, establish chronology and explain change and continuity. A careful historical answer distinguishes established evidence from debate or uncertainty."
  },
  geography: {
    title: "Geography",
    keywords: ["geography", "climate", "continent", "continents", "map", "landform"],
    definition: "Geography studies places, environments, physical processes and the relationships between people and the Earth.",
    details: "Physical geography examines mountains, rivers, climate and ecosystems. Human geography studies population, cities, economies and migration."
  }
};

const comparisons = [
  ["artificialIntelligence", "machineLearning"],
  ["html", "css"],
  ["html", "javascript"],
  ["css", "javascript"],
  ["frontend", "backend"],
  ["flexbox", "cssGrid"],
  ["java", "javascript"],
  ["python", "java"],
  ["java", "cpp"],
  ["http", "dns"],
  ["nodejs", "javascript"]
];

function normalizeForSearch(message) {
  return String(message || "")
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function keywordMatches(text, keyword) {
  const key = normalizeForSearch(keyword);
  if (!key) return false;
  const escaped = escapeRegExp(key);
  return new RegExp("(^|\\s)" + escaped + "($|\\s)", "i").test(text);
}

function findTopics(message) {
  const text = " " + normalizeForSearch(message) + " ";
  const found = [];

  for (const [id, topic] of Object.entries(topics)) {
    if (topic.keywords.some(keyword => keywordMatches(text, keyword))) {
      found.push(id);
    }
  }

  const specificCssTopics = new Set([
    "flexbox", "cssGrid"
  ]);
  if (found.some(id => specificCssTopics.has(id))) {
    const cssIndex = found.indexOf("css");
    if (cssIndex !== -1) found.splice(cssIndex, 1);
  }

  return found.sort((a, b) => {
    const aLen = Math.max(...topics[a].keywords.map(k => normalizeForSearch(k).length));
    const bLen = Math.max(...topics[b].keywords.map(k => normalizeForSearch(k).length));
    return bLen - aLen;
  });
}

function getTopic(id) {
  return topics[id] || null;
}

function formatExamples(topic) {
  if (!topic) return null;
  const examples = topic.examples || [];
  if (!examples.length) {
    return "I can explain " + topic.title + ", but I do not have a curated example set for it yet.\n\n" +
      (topic.details || topic.definition);
  }
  return "Examples of " + topic.title + ":\n\n" +
    examples.map((item, index) => (index + 1) + ". " + item).join("\n") +
    (topic.code ? "\n\nCode example:\n```" + getCodeLanguage(topic) + "\n" + topic.code + "\n```" : "");
}

function getCodeLanguage(topic) {
  if (/HTML/i.test(topic.title)) return "html";
  if (/CSS|Flexbox|Grid/i.test(topic.title)) return "css";
  if (["JavaScript", "React"].includes(topic.title)) return "javascript";
  if (topic.title === "Python") return "python";
  if (topic.title === "Java") return "java";
  if (topic.title === "C++") return "cpp";
  return "text";
}

function formatDetails(topic) {
  if (!topic) return null;
  const parts = [
    topic.title + " — a detailed explanation:",
    "\nWhat it is:\n" + topic.definition,
    "\nHow it works:\n" + (topic.details || topic.definition)
  ];
  if (topic.whenToUse) parts.push("\nWhen to use it:\n" + topic.whenToUse);
  if (topic.examples && topic.examples.length) {
    parts.push("\nPractical examples:\n" +
      topic.examples.map((item, index) => (index + 1) + ". " + item).join("\n"));
  }
  if (topic.code) {
    parts.push("\nCode example:\n```" + getCodeLanguage(topic) + "\n" + topic.code + "\n```");
  }
  return parts.join("\n");
}

function formatExampleExplanations(topic) {
  if (!topic) return null;
  if (!topic.examples || !topic.examples.length) {
    return "I do not have a curated example list for " + topic.title + " yet.\n\n" +
      (topic.details || topic.definition);
  }
  return "Here is what the examples of " + topic.title + " illustrate:\n\n" +
    topic.examples.map((item, index) => {
      let explanation = "This demonstrates a practical use of " + topic.title + ".";
      if (/^HTML$/i.test(topic.title)) {
        if (/<h1\b/i.test(item)) explanation = "The h1 element creates a level-one heading.";
        else if (/<p\b/i.test(item)) explanation = "The p element creates a paragraph.";
        else if (/<a\b/i.test(item)) explanation = "The a element creates a hyperlink.";
        else if (/<button\b/i.test(item)) explanation = "The button element creates an interactive button.";
      }
      return (index + 1) + ". " + item + "\n   " + explanation;
    }).join("\n\n");
}

function compareTopics(ids) {
  const pair = comparisons.find(items => items.every(id => ids.includes(id)));
  if (!pair) return null;

  const [firstId, secondId] = pair;
  const first = topics[firstId];
  const second = topics[secondId];
  let distinction = "They have different purposes. Their definitions below show the main distinction.";

  if (firstId === "flexbox" && secondId === "cssGrid") {
    distinction = "Flexbox is one-dimensional and arranges items along a row or column. Grid is two-dimensional and controls rows and columns together. Use Flexbox for navigation bars and component alignment; use Grid for dashboards and page layouts.";
  } else if ([firstId, secondId].includes("java") && [firstId, secondId].includes("javascript")) {
    distinction = "Java and JavaScript are separate languages. Java commonly runs on the JVM and is often used for backend and enterprise applications. JavaScript is central to browser interactivity and is also used on servers through Node.js.";
  }

  return first.title + " and " + second.title + ":\n\n" +
    first.title + ":\n" + first.definition + "\n\n" +
    second.title + ":\n" + second.definition + "\n\n" +
    "Main difference:\n" + distinction;
}

function getTopicResponse(message, options = {}) {
  if (typeof message !== "string" || !message.trim()) return null;

  const ids = findTopics(message);
  const contextTopic = options.contextTopic || null;
  const intent = options.intent || "general";

  if (intent === "comparison" && ids.length >= 2) {
    return compareTopics(ids) ||
      ids.slice(0, 2).map(id => topics[id].title + ":\n" + topics[id].definition).join("\n\n");
  }

  const topicId = ids[0] || contextTopic;
  const topic = getTopic(topicId);
  if (!topic) return null;

  if (intent === "explain_examples") return formatExampleExplanations(topic);
  if (intent === "examples") return formatExamples(topic);
  if (["explain", "followup"].includes(intent)) return formatDetails(topic);

  if (/\b(example|examples|sample|real[- ]world)\b/i.test(message)) {
    return formatExamples(topic);
  }
  if (/\b(explain|elaborate|in detail|tell me more|how does .+ work)\b/i.test(message)) {
    return formatDetails(topic);
  }
  return formatDetails(topic);
}

module.exports = {
  identity,
  topics,
  comparisons,
  normalizeForSearch,
  findTopics,
  getTopic,
  getTopicResponse,
  formatExamples,
  formatDetails,
  formatExampleExplanations,
  compareTopics
};
