"use strict";

class API {
  #url;

  constructor(url) {
    this.#url = url;
  }

  async #request(path, statusDict, responseHandler, errorHandler, init) {
    await fetch(this.#url + path, {
      ...init,
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) return response;
        throw {
          message: statusDict.hasOwnProperty(response.status)
            ? statusDict[response.status]
            : `Unexpected HTTP status: ${response.status}`,
          status: response.status,
          _response: response // Attach the raw response so we can read the body
        };
      })
      .then(async (response) => {
        await responseHandler(response);
      })
      .catch(async (error) => {
        console.error("Error: " + error.message);
        if (typeof errorHandler !== "undefined") {
           // Pass both status and the error object (which might contain the response)
           await errorHandler(error.status, error); 
        }
      });
  }

  async get(path, statusDict, responseHandler, errorHandler) {
    await this.#request(path, statusDict, responseHandler, errorHandler, {
      method: "GET",
    });
  }

  async post(path, data, statusDict, responseHandler, errorHandler) {
    await this.#request(path, statusDict, responseHandler, errorHandler, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async patch(path, data, statusDict, responseHandler, errorHandler) {
    await this.#request(path, statusDict, responseHandler, errorHandler, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async upload(path, formData, statusDict, responseHandler, errorHandler) {
    await this.#request(path, statusDict, responseHandler, errorHandler, {
      method: "POST",
      body: formData,
    });
  }
}

export default API;
