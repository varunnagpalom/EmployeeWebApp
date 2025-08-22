import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'

// Mock data for testing
export const mockEmployees = [
  {
    id: 1,
    name: "John Doe",
    dateOfJoining: "2025-08-18T10:00:00.000+00:00",
    status: "ACTIVE",
    department: "IT",
    salary: 80000.0,
    managerId: 1
  },
  {
    id: 2,
    name: "Heman",
    dateOfJoining: "2025-08-18T10:00:00.000+00:00",
    status: "ACTIVE",
    department: "Marketing",
    salary: 20000.0,
    managerId: 2
  },
  {
    id: 3,
    name: "Spider Man",
    dateOfJoining: "2025-08-18T10:00:00.000+00:00",
    status: "ACTIVE",
    department: "Finance",
    salary: 120000.0,
    managerId: 1
  },
  {
    id: 4,
    name: "Joker",
    dateOfJoining: "2025-08-01T10:00:00.000+00:00",
    status: "NOT_ACTIVE",
    department: "Finance",
    salary: 120000.0,
    managerId: 1
  }
]

// Custom render function that includes router
export const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

// Mock fetch responses
export const mockFetchSuccess = (data, status = 200) => {
  fetch.mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(data),
  })
}

export const mockFetchError = (message = 'Server Error') => {
  fetch.mockRejectedValueOnce(new Error(message))
}

// Wait for async operations
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0))
