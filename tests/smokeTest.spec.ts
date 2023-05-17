import { test, expect } from '@playwright/test';
import { redirectUrl } from './urls';
import {
  authorization,
  logIn,
} from './shared-selectors/authorizationSelectors';
import { nameModules } from './shared-selectors/modulesSelectors';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/authorization/);
  await logIn(page, authorization.correctLogin, authorization.correctPassword);
  await expect(page).toHaveURL(redirectUrl);
});

test('Enter the registry', async ({ page }) => {
  await page.locator(nameModules.Registry.moduleRegistry).click();
  await page.locator(nameModules.Registry.searchPatient).click();
  await expect(page).toHaveURL(/patients-search/);
  await page.getByRole('button', { name: 'Поиск' }).click();
  await expect(page.locator('table')).toHaveClass(['q-table']);
  page.on('response', (response) => {
    if (
      response.url().includes('api/register-office/treatment-cases?limit=20')
    ) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(404);
    }
  });
  await page.locator('tbody > tr').first().click();
  await expect(page.locator('.grow > .BaseScrollArea')).toHaveClass([
    'BaseScrollArea h-full w-full p-6',
  ]);
  await page
    .locator('[class="q-icon text-sanatorium-text notranslate material-icons"]')
    .click();
  await page.getByRole('button', { name: 'Добавить историю болезни' }).click();
  //проверка API
  //не оч могу понять как проверить подгрузился ли класс TitlePage
  //await expect(page.locator('TitlePage')).toHaveClass('TitlePage > gap');
  await page.getByRole('link', { name: 'Поиск пациентов' }).click();
  await page
    .getByRole('button', { name: 'Добавить амбулаторную карту' })
    .click();
  //проверка API
  //не оч могу понять как проверить подгрузился ли класс TitlePage
  //await expect(page.locator('TitlePage')).toHaveClass('TitlePage > gap');
  await page.getByRole('link', { name: 'Поиск пациентов' }).click();
  await page.locator(authorization.account).click();
  await page.getByText('Выйти').click();
  await expect(page).toHaveURL(/authorization/);
  await expect(page.locator('h1')).toContainText('Вход в систему');
});

test('Enter the Patient', async ({ page }) => {
  await page.locator(nameModules.Patients.myPatient).click();
  await expect(page).toHaveURL(/my-patients/);
  await page.getByRole('button', { name: 'Поиск' }).click();
  //проверка API
  await page.locator('tbody > tr').first().click();
  //проверка API
  await expect(page.locator('.grow > .BaseScrollArea')).toHaveClass([
    'BaseScrollArea h-full w-full p-6',
  ]);
  await page
    .locator('[class="q-icon text-sanatorium-text notranslate material-icons"]')
    .click();
  await page.locator(nameModules.Patients.myConsultation).click();
  await expect(page).toHaveURL(/my-consultations/);
  await page.getByRole('button', { name: 'Поиск' }).click();
  //проверка API
  await page.locator('tbody > tr').first().click();
  //проверка API
  await expect(page.locator('.grow > .BaseScrollArea')).toHaveClass([
    'BaseScrollArea h-full w-full p-6',
  ]);
  await page
    .locator('[class="q-icon text-sanatorium-text notranslate material-icons"]')
    .click();
  await page.locator(nameModules.Patients.searchPatient).click();
  await expect(page).toHaveURL(/patients-search/);
  await page.getByRole('button', { name: 'Поиск', exact: true }).click();
  //проверка API
  await page.locator('tbody > tr').first().click();
  //проверка API
  await expect(page.locator('.grow > .BaseScrollArea')).toHaveClass([
    'BaseScrollArea h-full w-full p-6',
  ]);
  await page
    .locator('[class="q-icon text-sanatorium-text notranslate material-icons"]')
    .click();
  await page.locator(authorization.account).click();
  await page.getByText('Выйти').click();
  await expect(page).toHaveURL(/authorization/);
  await expect(page.locator('h1')).toContainText('Вход в систему');
});

test('Enter the Release Control', async ({ page }) => {
  await page.locator(nameModules.releaseControl.moduleReleaseControl).click();
  await expect(page).toHaveURL(/release-control/);
  await page.locator(nameModules.releaseControl.Procedures).click();
  await expect(page).toHaveURL(/procedures/);
  await page.getByRole('button', { name: 'Поиск' }).click();
  //проверка API
  await page.locator(authorization.account).click();
  await page.getByText('Выйти').click();
  await expect(page).toHaveURL(/authorization/);
  await expect(page.locator('h1')).toContainText('Вход в систему');
});

test('Enter the Dispatching', async ({ page }) => {
  await page.locator(nameModules.Dispatching.moduleDispatching).click();
  await expect(page).toHaveURL(/dispatching/);
  await page.locator(nameModules.Dispatching.myPatient).click();
  await expect(page).toHaveURL(/my-patients/);
  await page.getByRole('button', { name: 'Поиск' }).click();
  await expect(page.locator('.q-table__middle > .q-table')).toHaveClass([
    'q-table',
  ]);
  await page.locator(authorization.account).click();
  await page.getByText('Выйти').click();
  await expect(page).toHaveURL(/authorization/);
  await expect(page.locator('h1')).toContainText('Вход в систему');
});

test('Enter the Schedules', async ({ page }) => {
  await page.locator(nameModules.Schedules.moduleSchedules).click();
  await expect(page).toHaveURL(/schedules/);
  await page.locator('path').first().click();
  await page.locator('path').first().click();
  await page.locator('path').nth(1).click();
  await page.locator('path').nth(1).click();
  await page.locator('path').nth(2).click();
  await page.locator('path').nth(2).click();
  await page.locator('svg').nth(3).click();
  await page.locator('svg').nth(3).click();
  await page.locator('path').first().click();
  await page
    .locator('div:nth-child(8) > .vue-treeselect__option')
    .first()
    .click();

  await expect(page.locator('.w-full > .ScheduleCalendar')).toHaveClass([
    'ScheduleCalendar',
  ]);
  await page.locator(authorization.account).click();
  await page.getByText('Выйти').click();
  await expect(page).toHaveURL(/authorization/);
  await expect(page.locator('h1')).toContainText('Вход в систему');
});

test('Enter the Laboratory', async ({ page }) => {
  await page.locator(nameModules.Laboratory.moduleLaboratory).click();
  await page.locator(nameModules.Laboratory.biomaterialSampling).click();
  await expect(page).toHaveURL(/biomaterial-sampling/);
  await page.getByRole('button', { name: 'Поиск' }).click();
  await expect(page.locator('.q-table__middle > .q-table')).toHaveClass([
    'q-table',
  ]);
  await page.locator(nameModules.Laboratory.resultsProcessing).click();
  await expect(page).toHaveURL(/results-processing/);
  await page.getByRole('button', { name: 'Поиск' }).click();
  await expect(page.locator('.q-table__middle > .q-table')).toHaveClass([
    'q-table',
  ]);
  await page.locator(nameModules.Laboratory.advancedSearch).click();
  await expect(page).toHaveURL(/advanced-search/);
  await page.getByRole('button', { name: 'Поиск' }).click();
  await expect(page.locator('.q-table__middle > .q-table')).toHaveClass([
    'q-table',
  ]);
  await page.locator(authorization.account).click();
  await page.getByText('Выйти').click();
  await expect(page).toHaveURL(/authorization/);
  await expect(page.locator('h1')).toContainText('Вход в систему');
});

test('Enter the Accounting', async ({ page }) => {
  await page.locator(nameModules.Accounting.moduleFiscals).click();
  await page.locator(nameModules.Accounting.Fiscals).click();
  await expect(page).toHaveURL(/fiscals/);
  await expect(
    page.locator('.FiscalsCommands  > .flex > .flex > button')
  ).toHaveCount(7, { timeout: 70000 });
  await page.locator(authorization.account).click();
  await page.getByText('Выйти').click();
  await expect(page).toHaveURL(/authorization/);
  await expect(page.locator('h1')).toContainText('Вход в систему');
});
