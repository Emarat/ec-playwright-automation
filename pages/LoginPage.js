class LoginPage {
  constructor(page) {
    this.page = page;
    this.userNameInput = "//input[@id='username']";
    this.userPasswordInput = "//input[@id='password']";
    this.loginButton = "//input[@id='kc-login']";
  }

  async gotoLoginPage(url) {
    await this.page.goto(url);
  }

  async login(username, password) {
    await this.page.fill(this.userNameInput, username);
    await this.page.fill(this.userPasswordInput, password);
    await this.page.click(this.loginButton);
  }
}

module.exports = { LoginPage };
