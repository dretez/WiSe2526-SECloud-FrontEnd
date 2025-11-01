"use strict";

class API {
  #url;

  constructor(url) {
    this.#url = url;
  }

  get(path, statusDict, responseHandler, errorHandler) {
    fetch(this.#url + path)
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
      .catch((error) => {
        console.error("Error: " + error.message);
        if (typeof errorHandler !== "undefined") errorHandler(error.status);
      });
  }

  post(path, data, statusDict, responseHandler, errorHandler) {
    fetch(this.#url + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
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
      .catch((error) => {
        console.error("Error: " + error.message);
        if (typeof errorHandler !== "undefined") errorHandler(error.status);
      });
  }

  patch(path, data, statusDict, responseHandler, errorHandler) {
    fetch(this.#url + path, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
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
      .catch((error) => {
        console.error("Error: " + error.message);
        if (typeof errorHandler !== "undefined") errorHandler(error.status);
      });
  }
}

export default API;
