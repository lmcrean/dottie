this button is triggered in the frontend\src\pages\assessment\detail\page.tsx

it doesn't get rendered but runs the function startNewChat

this is like a follow up to the sendInitialMessageButton

when there is no env in localhost testing -- it will still save the message in the sqlite database

the returned object will be a default placeholder message saying "This is a placeholder message confirming that our conversation has been saved in SQLite"

when there is an env in localhost testing -- it will return the actual message from the chatbot via Gemini AI
