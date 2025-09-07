from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.schemas.msg import Msg
from app.api.v1.endpoints import upload
from app.core.ai_service import model_service # Import the service
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create an instance of the FastAPI class using settings from config
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="API for the Dermatology Visual Question Answering (VQA) Chatbot.",
)

@app.on_event("startup")
async def startup_event():
    """Event handler for application startup."""
    logger.info("Application startup...")
    # This will trigger the model loading
    if model_service.model is None or model_service.processor is None:
        logger.error("AI model failed to load!")
    else:
        logger.info("AI model loaded and ready.")

app.include_router(upload.router, prefix=settings.API_V1_STR, tags=["Upload"])
app.include_router(vqa.router, prefix=settings.API_V1_STR, tags=["VQA"])
app.include_router(auth.router, prefix=settings.API_V1_STR, tags=["Authentication"])
app.include_router(history.router, prefix=settings.API_V1_STR, tags=["History"])

@app.get("/", response_model=Msg)
def read_root():
    """
    Root endpoint that returns a welcome message.
    
    The response is validated against the Msg schema.
    """
    return {"message": f"Welcome to the {settings.PROJECT_NAME}!"}
t("/", response_model=Msg)
def read_root():
    """
    Root endpoint that returns a welcome message.
    
    The response is validated against the Msg schema.
    """
    return {"message": f"Welcome to the {settings.PROJECT_NAME}!"}
