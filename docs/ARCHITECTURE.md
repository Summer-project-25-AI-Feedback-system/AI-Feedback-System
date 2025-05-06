# System Architecture

## Overview

Describe the general architecture of the system. What are the main components and how do they interact?

[![System Architecture](https://mermaid.ink/img/pako:eNp1VE1vm0AQ_SurPeRSPgw2YHOoZGMntdRKkZ320NLDGsaAArtoWdo4lv97Z4FEwXI5oBnevLdvZoAzTUQKNKSmacY8EfxYZGHMCSnZSbQqJCnLJMS8g4-l-JvkTCrytMaapj1kktU5uZeCK-Dpr5i-hTH9rVX6a-kg8n1LIlHVggNXzRh2EX5kGTT2Ds-EK3SK6PJxS_Yg_xQJkK_sBHIo0Sd9MLJiyXPvY4hGSittY_NSS2gacuOklfYRoX8pyhLkFahtPBTqS3sgy1bl5BPZQS3wxtJ3O0PpTPcjsVlFHoCDZEpcVXi6py25B0gP6JRseFZwGNf42s3-B0HHQqr_taz9MuTKwXsXj4Qi3fZa4DzksSiBmOTmkiL3uuzWDCM9hrSrMhO9zgasU1WOvHVLI6ZJdpv9E9GrM83POP0eWjl96g6p26dTcoeD0zd_AGY94PVp1NOWg0rkjkSjaZdi0R1C_bOkLHCyKBzTXKm6CW0bjTdWVqi8PVjo3gZu48ugYjpieB8YdcnUUcjKEjVwVnQsrWJrDjVoJouUhkq2YNAKZMV0Ss9aL6YqhwqXGmKYMvmsKRfk1Iz_FKJ6o0nRZjkNj6xsMGvrlClYF_jZser9qcTJgoxEyxUNF50EDc_0hYZOEFj-wvGnwcRZOO5kMTfoiYb-xPLnwSxw557rLDDyLgZ97U6dWPPAMyikBb6W3_qvv_sJXP4Bq800Cg?type=png)](https://mermaid.live/edit#pako:eNp1VE1vm0AQ_SurPeRSPgw2YHOoZGMntdRKkZ320NLDGsaAArtoWdo4lv97Z4FEwXI5oBnevLdvZoAzTUQKNKSmacY8EfxYZGHMCSnZSbQqJCnLJMS8g4-l-JvkTCrytMaapj1kktU5uZeCK-Dpr5i-hTH9rVX6a-kg8n1LIlHVggNXzRh2EX5kGTT2Ds-EK3SK6PJxS_Yg_xQJkK_sBHIo0Sd9MLJiyXPvY4hGSittY_NSS2gacuOklfYRoX8pyhLkFahtPBTqS3sgy1bl5BPZQS3wxtJ3O0PpTPcjsVlFHoCDZEpcVXi6py25B0gP6JRseFZwGNf42s3-B0HHQqr_taz9MuTKwXsXj4Qi3fZa4DzksSiBmOTmkiL3uuzWDCM9hrSrMhO9zgasU1WOvHVLI6ZJdpv9E9GrM83POP0eWjl96g6p26dTcoeD0zd_AGY94PVp1NOWg0rkjkSjaZdi0R1C_bOkLHCyKBzTXKm6CW0bjTdWVqi8PVjo3gZu48ugYjpieB8YdcnUUcjKEjVwVnQsrWJrDjVoJouUhkq2YNAKZMV0Ss9aL6YqhwqXGmKYMvmsKRfk1Iz_FKJ6o0nRZjkNj6xsMGvrlClYF_jZser9qcTJgoxEyxUNF50EDc_0hYZOEFj-wvGnwcRZOO5kMTfoiYb-xPLnwSxw557rLDDyLgZ97U6dWPPAMyikBb6W3_qvv_sJXP4Bq800Cg)

## Components

- **Frontend (React):** Describe purpose, technology and structure.
- **Backend (Node.js/Express):** Handles authentication, repository reading, AI communication.
- **AI Integration (OpenAI/DeepSeek):** Generates feedback from student code.
- **GitHub API:** Used to access student repositories and commit history.
- **(Optional) Database:** If used, describe its purpose.

## Data Flow

1. Teacher logs in via GitHub OAuth.
2. Repositories are listed via GitHub API.
3. Code is fetched and passed to the AI with a prompt.
4. AI response is returned and shown in UI.
5. Feedback summary and CSV report are generated.

## Architecture Diagram

Include a diagram (link to image or use a tool like draw.io or mermaid.js).
