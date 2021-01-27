module.exports = class TransactionConfirmation {
  constructor(driver) {
    this.driver = driver;
    this.locators = {
      header: { css: ".card-header" },
      txButton: { xpath: '//a[@href="/tx"]' },
    };
  }

  async getHeader() {
    return await this.driver.findElement(this.locators.header);
  }

  async goToTX() {
    await this.driver.findElement(this.locators.txButton).click();
  }
};
