# Assessment Services

This folder contains utility functions for processing assessment data.

## Purpose

The assessment services process raw user input data to derive insights, categorize patterns, and prepare data for API operations.

## Files

- `determinePattern.ts` - Logic for classifying menstrual health data into pattern categories (regular, irregular, heavy, pain, developing)
- `generateRecommendations.ts` - Generates personalized recommendations based on the identified pattern

## Logic Tree

The assessment system follows a decision tree to categorize patterns and generate recommendations:

1. **O1: Irregular Timing Pattern** - Cycles that are irregular, very short, or very long
2. **O2: Heavy or Prolonged Flow Pattern** - Heavy flow or extended periods
3. **O3: Pain-Predominant Pattern** - Severe or debilitating menstrual pain
4. **O4: Regular Menstrual Cycles** - Healthy, normal cycles
5. **O5: Developing Pattern** - Adolescent cycles still establishing regularity

## Dependencies

```
context/assessment/types ← determinePattern.ts
                        ↖ generateRecommendations.ts → context/assessment/types/recommendations
```

The services depend only on the type definitions and are consumed by UI components and hooks.
