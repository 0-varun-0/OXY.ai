from pydantic import BaseModel
from typing import Optional

class VqaRequest(BaseModel):
    image_filename: str
    question: str
    conversation_id: Optional[int] = None

class VqaResponse(BaseModel):
    answer: str
    conversation_id: int
    disclaimer: str
