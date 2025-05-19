import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Import test utilities
import { 
  renderResults,
  clearSessionStorage
} from './test-utils'

describe('Regular Menstrual Cycle Assessment Path', () => {
  // Set up user event
  const user = userEvent.setup()
  
  // Clear session storage after each test
  beforeEach(() => {
    clearSessionStorage()
  })
  
  afterEach(() => {
    clearSessionStorage()
  })
  
  it('should show regular cycle results', async () => {
    // Setup session storage for results page
    const sessionData = {
      age: '18-24 years',
      cycleLength: '26-30 days',
      periodDuration: '4-5 days',
      flowLevel: 'Moderate',
      painLevel: 'Mild',
      symptoms: ['Fatigue']
    }
    
    // Render results page directly
    renderResults(sessionData)
    
    // Wait for results to load
    await waitFor(() => {
      // Verify heading is present
      expect(screen.queryByText(/Your Assessment Results/i, { exact: false })).toBeInTheDocument()
    }, { timeout: 5000 })
    
    // Verify regular cycle pattern (O4 in LogicTree)
    expect(screen.getByText(/normal, healthy pattern/i, { exact: false })).toBeInTheDocument()
    
    // Check that metrics display correctly
    expect(screen.getAllByText(/26-30 days/i, { exact: false })[0]).toBeInTheDocument()
    expect(screen.getAllByText(/4-5 days/i, { exact: false })[0]).toBeInTheDocument()
    expect(screen.getAllByText(/Moderate/i, { exact: false })[0]).toBeInTheDocument()
    expect(screen.getAllByText(/Mild/i, { exact: false })[0]).toBeInTheDocument()
    expect(screen.getAllByText(/Fatigue/i, { exact: false })[0]).toBeInTheDocument() // Check selected symptom
    
    // Check for regular cycle recommendations
    expect(screen.getByText(/Track Your Cycle/i, { exact: false })).toBeInTheDocument()
    expect(screen.getByText(/Exercise Regularly/i, { exact: false })).toBeInTheDocument()
  })
}) 