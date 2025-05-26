# test driven development plan

# checklist (test commands from `cd backend`)

- [ ] create new assessment object:
- [ ] get assessment object by id:
- [ ] delete assessment by id:
- [ ] get list of assessments by user_id:
- [ ] list of assessments contains assessment_pattern and all other fields:

# test structure

- located in `__tests__` folder next to the triggering command
- tend to use `__tests__/runner/..` folders to handle the journey across multiple files
- files are kept under 100 lines of code for readability