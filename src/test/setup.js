import '@testing-library/jest-dom'
import { vi, beforeEach } from 'vitest'

// Mock fetch globally for all tests
globalThis.fetch = vi.fn()

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000/',
    origin: 'http://localhost:3000',
    protocol: 'http:',
    host: 'localhost:3000',
    hostname: 'localhost',
    port: '3000',
    pathname: '/',
    search: '',
    hash: '',
    assign: vi.fn(),
    reload: vi.fn(),
  },
  writable: true,
})

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks()
  fetch.mockClear()
})
