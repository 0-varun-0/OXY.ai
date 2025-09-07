# OXY.ai Presentation Outline

---

### 1. Title Slide
- **Project Title:** OXY.ai - AI-Powered Dermatology Visual Question Answering
- **Your Name:** Varun
- **Course:** CSE7101 Capstone Project
- **Date:** September 2025

---

### 2. Introduction & Problem Statement
- **Problem:** Access to dermatological advice can be slow and expensive. Patients often have questions about skin lesions and need preliminary information quickly.
- **Goal:** To develop an educational tool that provides instant, AI-driven analysis of skin lesion images to help users understand potential conditions.
- **Disclaimer:** Emphasize that this is an educational tool, NOT a medical diagnostic device.

---

### 3. System Architecture
- **Diagram:** (Create a simple diagram showing the following components)
  - **Frontend (React):** The user interface running in the browser.
  - **Backend (FastAPI):** The Python server that handles logic.
  - **AI Model (CLIP):** The core AI engine running on the server.
  - **Database (SQLite):** Stores user and conversation data.
  - **Docker:** Containers for both frontend and backend.
- **Flow:** User uploads image via React -> Nginx serves app -> Request goes to FastAPI -> FastAPI uses CLIP model -> Response sent back to user.

---

### 4. Technology Stack
- **Frontend:** React, TypeScript, Vite, Material-UI (MUI), React Router
- **Backend:** Python, FastAPI, Uvicorn
- **AI:** PyTorch, Hugging Face Transformers (CLIP Model)
- **Database:** SQLite with SQLAlchemy
- **Deployment:** Docker & Docker Compose

---

### 5. Live Demo Script
1.  **Show the running application** (via Docker Compose).
2.  **Registration:** Show the Register page and create a new user.
3.  **Login:** Show the Login page and sign in with the new user.
4.  **Image Upload:** Upload a clear test image of a skin lesion.
5.  **VQA:** Ask a question like "What is this lesion?"
6.  **Show Response:** Point out the AI-generated answer and the prominent medical disclaimer.
7.  **Show History:** Navigate to the (to-be-built or conceptual) history page to show the conversation is saved.
8.  **Logout:** Click the logout button to show the session ends and redirects to login.

---

### 6. Key Features & Technical Implementation
- **Zero-Shot Learning:** Explain how CLIP can classify images without being explicitly trained on our specific dermatology labels.
- **RESTful API:** Describe the key API endpoints (`/register`, `/login`, `/upload`, `/vqa`, `/history`). Show the auto-generated FastAPI docs at `/docs`.
- **Authentication:** Explain the JWT token-based authentication flow.
- **Persistence:** Explain how user data, conversations, and image paths are stored in the SQLite database.
- **Containerization:** Explain the benefits of using Docker for consistent development and deployment.

---

### 7. Challenges & Future Work
- **Challenges:**
  - Integrating large AI models into a web service.
  - Ensuring real-time performance.
  - Frontend dependency management (mention the linter/typedoc issues).
- **Future Work:**
  - Implement multi-turn conversations.
  - Allow users to view and resume past conversations from a history page.
  - Improve model accuracy with fine-tuning.
  - Deploy to a cloud service.

---

### 8. Q&A
- Open the floor for questions.
