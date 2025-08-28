# AI-Feedback System

<p align="center">
  <a href="https://reactjs.org" target="_blank">
    <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React Badge"/>
  </a>
  <a href="https://vitejs.dev" target="_blank">
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite Badge"/>
  </a>
  <a href="https://nodejs.org" target="_blank">
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js Badge"/>
  </a>
  <a href="https://www.typescriptlang.org" target="_blank">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Badge"/>
  </a>
  <a href="https://tailwindcss.com" target="_blank">
    <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS Badge"/>
  </a>
  <a href="https://openai.com" target="_blank">
    <img src="https://img.shields.io/badge/chatGPT-0A0A0A?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI Badge"/>
  </a>
</p>

## :books: Table of the content

- [Introduction](#bulb-introduction)
- [Features](#rocket-features)
- [Technology Stack & Tools](#toolbox-technology-stack--tools)
- [Key Libraries](#package-key-libraries)
- [UI/UX Design](#art-uiux-design)
- [Video Demonstration](#video_camera-video-demonstration)
- [Deployment](#gear-deployment)
- [Contacts](#email-contacts)

---

## :bulb: Introduction

The **AI Feedback System (AFS)** is a full-stack web application designed to streamline the grading and feedback process for educators and students. By leveraging powerful AI models and integrating seamlessly with **GitHub Classroom**, AFS automates the evaluation of programming assignments to provide instant, constructive feedback.

The system features a centralized dashboard for professors to manage assignments and monitor student progress, while providing students with an automated, on-demand feedback loop to help them improve their code.

---

## :rocket: Features

- **GitHub Classroom Integration:** Automatically syncs with GitHub Classroom to manage organizations, assignments, and student repositories.
- **Automated Evaluation:** Triggers an AI-powered evaluation process via **GitHub Actions** when a student pushes new code.
- **Intelligent Feedback:** Utilizes the **OpenAI API** to analyze code and generate detailed, contextual feedback.
- **Feedback Delivery:** Delivers feedback directly to the student's repository in a **ASSIGNMENT_EVALUATION.md** file and stores it in the AFS database for the professor's review.
- **Submission Management:** Allows professors to set and track submission limits for automated feedback.
- **Centralized Dashboard:** Provides professors with a comprehensive view of all coursework and student submissions.

---

## :toolbox: Technology Stack & Tools

AFS is built using the following technologies and integrations.

### Frontend

- **Language:** TypeScript
- **Framework:** React with Vite
- **Styling:** Tailwind CSS

### Backend

- **Runtime:** Node.js
- **Session Management:** Passport.js
- **Environment Variables:** DotEnv
- **Database:** Supabase

### Core Integrations & Tools

- **GitHub Classroom:** For assignment management.
- **GitHub Actions:** To automate the feedback workflow.
- **OpenAI API:** For AI-powered feedback generation.
- **Docker:** For containerization and portability.
- **Docker Compose:** For multi-container orchestration.

---

## :package: Key Libraries

- **Repomix:** An open-source tool that simplifies a code repository into a single, structured XML file, making it easier for AI models to analyze.
- **PapaParse:** Used for parsing CSV files, such as uploading student rosters.

---

## :art: UI/UX Design

The user interface and user experience design for AFS are documented in our Figma file.
**[Figma Design](https://www.figma.com/design/cp9XokUybiPdkMZtLpameU/AFS?node-id=6-2&t=vFVB0tH3GaZ7jDIu-1)**

---

## :video_camera: Video Demonstration

**TBD**

---

## :gear: Deployment

The AI Feedback System is deployed on Hetzner using **Docker** and **Docker Compose** to containerize and orchestrate the application. The application is publicly accessible at:
**[ai-feedback.live](https://ai-feedback.live/)**

---

## :email: Contacts

For questions or collaboration, please contact the development team:

- **Helmi Griffiths** - Full Stack Developer ([GitHub](https://github.com/HelmiGr))
- **Sam Chou** - Full Stack Developer ([GitHub](https://github.com/FuzzyKala))
- **Ville Matilainen** - Full Stack Developer ([GitHub](https://github.com/vima20))
