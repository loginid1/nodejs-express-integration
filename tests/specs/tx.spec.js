const { baseURL, loginIDUsername, loginIDPassword } = require("../data/");
const { Builder, Capabilities, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const chromedriver = require("chromedriver");
const LogIn = require("../page_objects/Login");
const TransactionConfirmation = require("../page_objects/TransactionConfirmation");
const { writeImage } = require("../utils/fs");

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
    }
  });

  afterAll(async () => await driver.close());

  it("Should successfully display tx route", async () => {
    await tx.goToTX();
    await tx.driver.wait(until.urlIs(baseURL + "/tx"));
    //image
    await driver.takeScreenshot().then(writeImage("get_tx_route.png"));
    const header = await tx.getHeader();
    expect(await header.getText()).toEqual("Create Transaction");
  });
});
