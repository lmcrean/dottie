import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AssessmentResultProvider } from '@/src/pages/assessment/steps/context/AssessmentResultProvider'
import { useAssessmentContext } from '@/src/pages/assessment/steps/context/hooks/use-assessment-context'
import ResultsPage from '@/src/pages/assessment/detail/page'
import React from 'react'
import { AuthProvider } from '@/src/pages/auth/context/AuthContextProvider'

describe('Regular Menstrual Cycle Assessment Path', () => {
  // Clear mocks after each test
  afterEach(() => {
    vi.restoreAllMocks()
  })
  
  it('should show regular cycle results', async () => {
    // Create a wrapper component that will set the assessment data
    const TestWrapper = () => {
      const { setResult } = useAssessmentContext()
      
      // Set data in context on mount
      React.useEffect(() => {
        const mockData = {
          age: '18-24 years',
          cycle_length: '26-30 days',
          period_duration: '4-5 days',
          flow_heaviness: 'moderate',
          pain_level: 'mild',
          physical_symptoms: ['fatigue'],
          emotional_symptoms: [],
          pattern: 'regular'
        }
        
        setResult(mockData)
      }, [setResult])
      
      return <ResultsPage />
    }
    
    // Render with necessary providers
    render(
      <AuthProvider>
        <AssessmentResultProvider>
          <MemoryRouter initialEntries={['/assessment/results?new=true']}>
            <TestWrapper />
          </MemoryRouter>
        </AssessmentResultProvider>
      </AuthProvider>
    )
    
    // Wait for results to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading assessment details/i)).not.toBeInTheDocument()
    }, { timeout: 3000 })
    
    // Now verify that the results are displayed
    expect(screen.getByText(/Your Assessment Results/i)).toBeInTheDocument()
    
    // Verify regular cycle pattern text appears
    expect(screen.getByText(/normal, healthy pattern/i)).toBeInTheDocument()
    
    // Check for regular cycle recommendations
    expect(screen.getByText(/Track Your Cycle/i)).toBeInTheDocument()
  })
}) 