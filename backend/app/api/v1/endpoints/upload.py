from fastapi import APIRouter, UploadFile, File, HTTPException, status
import aiofiles
import uuid
import os

from app.core.config import settings
from app.schemas.msg import Msg

router = APIRouter()

@router.post("/upload", response_model=Msg, status_code=status.HTTP_201_CREATED)
async def upload_image(file: UploadFile = File(...)):
    """
    Uploads an image, validates it, and saves it to the server.
    """
    # 1. Validate MIME type
    if file.content_type not in settings.ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported file type. Allowed types are {settings.ALLOWED_MIME_TYPES}"
        )

    # 2. Validate file size
    contents = await file.read()
    if len(contents) > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size exceeds the limit of {settings.MAX_FILE_SIZE_MB}MB"
        )
    
    # 3. Generate a unique filename and save the file
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)

    try:
        async with aiofiles.open(file_path, 'wb') as out_file:
            await out_file.write(contents)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"There was an error writing the file: {e}"
        )

    return {"message": f"File '{unique_filename}' uploaded successfully."}


from PIL import Image
from app.core.ai_service import model_service

@router.get("/classify/{image_filename}")
async def classify_uploaded_image(image_filename: str):
    """
    (Temporary Test Endpoint)
    Classifies a previously uploaded image using the AI model.
    """
    file_path = os.path.join(settings.UPLOAD_DIR, image_filename)

    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found."
        )

    try:
        image = Image.open(file_path)
        labels = settings.DERMATOLOGY_LABELS
        
        # Perform classification
        predictions = model_service.classify_image(image, labels)

        return predictions

    except HTTPException as e:
        # Re-raise HTTP exceptions
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing image: {e}"
        )
