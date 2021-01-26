const { Builder, Capabilities } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const chromedriver = require("chromedriver");
const LogIn = require("../page_objects/Login");

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

const url = "http://localhost:8080";
const driver = new Builder().withCapabilities(Capabilities.chrome()).build();

describe("Log In", () => {
  const login = new LogIn(driver);
  login.driver.get(url);

  it("Should successfuly show login screen", async () => {
    const button = await login.getButton();
  });
});
