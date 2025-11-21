"use strict";

import {
  startSession,
  endSession,
  updateProfileImage,
} from "../auth/session.js";
import { hideAuthScreen, setAuthError } from "../auth/auth.js";
import { setProfileStatus, updatePreview } from "../dashboard/dashboard.js";

const register = (api, email, password) => {
  api.post(
    "/auth/register",
    { email: email, password: password },
    { 400: "Registration failed" },
    async (response) => {
      let data = await response.json();
      startSession(data);
      hideAuthScreen();
    },
    () => {
      setAuthError("Registration failed");
    },
  );
};

const login = (api, email, password) => {
  api.post(
    "/auth/login",
    { email: email, password: password },
    { 401: "Invalid credentials" },
    async (response) => {
      let data = await response.json();
      startSession(data);
      hideAuthScreen();
    },
    (err) => {
      errorDetails = err.status === 401 ? ": Invalid credentials" : "";
      setAuthError(`Login Failed${errorDetails}`);
    },
  );
};

const logout = (api) => {
  api.post("/auth/logout", {}, {}, () => {
    endSession();
  });
};

const me = (api) => {
  let output;
  api.get(
    "/auth/me",
    { 401: "Unauthorized" },
    async (response) => {
      startSession(await response.json());
    },
    () => {
      endSession();
    },
  );
  return output;
};

const uploadProfileImage = async (api, file) => {
  let output;
  const formData = new FormData();
  formData.append("profileImage", file);
  await api.upload(
    "/auth/profile-image",
    formData,
    {
      400: "Invalid upload",
      401: "Unauthorized",
    },
    async (response) => {
      output = await response.json();
      if (output?.downloadUrl) {
        updateProfileImage(output.downloadUrl);
        updatePreview();
        setProfileStatus("✅ Profile image updated successfully!", true);
        setTimeout(() => setProfileStatus(""), 3000);
      } else {
        setProfileStatus("❌ Failed to upload profile image");
      }
    },
    (err) => {
      console.error("Profile upload error:", err.message);
      setProfileStatus(`❌ Upload failed: ${err?.message || "Unknown error"}`);
      updatePreview();
    },
  );
};

export { register, login, logout, me, uploadProfileImage };
