const axios = require("axios");

const iHttp = axios.create();

const setBaseUrl = (baseUrl = "") => {
  iHttp.defaults.baseURL = baseUrl;
};

const setToken = (token) => {
  token
    ? (iHttp.defaults.headers.authorization = `Bearer ${token}`)
    : (iHttp.defaults.headers.authorization = "");
};

module.exports = { iHttp, setBaseUrl, setToken };
