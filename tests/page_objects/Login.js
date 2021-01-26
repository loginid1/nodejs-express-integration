const { until } = require("selenium-webdriver");

module.exports = class LogIn {
  constructor(driver) {
    this.driver = driver;
    this.locators = {
      loginHeader: { css: "h1" },
      loginButton: { xpath: '//a[@href="/login"]' },
      loginIDButton: { css: "button" },
      inputUsername: { css: 'input[placeholder="email"]' },
      inputPassword: { css: 'input[type="password"]' },
      continueButton: { xpath: '//div[text()="Continue"]' },
      eitherHeader: {
        xpath: '//h1[text()="Hello!"] | //h2[text()="Integrations"]',
      },
    };
  }

  async getHeaderName() {
    return await this.driver.findElement(this.locators.eitherHeader).getText();
  }

  async getLoginIDButton() {
    return await this.driver.findElement(this.locators.loginIDButton);
  }

  async goToChallenge() {
    await this.driver.findElement(this.locators.loginButton).click();
  }

  async fillUpLoginIDFormAndSubmit(username, password) {
    await this.driver
      .findElement(this.locators.inputUsername)
      .sendKeys(username);

    await this.driver.findElement(this.locators.loginIDButton).click();
    await this.driver.wait(until.elementLocated(this.locators.inputPassword));

    await this.driver
      .findElement(this.locators.inputPassword)
      .sendKeys(password);

    await this.driver.findElement(this.locators.continueButton).click();
    await this.driver.wait(until.elementLocated(this.locators.eitherHeader));
  }
};
