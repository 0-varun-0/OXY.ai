from fastapi import APIRouter, HTTPException, status, Body
from PIL import Image
import os

from app.core.config import settings
from app.core.ai_service import model_service
from app.schemas.vqa import VqaRequest, VqaResponse

router = APIRouter()

@router.post("/vqa", response_model=VqaResponse)
async def visual_question_answering(request: VqaRequest = Body(...)):
    """
    Handles a visual question answering request.
    - Validates the image file exists.
    - Analyzes the question for intent.
    - Triggers AI classification.
    - Formulates a response with a disclaimer.
    """
    file_path = os.path.join(settings.UPLOAD_DIR, request.image_filename)
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Image file not found: {request.image_filename}"
        )

    # Simple keyword-based intent recognition
    question_lower = request.question.lower()
    is_classification_request = any(keyword in question_lower for keyword in ["what is this", "classify", "identify"])

    if not is_classification_request:
        return VqaResponse(
            answer="I am currently configured to only classify skin lesions. Please ask a question like 'What is this?'",
            disclaimer=settings.MEDICAL_DISCLAIMER
        )

    try:
        image = Image.open(file_path).convert("RGB")
        labels = settings.DERMATOLOGY_LABELS
        
        predictions = model_service.classify_image(image, labels)
        
        # Find the top prediction
        top_prediction = max(predictions.items(), key=lambda item: item[1])
        top_label, top_prob = top_prediction

        answer = (
            f"My analysis suggests this could be '{top_label}' with a confidence of "
            f"{top_prob:.1%}."
        )

        return VqaResponse(answer=answer, disclaimer=settings.MEDICAL_DISCLAIMER)

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during AI processing: {e}"
        )
