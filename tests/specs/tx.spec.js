require("dotenv").config({ path: "./.env" });
const { Builder, Capabilities } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const chromedriver = require("chromedriver");
const LogIn = require("../page_objects/Login");
const TransactionConfirmation = require("../page_objects/TransactionConfirmation");

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

const url = "http://localhost:8080";
const driver = new Builder().withCapabilities(Capabilities.chrome()).build();

describe("Log In", () => {
  const login = new LogIn(driver);
  login.driver.get(url);

  it("Should successfully show login screen", async () => {
    expect(await login.getHeaderName()).toEqual("Hello!");
  });

  it("Should successfully direct to loginID login", async () => {
    await login.goToChallenge();
    const button = await login.getLoginIDButton();
    expect(await button.getText()).toEqual("Login");
  });

  it("Should successfully authenticate and redirect back to origin", async () => {
    await login.fillUpLoginIDFormAndSubmit(
      process.env.LOGINID_USERNAME,
      process.env.LOGINID_PASSWORD
    );
    expect(await login.getHeaderName()).toEqual("Hello!");
  });
});

describe("Transaction Confirmation", async () => {
  const tx = new TransactionConfirmation(driver);

  //incase callback is not returned
  //this may be removed later on
  if (await tx.driver.getCurrentUrl().contains("integration")) {
    await tx.driver.get(url);
  }

  it("Should successfully display tx route", async () => {});
});
