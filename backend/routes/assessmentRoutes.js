import express from "express";
import {
  startAssessment,
  submitAnswer,
  getResults,
} from "../controllers/assessmentController.js";

const router = express.Router();

// Add logging middleware
router.use((req, res, next) => {
  console.log(`Assessment route: ${req.method} ${req.path}`);
  
  // For PUT and DELETE requests, log the request body
  if (req.method === 'PUT' || req.method === 'DELETE') {
    console.log(`${req.method} ${req.originalUrl}`);
    console.log('Body:', req.body);
  }
  
  next();
});

// Simple in-memory store for testing assessments
const assessments = [];

// Middleware to verify JWT token (simplified version)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  // In a real implementation, you would verify the token
  // and attach the user data to the request
  try {
    // Try to decode the token to get the user ID
    const decoded = token.split('.')[1];
    const payload = JSON.parse(Buffer.from(decoded, 'base64').toString());
    req.user = { id: payload.id || '123' };
  } catch (error) {
    console.error("Token decode error:", error);
    // Default fallback
    req.user = { id: '123' };
  }
  
  next();
};

// Routes for assessment
router.post("/start", startAssessment);
router.post("/answer", submitAnswer);
router.get("/results/:assessmentId", getResults);

// New routes from README
// Send assessment results from frontend
router.post("/send", authenticateToken, (req, res) => {
  try {
    const { assessmentData } = req.body;
    
    // Validate assessment data
    if (!assessmentData) {
      return res.status(400).json({ error: 'Assessment data is required' });
    }
    
    // Generate a new assessment ID
    const id = `assessment-${Date.now()}`;
    
    // Create the assessment object
    const assessment = { 
      id,
      userId: req.user.id,
      createdAt: new Date().toISOString(),
      assessmentData
    };
    
    // Store in memory
    assessments.push(assessment);
    
    res.status(201).json(assessment);
  } catch (error) {
    console.error('Error sending assessment:', error);
    res.status(500).json({ error: 'Failed to send assessment' });
  }
});

// Get list of all assessments for current user
router.get("/list", authenticateToken, (req, res) => {
  try {
    // Filter assessments by user ID
    const userAssessments = assessments.filter(a => a.userId === req.user.id);
    res.json(userAssessments);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({ error: 'Failed to fetch assessments' });
  }
});

// Get detailed view of a specific assessment
router.get("/:id", authenticateToken, (req, res) => {
  try {
    const assessmentId = req.params.id;
    
    // Find the assessment by ID
    const assessment = assessments.find(a => a.id === assessmentId);
    
    if (!assessment) {
      // If not found in memory, return a mock assessment
      return res.json({
        id: assessmentId,
        userId: req.user.id,
        createdAt: new Date().toISOString(),
        assessmentData: {
          age: "18_24",
          cycleLength: "26_30",
          periodDuration: "4_5",
          flowHeaviness: "moderate",
          painLevel: "moderate",
          symptoms: {
            physical: ["Bloating", "Headaches"],
            emotional: ["Mood swings", "Irritability"]
          },
          recommendations: [
            {
              title: "Track Your Cycle",
              description: "Keep a record of when your period starts and stops to identify patterns."
            },
            {
              title: "Pain Management",
              description: "Over-the-counter pain relievers like ibuprofen can help with cramps."
            }
          ]
        }
      });
    }
    
    res.json(assessment);
  } catch (error) {
    console.error('Error fetching assessment:', error);
    res.status(500).json({ error: 'Failed to fetch assessment' });
  }
});

// Update a specific assessment
router.put("/update/:id", authenticateToken, (req, res) => {
  try {
    const assessmentId = req.params.id;
    const { assessmentData } = req.body;
    
    console.log(`PUT /api/assessment/update/${assessmentId} - checking`);
    
    // Find the assessment by ID
    const assessmentIndex = assessments.findIndex(a => a.id === assessmentId);
    
    if (assessmentIndex === -1) {
      console.log(`PUT /api/assessment/update/${assessmentId} - not found`);
      return res.status(404).json({ error: 'Assessment not found' });
    }
    
    // Check if the assessment belongs to the user
    if (assessments[assessmentIndex].userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: Cannot update other users assessments' });
    }
    
    // Update the assessment
    assessments[assessmentIndex] = {
      ...assessments[assessmentIndex],
      assessmentData,
      updatedAt: new Date().toISOString()
    };
    
    res.json(assessments[assessmentIndex]);
  } catch (error) {
    console.error('Error updating assessment:', error);
    res.status(500).json({ error: 'Failed to update assessment' });
  }
});

// Delete a specific assessment
router.delete("/delete/:id", authenticateToken, (req, res) => {
  try {
    const assessmentId = req.params.id;
    
    console.log(`DELETE /api/assessment/delete/${assessmentId} - checking`);
    
    // Find the assessment by ID
    const assessmentIndex = assessments.findIndex(a => a.id === assessmentId);
    
    if (assessmentIndex === -1) {
      console.log(`DELETE /api/assessment/delete/${assessmentId} - not found`);
      return res.status(404).json({ error: 'Assessment not found' });
    }
    
    // Check if the assessment belongs to the user
    if (assessments[assessmentIndex].userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: Cannot delete other users assessments' });
    }
    
    // Remove the assessment
    assessments.splice(assessmentIndex, 1);
    
    res.json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assessment:', error);
    res.status(500).json({ error: 'Failed to delete assessment' });
  }
});

export default router;
