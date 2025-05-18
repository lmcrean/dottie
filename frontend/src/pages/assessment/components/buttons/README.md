# button i.e. data flow routes summary

the data flow routes are triggered by the following buttons:

- `save assessment`
- `view assessment detail`
- `view assessment list`
- `delete assessment`

# save assessment

Button Rendered from: `../../steps/symptoms/page.tsx`

the user saves the results of the assessment, redirecting to the [assessment detail page](#view-assessment-detail).

1. USER ACTION: the user clicks the `save and continue` button in `../../steps/components/SaveAndContinueButton.tsx`. This button is rendered on the last step of the assessment ("symptoms").
2. the results are pushed from the ../steps/context to the database.
3. the `id` of the assessment is extracted from the response.
4. call step 2 of `view assessment detail`.

# view assessment detail:

Button Rendered from: `../../list/page.tsx`. Assessment `id` has been recorded next to the button.

1. **USER ACTION: the user clicks on an assessment from the assessment list.**
2. True/ False have we clicked the `view assessment detail` button?

- True: We have clicked the `view assessment detail` button. Extract the assessment `id` recorded next to the button.
- False: We have just made a post request from the [save assessment](#save-assessment) button. extract the assessment `id` from the post request result that has just been made.

3. the assessment `id` is passed to the `detail/page.tsx` component.
4. **the `detail/page.tsx` fetches the results from the database and displays them in the `../../components/ResultsTable.tsx` component.**
5. Additionally, the `id` is saved to context, so that it can be used when deleting the assessment.

# view assessment list:

the user views the list of assessments they have completed. This button is rendered in the navbar and the assessment details.

1. **USER ACTION: user clicks the `view assessments` button.**
2. the user is directed to the list page (`list/page.tsx`)
3. the list page renders the `../../components/AssessmentList.tsx` component with a loading skeleton of the Assessment List.
4. the `AssessmentList.tsx` component calls the backend to fetch the assessment list through `../../list/api/Request.ts`.
5. **the `AssessmentList.tsx` component displays the assessment list in the `../../list/components/AssessmentList.tsx` component.**
6. Additionally,the assessment `id` is saved to context, so that it can be used when navigating to the assessment detail page.

# delete assessment

the user clicks on the delete assessment button, which is rendered in the detail page (`../../detail/page.tsx`).

1. **USER ACTION: the user clicks on the delete assessment button.**
2. a loading skeleton is displayed.
3. the `id` of the assessment is extracted from the context.
4. the api is called in `../../detail/api/deleteById/Request.ts`, using the `id` of the assessment to be deleted.
5. **the view assessment list button is called, directing the user to view assessment list/ step 2.**
