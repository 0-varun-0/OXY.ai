from pydantic import BaseModel

class VqaRequest(BaseModel):
    image_filename: str
    question: str

class VqaResponse(BaseModel):
    answer: str
    disclaimer: str
