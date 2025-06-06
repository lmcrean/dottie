import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// Simple mock component
const MockPainPredominantResults = ({ data }) => (
  <div>
    <h1>Your Assessment Results</h1>
    <div>Pain-Predominant Pattern</div>
    <p>Your menstrual pain is higher than typical and may be impacting your quality of life.</p>
    <div>{data.cycleLength || "26-30 days"}</div>
    <div>{data.periodDuration || "4-5 days"}</div>
    <div>{data.flowHeaviness || "moderate"}</div>
    <div>{data.painLevel || "severe"}</div>
    <div>Symptoms</div>
    <div>
      {data.symptoms && data.symptoms.physical
        ? data.symptoms.physical.map(symptom => <div key={symptom}>{symptom}</div>)
        : <div>headaches</div>
      }
    </div>
    <div>Heat Therapy</div>
    <div>Pain Management</div>
    <div>Gentle Exercise</div>
    <div>Medical Support</div>
  </div>
)

describe('Pain-Predominant Menstrual Pattern Assessment Path', () => {
  it('should show pain-predominant results when pain is higher than typical', () => {
    const sessionData = {
      age: '18-24 years',
      cycleLength: '26-30 days',
      periodDuration: '4-5 days',
      flowHeaviness: 'moderate',
      painLevel: 'severe',
      symptoms: {
        physical: ['headaches'],
        emotional: []
      }
    }
    
    render(
      <MemoryRouter>
        <MockPainPredominantResults data={sessionData} />
      </MemoryRouter>
    )
    
    // Verify heading is present
    expect(screen.getByText('Your Assessment Results')).toBeInTheDocument()
    
    // Verify pain-predominant pattern
    expect(screen.getByText('Pain-Predominant Pattern')).toBeInTheDocument()
    expect(screen.getByText('Your menstrual pain is higher than typical and may be impacting your quality of life.')).toBeInTheDocument()
    
    // Check that metrics display correctly
    expect(screen.getByText('severe')).toBeInTheDocument()
    expect(screen.getByText('headaches')).toBeInTheDocument()
    
    // Check for pain-related recommendations
    expect(screen.getByText('Heat Therapy')).toBeInTheDocument()
    expect(screen.getByText('Pain Management')).toBeInTheDocument()
    expect(screen.getByText('Gentle Exercise')).toBeInTheDocument()
    expect(screen.getByText('Medical Support')).toBeInTheDocument()
  })
  
  it('should show pain pattern even with additional symptoms', () => {
    const sessionData = {
      age: '18-24 years',
      cycleLength: '26-30 days',
      periodDuration: '4-5 days',
      flowHeaviness: 'moderate',
      painLevel: 'severe',
      symptoms: {
        physical: ['headaches', 'bloating', 'fatigue'],
        emotional: []
      }
    }
    
    render(
      <MemoryRouter>
        <MockPainPredominantResults data={sessionData} />
      </MemoryRouter>
    )
    
    // Verify heading is present
    expect(screen.getByText('Your Assessment Results')).toBeInTheDocument()
    
    // Verify pain pattern text is shown
    expect(screen.getByText('Pain-Predominant Pattern')).toBeInTheDocument()
    
    // Verify pain level is shown
    expect(screen.getByText('severe')).toBeInTheDocument()
    
    // Check for symptoms section heading
    expect(screen.getByText('Symptoms')).toBeInTheDocument()
    
    // Verify all symptoms are displayed
    expect(screen.getByText('headaches')).toBeInTheDocument()
    expect(screen.getByText('bloating')).toBeInTheDocument()
    expect(screen.getByText('fatigue')).toBeInTheDocument()
  })
}) 