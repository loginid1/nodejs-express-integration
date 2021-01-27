module.exports = class TransactionConfirmation {
  constructor(driver) {
    this.driver = driver;
    this.locators = {
      txButton: { xpath: '//a[@href="/tx"]' },
    };
  }

  async goToTX() {
    await this.driver.findElement(this.locators.txButton).click();
  }
};
