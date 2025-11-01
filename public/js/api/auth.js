"use strict";

import { startSession, endSession } from "../auth/session.js";
import { hideAuthScreen } from "../auth/auth.js";

const register = (api, email, password) => {
  api.post(
    "/auth/register",
    { email: email, password: password },
    { 400: "Registration failed" },
    async (response) => {
      let data = await response.json();
      console.log(data);
      console.log(data.uid);
      console.log(data.email);
      startSession();
      hideAuthScreen();
    },
    (status) => {
      // handle http error
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
      console.log(data);
      console.log(data.uid);
      console.log(data.email);
      startSession();
      hideAuthScreen();
    },
    (status) => {
      // handle http error
    },
  );
};

const logout = (api) => {
  api.post("/auth/logout", {}, {}, () => {
    endSession();
  });
};

export { register, login, logout };
