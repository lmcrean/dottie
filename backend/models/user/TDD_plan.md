# test driven development plan

# checklist (test commands from `cd backend`)

- [ ] create new user:
- [ ] authenticate user:
- [ ] get user by id:
- [ ] delete user by id:
- [ ] update username:
- [ ] update email:
- [ ] update password:

# test structure

- located in `__tests__` folder next to the triggering command
- tend to use `__tests__/runner/..` folders to handle the journey across multiple files
- files are kept under 100 lines of code for readability