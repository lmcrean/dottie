# test driven development plan

# checklist (test commands from `cd backend`)

- [x] create new user: `npm test -- "models/user/__tests__/createUser.test.js"` ✅ 8/8 tests passing
- [x] authenticate user: `npm test -- "models/user/__tests__/authenticateUser.test.js"` ✅ 10/10 tests passing
- [x] get user by id: `npm test -- "models/user/__tests__/getUserById.test.js"` ✅ (ready for testing)
- [x] delete user by id: `npm test -- "models/user/__tests__/deleteUserById.test.js"` ✅ (ready for testing)
- [x] update username: `npm test -- "models/user/__tests__/updateUsername.test.js"` ✅ (ready for testing)
- [x] update email: `npm test -- "models/user/__tests__/updateEmail.test.js"` ✅ (ready for testing)
- [x] update password: `npm test -- "models/user/__tests__/updatePassword.test.js"` ✅ (ready for testing)

# test structure

- located in `__tests__` folder next to the triggering command
- tend to use `__tests__/runner/..` folders to handle the journey across multiple files
- files are kept under 100 lines of code for readability

# runner tests (multi-file data flow)

- [x] complete user workflow: `npm test -- "models/user/__tests__/runner/userWorkflow.test.js"` ✅ (ready for testing)