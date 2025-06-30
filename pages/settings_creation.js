class SettingsCreationPage {
  constructor(page) {
    this.page = page;

    // Page locators
    this.nirbachonModule =
      "//div[@class='d-grid grid-cols-2 grid-cols-md-3 gap-12 justify-content-center align-items-center']//div[1]";
    this.nirbachonSubModule =
      "//div[@id='নির্বাচন']//div[@class='position-relative']//div//span[@class='text-title fw-semibold'][contains(text(),'নির্বাচন')]";
    this.settingsCreationLink =
      "//div[@id='নির্বাচন']//div[2]//div[1]//a[1]//div[1]//div[1]//span[2]";
    this.createNewButton =
      "//button[@class='btn gap-4 btn-sm btn-primary-fill btn-transition btn-active']";
    this.electionTypeDropdown =
      "//div[contains(@class,'container-96 mb-24 py-9')]//div[1]//div[2]//div[1]//div[1]//div[1]//div[1]";
    this.testDataDropdown =
      "//div[contains(@class,'d-flex flex-column gap-8 p-9 border rounded-5')]//div[2]//div[2]//div[1]//div[1]//div[1]//div[1]";
    this.divisionDropdown =
      "//div[contains(@class,'align-items-center gap-4 w-100')]";
    this.addAllSettings =
      '//div[6]//div[1]//div[1]//div[1]//button[1]//span[1]';
    this.submitButton = "//button[@type='submit']";
  }

  async navigateToSettingsCreationForm() {
    await this.page.click(this.nirbachonModule);
    await this.page.click(this.nirbachonSubModule);
    await this.page.click(this.settingsCreationLink);
    await this.page.click(this.createNewButton);
  }

  async fillElectionDetails(electionType, testData) {
    await this.page.click(this.electionTypeDropdown);
    await this.page.click(`//span[contains(text(),'${electionType}')]`);
    await this.page.click(this.testDataDropdown);
    await this.page.click(`//span[normalize-space()='${testData}']`);
  }

  async selectLocation(divisionName, settingsName) {
    await this.page.click(this.divisionDropdown);
    await this.page.click(
      "//div[contains(@class,'shadow-xl position-absolute mt-1 p-3 z-1 select-menu')]//div[2]"
    );
    await this.page.click(this.addAllSettings);
  }

  async submitForm() {
    // await this.page.click(this.submitButton);
  }
}

module.exports = { SettingsCreationPage };
