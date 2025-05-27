# test driven development cycle

from `cd backend`:

1. run `npm run test:dev`
2. run `npm run test:prod`
3. inspect output
4. update test file if needed
5. update codebase if needed
6. redeploy with `vercel --prod` command
7. inspect logs on Vercel manually (if using Cursor IDE, Cursor should ask you to do this)
8. run `npm run test:prod` again and inspect logs