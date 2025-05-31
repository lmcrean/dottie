# test driven development cycle

from `cd backend`:

1. run `npm run test:dev; vercel --prod; npm run test:prod` this will deploy the app, should confirm that the dev tests pass and locate the problem area in the prod tests.
2. inspect logs on Vercel manually (if using Cursor IDE, Cursor should ask you to do this)
3. review SQL tables in `backend\db\supabase\current-tables\..` (manually taken from Supabase platform)
4. inspect output from 1-3 altogether consider whether problem area is in tests or codebase
5. update test file if needed
6. update codebase if needed
7. repeat 