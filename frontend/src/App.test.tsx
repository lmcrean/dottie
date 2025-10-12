import { describe, it, expect, beforeAll, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'
import { AuthProvider } from '@/src/pages/auth/context/AuthContextProvider'
import { AssessmentResultProvider } from '@/src/pages/assessment/steps/context/AssessmentResultProvider'

// Mock browser APIs which are not available in test environment
beforeAll(() => {
  // Mock IntersectionObserver
  ;(globalThis as typeof globalThis & { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    takeRecords() { return [] }
    unobserve() {}
  }

  // Mock ResizeObserver
  ;(globalThis as typeof globalThis & { ResizeObserver: typeof ResizeObserver }).ResizeObserver = class ResizeObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  }

  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })

  // Mock window.scrollTo
  window.scrollTo = vi.fn()
})

// Helper to render App with all required providers
const renderApp = () => {
  return render(
    <AuthProvider>
      <AssessmentResultProvider>
        <App />
      </AssessmentResultProvider>
    </AuthProvider>
  )
}

describe('App', () => {
  it('renders the landing page by default', () => {
    renderApp()
    expect(screen.getByText(/Your Personal/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Menstrual Health/)
  })

  it('renders sign-in and sign-up links', () => {
    renderApp()
    expect(screen.getByText(/Start Your Journey/i)).toBeInTheDocument()
    const signInLinks = screen.getAllByText(/Sign In/i)
    expect(signInLinks.length).toBeGreaterThan(0)
  })

  it('renders feature descriptions', () => {
    renderApp()
    expect(screen.getByText(/Track Your Cycle/i)).toBeInTheDocument()
    expect(screen.getByText(/Get Personalized Insights/i)).toBeInTheDocument()
    expect(screen.getByText(/Stay Informed/i)).toBeInTheDocument()
  })
}) 
