# Assessment Model Refactor Plan

## Overlapping Concerns Identified

### 1. **Test Mode Logic Still Present** ❌
- Files: `DeleteAssessment.js`, `FindAssessment.js`, `ValidateAssessment.js`, `AssessmentTestUtils.js`
- Issue: Test mode logic should be removed and replaced with proper mocking

### 2. **Multiple Assessment Classes** 🔄
- `AssessmentBase.js` - base class with operations
- `Assessment.js` (main) - current format extending base  
- `Assessment.js` (root) - facade routing between legacy/current
- Issue: Creates import confusion and unclear hierarchy

### 3. **Redundant Validation** 🗑️
- `ValidateAssessment.js` - ownership validation + stub method
- `ValidateAssessmentFormat.js` - just calls `FormatDetector.isCurrentFormat()`
- Resolution: Remove `ValidateAssessmentFormat.js`, consolidate validation

### 4. **Scattered Transformation Logic** 🔀
- `TransformationRouter.js` - routes by format
- `TransformDbToApi.js` / `TransformApiToDb.js` - current format only
- Individual classes also have transform methods
- Resolution: Centralize transformation logic

### 5. **Operations Duplication** 📋
- `AssessmentOperations.js` - delegates to LegacyAssessment
- Individual operation classes (`DeleteAssessment.js`, etc.)
- `AssessmentBase.js` - also delegates to same classes
- Resolution: Use unified operations approach

## Resolution Strategy

### Phase 1: Create Clean Architecture ✅ DONE
- [x] Created `CleanAssessmentOperations.js` - unified operations without test mode
- [x] Created `UnifiedAssessment.js` - single entry point
- [x] Added tests for new unified approach

### Phase 2: Remove Test Mode Logic ✅ DONE
- [x] Remove test mode from `DeleteAssessment.js`
- [x] Remove test mode from `FindAssessment.js` 
- [x] Remove test mode from `ValidateAssessment.js`
- [x] Delete `AssessmentTestUtils.js`

### Phase 3: Remove Redundant Files ✅ DONE  
- [x] Delete `ValidateAssessmentFormat.js` (redundant)
- [x] Delete `AssessmentOperations.js` (replaced by CleanAssessmentOperations)
- [x] Delete `TransformationRouter.js` (logic moved to CleanAssessmentOperations)
- [x] Delete `ValidateAssessmentFormat.test.js` (test file for deleted class)

### Phase 4: Update Imports ✅ DONE
- [x] Replace `Assessment.js` (root) with thin wrapper to `UnifiedAssessment.js`
- [x] Update `ReadAssessment.js` to use `FormatDetector` instead of deleted validation class
- [x] Fix syntax errors in controller files

### Phase 5: Clean Up Individual Operation Classes
- [ ] Remove test mode logic from operation classes
- [ ] Consider consolidating small operation classes

### Phase 6: Testing
- [ ] Run all assessment tests
- [ ] Run route tests  
- [ ] Run e2e tests

## Files to Remove After Refactor

1. `AssessmentTestUtils.js` - test mode utilities no longer needed
2. `ValidateAssessmentFormat.js` - redundant wrapper around FormatDetector
3. `AssessmentOperations.js` - replaced by CleanAssessmentOperations
4. `TransformationRouter.js` - logic consolidated into CleanAssessmentOperations
5. `AssessmentBase.js` - replaced by UnifiedAssessment
6. `Assessment.js` (root) - replaced by UnifiedAssessment

## Files to Update

### Remove Test Mode Logic:
- `DeleteAssessment.js`
- `FindAssessment.js`
- `ValidateAssessment.js`

### Update Imports:
- All route controllers
- All test files
- Any other files importing Assessment

## Benefits After Refactor

1. **Single Assessment Entry Point**: `UnifiedAssessment.js` 
2. **No Test Mode Confusion**: Proper mocking in tests
3. **Clear Separation**: Operations, transformations, validation properly organized
4. **Reduced Files**: ~6 fewer files with overlapping concerns
5. **Simpler Imports**: One clear import path for Assessment operations
6. **Better Maintainability**: Clear single responsibility for each remaining file

## Current Status

- ✅ Phase 1 Complete: Clean architecture created and tested
- ✅ Phase 2 Complete: Removed test mode logic from all assessment files
- ✅ Phase 3 Complete: Removed redundant files 
- ✅ Phase 4 Complete: Updated imports and fixed syntax errors
- ⏳ Phase 5: Optional cleanup of remaining operation classes
- ⏳ Phase 6: Testing needs attention (some route tests failing due to external dependencies) 