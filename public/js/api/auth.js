"use strict";

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
      // set httponly session cookie
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
      // set httponly session cookie
    },
  );
};

const logout = (api) => {
  api.post("/auth/logout", {}, {}, () => {
    // clear httponly session cookie
  });
};

export { register, login, logout };
