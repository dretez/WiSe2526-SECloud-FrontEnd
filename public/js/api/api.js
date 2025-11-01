"use strict";

class API {
  #url;

  constructor(url) {
    this.#url = url;
  }

  get(path, statusDict, responseHandler) {
    fetch(this.#url + path)
      .then((response) => {
        if (response.ok) return response;
        if (statusDict.hasOwnProperty(response.status))
          throw new Error(statusDict[response.status]);
        else throw new Error(`Unexpected HTTP status: ${response.status}`);
      })
      .then((response) => {
        responseHandler(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  post(path, data, statusDict, responseHandler) {
    fetch(this.#url + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) return response;
        if (statusDict.hasOwnProperty(response.status))
          throw new Error(statusDict[response.status]);
        else throw new Error(`Unexpected HTTP status: ${response.status}`);
      })
      .then((response) => {
        responseHandler(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  patch(path, data, statusDict, responseHandler) {
    fetch(this.#url + path, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) return response;
        if (statusDict.hasOwnProperty(response.status))
          throw new Error(statusDict[response.status]);
        else throw new Error(`Unexpected HTTP status: ${response.status}`);
      })
      .then((response) => {
        responseHandler(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

export default API;
