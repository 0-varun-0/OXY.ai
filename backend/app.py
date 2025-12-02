# backend/app.py

import os
import uuid
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import logging
import torch
from transformers import ViltProcessor, ViltForQuestionAnswering

# Paths
HERE = os.path.dirname(__file__)
MODEL_DIR = os.path.join(HERE, "models", "vilt_vqa_ft")
MODEL_MARKER = os.path.join(MODEL_DIR, ".model_ready")
UPLOAD_DIR = os.path.join(HERE, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("vqa-backend")

# --- Model Loading ---
VQA_MODEL = None
VQA_PROCESSOR = None
USE_MODEL = False

try:
    if os.path.isfile(MODEL_MARKER):
        logger.info(f"Loading VQA model from: {MODEL_DIR}")
        VQA_PROCESSOR = ViltProcessor.from_pretrained(MODEL_DIR)
        VQA_MODEL = ViltForQuestionAnswering.from_pretrained(MODEL_DIR)
        logger.info("VQA model loaded successfully.")
        USE_MODEL = True
    else:
        logger.error("VQA model not found. You MUST run: python backend/download.py")

except Exception as e:
    logger.error(f"Error loading model: {e}", exc_info=True)
    raise RuntimeError("Failed to load VQA model. Check logs for details.") from e

# --- API Definitions ---
from pydantic import BaseModel

class QAResponse(BaseModel):
    question: str
    answer: str

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    image_id = str(uuid.uuid4())
    save_path = os.path.join(UPLOAD_DIR, image_id + ".jpg")
    content = await file.read()
    with open(save_path, "wb") as f:
        f.write(content)
    return {"image_id": image_id}

@app.post("/query", response_model=QAResponse)
async def query(image_id: str = Form(...), question: str = Form(...)):
    if not USE_MODEL:
        raise HTTPException(status_code=500, detail="Model not available. Please check the backend logs.")

    image_path = os.path.join(UPLOAD_DIR, image_id + ".jpg")
    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Image not found")

    try:
        image = Image.open(image_path).convert("RGB")
        
        encoding = VQA_PROCESSOR(image, question, return_tensors="pt")
        
        outputs = VQA_MODEL(**encoding)
        logits = outputs.logits
        idx = logits.argmax(-1).item()
        answer = VQA_MODEL.config.id2label[idx]

        return QAResponse(
            question=question,
            answer=answer,
        )

    except Exception as e:
        logger.error(f"Error during query processing: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An error occurred while processing the query.")
