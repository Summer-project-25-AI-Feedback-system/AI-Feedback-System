# Functional Requirements

## User Roles
- **Teacher**: Views student submissions, AI-generated feedback, exports CSV.
- **Student** (optional): May access personal feedback in future versions.

## MVP Requirements
- GitHub OAuth login
- Fetch student repositories
- Analyze code using AI
- Display feedback per student
- Generate summary reports
- Export results as CSV

## User Stories
- As a teacher, I want to see feedback for each student’s submission.
- As a teacher, I want to export feedback and points to a CSV file.
- As a teacher, I want to understand common problems students face.

## Non-Functional Requirements
- Must work in modern browsers (Chrome, Firefox)
- API keys must not be exposed on frontend
- Response time from AI should be < 5 seconds