# Epic Stories

Organize your features and user stories into broader epics.

## Epics and Related Stories

### 1. GitHub Integration

#### Goal: Enable secure and seamless access to student repositories using GitHub's API.

##### User stories:

- As a teacher, I want to authenticate with GitHub using OAuth so I can securely access student repositories.
- As a teacher, I want to view a list of student repositories so I can select which ones to analyze.
- As a teacher, I want to fetch code and metadata (e.g., last commit, repo owner) for each repository.

##### Suggestions:

- Support GitHub Classroom filtering/tagging to improve repo discovery.
- Cache repository metadata to reduce API usage and improve performance.

### 2. AI Feedback Engine

#### Goal: Provide automated, context-aware feedback on student code using LLMs.

##### User stories:

- As a teacher, I want to automatically generate prompts from student code so I can get feedback from the AI without manual formatting.
- As a system, I need to send these prompts to an AI engine (OpenAI or DeepSeek) and receive relevant, structured feedback.
- As a user, I want error handling and retry mechanisms in case of AI API failures.

##### Suggestions:

- Store past AI responses temporarily (in memory or local cache) to reduce duplicate requests during session.
- Define prompt templates that adapt to different code types or assignment goals.
- Consider feedback format standardization (e.g., issue type, severity, suggestion) for easier UI rendering and reporting.

### 3. Feedback UI

#### Goal: Display AI feedback clearly and helpfully for each student’s submission.

##### User stories:

- As a teacher, I want to view AI-generated feedback per student with syntax-highlighted code.
- As a teacher, I want common issues or coding patterns visually highlighted.
- As a user, I want the ability to toggle views between individual feedback and group insights.

##### Suggestions:

- Add collapsible sections and tags (e.g., logic, naming, performance) for better navigation.
- Consider future read-only student access UI for feedback transparency and self-learning.

### 4. Reporting Tools

#### Goal: Aggregate and export meaningful summaries of student feedback and performance.

##### User stories:

- As a teacher, I want to generate group-level summaries to identify widespread challenges.
- As a teacher, I want to export all feedback and points as a CSV file for grading or archival purposes.
- As a teacher, I want to see submission trends over time to evaluate class progress.

##### Suggestions:

- Include analytics like “top 5 common issues” or “average feedback score” per assignment.
- Allow optional filters (by student, assignment, or issue type) when generating reports.

### 5. Project Infrastructure

#### Goal: Support scalable development and deployment through reliable tooling.

##### User stories:

- As a developer, I want Docker containers for both frontend and backend to ensure consistency across environments.
- As a team, I want a basic CI/CD pipeline to run tests and deploy the app automatically (optional in MVP).
- As a developer, I want a documented deployment plan (e.g., Vercel for frontend, Render/Fly.io/Heroku for backend, optional in MVP).

##### Suggestions:

- Add environment variable management and secrets handling early on (e.g., .env, GitHub secrets).
- Plan for rate limits and retries when integrating with GitHub or AI APIs.
