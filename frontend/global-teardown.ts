/**
 * Global teardown utility for Playwright tests
 * This runs after all tests have completed
 */
async function globalTeardown() {
  console.log('🔄 Test is finished... tearing down servers');

  // Give a moment for any pending operations to complete
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log('✅ Teardown complete');

  // Exit the process to prevent terminal from getting stuck
  process.exit(0);
}

export default globalTeardown;
