/**
 * Setup Workflow Scenarios for Production Testing
 * 
 * Tests all setup endpoints to verify system health and database connectivity
 * Uses lenient error handling for production environment
 */

import { testHealthHello } from '../setup/testHealthHello.js';
import { testDatabaseHello } from '../setup/testDatabaseHello.js';
import { testDatabaseStatus } from '../setup/testDatabaseStatus.js';

/**
 * Complete setup workflow test for production
 * Tests all setup endpoints with production-appropriate error handling
 */
export async function runSetupWorkflow(request, expect) {
  console.log('🔧 Starting Production Setup Workflow...');
  
  try {
    const results = {};
    let hasErrors = false;
    
    // Step 1: Test basic API health (should always work)
    console.log('\n--- Step 1: Testing API Health ---');
    results.healthHello = await testHealthHello(request, expect);
    
    // Step 2: Test database connection with hello (may fail in prod)
    console.log('\n--- Step 2: Testing Database Hello ---');
    results.databaseHello = await testDatabaseHello(request, expect);
    if (results.databaseHello.status === 'error') {
      hasErrors = true;
    }
    
    // Step 3: Test database status check (may fail in prod)
    console.log('\n--- Step 3: Testing Database Status ---');
    results.databaseStatus = await testDatabaseStatus(request, expect);
    if (results.databaseStatus.status === 'error') {
      hasErrors = true;
    }
    
    if (hasErrors) {
      console.log('\n⚠️ Setup Workflow completed with database connection issues');
      console.log('✅ API is healthy but database connectivity needs attention');
    } else {
      console.log('\n🎉 Setup Workflow completed successfully!');
      console.log('✅ All setup endpoints are working correctly');
    }
    
    return {
      success: !hasErrors,
      hasWarnings: hasErrors,
      results: results
    };
    
  } catch (error) {
    console.error('\n❌ Setup Workflow failed:', error.message);
    throw error;
  }
}

/**
 * Individual setup endpoint tests with production error handling
 * Run each setup test independently for debugging
 */
export async function runIndividualSetupTests(request, expect) {
  console.log('🔧 Starting Individual Production Setup Tests...');
  
  const results = {
    healthHello: { success: false, error: null, details: null },
    databaseHello: { success: false, error: null, details: null },
    databaseStatus: { success: false, error: null, details: null }
  };
  
  // Test 1: Health Hello (should always pass)
  try {
    console.log('\n--- Testing Health Hello Endpoint ---');
    const result = await testHealthHello(request, expect);
    results.healthHello.success = true;
    results.healthHello.details = result;
    console.log('✅ Health Hello: PASSED');
  } catch (error) {
    results.healthHello.error = error.message;
    console.log('❌ Health Hello: FAILED -', error.message);
  }
  
  // Test 2: Database Hello (may fail in prod)
  try {
    console.log('\n--- Testing Database Hello Endpoint ---');
    const result = await testDatabaseHello(request, expect);
    results.databaseHello.details = result;
    
    if (result.status === 'success') {
      results.databaseHello.success = true;
      console.log('✅ Database Hello: PASSED');
    } else {
      results.databaseHello.error = `Status 500: ${result.error?.message || 'Database connection issue'}`;
      console.log('⚠️ Database Hello: WARNING - Database connection issue detected');
    }
  } catch (error) {
    results.databaseHello.error = error.message;
    console.log('❌ Database Hello: FAILED -', error.message);
  }
  
  // Test 3: Database Status (may fail in prod)
  try {
    console.log('\n--- Testing Database Status Endpoint ---');
    const result = await testDatabaseStatus(request, expect);
    results.databaseStatus.details = result;
    
    if (result.status === 'success') {
      results.databaseStatus.success = true;
      console.log('✅ Database Status: PASSED');
    } else {
      results.databaseStatus.error = `Status 500: ${result.error?.message || 'Database connection issue'}`;
      console.log('⚠️ Database Status: WARNING - Database connection issue detected (this is the current issue!)');
    }
  } catch (error) {
    results.databaseStatus.error = error.message;
    console.log('❌ Database Status: FAILED -', error.message);
  }
  
  // Summary
  const passedTests = Object.values(results).filter(test => test.success).length;
  const totalTests = Object.keys(results).length;
  const warningTests = Object.values(results).filter(test => !test.success && test.error && test.error.includes('Status 500')).length;
  
  console.log(`\n📊 Production Setup Tests Summary:`);
  console.log(`   ✅ Passed: ${passedTests}/${totalTests}`);
  console.log(`   ⚠️ Warnings (500 errors): ${warningTests}`);
  console.log(`   ❌ Failed: ${totalTests - passedTests - warningTests}`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All setup tests passed!');
  } else if (warningTests > 0) {
    console.log('⚠️ Some tests show database connection issues - needs investigation');
  } else {
    console.log('❌ Some setup tests failed - check logs above for details');
  }
  
  return {
    summary: { 
      passed: passedTests, 
      warnings: warningTests,
      failed: totalTests - passedTests - warningTests,
      total: totalTests 
    },
    results: results
  };
} 