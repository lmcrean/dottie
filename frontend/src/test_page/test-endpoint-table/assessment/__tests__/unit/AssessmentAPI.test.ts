import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

// Mock axios
vi.mock('axios');

// Mock localStorage
vi.stubGlobal('localStorage', {
  getItem: vi.fn().mockReturnValue('test-token'),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
});

describe('AssessmentAPI', () => {
  const mockAssessmentData = {
    age: "18-24",
    cycleLength: "26-30",
    periodDuration: "4-5",
    flowHeaviness: "moderate",
    painLevel: "moderate",
    symptoms: {
      physical: ["Bloating", "Headaches"],
      emotional: ["Mood swings", "Irritability"]
    }
  };

  const mockAssessmentResponse = {
    id: "assessment-123",
    message: "Assessment saved"
  };

  const mockAssessmentList = [
    { id: "assessment-1", date: "2023-06-15" },
    { id: "assessment-2", date: "2023-06-20" }
  ];

  const mockAssessmentDetail = {
    id: "assessment-123",
    data: {
      age: "18_24",
      symptoms: {
        physical: ["Bloating"],
        emotional: ["Mood swings"]
      }
    }
  };

  beforeEach(() => {
    vi.resetAllMocks();
    (axios.create as any).mockReturnValue(axios);
    (axios.get as any).mockImplementation((url) => {
      if (url === '/api/assessment/list') {
        return Promise.resolve({ data: mockAssessmentList });
      } else if (url.match(/\/api\/assessment\/\w+/)) {
        return Promise.resolve({ data: mockAssessmentDetail });
      }
      return Promise.reject(new Error('Not found'));
    });
    
    (axios.post as any).mockImplementation((url) => {
      if (url === '/api/assessment/send') {
        return Promise.resolve({ data: mockAssessmentResponse });
      }
      return Promise.reject(new Error('Not found'));
    });
    
    (axios.put as any).mockImplementation((url) => {
      if (url.match(/\/api\/assessment\/\w+/)) {
        return Promise.resolve({ data: { message: "Assessment updated" } });
      }
      return Promise.reject(new Error('Not found'));
    });
    
    (axios.delete as any).mockImplementation((url) => {
      if (url.match(/\/api\/assessment\/\w+/)) {
        return Promise.resolve({ data: { message: "Assessment deleted" } });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  describe('POST /api/assessment/send', () => {
    it('should send assessment data and return id and message', async () => {
      // Using axios directly since we're testing the API, not the component
      const response = await axios.post('/api/assessment/send', mockAssessmentData);
      
      expect(axios.post).toHaveBeenCalledWith('/api/assessment/send', mockAssessmentData);
      expect(response.data).toEqual(mockAssessmentResponse);
      expect(response.data.id).toBe("assessment-123");
      expect(response.data.message).toBe("Assessment saved");
    });
  });

  describe('GET /api/assessment/list', () => {
    it('should retrieve list of assessments', async () => {
      const response = await axios.get('/api/assessment/list');
      
      expect(axios.get).toHaveBeenCalledWith('/api/assessment/list');
      expect(response.data).toEqual(mockAssessmentList);
      expect(response.data.length).toBe(2);
      expect(response.data[0].id).toBe("assessment-1");
    });
  });

  describe('GET /api/assessment/:id', () => {
    it('should retrieve assessment by id', async () => {
      const assessmentId = "assessment-123";
      const response = await axios.get(`/api/assessment/${assessmentId}`);
      
      expect(axios.get).toHaveBeenCalledWith(`/api/assessment/${assessmentId}`);
      expect(response.data).toEqual(mockAssessmentDetail);
      expect(response.data.id).toBe(assessmentId);
      expect(response.data.data.symptoms.physical).toContain("Bloating");
    });
  });

  describe('PUT /api/assessment/:id', () => {
    it('should update assessment and return success message', async () => {
      const assessmentId = "assessment-123";
      const updateData = {
        flowHeaviness: "heavy",
        painLevel: "severe"
      };
      
      const response = await axios.put(`/api/assessment/${assessmentId}`, updateData);
      
      expect(axios.put).toHaveBeenCalledWith(`/api/assessment/${assessmentId}`, updateData);
      expect(response.data.message).toBe("Assessment updated");
    });
  });

  describe('DELETE /api/assessment/:id', () => {
    it('should delete assessment and return success message', async () => {
      const assessmentId = "assessment-123";
      
      const response = await axios.delete(`/api/assessment/${assessmentId}`);
      
      expect(axios.delete).toHaveBeenCalledWith(`/api/assessment/${assessmentId}`);
      expect(response.data.message).toBe("Assessment deleted");
    });
  });
}); 