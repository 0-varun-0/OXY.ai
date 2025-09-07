from fastapi import FastAPI
from app.core.config import settings
from app.schemas.msg import Msg
from app.api.v1.endpoints import upload

# Create an instance of the FastAPI class using settings from config
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="API for the Dermatology Visual Question Answering (VQA) Chatbot.",
)

app.include_router(upload.router, prefix=settings.API_V1_STR, tags=["Upload"])

@app.get("/", response_model=Msg)
def read_root():
    """
    Root endpoint that returns a welcome message.
    
    The response is validated against the Msg schema.
    """
    return {"message": f"Welcome to the {settings.PROJECT_NAME}!"}
