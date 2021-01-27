const { baseURL, loginIDUsername, loginIDPassword } = require("../data/");
const { Builder, Capabilities } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const chromedriver = require("chromedriver");
const LogIn = require("../page_objects/Login");

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

const driver = new Builder().withCapabilities(Capabilities.chrome()).build();

describe("Log In", () => {
  afterAll(() => driver.close());

  const login = new LogIn(driver);
  login.driver.get(baseURL);

  it("Should successfully show login screen", async () => {
    expect(await login.getHeaderName()).toEqual("Hello!");
  });

  it("Should successfully direct to LoginID login", async () => {
    await login.goToChallenge();
    const button = await login.getLoginIDButton();
    expect(await button.getText()).toEqual("Login");
  });

  it("Should successfully authenticate and redirect back to origin", async () => {
    await login.fillUpLoginIDFormAndSubmit(loginIDUsername, loginIDPassword);
    expect(await login.getHeaderName()).toEqual("Hello!");
  });
});
