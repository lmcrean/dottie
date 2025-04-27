# Symptoms Data Dependency Chain

This document explains how symptom data flows through the Dottie application.

## Flow Overview 🔗

1. Symptoms selection in `symptoms/page.tsx`
2. Session storage intermediate storage
3. Results processing in `results/page.tsx`
4. API request via `assessment/requests/postSend/Request.ts`
5. Backend processing in `backend/models/assessment/FlattenedAssessment.js`
6. Database storage
7. API response to get request
8. Display in `history/[id]/page.tsx`
