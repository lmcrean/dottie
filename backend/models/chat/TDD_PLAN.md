# test driven development plan

# checklist (test commands from `cd backend`)

- [x] start new conversation: `npm test -- "models/chat/conversation/create-new-conversation/__tests__/createAssessmentConversation.test.js"` ✅ 20/20 tests passing
- [x] add message to conversation: `npm test -- "models/chat/message/user-message/add-message/__tests__/messageFlowDialogue.test.js"` ✅ 21/21 tests passing 

- [x] get conversation by conversation_id: `npm test -- "getConversationById.test.js"` ✅ 18/18 tests passing
- [x] conversation object updates when a new message is added: `npm test -- "__tests__/conversationUpdateOnMessage.test.js"` ✅ 27/27 tests passing
- [x] delete conversation by conversation_id: `npm test -- "models/chat/conversation/delete-conversation/__tests__/chatDelete.test.js"` ✅ 11/11 tests passing
  
- [x] list updates on new message, specifically the message count and message preview of conversation id in list: `npm test -- "models/chat/list/__tests__/listUpdatesOnMessage.test.js"` ✅ 5/5 tests passing
- [x] assessment object is located in the conversation object as a foreign key including age, physical_symptoms, emotional_symptoms, and assessment_id etc.: `npm test -- "models/chat/list/__tests__/assessmentIntegration.test.js"` ✅ 8/8 tests passing
  
- [x] get list of conversations by user_id: `npm test -- "models/chat/list/__tests__/getUserConversations.test.js"` ✅ 9/9 tests passing
- [x] assessment pattern is located for each conversation in the lists: (covered in assessment integration test) ✅


# checklist edge cases

- [x] edit message by id and regenerate response: `npm test -- "models/chat/message/user-message/add-message/edit-message.js/__tests__/editMessageRegeneration.test.js"` ✅ 12/12 tests passing
- [x] list updates on message edit: `npm test -- "models/chat/list/__tests__/listUpdatesOnEdit.test.js"` ✅ 9/9 tests passing

# test structure

- located in `__tests__` folder next to the triggering command
- tend to use `__tests__/runner/..` folders to handle the journey across multiple files
- files are kept under 100 lines of code for readability