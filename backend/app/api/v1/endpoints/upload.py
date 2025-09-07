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



