import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Import test utilities
import { 
  navigateToAgeVerification,
  navigateToCycleLength,
  navigateToPeriodDuration,
  renderResults,
  clearSessionStorage
} from './test-utils'

describe('Heavy Flow Menstrual Pattern Assessment Path', () => {
  // Set up user event
  const user = userEvent.setup()
  
  // Clear session storage after each test
  beforeEach(() => {
    clearSessionStorage()
  })
  
  afterEach(() => {
    clearSessionStorage()
  })
  
  it('should show heavy flow results when period duration is longer than typical', async () => {
    // Navigate through steps
    await navigateToAgeVerification(user, '18-24 years')
    await navigateToCycleLength(user, '26-30 days')
    await navigateToPeriodDuration(user, '8+ days')
    
    // Setup session storage for results page
    const sessionData = {
      age: '18-24 years',
      cycleLength: '26-30 days',
      periodDuration: '8+ days',
      flowLevel: 'Heavy'
    }
    
    // Render results page
    renderResults(sessionData)
    
    // Verify heading is present
    expect(screen.getByText(/Your Assessment Results/i)).toBeInTheDocument()
    
    // Verify heavy flow pattern (O2 in LogicTree)
    expect(screen.getByText('Your flow is heavier or longer than typical, which could impact your daily activities.')).toBeInTheDocument()
    
    // Check that metrics display correctly
    expect(screen.getAllByText('8+ days')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Heavy')[0]).toBeInTheDocument()
    
    // Check for heavy flow recommendations
    expect(screen.getByText('Iron-rich Foods', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('Stay Hydrated', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('Medical Evaluation', { exact: false })).toBeInTheDocument()
  })
  
  it('should show heavy flow results when flow level is heavy regardless of duration', async () => {
    // For this test, we'll skip navigation and just set session storage directly
    
    // Setup session storage for results page
    const sessionData = {
      age: '18-24 years',
      cycleLength: '26-30 days',
      periodDuration: '4-5 days', // Normal duration
      flowLevel: 'Heavy' // But heavy flow
    }
    
    // Render results page
    renderResults(sessionData)
    
    // Verify heading is present
    expect(screen.getByText(/Your Assessment Results/i)).toBeInTheDocument()
    
    // Verify heavy flow pattern (O2 in LogicTree)
    expect(screen.getByText('Your flow is heavier or longer than typical, which could impact your daily activities.')).toBeInTheDocument()
    
    // Check that metrics display correctly
    expect(screen.getAllByText('4-5 days')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Heavy')[0]).toBeInTheDocument()
    
    // Check for heavy flow recommendations
    expect(screen.getByText('Iron-rich Foods', { exact: false })).toBeInTheDocument()
  })
}) 