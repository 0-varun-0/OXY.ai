import logging
from transformers import CLIPProcessor, CLIPModel
import torch

logger = logging.getLogger(__name__)

class AIModel:
    """Singleton class to load and hold the CLIP model."""
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            logger.info("Creating AIModel singleton instance...")
            cls._instance = super(AIModel, cls).__new__(cls)
            cls._instance.model = None
            cls._instance.processor = None
            cls._instance.device = "cuda" if torch.cuda.is_available() else "cpu"
            cls._instance.load_model()
        return cls._instance

    def load_model(self):
        """Loads the CLIP model and processor from Hugging Face."""
        model_id = "openai/clip-vit-base-patch32"
        logger.info(f"Loading model: {model_id} on device: {self.device}")
        try:
            self.model = CLIPModel.from_pretrained(model_id).to(self.device)
            self.processor = CLIPProcessor.from_pretrained(model_id)
            logger.info("CLIP model and processor loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load AI model: {e}")
            raise

# Instantiate the model on module load
model_service = AIModel()
