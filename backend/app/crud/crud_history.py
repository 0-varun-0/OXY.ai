from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app import models

async def create_conversation(db: AsyncSession, *, user_id: int, image_path: str) -> models.Conversation:
    db_conversation = models.Conversation(user_id=user_id, image_path=image_path)
    db.add(db_conversation)
    await db.commit()
    await db.refresh(db_conversation)
    return db_conversation

async def add_message(db: AsyncSession, *, conversation_id: int, text: str, is_from_user: bool) -> models.Message:
    db_message = models.Message(conversation_id=conversation_id, text=text, is_from_user=is_from_user)
    db.add(db_message)
    await db.commit()
    await db.refresh(db_message)
    return db_message

async def get_conversation(db: AsyncSession, *, conversation_id: int, user_id: int) -> models.Conversation | None:
    result = await db.execute(
        select(models.Conversation)
        .where(models.Conversation.id == conversation_id, models.Conversation.user_id == user_id)
        .options(selectinload(models.Conversation.messages))
    )
    return result.scalars().first()

async def get_conversations_by_user(db: AsyncSession, *, user_id: int) -> list[models.Conversation]:
    result = await db.execute(
        select(models.Conversation)
        .where(models.Conversation.user_id == user_id)
        .order_by(models.Conversation.created_at.desc())
    )
    return result.scalars().all()
