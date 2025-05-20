this test runs through the app in localhost, connected to SQLite database in backend.

Overview:

1.  create account
2.  go through assessment steps
3.  view results
4.  save results to database
5.  view results id
6.  view results list

Test instructions:

the test focuses more on waiting for network to be idle and then running assertions (and being able to do this), rather than verifying.

1.  setup concurrently backend and frontend with cd frontend; npm run dev
2.  go to /
3.  confirm landing page is up
4.  click on create account button
5.  enter details and click on create account
6.  sign in
7.  enter random age verification
8.  enter random cycle length
9.  enter random period duration
10. enter random flow
11. enter random pain
12. enter random symptoms
13. confirm results page is up
14. confirm context has saved the data that was entered. WE DO NOT USE SESSION STORAGE. See files:

- frontend\src\context\assessment\types\index.ts
- frontend\src\context\assessment\types\recommendations.ts
- frontend\src\context\assessment\AssessmentResultContext.ts

15. confirm results page is rendering the data from the context.
16. save results to database, click on save results button
17. view results id
18. view results list

# step 14
