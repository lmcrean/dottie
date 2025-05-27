# test driven development cycle

1. run n`pm run test:prod` from `cd backend`
2. inspect output
3. update test file if needed
4. update codebase if needed
5. redeploy with `vercel --prod` command
6. inspect logs with `vercel logs --prod`
7. run `npm run test:prod` again from `cd backend` and inspect logs
   