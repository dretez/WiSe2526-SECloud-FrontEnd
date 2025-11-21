"use strict";

import * as api_links from "../api/links.js";
import * as api_auth from "../api/auth.js";
import { getCurrentUser, isAuthenticated } from "../auth/session.js";

import { LinkComponent } from "./linkComponent.js";

const openButtons = document.querySelectorAll(".openDashboard");
const dashboard = document.querySelector("#my-dashboard");
const listDisplay = dashboard.querySelector("ul.link-list");
const applyChangesBtn = dashboard.querySelector("button[name=applyChanges]");
const profileImageInput = dashboard.querySelector("input[name=profileImage]");
const profileStatusDisplay = dashboard.querySelector(".profileImageStatus");
const profilePreview = dashboard.querySelector(".profileImage");

openButtons.forEach((e) =>
  e.addEventListener("click", () => {
    if (!isAuthenticated()) return;
    dashboard.classList.add("display");
  }),
);

const testLinks = (api) => [
  new LinkComponent(
    api,
    123,
    "https://one.one.one.one/",
    "https://short.example/123",
    23,
    "-",
    "-",
    false,
  ),
  new LinkComponent(
    api,
    456,
    "https://www.google.com/",
    "https://short.example/456",
    157,
    "-",
    "-",
    true,
  ),
];

class Dashboard {
  #api;
  #links;

  constructor(api) {
    this.#api = api;
    this.#links = [];
    applyChangesBtn.addEventListener("click", () => this.commit());

    openButtons.forEach((e) =>
      e.addEventListener("click", () => {
        if (!isAuthenticated()) return;
        setProfileStatus("");
        updatePreview();
        this.load();
      }),
    );

    if (profileImageInput) {
      profileImageInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
          /// Validate file size (max: 5MB)
          setProfileStatus("File too large. Maximum size is 5MB.");
          e.target.value = "";
          return;
        }

        const validTypes = [
          "image/png",
          "image/jpeg",
          "image/jpg",
          "image/webp",
        ];
        if (!validTypes.includes(file.type)) {
          // Validate file type
          setProfileStatus("Invalid file type. Please use PNG, JPEG, or WebP.");
          e.target.value = "";
          return;
        }

        // Show preview before upload
        const reader = new FileReader();
        reader.onload = (e) => {
          if (profilePreview) {
            profilePreview.src = e.target.result;
            profilePreview.classList.remove("hide");
          }
        };
        reader.readAsDataURL(file);

        setProfileStatus("Uploading... ⏳");
        profileImageInput.disabled = true;
        api_auth.uploadProfileImage(this.#api, file);
        profileImageInput.disabled = false;
        e.target.value = "";
      });
    }

    updatePreview();
  }

  async load() {
    this.#links.forEach((l) => {
      if (typeof l.element !== "undefined") l.element.remove();
    });
    let linklist;
    try {
      linklist = api_links.mine(this.#api);
      this.#links = linklist.map(
        (l) =>
          new LinkComponent(
            l.id,
            l.longUrl,
            l.shortUrl,
            l.hitCount,
            l.lastHitAt,
            l.createdAt,
            l.isActive,
          ),
      );
      this.#links.forEach((e) => {
        listDisplay.appendChild(e.element);
      });
    } catch (status) {
      this.#links = testLinks(this.#api);
      this.#links.forEach((e) => {
        listDisplay.appendChild(e.element);
      });
      // warn user about failure
    }
  }

  async commit() {
    this.#links.forEach((l) => {
      l.commit();
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

export { Dashboard, updatePreview, setProfileStatus };
