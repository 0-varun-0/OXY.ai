from pydantic import BaseModel
from datetime import datetime

# Schema for message data
class Message(BaseModel):
    id: int
    text: str
    is_from_user: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Schema for conversation data, including its messages
class Conversation(BaseModel):
    id: int
    user_id: int
    image_path: str
    created_at: datetime
    messages: list[Message] = []

    class Config:
        from_attributes = True

# Schema for listing conversations (without messages)
class ConversationSummary(BaseModel):
    id: int
    image_path: str
    created_at: datetime

    class Config:
        from_attributes = True
