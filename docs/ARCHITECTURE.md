# System Architecture

## Overview

This system is designed as a full-stack web application that automates feedback for programming assignments submitted via GitHub Classroom. It consists of three core layers—Frontend, Backend, and External Integrations—each playing a distinct role in delivering real-time, AI-assisted insights to both students and teachers.

The Frontend, built with React, provides a user-friendly interface for authentication, repository selection, and feedback visualization. It communicates with the Backend via RESTful APIs.

The Backend, powered by Node.js and Express, handles user authentication through GitHub OAuth, fetches repository data via the GitHub API, and manages prompt generation and communication with AI services like OpenAI or DeepSeek. It also formats and returns feedback, summaries, and CSV exports to the frontend.

The system leverages external APIs—GitHub API for accessing student submissions and AI APIs for analyzing code and generating feedback—without requiring a dedicated database for the MVP.

Components are containerized using Docker to ensure portability and consistent development environments.

## Components

- **Frontend (React):**
  Built with React and Vite, the frontend provides the user interface for students and teachers. It includes components for login, repository selection, feedback display, and summary reports. Optionally styled with Tailwind CSS, it communicates with the backend via a structured API service layer using axios.

- **Backend (Node.js/Express):** Handles authentication, repository reading, AI communication.
  Acts as the main server layer. It handles GitHub OAuth authentication, fetches repositories, processes requests, and orchestrates interactions between GitHub and AI services. Follows a modular structure with routes, controllers, and services.

- **AI Integration (OpenAI/DeepSeek):** Generates feedback from student code.
  Uses AI APIs to analyze student code, generate insightful feedback, and suggest improvements. Prompts are crafted dynamically based on submission context and user roles (teacher/student).

- **GitHub API:** Used to access student repositories and commit history.
  Integrates GitHub REST APIs to authenticate users, list repositories, and fetch student assignment code and metadata (e.g., commits, diffs). It serves as the bridge between GitHub Classroom and the feedback system.

<!-- - **(Optional) Database:** If used, describe its purpose. -->

## Data Flow

1. Teacher logs in via GitHub OAuth.
2. Repositories are listed via GitHub API.
3. Code is fetched and passed to the AI with a prompt.
4. AI response is returned and shown in UI.
5. Feedback summary and CSV report are generated.

## Architecture Diagram

[![System Architecture](https://mermaid.ink/img/pako:eNp1VE1vm0AQ_SurPeRSPgw2YHOoZGMntdRKkZ320NLDGsaAArtoWdo4lv97Z4FEwXI5oBnevLdvZoAzTUQKNKSmacY8EfxYZGHMCSnZSbQqJCnLJMS8g4-l-JvkTCrytMaapj1kktU5uZeCK-Dpr5i-hTH9rVX6a-kg8n1LIlHVggNXzRh2EX5kGTT2Ds-EK3SK6PJxS_Yg_xQJkK_sBHIo0Sd9MLJiyXPvY4hGSittY_NSS2gacuOklfYRoX8pyhLkFahtPBTqS3sgy1bl5BPZQS3wxtJ3O0PpTPcjsVlFHoCDZEpcVXi6py25B0gP6JRseFZwGNf42s3-B0HHQqr_taz9MuTKwXsXj4Qi3fZa4DzksSiBmOTmkiL3uuzWDCM9hrSrMhO9zgasU1WOvHVLI6ZJdpv9E9GrM83POP0eWjl96g6p26dTcoeD0zd_AGY94PVp1NOWg0rkjkSjaZdi0R1C_bOkLHCyKBzTXKm6CW0bjTdWVqi8PVjo3gZu48ugYjpieB8YdcnUUcjKEjVwVnQsrWJrDjVoJouUhkq2YNAKZMV0Ss9aL6YqhwqXGmKYMvmsKRfk1Iz_FKJ6o0nRZjkNj6xsMGvrlClYF_jZser9qcTJgoxEyxUNF50EDc_0hYZOEFj-wvGnwcRZOO5kMTfoiYb-xPLnwSxw557rLDDyLgZ97U6dWPPAMyikBb6W3_qvv_sJXP4Bq800Cg?type=png)](https://mermaid.live/edit#pako:eNp1VE1vm0AQ_SurPeRSPgw2YHOoZGMntdRKkZ320NLDGsaAArtoWdo4lv97Z4FEwXI5oBnevLdvZoAzTUQKNKSmacY8EfxYZGHMCSnZSbQqJCnLJMS8g4-l-JvkTCrytMaapj1kktU5uZeCK-Dpr5i-hTH9rVX6a-kg8n1LIlHVggNXzRh2EX5kGTT2Ds-EK3SK6PJxS_Yg_xQJkK_sBHIo0Sd9MLJiyXPvY4hGSittY_NSS2gacuOklfYRoX8pyhLkFahtPBTqS3sgy1bl5BPZQS3wxtJ3O0PpTPcjsVlFHoCDZEpcVXi6py25B0gP6JRseFZwGNf42s3-B0HHQqr_taz9MuTKwXsXj4Qi3fZa4DzksSiBmOTmkiL3uuzWDCM9hrSrMhO9zgasU1WOvHVLI6ZJdpv9E9GrM83POP0eWjl96g6p26dTcoeD0zd_AGY94PVp1NOWg0rkjkSjaZdi0R1C_bOkLHCyKBzTXKm6CW0bjTdWVqi8PVjo3gZu48ugYjpieB8YdcnUUcjKEjVwVnQsrWJrDjVoJouUhkq2YNAKZMV0Ss9aL6YqhwqXGmKYMvmsKRfk1Iz_FKJ6o0nRZjkNj6xsMGvrlClYF_jZser9qcTJgoxEyxUNF50EDc_0hYZOEFj-wvGnwcRZOO5kMTfoiYb-xPLnwSxw557rLDDyLgZ97U6dWPPAMyikBb6W3_qvv_sJXP4Bq800Cg)
