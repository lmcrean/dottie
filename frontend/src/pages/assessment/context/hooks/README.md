# Assessment Context Hooks

This folder contains the hooks for the assessment context, organized in a layered approach:

## use-assessment-context

The foundational hook that directly accesses the AssessmentResultContext. It:

- Provides raw access to context values
- Validates usage within the provider

## use-assessment-result

A wrapper around useAssessmentContext that:

- Exposes state from the context
- Adds transformation functionality (transformToFlattenedFormat)
- Simplifies access to assessment results

## useAssessmentData

The most comprehensive hook built on top of useAssessmentResult. It:

- Manages local state with assessment data
- Implements fallback between context data and sessionStorage
- Determines menstrual patterns based on assessment values
- Provides UI state management (expandableSymptoms, isClamped)

## Why Separate Hooks?

This separation follows good design principles:

- Single responsibility for each hook
- Selective importing based on specific needs
- Prevention of circular dependencies
- Easier unit testing of individual hooks
- Simplified maintenance as assessment functionality grows
