from fastapi import APIRouter, HTTPException, status, Body
from PIL import Image
import os

from fastapi import APIRouter, HTTPException, status, Body, Depends
from PIL import Image
import os

from app import models, crud
from app.core.config import settings
from app.core.ai_service import model_service
from app.schemas.vqa import VqaRequest, VqaResponse
from app.api.v1.endpoints.auth import get_current_user, get_db
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()

@router.post("/vqa", response_model=VqaResponse)
async def visual_question_answering(
    *, 
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
    request: VqaRequest = Body(...)
):
    """
    Handles a VQA request, now with conversation persistence.
    """
    # If conversation_id is provided, we could handle follow-up questions.
    # For now, we will treat every question as the start of a new analysis.
    if request.conversation_id:
        # Advanced: Here you could add logic for multi-turn conversations.
        # For this stage, we'll just return a simple message.
        conversation = await crud.crud_history.get_conversation(db=db, conversation_id=request.conversation_id, user_id=current_user.id)
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        await crud.crud_history.add_message(db=db, conversation_id=conversation.id, text=request.question, is_from_user=True)
        canned_answer = "I am currently able to provide an analysis for the initial question only."
        await crud.crud_history.add_message(db=db, conversation_id=conversation.id, text=canned_answer, is_from_user=False)
        
        return VqaResponse(
            answer=canned_answer,
            conversation_id=conversation.id,
            disclaimer=settings.MEDICAL_DISCLAIMER
        )

    # --- Logic for a new conversation ---
    file_path = os.path.join(settings.UPLOAD_DIR, request.image_filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"Image file not found: {request.image_filename}")

    # Create a new conversation in the database
    conversation = await crud.crud_history.create_conversation(db=db, user_id=current_user.id, image_path=request.image_filename)
    
    # Save the user's question
    await crud.crud_history.add_message(db=db, conversation_id=conversation.id, text=request.question, is_from_user=True)

    # Perform AI analysis
    try:
        image = Image.open(file_path).convert("RGB")
        labels = settings.DERMATOLOGY_LABELS
        predictions = model_service.classify_image(image, labels)
        top_prediction = max(predictions.items(), key=lambda item: item[1])
        ai_answer = f"My analysis suggests this could be '{top_prediction[0]}' with a confidence of {top_prediction[1]:.1%}."

        # Save the AI's answer
        await crud.crud_history.add_message(db=db, conversation_id=conversation.id, text=ai_answer, is_from_user=False)

        return VqaResponse(
            answer=ai_answer,
            conversation_id=conversation.id,
            disclaimer=settings.MEDICAL_DISCLAIMER
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during AI processing: {e}")

