import '@testing-library/jest-dom';

class RO {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// @ts-ignore
global.ResizeObserver = RO
