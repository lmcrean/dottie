# Testing Structure

This directory contains all tests for the Dottie backend organized by test type.

## Directory Structure

- unit/ - Fast isolated tests of individual components
- e2e/ - End-to-end tests
  - dev/ - Development environment tests (using SQLite)
  - prod/ - Production environment tests (using Azure SQL)

## Running Tests

### All Tests

`ash
npm test
`

### Unit Tests Only

`ash
npm test -- "unit"
`

### Development Environment Tests

`ash
npm test -- "e2e/dev"
`

### Production Environment Tests

`ash
npm test -- "e2e/prod"
`
