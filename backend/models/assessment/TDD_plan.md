# test driven development plan

# checklist (test commands from `cd backend`)

- [x] create new assessment object: `npm test -- "createAssessment.test.js"` ✅ 7/7 tests passing
- [x] get assessment object by id: `npm test -- "getAssessmentById.test.js"` ✅ 10/10 tests passing
- [x] delete assessment by id: `npm test -- "deleteAssessmentById.test.js"` ✅ 10/10 tests passing  
- [x] get list of assessments by user_id: `npm test -- "getAssessmentsByUserId.test.js"` ✅ 11/11 tests passing
- [x] list of assessments contains assessment_pattern and all other fields: `npm test -- "assessmentIntegration.test.js"` ✅ 41/41 tests passing (comprehensive workflow)

# test structure

- located in `__tests__` folder next to the triggering command
- tend to use `__tests__/runner/..` folders to handle the journey across multiple files
- files are kept under 100 lines of code for readability