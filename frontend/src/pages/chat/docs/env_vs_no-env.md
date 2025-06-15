# env vs no-env

## no env / localhost

most developers will work with no env variables

this means the chat will return default messages with no context

with no env variables in localhost we expect

✅ objects to be stored in the SQlite database with placeholder messages returned from the chatbot
✅ no console logs in devtools
❌ Gemini AI chatbot will not be used

## env variables added / localhost

with env variables added in localhost we expect

✅ objects to be stored in the SQlite database
✅ no console logs in devtools
✅ Gemini AI chatbot will be used
