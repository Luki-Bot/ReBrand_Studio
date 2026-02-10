const COOKIE_KEY = "br_cookie_choice_v1";
const LANG_KEY = "br_lang_choice_v1";
const cookieBanner = document.getElementById("cookieBanner");
const acceptEssentialBtn = document.getElementById("acceptEssential");
const acceptAllBtn = document.getElementById("acceptAll");
const yearElement = document.getElementById("year");
const langButtons = document.querySelectorAll("[data-set-lang]");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

function setCookieChoice(mode) {
  localStorage.setItem(COOKIE_KEY, mode);
  if (cookieBanner) {
    cookieBanner.classList.remove("show");
  }
}

if (cookieBanner) {
  const cookieChoice = localStorage.getItem(COOKIE_KEY);
  if (!cookieChoice) {
    cookieBanner.classList.add("show");
  }
}

if (acceptEssentialBtn) {
  acceptEssentialBtn.addEventListener("click", () => setCookieChoice("essential"));
}

if (acceptAllBtn) {
  acceptAllBtn.addEventListener("click", () => setCookieChoice("all"));
}

function applyLanguage(lang) {
  const normalizedLang = lang === "de" ? "de" : "en";
  document.body.dataset.lang = normalizedLang;
  document.documentElement.lang = normalizedLang;
  localStorage.setItem(LANG_KEY, normalizedLang);

  document.querySelectorAll(".lang-de").forEach((node) => {
    node.hidden = normalizedLang !== "de";
  });
  document.querySelectorAll(".lang-en").forEach((node) => {
    node.hidden = normalizedLang !== "en";
  });

  langButtons.forEach((button) => {
    const isActive = button.dataset.setLang === normalizedLang;
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function getLanguageFromQuery() {
  const queryLang = new URLSearchParams(window.location.search).get("lang");
  if (queryLang === "de" || queryLang === "en") {
    return queryLang;
  }
  return null;
}

function updateInternalLinks(lang) {
  const normalizedLang = lang === "de" ? "de" : "en";
  const links = document.querySelectorAll("a[href]");

  links.forEach((link) => {
    const rawHref = link.getAttribute("href");
    if (!rawHref || rawHref.startsWith("#") || rawHref.startsWith("mailto:") || rawHref.startsWith("tel:")) {
      return;
    }

    let url;
    try {
      url = new URL(rawHref, window.location.origin + window.location.pathname);
    } catch {
      return;
    }

    if (url.origin !== window.location.origin) {
      return;
    }

    if (url.pathname.endsWith(".html")) {
      url.searchParams.set("lang", normalizedLang);
      const nextHref = `${url.pathname}${url.search}${url.hash}`;
      link.setAttribute("href", nextHref);
    }
  });
}

if (langButtons.length) {
  const queryLang = getLanguageFromQuery();
  const storedLang = localStorage.getItem(LANG_KEY);
  const browserLang = navigator.language && navigator.language.toLowerCase().startsWith("de") ? "de" : "en";
  const initialLang = queryLang || storedLang || browserLang;
  applyLanguage(initialLang);
  updateInternalLinks(initialLang);

  langButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextLang = button.dataset.setLang || "de";
      applyLanguage(nextLang);
      updateInternalLinks(nextLang);
    });
  });
}
