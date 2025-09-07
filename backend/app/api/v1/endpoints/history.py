from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app import models, crud, schemas
from app.api.v1.endpoints.auth import get_current_user, get_db

router = APIRouter()

@router.get("/history/conversations", response_model=List[schemas.history.ConversationSummary])
async def get_user_conversations(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Retrieve all conversation summaries for the current user."""
    return await crud.crud_history.get_conversations_by_user(db=db, user_id=current_user.id)

@router.get("/history/conversations/{conversation_id}", response_model=schemas.history.Conversation)
async def get_full_conversation(
    conversation_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Retrieve a full conversation, including all messages."""
    conversation = await crud.crud_history.get_conversation(db=db, conversation_id=conversation_id, user_id=current_user.id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation
