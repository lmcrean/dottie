# test driven development plan

# checklist (test commands from `cd backend`)

- [x] start new conversation: `npm test -- "models/chat/conversation/create-new-conversation/__tests__/createAssessmentConversation.test.js"` ✅ 20/20 tests passing
- [x] add message to conversation: `npm test -- "models/chat/message/user-message/add-message/__tests__/messageFlowDialogue.test.js"` ✅ 21/21 tests passing 
- [ ] get list of conversations by user_id:
- [ ] get conversation by conversation_id:
- [ ] delete conversation by conversation_id:
- [ ] list updates on new message, specifically the message count and message preview of conversation id in list:
- [ ] assessment object is located in the conversation object as a foreign key including age, physical_symptoms, emotional_symptoms, and assessment_id etc.:
- [ ] assessment pattern is located for each conversation in the lists:


# checklist edge cases

- [ ] edit message by id and regenerate response:
- [ ] list updates on message edit:

# test structure

- located in `__tests__` folder next to the triggering command
- tend to use `__tests__/runner/..` folders to handle the journey across multiple files
- files are kept under 100 lines of code for readability