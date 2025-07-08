import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import I18nProvider from './components/I18nProvider';
import { initI18next } from './i18n';

export async function renderWithI18n(ui: ReactElement) {
  const i18n = await initI18next('en');
  return render(<I18nProvider i18n={i18n}>{ui}</I18nProvider>);
}
