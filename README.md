# AI-Feedback System

<p>
  
<img alt="React Badge" src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" />

<img alt="Vite Badge" src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" />

<img alt="Nodejs Badge" src="https://img.shields.io/badge/Node%20js-3c873a?style=for-the-badge&logo=nodedotjs&logoColor=white" />

<img alt="TypeScript Badge" src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />

<img alt="Tailwind_CSS Badge" src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" />

<img alt="chatGPT" src="https://img.shields.io/badge/chatGPT-0A0A0A?style=for-the-badge&logo=openai&logoColor=white" />

</p>

## :books: Table of the content

- [Introduction](#bulb-introduction)
- [Start](#rocket-start)
- [UI Diagram](#art-ui-diagram)
- [API document](#page_with_curl-api-document)
- [Key Libraries](#package-key-libraries)
- [Deployment](#gear-deployment)
- [Video Demonstration](#video_camera-video-demonstration)
- [Contacts](#email-contacts)

## :bulb: Introduction

This system is designed as a full-stack web application that automates feedback for programming assignments submitted via GitHub Classroom. It consists of three core layers—Frontend, Backend, and External Integrations—each playing a distinct role in delivering real-time, AI-assisted insights to both students and teachers.

The Frontend, built with React, provides a user-friendly interface for authentication, repository selection, and feedback visualization. It communicates with the Backend via RESTful APIs.

The Backend, powered by Node.js and Express, handles user authentication through GitHub OAuth, fetches repository data via the GitHub API, and manages prompt generation and communication with AI services like OpenAI or DeepSeek. It also formats and returns feedback, summaries, and CSV exports to the frontend.

The system leverages external APIs—GitHub API for accessing student submissions and AI APIs for analyzing code and generating feedback—without requiring a dedicated database for the MVP.

Components are containerized using Docker to ensure portability and consistent development environments.

## :rocket: Start

TBD

## :art: UI Diagram

TBD

## :video_camera: Video Demonstration

TBD

## :page_with_curl: API document

TBD

## :package: Key Libraries

- [Chart.js](https://www.chartjs.org/) – Used to display analytics and data visualizations
- [PapaParse](https://www.papaparse.com/) – Used to parse CSV files (e.g., uploading student rosters)

## :gear: Deployment

TBD

## :email: Contacts

- [Lassi Riekkola](https://github.com/LassiRiekkola) - Backend developer
- [Helmi Griffiths](https://github.com/HelmiGr) - Full Stack developer
- [Sam Chou](https://github.com/FuzzyKala) - Full Stack developer
- [Ville Matilainen](https://github.com/vima20) - Full Stack developer
