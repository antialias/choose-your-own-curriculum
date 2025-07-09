import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tooltip } from './Tooltip'

class RO {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// @ts-expect-error jsdom lacks ResizeObserver
global.ResizeObserver = RO

it('shows tooltip on hover', async () => {
  const user = userEvent.setup()
  render(
    <Tooltip content="info">
      <span>trigger</span>
    </Tooltip>
  )
  await user.hover(screen.getByText('trigger'))
  const items = await screen.findAllByText('info')
  expect(items.length).toBeGreaterThan(0)
})
