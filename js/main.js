const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "メニューを開く");
    });
  });
}

const servicePanel = document.querySelector("#service-panel");
const servicePanelBody = document.querySelector("#service-panel-body");
const servicePanelClose = document.querySelector(".service-panel-close");

function fixServicePaths(root) {
  root.querySelectorAll("[src], [href]").forEach((el) => {
    ["src", "href"].forEach((attr) => {
      const value = el.getAttribute(attr);
      if (!value) return;
      if (value.startsWith("../images/")) {
        el.setAttribute(attr, value.replace("../images/", "images/"));
      }
      if (value === "../index.html#service" || value.endsWith("index.html#service")) {
        el.setAttribute(attr, "#service");
        if (el.classList.contains("service-page-back")) {
          el.classList.add("js-service-panel-close");
        }
      }
    });
  });
}

function openServicePanel() {
  if (!servicePanel) return;
  servicePanel.classList.add("is-open");
  servicePanel.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-panel-open");
}

function closeServicePanel() {
  if (!servicePanel) return;
  servicePanel.classList.remove("is-open", "is-loading");
  servicePanel.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-panel-open");
}

async function loadServicePanel(url) {
  if (!servicePanel || !servicePanelBody) return;

  openServicePanel();
  servicePanel.classList.add("is-loading");
  servicePanelBody.innerHTML = '<p style="padding:48px 24px;color:#64748b;">読み込み中...</p>';

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("failed to load");
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const main = doc.querySelector("main.service-page");

    if (!main) throw new Error("content not found");

    servicePanelBody.innerHTML = main.outerHTML;
    fixServicePaths(servicePanelBody);
    servicePanelBody.scrollTop = 0;
  } catch {
    servicePanelBody.innerHTML =
      '<p style="padding:48px 24px;color:#64748b;">読み込みに失敗しました。<a href="' +
      url +
      '">こちら</a>から開いてください。</p>';
  } finally {
    servicePanel.classList.remove("is-loading");
  }
}

document.querySelectorAll(".js-service-panel").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const url = link.dataset.service || link.getAttribute("href");
    if (!url) return;
    if (window.location.protocol === "file:") {
      window.location.href = url;
      return;
    }
    loadServicePanel(url);
  });
});

if (servicePanelBody) {
  servicePanelBody.addEventListener("click", (event) => {
    if (event.target.closest(".js-service-panel-close, .service-page-back")) {
      event.preventDefault();
      closeServicePanel();
    }
  });
}

if (servicePanelClose) {
  servicePanelClose.addEventListener("click", closeServicePanel);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && servicePanel?.classList.contains("is-open")) {
    closeServicePanel();
  }
});
