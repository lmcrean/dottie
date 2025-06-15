 this test runs through the app in localhost, connected to SQLite database in backend.

 Overview:

 1. create account
 2. go through assessment steps
 3. view results
 4. save results to database
 5. view results id
 6. view results list


 Test instructions:

 the test focuses more on waiting for network to be idle and then running assertions (and being able to do this), rather than verifying.

 1. go to / 
 2. click on create account button
 3. enter details and click on create account
 4. sign in
 5. enter random age verification
 6. enter random cycle length
 7.  enter random period duration
 8.  enter random flow
 9.  enter random pain
 10. enter random symptoms
 11. confirm results page is up
 12. confirm context has saved the data that was entered. WE DO NOT USE SESSION STORAGE. See files:
 - frontend\src\context\assessment\types\index.ts
 - frontend\src\context\assessment\types\recommendations.ts
 - frontend\src\context\assessment\AssessmentResultContext.ts
 1.  confirm results page is rendering the data from the context.
 2.  save results to database, click on save results button
 3.  view results id
 4.  view results list

