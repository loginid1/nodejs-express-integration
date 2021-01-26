module.exports = class LogIn {
  constructor(driver) {
    this.driver = driver;
    this.locators = {
      loginButton: { css: "button" },
    };
  }

  async loginButton() {
    return await this.driver.findElement(this.locators.loginButton);
  }
};
