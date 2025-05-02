```
cd backend; npx playwright test routes/__tests__/prod/master-integration.api.pw.spec.js -c playwright.prod.config.js
```

This command will run the tests in the `routes/__tests__/prod` directory using the `playwright.prod.config.js` configuration file.


# deploy and test

if fixing, the remember to include deployment command

```
cd backend; vercel --prod; npx playwright test routes/__tests__/prod/master-integration.api.pw.spec.js -c playwright.prod.config.js
```