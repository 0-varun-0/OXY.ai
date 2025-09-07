from fastapi import FastAPI

# Create an instance of the FastAPI class
app = FastAPI(
    title="OXY.ai API",
    description="API for the Dermatology Visual Question Answering (VQA) Chatbot.",
    version="0.1.0",
)

@app.get("/")
def read_root():
    """
    Root endpoint that returns a welcome message.
    """
    return {"message": "Welcome to the OXY.ai FastAPI server!"}