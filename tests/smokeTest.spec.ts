import { test, expect } from '@playwright/test';
import { redirectUrl } from './urls';
import { authorization, logIn } from './shared-selectors/authorizationSelectors';
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
  await expect(page).toHaveURL(/registration\/patients-search/);
  await page.getByRole('button', { name: 'Поиск' }).locator('visible=true').click();
  page.on('response', (response) => {
    if (response.url().includes('api/register-office/treatment-cases?limit=20')) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await page.locator('q-table').isVisible();
  await expect(page.locator('tbody > tr')).toHaveCount(20);
  await page.locator('tbody > tr').first().click();
  await expect(page.locator('.BaseScrollArea > .q-scrollarea')).toHaveCount(2);
  page.on('response', (response) => {
    if (response.url().includes('api/medical-records/treatment-cases')) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await page.locator('[class="q-icon text-sanatorium-text notranslate material-icons"]').click();
  await page.getByRole('button', { name: 'Добавить историю болезни' }).click();
  page.on('response', (response) => {
    if (response.url().includes('api/register-office/treatment-cases/new')) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await expect(page.locator('.BaseSection')).toHaveCount(4);
  await page.getByRole('link', { name: 'Поиск пациентов' }).click();
  await page.getByRole('button', { name: 'Добавить амбулаторную карту' }).click();

  page.on('response', (response) => {
    if (response.url().includes('api/register-office/treatment-cases/new')) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await expect(page.locator('.BaseSection')).toHaveCount(4);
  await page.getByRole('link', { name: 'Поиск пациентов' }).click();
  await page.locator(authorization.account).click();
  await page.getByText('Выйти').click();
  await expect(page).toHaveURL(/authorization/);
  await expect(page.locator('h1')).toContainText('Вход в систему');
});

//есть баг - при открытии ИБ из вкладки "Мои консультации", а после её закрытия (ИБ), то перебрасывает на вкладку "Мои пациенты"
test('Enter the Patient', async ({ page }) => {
  await page.locator(nameModules.Patients.myPatient).click();
  await expect(page).toHaveURL(/my-patients/);
  await page.getByRole('button', { name: 'Поиск' }).locator('visible=true').click();
  page.on('response', (response) => {
    if (response.url().includes('api/register-office/treatment-cases?limit=20')) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await page.locator('q-table').isVisible();
  await expect(page.locator('tbody > tr')).toHaveCount(20);
  await page.locator('tbody > tr').first().click();
  await expect(page.locator('.BaseScrollArea > .q-scrollarea')).toHaveCount(2);
  page.on('response', (response) => {
    if (response.url().includes('api/medical-records/treatment-cases**')) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await expect(page.locator('.grow > .BaseScrollArea')).toHaveClass(['BaseScrollArea h-full w-full p-6']);
  await page.locator('[class="q-icon text-sanatorium-text notranslate material-icons"]').click();
  await page.locator(nameModules.Patients.myConsultation).click();
  await expect(page).toHaveURL(/my-consultations/);
  await page.getByRole('button', { name: 'Поиск' }).locator('visible=true').click();
  page.on('response', (response) => {
    if (response.url().includes('api/medical-records/treatment-cases/my-dispatched-consultations**')) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await page.locator('q-table').isVisible();
  await expect(page.locator('tbody > tr')).toHaveCount(20);
  await page.locator('tbody > tr').first().click();
  await expect(page.locator('.BaseScrollArea > .q-scrollarea')).toHaveCount(2);
  page.on('response', (response) => {
    if (response.url().includes('api/medical-records/treatment-cases**')) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await expect(page.locator('.grow > .BaseScrollArea')).toHaveClass(['BaseScrollArea h-full w-full p-6']);
  await page.locator('[class="q-icon text-sanatorium-text notranslate material-icons"]').click();
  await page.locator(nameModules.Patients.searchPatient).click();
  await expect(page).toHaveURL(/patients-search/);
  await page.getByRole('button', { name: 'Поиск', exact: true }).locator('visible=true').click();
  page.on('response', (response) => {
    if (response.url().includes('api/medical-records/treatment-cases/my-dispatched-consultations**')) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await page.locator('q-table').isVisible();
  await expect(page.locator('tbody > tr')).toHaveCount(20);
  await page.locator('tbody > tr').first().click();
  await expect(page.locator('.BaseScrollArea > .q-scrollarea')).toHaveCount(2);
  page.on('response', (response) => {
    if (response.url().includes('api/medical-records/treatment-cases**')) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await expect(page.locator('.grow > .BaseScrollArea')).toHaveClass(['BaseScrollArea h-full w-full p-6']);
  await page.locator('[class="q-icon text-sanatorium-text notranslate material-icons"]').click();
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
  await page.getByRole('button', { name: 'Поиск' }).locator('visible=true').click();
  page.on('response', (response) => {
    if (response.url().includes('api/release-control/procedures/search')) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await page.locator('q-table').isVisible();
  await expect(page.locator('tbody > tr')).toHaveClass('q-tr cursor-pointer');
  await expect(page.locator('.NotSelectedText > .text-lg')).toHaveText('Данные не выбраны');
  await expect(page.locator('.NotSelectedText > .mt-4')).toHaveText('Выберите пациента из списка, чтобы посмотреть подробную информацию');
  await page.locator('tbody > tr').first().click();
  page.on('response', (response) => {
    if (response.url().includes('api/release-control/procedures')) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await expect(page.locator('.ProcedureDetailsToRelease > .h-full > .flex')).toBeVisible();
  await page.locator(authorization.account).first().click();
  await page.getByText('Выйти').click();
  await expect(page).toHaveURL(/authorization/);
  await expect(page.locator('h1')).toContainText('Вход в систему');
});

test('Enter the Dispatching', async ({ page }) => {
  await page.locator(nameModules.Dispatching.moduleDispatching).click();
  await expect(page).toHaveURL(/dispatching/);
  await page.locator(nameModules.Dispatching.myPatient).click();
  await expect(page).toHaveURL(/my-patients/);
  await page.getByRole('button', { name: 'Поиск' }).locator('visible=true').click();
  page.on('response', (response) => {
    if (response.url().includes('api/dispatching')) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await page.locator('q-table').isVisible();
  await expect(page.locator('tbody > tr')).toHaveCount(20);
  await page.locator('tbody > tr').first().click();
  page.on('response', (response) => {
    if (response.url().includes('api/dispatching/treatment-cases')) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await expect(page.locator('.BaseScrollArea > .q-scrollarea')).toHaveCount(2);
  await expect(page.locator('.grow > .BaseScrollArea')).toHaveClass(['BaseScrollArea h-full w-full p-6']);
  await page.locator('[class="q-icon text-sanatorium-text notranslate material-icons"]').click();
  await page.locator(authorization.account).click();
  await page.getByText('Выйти').click();
  await expect(page).toHaveURL(/authorization/);
  await expect(page.locator('h1')).toContainText('Вход в систему');
});

test('Enter the Schedules', async ({ page }) => {
  await page.locator(nameModules.Schedules.moduleSchedules).click();
  await expect(page).toHaveURL(/schedules/);
  page.on('response', (response) => {
    if (response.url().includes('api/facilities/service-points')) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await expect(page.locator('.NoContentLayout > .text-grey-7')).toHaveText('Выберите расписание');
  await page.locator('path').first().click();
  await page.locator('vue-treeselect__list').isVisible();
  await page.locator('div:nth-child(8) > .vue-treeselect__option').first().click();
  page.on('response', (response) => {
    if (response.url().includes('/api/dispatching/service-points/schedules')) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await expect(page.locator('.w-full > .ScheduleCalendar')).toHaveClass(['ScheduleCalendar absolute inset-0']);
  await expect(page.locator('.q-scrollarea__content > .absolute > .NoContentLayout')).toBeVisible();
  await page.locator(authorization.account).click();
  await page.getByText('Выйти').click();
  await expect(page).toHaveURL(/authorization/);
  await expect(page.locator('h1')).toContainText('Вход в систему');
});

test('Enter the Laboratory', async ({ page }) => {
  await page.locator(nameModules.Laboratory.moduleLaboratory).click();
  await page.locator(nameModules.Laboratory.biomaterialSampling).click();
  await expect(page).toHaveURL(/biomaterial-sampling/);
  await page.getByRole('button', { name: 'Поиск' }).locator('visible=true').click();
  page.on('response', (response) => {
    if (response.url().includes('api/laboratory/biomaterial-taking')) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await expect(page.locator('.q-table__middle > .q-table')).toHaveClass(['q-table']);
  await page.locator(nameModules.Laboratory.resultsProcessing).click();
  await expect(page).toHaveURL(/results-processing/);
  await page.getByRole('button', { name: 'Поиск' }).locator('visible=true').click();
  page.on('response', (response) => {
    if (response.url().includes('api/laboratory')) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await expect(page.locator('.q-table__middle > .q-table')).toHaveClass(['q-table']);
  await page.locator(nameModules.Laboratory.advancedSearch).click();
  await expect(page).toHaveURL(/advanced-search/);
  await page.getByRole('button', { name: 'Поиск' }).locator('visible=true').click();
  await page.getByRole('button', { name: 'Поиск' }).locator('visible=true').click();
  page.on('response', (response) => {
    if (response.url().includes('api/laboratory/search')) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await expect(page.locator('.q-table__middle > .q-table')).toHaveClass(['q-table']);
  await page.locator(authorization.account).click();
  await page.getByText('Выйти').click();
  await expect(page).toHaveURL(/authorization/);
  await expect(page.locator('h1')).toContainText('Вход в систему');
});

test('Enter the Accounting', async ({ page }) => {
  await page.locator(nameModules.Accounting.moduleFiscals).click();
  await page.locator(nameModules.Accounting.Fiscals).click();
  await expect(page).toHaveURL(/fiscals/);
  page.on('response', (response) => {
    if (response.url().includes('api/accounting/fiscals')) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await expect(page.locator('.FiscalsCommands  > .flex > .flex > button')).toHaveCount(7, { timeout: 70000 });
  await page.locator(nameModules.Accounting.creditCardTerminals).click();
  page.on('response', (response) => {
    if (response.url().includes('api/accounting/fiscals')) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await expect(page).toHaveURL(/credit-card-terminals/);
  await expect(page.locator('.FiscalsCommands  > .flex > .flex > button')).toHaveCount(4, { timeout: 70000 });
  await page.locator(authorization.account).click();
  await page.getByText('Выйти').click();
  await expect(page).toHaveURL(/authorization/);
  await expect(page.locator('h1')).toContainText('Вход в систему');
});
