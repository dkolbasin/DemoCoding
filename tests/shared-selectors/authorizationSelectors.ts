// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
export const authorization = {
  emailInput: 'input[aria-label="Имя пользователя"]',
  passwordInput: 'input[aria-label="Пароль"]',
  logInButton: '.q-btn',
  errorMessage: 'Вы указали неверный логин или пароль',

  correctLogin: 'admin',
  correctPassword: 'pass1!2@',
  incorrectLogin: 'incorrectEmail',
  invalidPassword: 'qwerty123',

  notificationBar: '.text-red',
  account: '.q-btn__content > .q-icon',
};

export const logIn = async (page, email, pass) => {
  await page.locator(authorization.emailInput).fill(email);
  await page.locator(authorization.passwordInput).fill(pass);
  await page.locator(authorization.logInButton).click();
};
