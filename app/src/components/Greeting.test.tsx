import { render, screen } from '@testing-library/react';
import { Greeting } from './Greeting';
import I18nProvider from './I18nProvider';

test('renders greeting', async () => {
  render(
    <I18nProvider lng="en">
      <Greeting name="Test" />
    </I18nProvider>
  );
  expect(await screen.findByText('Hello Test')).toBeInTheDocument();
});
