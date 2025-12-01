"use strict";

import * as api_links from "../api/links.js";
import * as api_auth from "../api/auth.js";
import * as api_analysis from "../api/analysis.js";
import { getCurrentUser, isAuthenticated } from "../auth/session.js";

import { LinkComponent } from "./linkComponent.js";


const openButtons = document.querySelectorAll(".openDashboard");
const dashboard = document.querySelector("#my-dashboard");
const listDisplay = dashboard.querySelector("ul.link-list");
const applyChangesBtn = dashboard.querySelector("button[name=applyChanges]");
const profileImageInput = dashboard.querySelector("input[name=profileImageInput]");
const profileStatusDisplay = dashboard.querySelector(".profileImageStatus");
const profilePreview = dashboard.querySelector(".profileImage");
const analysisSection = dashboard.querySelector(".ai-analysis");
const analysisMeta = dashboard.querySelector(".ai-analysis-meta");
const analysisText = dashboard.querySelector(".ai-analysis-text");
const analysisCharts = dashboard.querySelector(".ai-analysis-charts");
const qrSection = dashboard.querySelector(".qr-section");
const qrMeta = dashboard.querySelector(".qr-meta");
const qrImage = dashboard.querySelector(".qr-image");
const analysisTab = dashboard.querySelector(".analysis-tab");
const qrTab       = dashboard.querySelector(".qr-tab");
const closeButtons = dashboard.querySelectorAll(".closePane");





openButtons.forEach((e) =>
  e.addEventListener("click", () => {
    if (!isAuthenticated()) return;
    dashboard.classList.add("display");
  }),
);



class Dashboard {
  #api;
  #links;

  constructor(api) {
    this.#api = api;
    this.#links = [];

    // Apply-Button: speichern + alles schließen
    if (applyChangesBtn) {
      applyChangesBtn.addEventListener("click", async () => {
        await this.commit();
        analysisSection?.classList.add("hide");
        qrSection?.classList.add("hide");
        dashboard.classList.remove("display");
      });
    }

    // X-Button oben rechts: nur schließen
    closeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        analysisSection?.classList.add("hide");
        qrSection?.classList.add("hide");
        dashboard.classList.remove("display");
      });
    });

    // Dashboard öffnen
    openButtons.forEach((e) =>
        e.addEventListener("click", () => {
          if (!isAuthenticated()) return;
          setProfileStatus("");
          updatePreview();
          this.load();

          // Dashboard anzeigen
          dashboard.classList.add("display");

          // AI & QR beim Öffnen immer einklappen
          analysisSection?.classList.add("hide");
          qrSection?.classList.add("hide");
        }),
    );

    // Profilbild-Handler (wie gehabt) …
    if (profileImageInput) {
      profileImageInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
          setProfileStatus("File too large. Maximum size is 5MB.");
          e.target.value = "";
          return;
        }

        const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
        if (!validTypes.includes(file.type)) {
          setProfileStatus("Invalid file type. Please use PNG, JPEG, or WebP.");
          e.target.value = "";
          return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
          if (profilePreview) {
            profilePreview.src = ev.target.result;
            profilePreview.classList.remove("hide");
          }
        };
        reader.readAsDataURL(file);

        setProfileStatus("Uploading... ⏳");
        profileImageInput.disabled = true;
        await api_auth.uploadProfileImage(this.#api, file);
        profileImageInput.disabled = false;
        e.target.value = "";
      });
    }

    updatePreview();
  }


  async load() {
    // Alte DOM-Elemente entfernen
    this.#links.forEach((l) => {
      if (typeof l.element !== "undefined") l.element.remove();
    });

    // Alle Links vom Backend holen
    const allLinks = await api_links.mine(this.#api);

    // Nur aktive Links anzeigen
    const activeLinks = allLinks.filter((l) => l.isActive !== false);

    // LinkComponent-Instanzen bauen
    this.#links = activeLinks.map(
        (l) =>
            new LinkComponent(
                this.#api,
                l.id,
                l.longUrl,
                l.shortUrl,
                l.hitCount,
                l.lastHitAt,
                l.createdAt,
                l.isActive,
            ),
    );

    // In DOM einhängen + Buttons verdrahten
    this.#links.forEach((linkComponent) => {
      listDisplay.appendChild(linkComponent.element);

      const aiBtn = linkComponent.element.querySelector(".ai-analysis-button");
      if (aiBtn) {
        aiBtn.addEventListener("click", () => {
          this.showAnalysis(linkComponent);
        });
      }

      const qrBtn = linkComponent.element.querySelector(".qr-button");
      if (qrBtn) {
        qrBtn.addEventListener("click", () => {
          this.showQr(linkComponent);
        });
      }
    });
  }


  async commit() {
    this.#links.forEach((l) => {
      l.commit();
    });
  }

  async showAnalysis(link) {
    if (!analysisSection || !analysisMeta || !analysisText) return;

    const shortCode = link.shortUrl.replace(/^https?:\/\/[^/]+\//, "");

    // Wenn derselbe Code schon offen ist -> wieder schließen
    if (
        analysisSection.dataset.currentCode === shortCode &&
        !analysisSection.classList.contains("hide")
    ) {
      analysisSection.classList.add("hide");
      analysisSection.dataset.currentCode = "";
      if (analysisCharts) analysisCharts.innerHTML = "";
      return;
    }

    analysisSection.dataset.currentCode = shortCode;

    analysisTab?.classList.add("is-active");
    qrTab?.classList.remove("is-active");

    analysisSection.classList.remove("hide");
    qrSection?.classList.add("hide");

    analysisMeta.textContent = "Analyse wird geladen …";
    analysisText.textContent = "";

    try {
      const result = await api_analysis.summary(this.#api, shortCode);
      const stats = result.stats;

      analysisMeta.textContent =
          `Link: ${stats.shortCode} | Zeitraum: ${stats.period} | Klicks: ${stats.totalClicks}`;
      analysisText.textContent = result.summary ?? JSON.stringify(stats, null, 2);

      renderCharts(analysisCharts, stats);
    } catch (err) {
      console.error("AI analysis error", err);
      analysisMeta.textContent = "Fehler bei der Analyse";
      analysisText.textContent = err.message ?? String(err);
      if (analysisCharts) analysisCharts.innerHTML = "";
    }
  }


  async showQr(link) {
    const campaign = window.prompt(
        "Wie soll dieser QR-Code heißen? (z.B. airport, sbahn, newsletter)",
        "airport"
    );
    if (!campaign) return;

    qrTab?.classList.add("is-active");
    analysisTab?.classList.remove("is-active");

    qrSection.classList.remove("hide");
    analysisSection?.classList.add("hide");

    const shortUrl = link.shortUrl;
    const qrUrl = shortUrl.includes("?")
        ? `${shortUrl}&src=${encodeURIComponent(campaign)}`
        : `${shortUrl}?src=${encodeURIComponent(campaign)}`;

    // vorhandene Section im Dashboard nutzen
    if (!qrSection || !qrMeta) return;

    qrSection.classList.remove("hide");
    qrMeta.textContent = `Link: ${qrUrl} (Kampagne: ${campaign})`;

    if (!window.QRCode) {
      console.error("QRCodeJS not found on window");
      alert("QR-Code-Bibliothek konnte nicht geladen werden.");
      return;
    }

    const qrWrapper = qrSection.querySelector(".qr-image-wrapper");
    if (!qrWrapper) return;

    // alten Code löschen, damit bei jedem Klick ein neuer QR entsteht
    qrWrapper.innerHTML = "";

    // direkt in den Wrapper rendern lassen
    new window.QRCode(qrWrapper, {
      text: qrUrl,
      width: 256,
      height: 256,
      correctLevel: window.QRCode.CorrectLevel.H,
    });
  }


}

function updatePreview() {
  if (!profilePreview) return;
  const user = getCurrentUser();
  if (user?.profileImageUrl) {
    profilePreview.src = user.profileImageUrl;
    profilePreview.classList.remove("hide");
  } else {
    profilePreview.removeAttribute("src");
    profilePreview.classList.add("hide");
  }
}

function setProfileStatus(message, success) {
  if (!profileStatusDisplay) return;
  if (message) {
    profileStatusDisplay.classList.remove("error");
    profileStatusDisplay.classList.remove("success");
    profileStatusDisplay.textContent = "";
    if (typeof success === "boolean")
      profileStatusDisplay.classList.add(success ? "success" : "error");
  } else {
    profileStatusDisplay.textContent = "";
    profileStatusDisplay.classList.add("hide");
  }
}

function renderCharts(container, stats) {
  if (!container || !stats) return;
  container.innerHTML = "";

  // Devices
  if (stats.devices && stats.devices.length > 0) {
    const data = stats.devices.map((d) => ({
      label: mapDeviceLabel(d.deviceType),
      value: d.count ?? 0,
    }));
    renderBarChart(container, "Klicks nach Gerätetyp", data);
  }

  // Countries
  if (stats.countries && stats.countries.length > 0) {
    const data = stats.countries.map((c) => ({
      label: c.country || "UNKNOWN",
      value: c.count ?? 0,
    }));
    renderBarChart(container, "Klicks nach Land", data);
  }

  // Sources (Referrer / Quelle)
  if (stats.sources && stats.sources.length > 0) {
    const data = stats.sources.map((s) => ({
      label: s.source || "UNKNOWN",
      value: s.count ?? 0,
    }));
    renderBarChart(container, "Klicks nach Quelle", data);
  }
}

function mapDeviceLabel(deviceType) {
  switch ((deviceType || "").toLowerCase()) {
    case "desktop":
      return "Desktop";
    case "mobile":
      return "Mobile";
    case "tablet":
      return "Tablet";
    default:
      return deviceType || "Unbekannt";
  }
}

function renderBarChart(container, title, data) {
  if (!data || data.length === 0) return;

  const max = Math.max(...data.map((d) => d.value ?? 0)) || 1;

  const card = document.createElement("div");
  card.className = "mini-chart-card";

  const heading = document.createElement("h4");
  heading.textContent = title;
  card.appendChild(heading);

  const bars = document.createElement("div");
  bars.className = "mini-chart-bars";

  data.forEach((item) => {
    const value = item.value ?? 0;
    const label = item.label ?? "?";

    const row = document.createElement("div");
    row.className = "mini-chart-row";

    const labelSpan = document.createElement("span");
    labelSpan.className = "mini-chart-label";
    labelSpan.textContent = label;

    const barWrapper = document.createElement("div");
    barWrapper.className = "mini-chart-bar-wrapper";

    const bar = document.createElement("div");
    bar.className = "mini-chart-bar";
    bar.style.width = `${(value / max) * 100}%`;

    const valueSpan = document.createElement("span");
    valueSpan.className = "mini-chart-value";
    valueSpan.textContent = String(value);

    barWrapper.appendChild(bar);
    barWrapper.appendChild(valueSpan);
    row.appendChild(labelSpan);
    row.appendChild(barWrapper);
    bars.appendChild(row);
  });

  card.appendChild(bars);
  container.appendChild(card);
}



export { Dashboard, updatePreview, setProfileStatus };
