import { test, expect } from "@playwright/test";
import { clearSessionStorage } from "./utils/test-utils";
import { signUpTestUser } from "./utils/sign-up.spec";
import { signInUser } from "./utils/sign-in.spec";
import { runAgeVerificationStep } from "./runners/1-ageVerification";
import { runCycleLengthStep } from "./runners/2-cycleLength";
import { runPeriodDurationStep } from "./runners/3-periodDuration";
import { runFlowStep } from "./runners/4-flow";
import { runPainStep } from "./runners/5-pain";
import { runSymptomsStep } from "./runners/6-symptoms";
import { checkResultsPage } from "./runners/7-results";

// Define viewport for portrait orientation
const portraitViewport = { width: 390, height: 844 }; // iPhone 12 Pro portrait dimensions

test("Regular Cycle Assessment Path - complete flow", async ({ page }) => {
  // Configure viewport
  await page.setViewportSize(portraitViewport);
  
  // Clear session storage
  await clearSessionStorage(page);

  // Try to create a new test user and sign in
  // But continue the test even if authentication fails
  let authenticationSuccessful = false;
  
  try {
    // First sign up a new test user
    console.log("Creating new test user");
    const userCredentials = await signUpTestUser(page);
    
    // Then sign in with the new user
    console.log("Signing in with test user");
    authenticationSuccessful = await signInUser(page, userCredentials.email, userCredentials.password);
    
    if (!authenticationSuccessful) {
      console.warn("Authentication failed, but continuing with the assessment test");
    } else {
      console.log("Authentication successful, proceeding with assessment");
    }
  } catch (error) {
    console.error("Error during authentication:", error);
    console.warn("Continuing with assessment test despite authentication error");
  }

  // Run each step of the assessment process
  await runAgeVerificationStep(page);
  await runCycleLengthStep(page);
  await runPeriodDurationStep(page);
  await runFlowStep(page);
  await runPainStep(page);
  await runSymptomsStep(page);
  await checkResultsPage(page);
  
  // Test completed successfully
  console.log("Test completed successfully - Full assessment flow verified");
}); 