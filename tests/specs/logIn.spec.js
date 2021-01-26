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
    const header = await login.driver.findElement({ css: "h1" }).getText();
    expect(header).toEqual("Hello!");
  });

  it("Should successfuly direct to loginID login", async () => {
    await login.goToChallenge();
    const button = await login.getLoginIDButton();
    expect(await button.getText()).toEqual("Login");
  });
});
