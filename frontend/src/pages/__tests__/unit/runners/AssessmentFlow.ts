// Assessment Flow Test Runner

// Define types for our state
export interface AssessmentData {
  age: number;
  cycleLength: number;
  periodDuration: number;
  flowHeaviness: string;
  painLevel: string;
  symptoms: string[];
}

export interface AppState {
  username: string;
  email: string;
  password: string;
  assessmentData: AssessmentData;
  userId?: string;
  authToken?: string;
  assessmentIds?: string[];
}

interface MockPage {
  goto: (url: string) => Promise<void>;
  click: (selector: string) => Promise<void>;
  fill: (selector: string, value: string) => Promise<void>;
  waitForURL: (url: string | RegExp) => Promise<void>;
  waitForSelector: (selector: string) => Promise<void>;
  waitForNetworkIdle: () => Promise<void>;
  isVisible: (selector: string) => Promise<boolean>;
  url: () => string;
  evaluate: (fn: () => any) => Promise<any>;
}

export async function runAssessmentFlow(page: MockPage, state: AppState): Promise<AppState> {

  
  // Go through assessment steps
  await page.goto('/assessment/start');
  await page.waitForNetworkIdle();
  
  // Age verification
  await page.fill('input[name="age"]', String(state.assessmentData.age));
  await page.click('button[type="submit"]');
  await page.waitForNetworkIdle();
  
  // Cycle length
  await page.fill('input[name="cycleLength"]', String(state.assessmentData.cycleLength));
  await page.click('button[type="submit"]');
  await page.waitForNetworkIdle();
  
  // Period duration
  await page.fill('input[name="periodDuration"]', String(state.assessmentData.periodDuration));
  await page.click('button[type="submit"]');
  await page.waitForNetworkIdle();
  
  // Flow heaviness
  await page.click(`[data-testid="flow-${state.assessmentData.flowHeaviness}"]`);
  await page.click('button[type="submit"]');
  await page.waitForNetworkIdle();
  
  // Pain level
  await page.click(`[data-testid="pain-${state.assessmentData.painLevel}"]`);
  await page.click('button[type="submit"]');
  await page.waitForNetworkIdle();
  
  // Symptoms
  for (const symptom of state.assessmentData.symptoms) {
    await page.click(`[data-testid="symptom-${symptom}"]`);
  }
  await page.click('button[type="submit"]');
  await page.waitForNetworkIdle();
  
  // Verify results page is displayed
  await page.waitForURL('**/results');
  
  // Save results to database
  await page.click('[data-testid="save-results-button"]');
  await page.waitForNetworkIdle();
  
  // View results ID
  await page.waitForSelector('[data-testid="results-id"]');
  const resultsId = await page.evaluate(() => {
    const element = document.querySelector('[data-testid="results-id"]');
    return element ? element.textContent : null;
  });
  
  // View results list
  await page.goto('/results/list');
  await page.waitForNetworkIdle();
  await page.waitForSelector('[data-testid="results-list-item"]');
  

  
  return {
    ...state,
    assessmentIds: [resultsId as string]
  };
} 