"use strict";

class API {
  #url;

  constructor(url) {
    this.#url = url;
  }

  async get(path, statusDict, responseHandler, errorHandler) {
    await fetch(this.#url + path, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) return response;
        if (statusDict.hasOwnProperty(response.status))
          throw {
            message: statusDict[response.status],
            status: response.status,
          };
        else
          throw {
            message: `Unexpected HTTP status: ${response.status}`,
            status: response.status,
          };
      })
      .then(async (response) => {
        await responseHandler(response);
      })
      .catch(async (error) => {
        console.error("Error: " + error.message);
        if (typeof errorHandler !== "undefined")
          await errorHandler(error.status);
      });
  }

  async post(path, data, statusDict, responseHandler, errorHandler) {
    await fetch(this.#url + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) return response;
        if (statusDict.hasOwnProperty(response.status))
          throw {
            message: statusDict[response.status],
            status: response.status,
          };
        else
          throw {
            message: `Unexpected HTTP status: ${response.status}`,
            status: response.status,
          };
      })
      .then(async (response) => {
        await responseHandler(response);
      })
      .catch(async (error) => {
        console.error("Error: " + error.message);
        if (typeof errorHandler !== "undefined")
          await errorHandler(error.status);
      });
  }

  async patch(path, data, statusDict, responseHandler, errorHandler) {
    await fetch(this.#url + path, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) return response;
        if (statusDict.hasOwnProperty(response.status))
          throw {
            message: statusDict[response.status],
            status: response.status,
          };
        else
          throw {
            message: `Unexpected HTTP status: ${response.status}`,
            status: response.status,
          };
      })
      .then((response) => {
        responseHandler(response);
      })
      .catch(async (error) => {
        console.error("Error: " + error.message);
        if (typeof errorHandler !== "undefined")
          await errorHandler(error.status);
      });
  }
}

export default API;
