(() => {
  "use strict";
  window.CNF_PUBLIC_MODE = true;
  const message = "This is the public GitHub Pages edition. Accounts, admin tools, saved progress, verified quizzes, Library uploads and NEXA AI chat are available in the Local Edition.";
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input, init) => {
    const raw = typeof input === "string" ? input : (input && input.url) || "";
    let url;
    try { url = new URL(raw, window.location.href); } catch { return originalFetch(input, init); }
    if (url.origin === window.location.origin && url.pathname.startsWith("/api/")) {
      return new Response(JSON.stringify({ success: false, message, error: message }), {
        status: 503,
        headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
      });
    }
    return originalFetch(input, init);
  };
  document.addEventListener("DOMContentLoaded", () => {
    const bar = document.createElement("aside");
    bar.setAttribute("role", "note");
    bar.style.cssText = "position:relative;z-index:99999;padding:9px 16px;text-align:center;background:#101f2b;border-bottom:1px solid #00d9ff55;color:#dceaf3;font:500 12px/1.5 'DM Sans',sans-serif;";
    bar.innerHTML = 'PUBLIC LEARNING EDITION · <a href="./local-edition.html" style="color:#00d9ff;font-weight:700;text-decoration:underline">See what runs locally</a>';
    document.body.prepend(bar);
  });
})();
