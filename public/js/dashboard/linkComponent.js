"use strict";

import * as api_links from "../api/links.js";

class LinkComponent {
  #displayToggled;
  #id;
  #isActive;
  #api;

  constructor(
    api,
    id,
    longUrl,
    shortUrl,
    hitCount,
    lastHit,
    createdAt,
    isActive,
    toggled = false,
  ) {
    this.#api = api;
    this.#id = id;
    this.#isActive = isActive;
    this.#displayToggled = toggled;

    this.longUrl = longUrl;
    this.shortUrl = shortUrl;

    this.element = document.createElement("li");
    this.element.innerHTML = `
<div class="longUrl">${longUrl}</div>
<div class="shortUrl">
  <a href="${shortUrl}" target="_blank" rel="noreferrer">${shortUrl}</a>
</div>
<div class="id">Id: ${id}</div>
<div class="hitCount">Hit count: ${hitCount}</div>
<div class="lastHitAt">Last hit: ${typeof lastHit == "undefined" ? "-" : lastHit}</div>
<div class="createdAt">Created: ${typeof createdAt == "undefined" ? "-" : createdAt}</div>
<div class="isActive">
  <input type="checkbox" name="activeLinkToggle" value=""${isActive ? " checked" : ""}/>
</div>
<div class="actions">
  <button type="button" class="ai-analysis-button">AI Analysis</button>
  <button type="button" class="qr-button">QR Code</button>
  <button type="button" class="delete-button">Delete</button>
</div>
    `;

    this.element.classList[this.#displayToggled ? "add" : "remove"]("big");
    this.element.addEventListener("click", () => {
      this.#displayToggled = !this.#displayToggled;
      this.element.classList[this.#displayToggled ? "add" : "remove"]("big");
    });

    const activeCheckbox = this.element.querySelector(
        'input[name="activeLinkToggle"]',
    );
    if (activeCheckbox) {
      activeCheckbox.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    }

    const aiButton = this.element.querySelector(".ai-analysis-button");
    if (aiButton) {
      aiButton.addEventListener("click", (e) => {
        // Nur verhindern, dass der Klick das Element toggelt;
        // die eigentliche Analyse startet das Dashboard (wird dort mit addEventListener über die Instanz verdrahtet)
        e.stopPropagation();
      });
    }

    const qrButton = this.element.querySelector(".qr-button");
    if (qrButton) {
      qrButton.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    }

    const deleteButton = this.element.querySelector(".delete-button");
    if (deleteButton) {
      deleteButton.addEventListener("click", async (e) => {
        e.stopPropagation();

        const ok = window.confirm("Diesen Shortlink wirklich löschen?");
        if (!ok) return;

        try {
          // „Soft Delete“: erst mal nur deaktivieren
          await api_links.toggle(this.#api, this.#id, false);
          this.element.remove();
        } catch (error) {
          console.error("Failed to delete link", error);
          alert("Link konnte nicht gelöscht werden.");
        }
      });
    }
  }




  async commit() {
    const activeToggle = this.element.querySelector(
      'input[name="activeLinkToggle"]',
    );
    if (!activeToggle) return;

    if (activeToggle.checked === this.#isActive) return;
    try {
      await api_links.toggle(this.#api, this.#id, activeToggle.checked);
      this.#isActive = activeToggle.checked;
    } catch (error) {
      console.error("Failed to toggle link", error);
    }
  }
}

export { LinkComponent };
