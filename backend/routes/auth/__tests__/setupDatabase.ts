// Global setup file for Vitest
// TODO: Fix empty import

// Export an async setup function that will be called by Vitest
export async function setup() {
  const success = await initTestDatabase();

  if (!success) {
    console.error("Failed to initialize test database!");
    process.exit(1);
  }
}

