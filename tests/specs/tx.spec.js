const { baseURL, loginIDUsername, loginIDPassword } = require("../data/");
const { Builder, Capabilities, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const chromedriver = require("chromedriver");
const LogIn = require("../page_objects/Login");
const TransactionConfirmation = require("../page_objects/TransactionConfirmation");

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

const driver = new Builder().withCapabilities(Capabilities.chrome()).build();

const login = new LogIn(driver);
const tx = new TransactionConfirmation(driver);

describe("Transaction Confirmation", () => {
  beforeAll(async () => {
    await driver.get(baseURL);
    await login.fullLogin(loginIDUsername, loginIDPassword);
    //incase callback is not returned
    //this may be removed later on
    const currentUrl = await tx.driver.getCurrentUrl();
    if (currentUrl.includes("integration")) {
      await tx.driver.get(baseURL);
      //await tx.driver.wait(until.urlIs(url + "/tx"));
    }
  });

  it("Should successfully display tx route", async () => {
    await tx.goToTX();
  });
});
