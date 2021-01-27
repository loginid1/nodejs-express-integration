require("dotenv").config({ path: "./.env" });

module.exports = {
  baseURL: "http://localhost:8080",
  loginIDUsername: process.env.LOGINID_USERNAME,
  loginIDPassword: process.env.LOGINID_PASSWORD,
};
