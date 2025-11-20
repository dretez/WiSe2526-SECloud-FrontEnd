"use strict";

import {
  startSession,
  endSession,
  updateProfileImage,
} from "../auth/session.js";
import { hideAuthScreen } from "../auth/auth.js";

const register = async (api, email, password) => {
  const data = await api.post(
    "/auth/register",
    { email: email, password: password },
    { 400: "Registration failed" },
    async (response) => {
      return await response.json();
    },
    (status) => {
      throw new Error(status);
    },
  );
  startSession(data);
  hideAuthScreen();
  return data;
};

const login = async (api, email, password) => {
  const data = await api.post(
    "/auth/login",
    { email: email, password: password },
    { 401: "Invalid credentials" },
    async (response) => {
      return await response.json();
    },
    (status) => {
      throw new Error(status);
    },
  );
  startSession(data);
  hideAuthScreen();
  return data;
};

const logout = async (api) => {
  await api.post("/auth/logout", {}, {}, () => {});
    endSession();
};

const me = async (api) => {
  try {
    const data = await api.get(
      "/auth/me",
      { 401: "Unauthorized" },
      async (response) => {
        return await response.json();
      },
    );
    return data;
  } catch (error) {
    return undefined;
  }
};

const uploadProfileImage = async (api, file) => {
  const formData = new FormData();
  formData.append("profileImage", file);

  const data = await api.upload(
    "/auth/profile-image",
    formData,
    { 400: "Invalid upload", 401: "Unauthorized" },
    async (response) => {
      return await response.json();
    },
  );

  if (data?.downloadUrl) {
    updateProfileImage(data.downloadUrl);
  }

  return data;
};

export { register, login, logout, me, uploadProfileImage };
