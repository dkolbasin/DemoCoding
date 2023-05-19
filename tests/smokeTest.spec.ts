import { test, expect } from '@playwright/test';
import { redirectUrl } from './urls';
import { authorization, logIn } from './shared-selectors/authorizationSelectors';
import { nameModules } from './shared-selectors/modulesSelectors';

let searchButton;
let recordNoPatient;
let titlePagePatient;
let baseAreaRecordNo;
let closeRecordNo;
let baseSectionAddRecordNo;
let scrollContentPatient;
let patientList;
let tablePatient;

const requestSearchRegistryUrl = 'api/register-office/treatment-cases';
const requestSearchPatientUrl = '/api/medical-records/treatment-cases';
const requestSearchReleaseControlUrl = 'api/release-control/procedures';
const requestSearchDispatchinglUrl = 'api/dispatching';
const requestSearchLaboratory = 'api/laboratory';
const requestSearchAccounting = 'api/accounting/fiscals';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/authorization/);
  await logIn(page, authorization.correctLogin, authorization.correctPassword);
  await expect(page).toHaveURL(redirectUrl);
  searchButton = await page.getByRole('button', { name: 'Поиск' });
  recordNoPatient = await page.locator('.tabulator-row');
  titlePagePatient = await page.locator('.TitlePage > div');
  scrollContentPatient = await page.locator('[class="q-scrollarea__content absolute"]');
  baseAreaRecordNo = await page.locator('.BaseScrollArea > .q-scrollarea');
  closeRecordNo = await page.locator('[class="q-icon text-sanatorium-text notranslate material-icons"]');
  baseSectionAddRecordNo = await page.locator('.BaseSection');
  patientList = await page.locator('.tabulator-table');
  tablePatient = await page.locator('[class="q-table"]');
});

test('Enter the registry', async ({ page }) => {
  await page.locator(nameModules.Registry.moduleRegistry).click();
  await page.locator(nameModules.Registry.searchPatient).click();
  await expect(page).toHaveURL(/registration\/patients-search/);
  await searchButton.locator('visible=true').click();
  page.on('response', (response) => {
    if (response.url().includes(requestSearchRegistryUrl)) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await patientList.isVisible();
  await expect(recordNoPatient).toHaveCount(20);
  await recordNoPatient.first().click();
  await titlePagePatient.isVisible();
  await scrollContentPatient.first().isVisible();
  await expect(baseAreaRecordNo).toHaveCount(2);
  page.on('response', (response) => {
    if (response.url().includes(requestSearchRegistryUrl)) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await closeRecordNo.click();
  await page.getByRole('button', { name: 'Добавить историю болезни' }).click();
  page.on('response', (response) => {
    if (response.url().includes(requestSearchRegistryUrl)) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await baseSectionAddRecordNo.first().isVisible();
  await baseSectionAddRecordNo.nth(1).isVisible();
  await baseSectionAddRecordNo.nth(2).isVisible();
  await baseSectionAddRecordNo.nth(3).isVisible();
  await expect(baseSectionAddRecordNo).toHaveCount(4);
  await page.getByRole('link', { name: 'Поиск пациентов' }).click();
  await page.getByRole('button', { name: 'Добавить амбулаторную карту' }).click();

  page.on('response', (response) => {
    if (response.url().includes(requestSearchRegistryUrl)) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await baseSectionAddRecordNo.first().isVisible();
  await baseSectionAddRecordNo.nth(1).isVisible();
  await baseSectionAddRecordNo.nth(2).isVisible();
  await baseSectionAddRecordNo.nth(3).isVisible();
  await expect(baseSectionAddRecordNo).toHaveCount(4);
  await page.getByRole('link', { name: 'Поиск пациентов' }).click();
  await page.locator(authorization.account).click();
  await page.getByText('Выйти').click();
  await expect(page).toHaveURL(/authorization/);
  await expect(page.locator('h1')).toContainText('Вход в систему');
});

//https://youtrack.quirco.com/issue/SW-2025 - баг при открытии ИБ из вкладки "Мои консультации", а после её закрытия (ИБ), то перебрасывает на вкладку "Мои пациенты"
test('Enter the Patient', async ({ page }) => {
  await page.locator(nameModules.Patients.myPatient).click();
  await expect(page).toHaveURL(/treatment-cases\/my-patients/);
  await searchButton.locator('visible=true').click();
  page.on('response', (response) => {
    if (response.url().includes(requestSearchPatientUrl)) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await patientList.isVisible();
  await expect(recordNoPatient).toHaveCount(20);
  await recordNoPatient.first().click();
  await scrollContentPatient.first().isVisible();
  await titlePagePatient.isVisible();
  await expect(baseAreaRecordNo).toHaveCount(2);
  page.on('response', (response) => {
    if (response.url().includes(requestSearchPatientUrl)) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await closeRecordNo.click();
  await expect(page).toHaveURL(/treatment-cases\/my-patients/);
  await page.locator(nameModules.Patients.myConsultation).click();
  await expect(page).toHaveURL(/treatment-cases\/my-consultations/);
  await searchButton.locator('visible=true').click();
  page.on('response', (response) => {
    if (response.url().includes(requestSearchPatientUrl)) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await patientList.isVisible();
  await expect(recordNoPatient).toHaveCount(20);
  await recordNoPatient.first().click();
  await scrollContentPatient.first().isVisible();
  await titlePagePatient.isVisible();
  await expect(baseAreaRecordNo).toHaveCount(2);
  page.on('response', (response) => {
    if (response.url().includes(requestSearchPatientUrl)) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await closeRecordNo.click();
  //await expect(page).toHaveURL(/treatment-cases\/my-consultations/);
  await page.locator(nameModules.Patients.searchPatient).click();
  await expect(page).toHaveURL(/treatment-cases\/patients-search/);
  await searchButton.locator('visible=true').click();
  page.on('response', (response) => {
    if (response.url().includes(requestSearchPatientUrl)) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await patientList.isVisible();
  await expect(recordNoPatient).toHaveCount(20);
  await recordNoPatient.first().click();
  await scrollContentPatient.first().isVisible();
  await titlePagePatient.isVisible();
  await expect(baseAreaRecordNo).toHaveCount(2);
  page.on('response', (response) => {
    if (response.url().includes(requestSearchPatientUrl)) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await closeRecordNo.click();
  //await expect(page).toHaveURL(/treatment-cases\/patients-search/);
  await page.locator(authorization.account).click();
  await page.getByText('Выйти').click();
  await expect(page).toHaveURL(/authorization/);
  await expect(page.locator('h1')).toContainText('Вход в систему');
});

test('Enter the Release Control', async ({ page }) => {
  const havePatietnToTable = await page.locator('[class="q-tr cursor-pointer"]');
  const notDisplayedPatietnData = await page.locator('[class="text-lg"]');
  const needChoosePatient = await page.locator('[class="mt-4 w-[250px]"]');
  let procedureDetailsToRelease = await page.locator('[class="flex h-full flex-col"]');

  await page.locator(nameModules.releaseControl.moduleReleaseControl).click();
  await expect(page).toHaveURL(/release-control/);
  await page.locator(nameModules.releaseControl.Procedures).click();
  await expect(page).toHaveURL(/release-control\/procedures/);
  await searchButton.locator('visible=true').click();
  page.on('response', (response) => {
    if (response.url().includes(requestSearchReleaseControlUrl)) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await tablePatient.isVisible();
  await havePatietnToTable.first().isVisible();
  await expect(notDisplayedPatietnData).toHaveText('Данные не выбраны');
  await expect(needChoosePatient).toHaveText('Выберите пациента из списка, чтобы посмотреть подробную информацию');
  await havePatietnToTable.first().click();
  page.on('response', (response) => {
    if (response.url().includes(requestSearchReleaseControlUrl)) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await procedureDetailsToRelease.isVisible();
  await page.locator(authorization.account).first().click();
  await page.getByText('Выйти').click();
  await expect(page).toHaveURL(/authorization/);
  await expect(page.locator('h1')).toContainText('Вход в систему');
});

test('Enter the Dispatching', async ({ page }) => {
  const scrollContentPatientDispatching = await page.locator('[class="q-scrollarea__container scroll relative-position fit hide-scrollbar"]');
  await page.locator(nameModules.Dispatching.moduleDispatching).click();
  await expect(page).toHaveURL(/dispatching/);
  await page.locator(nameModules.Dispatching.myPatient).click();
  await expect(page).toHaveURL(/dispatching\/my-patients/);
  await searchButton.locator('visible=true').click();
  page.on('response', (response) => {
    if (response.url().includes(requestSearchDispatchinglUrl)) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await patientList.isVisible();
  await expect(recordNoPatient).toHaveCount(20);
  await recordNoPatient.first().click();
  page.on('response', (response) => {
    if (response.url().includes(requestSearchDispatchinglUrl)) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await scrollContentPatient.first().isVisible();
  //не получается проверить левую часть на ИБ
  await expect(baseAreaRecordNo).toHaveCount(2);
  await closeRecordNo.click();
  await page.locator(authorization.account).click();
  await page.getByText('Выйти').click();
  await expect(page).toHaveURL(/authorization/);
  await expect(page.locator('h1')).toContainText('Вход в систему');
});

test('Enter the Schedules', async ({ page }) => {
  const requestSearchFacilitiesScheduleslUrl = 'api/facilities/service-points';
  const requestSearchScheduleslUrl = '/api/dispatching/service-points/schedules';

  const ChooseSchedule = '[class="text-grey-7 text-base"]';
  const openSchedule = await page.locator('div > .vue-treeselect__option');
  const openGroupSchedule = await page.locator('path');
  const listScheduleOfGroup = await page.locator('[class="vue-treeselect__list"]');
  const displayedSchedule = await page.locator('.w-full > .ScheduleCalendar');
  await page.locator(nameModules.Schedules.moduleSchedules).click();
  await expect(page).toHaveURL(/schedules/);
  page.on('response', (response) => {
    if (response.url().includes(requestSearchFacilitiesScheduleslUrl)) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await expect(page.locator(ChooseSchedule)).toHaveText('Выберите расписание');
  await openGroupSchedule.first().click();
  await listScheduleOfGroup.last().isVisible();
  await openSchedule.nth(8).click();
  page.on('response', (response) => {
    if (response.url().includes(requestSearchScheduleslUrl)) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await displayedSchedule.isVisible();
  await page.locator(authorization.account).click();
  await page.getByText('Выйти').click();
  await expect(page).toHaveURL(/authorization/);
  await expect(page.locator('h1')).toContainText('Вход в систему');
});

test('Enter the Laboratory', async ({ page }) => {
  await page.locator(nameModules.Laboratory.moduleLaboratory).click();
  await expect(page).toHaveURL(/laboratory/);
  await page.locator(nameModules.Laboratory.biomaterialSampling).click();
  await expect(page).toHaveURL(/laboratory\/biomaterial-sampling/);
  await searchButton.locator('visible=true').click();
  page.on('response', (response) => {
    if (response.url().includes(requestSearchLaboratory)) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await patientList.isVisible();
  await page.locator(nameModules.Laboratory.resultsProcessing).click();
  await expect(page).toHaveURL(/laboratory\/results-processing/);
  await searchButton.locator('visible=true').click();
  page.on('response', (response) => {
    if (response.url().includes(requestSearchLaboratory)) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await patientList.isVisible();
  await page.locator(nameModules.Laboratory.advancedSearch).click();
  await expect(page).toHaveURL(/laboratory\/advanced-search/);
  await searchButton.locator('visible=true').click();
  page.on('response', (response) => {
    if (response.url().includes(requestSearchLaboratory)) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await patientList.isVisible();
  await page.locator(authorization.account).click();
  await page.getByText('Выйти').click();
  await expect(page).toHaveURL(/authorization/);
  await expect(page.locator('h1')).toContainText('Вход в систему');
});

test('Enter the Accounting', async ({ page }) => {
  const buttonFiscalsCommands = await page.locator('.FiscalsCommands  > .flex > .flex > button');
  await page.locator(nameModules.Accounting.moduleFiscals).click();
  await page.locator(nameModules.Accounting.Fiscals).click();
  await expect(page).toHaveURL(/fiscals/);
  page.on('response', (response) => {
    if (response.url().includes(requestSearchAccounting)) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await buttonFiscalsCommands.first().isVisible();
  await buttonFiscalsCommands.nth(1).isVisible();
  await buttonFiscalsCommands.nth(2).isVisible();
  await buttonFiscalsCommands.nth(3).isVisible();
  await buttonFiscalsCommands.nth(4).isVisible();
  await buttonFiscalsCommands.nth(5).isVisible();
  await buttonFiscalsCommands.nth(6).isVisible();
  await page.locator(nameModules.Accounting.creditCardTerminals).click();
  page.on('response', (response) => {
    if (response.url().includes(requestSearchAccounting)) {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    }
  });
  await expect(page).toHaveURL(/accounting\/credit-card-terminals/);
  await buttonFiscalsCommands.first().isVisible();
  await buttonFiscalsCommands.nth(1).isVisible();
  await buttonFiscalsCommands.nth(2).isVisible();
  await buttonFiscalsCommands.nth(3).isVisible();
  await page.locator(authorization.account).click();
  await page.getByText('Выйти').click();
  await expect(page).toHaveURL(/authorization/);
  await expect(page.locator('h1')).toContainText('Вход в систему');
});
