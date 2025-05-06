# Functional Requirements

## User Roles

- **Teacher**: Authenticates via GitHub, views student submissions, reviews AI-generated feedback, generates summary reports, and exports data as CSV.
- **Student** (optional): May access personal feedback in future versions.

## MVP Requirements

- GitHub OAuth login for authentication
- List and fetch student repositories from GitHub Classroom
- Analyze code submissions using AI (OpenAI/DeepSeek)
- Display per-student feedback in the web UI
- Generate aggregated summary reports (e.g., most common issues, success rates)
- Export detailed feedback and grading data as a CSV file

## User Stories

- As a teacher, I want to authenticate via GitHub so I can access my students’ repositories.
- As a teacher, I want to view AI-generated feedback for each student submission to save review time.
- As a teacher, I want to download a CSV file with feedback and points to simplify grading.
- As a teacher, I want to see common errors and patterns across submissions to guide class instruction.

## Non-Functional Requirements

- The system must work reliably on modern browsers (Chrome, Firefox, Edge).
- API keys and secrets must be securely stored on the server and never exposed to the frontend.
- The response time from the AI feedback engine should be under 5 seconds to ensure a smooth user experience.
- The system should be containerized (via Docker) to support easy deployment and consistent development environments.
