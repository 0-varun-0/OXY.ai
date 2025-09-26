# OXY.ai: AI-Powered MedicalVisual Question Answering

![Python](https://img.shields.io/badge/Python-3.9%2B-blue.svg) ![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-green.svg) ![React](https://img.shields.io/badge/React-18%2B-blue.svg) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg) ![Docker](https://img.shields.io/badge/Docker-20.10%2B-blue.svg)

OXY.ai is a proof-of-concept web application designed for AI-assisted analysis of skin lesion images. Users can upload an image, ask questions in natural language, and receive a classification based on the OpenAI CLIP model, all within a secure, session-based chat interface.

> **⚠️ MEDICAL DISCLAIMER**
> This is an AI-generated analysis and **not a medical diagnosis**. This tool is for educational and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. **Always consult a qualified dermatologist** for any health concerns.

---

## ✨ Features

- **Secure User Authentication:** Full registration and JWT-based login system to protect user data and history.
- **Image Upload & Preview:** A clean interface for uploading JPG/PNG images with client-side validation and preview.
- **AI-Powered VQA:** Leverages the OpenAI CLIP model to perform zero-shot classification on uploaded images based on natural language questions.
- **Persistent Conversation History:** All user interactions, including images, questions, and AI responses, are saved per-user to a local SQLite database.
- **Fully Containerized:** The entire application stack (React Frontend, FastAPI Backend) is containerized with Docker and orchestrated with Docker Compose for easy, one-command setup.
- **Auto-Generated API Docs:** The FastAPI backend provides interactive API documentation via Swagger UI and ReDoc.

---

## 🛠️ Technology Stack & Architecture

The project follows a modern, decoupled architecture with a React single-page application (SPA) communicating with a Python REST API.

| Area      | Technology                                       | Purpose                                           |
|-----------|--------------------------------------------------|---------------------------------------------------|
| Frontend  | React, TypeScript, Vite, Material-UI (MUI)       | Building a responsive, modern user interface.     |
| Backend   | Python, FastAPI, Uvicorn                         | High-performance, asynchronous API service.       |
| AI        | PyTorch, Hugging Face Transformers (CLIP)        | Zero-shot image classification model.             |
| Database  | SQLite, SQLAlchemy (Async)                       | Local, persistent storage for user & chat data.   |
| Deployment| Docker, Docker Compose, Nginx                    | Containerization and production-like deployment.  |

**Data Flow:** `User -> React (Nginx) -> FastAPI (Uvicorn) -> CLIP Model & SQLite DB -> FastAPI -> React -> User`

---

## 🚀 Getting Started (Production Mode with Docker)

This is the simplest and recommended method to run the entire application.

### Prerequisites

- Docker (`20.10.0` or newer)
- Docker Compose (`1.29.0` or newer)
- Git

### Execution Steps

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd OXY.ai
    ```

2.  **Build and Run the Containers:**
    This command will build the images for both the frontend and backend and start the services in detached mode.
    ```bash
    docker-compose up --build -d
    ```

3.  **Access the Application:**
    -   **Frontend UI:** Open your browser to `http://localhost:5173`
    -   **Backend API Docs (Swagger):** `http://localhost:8000/docs`

4.  **Using the Application:**
    -   You will be prompted to register a new user account first.
    -   Log in with your new credentials to access the image upload and chat features.

5.  **Stopping the Application:**
    ```bash
    docker-compose down
    ```

---

## 👨‍💻 Local Development Setup

For contributors who wish to run the services directly on the host machine.

### Backend Server

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize the database (only needs to be run once)
python -m app.db.init_db

# Run the development server
uvicorn app.main:app --reload
```

### Frontend Server

```bash
# In a new terminal, navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

---

## 🧪 Testing and Quality

- **Run Backend Unit Tests:**
  ```bash
  cd backend
  PYTHONPATH=. ./venv/bin/pytest
  ```

- **Run Frontend Linter:**
  ```bash
  cd frontend
  npm run lint
  ```

### Known Issues

-   **Frontend Tooling:** The ESLint and TypeDoc configurations in the frontend have unresolved dependency conflicts. While `npm install` completes, the `lint` and `docs` scripts may fail. This is a non-critical issue related to build tooling and does not affect the application's functionality.
