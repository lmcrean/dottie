# data flow routes summary

# 1 - viewing the assessment list:

the user views the list of assessments they have completed. This can be done from various locations, there is a view assessments component, that is reused in the navbar and the assessment details.

1. USER ACTION: user navigates to `./list/page.tsx` from the `view assessments` button.
2. the `list/page.tsx` renders the `./components/AssessmentList.tsx` component with a loading skeleton of the Assessment List.
3. the `AssessmentList.tsx` component calls the backend to fetch the assessment list through `./list/api/Request.ts`.
4. the `AssessmentList.tsx` component displays the assessment list in the `./list/components/AssessmentList.tsx` component.
5. the assessment `id` is saved to context, so that it can be used when navigating to the assessment detail page.

# 2 - viewing an assessment detail after completing a new assessment:

the user views the details of an assessment after completing it.

1. USER ACTION: the user clicks the `save and continue` button in `./steps/components/SaveAndContinueButton.tsx`. This button is rendered on the last step of the assessment ("symptoms").
2. the results are saved to context and pushed to the database.
3. the `id` of the assessment is extracted from the response.
4. the user is redirected to the `./detail/page.tsx` with a loading skeleton of the results table.
5. the api is called in `./detail/api/Request.ts`, using the `id` of the assessment just completed.
6. the `detail/page.tsx` fetches the results from the database and displays them in the `./components/ResultsTable.tsx` component.

# 3 - viewing an assessment detail from the assessment list:

the user views the details of an assessment from the assessment list.

1. USER ACTION: the user clicks on an assessment from the assessment list.
2. the assessment `id` is extracted from the list and passed to the `detail/page.tsx` component.
3. the `detail/page.tsx` fetches the results from the database and displays them in the `./components/ResultsTable.tsx` component.
4. the `id` is saved to context, so that it can be used when navigating to the assessment detail page.

# 4 - deleting an assessment

there is a delete
