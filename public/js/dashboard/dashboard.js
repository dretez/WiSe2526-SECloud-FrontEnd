"use strict";

import * as api_links from "../api/links.js";
import * as api_auth from "../api/auth.js";
import {
  isAuthenticated,
  getCurrentUser,
  updateProfileImage as updateSessionProfileImage,
} from "../auth/session.js";

import { LinkComponent } from "./linkComponent.js";

const openButtons = document.querySelectorAll(".openDashboard");
const dashboard = document.querySelector("#my-dashboard");
const listDisplay = dashboard.querySelector("ul.link-list");
const applyChangesBtn = dashboard.querySelector("button[name=applyChanges]");
const profileImageInput = dashboard.querySelector("input[name=profileImage]");
const profileStatusDisplay = dashboard.querySelector(".profileImageStatus");
const profilePreview = dashboard.querySelector(".profileImage");

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
        dashboard.classList.add("display");
        this.load();
      }),
    );

    if (profileImageInput) {
      profileImageInput.addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setProfileStatus("File too large. Maximum size is 5MB.");
          event.target.value = "";
          return;
        }

        // Validate file type
        const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
        if (!validTypes.includes(file.type)) {
          setProfileStatus("Invalid file type. Please use PNG, JPEG, or WebP.");
          event.target.value = "";
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

        try {
          const { downloadUrl } = await api_auth.uploadProfileImage(this.#api, file);
          if (downloadUrl) {
            updateSessionProfileImage(downloadUrl);
            updatePreview();
            setProfileStatus("✅ Profile image updated successfully!");
            // Clear status after 3 seconds
            setTimeout(() => setProfileStatus(""), 3000);
          } else {
            setProfileStatus("❌ Failed to upload profile image");
          }
        } catch (error) {
          console.error("Profile upload error:", error);
          setProfileStatus(`❌ Upload failed: ${error?.message || "Unknown error"}`);
          // Reset preview on error
          updatePreview();
        } finally {
          profileImageInput.disabled = false;
          event.target.value = "";
        }
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
      linklist = await api_links.mine(this.#api);
      this.#links = linklist.map(
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
    await Promise.all(
      this.#links.map(async (l) => {
        await l.commit();
      }),
    );
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

function setProfileStatus(message) {
  if (!profileStatusDisplay) return;
  if (message) {
    profileStatusDisplay.textContent = message;
    profileStatusDisplay.classList.remove("hide");
    // Add success/error styling
    if (message.includes("✅")) {
      profileStatusDisplay.style.background = "rgba(40, 167, 69, 0.1)";
      profileStatusDisplay.style.color = "#28a745";
    } else if (message.includes("❌") || message.includes("Failed")) {
      profileStatusDisplay.style.background = "rgba(220, 53, 69, 0.1)";
      profileStatusDisplay.style.color = "#dc3545";
    } else {
      profileStatusDisplay.style.background = "rgba(102, 126, 234, 0.1)";
      profileStatusDisplay.style.color = "#667eea";
    }
  } else {
    profileStatusDisplay.textContent = "";
    profileStatusDisplay.classList.add("hide");
  }
}

export { Dashboard };
