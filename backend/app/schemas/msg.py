from pydantic import BaseModel

class Msg(BaseModel):
    """
    A Pydantic model for generic message responses.
    """
    message: str
