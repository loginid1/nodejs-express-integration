module.exports = class LogIn {
  constructor(driver) {
    this.driver = driver;
    this.locators = {
      loginButton: { xpath: '//a[@href="/login"]' },
      loginIDButton: { css: "button" },
    };
  }

  async getLoginIDButton() {
    return await this.driver.findElement(this.locators.loginIDButton);
  }

  async goToChallenge() {
    await this.driver.findElement(this.locators.loginButton).click();
  }

  async fillUpLoginIDForm() {}
};
