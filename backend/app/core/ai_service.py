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

    def classify_image(self, image, labels: list[str]) -> dict[str, float]:
        """
        Performs zero-shot classification of an image against a list of text labels.

        Args:
            image: A PIL Image object.
            labels: A list of string descriptions.

        Returns:
            A dictionary mapping each label to its probability score.
        """
        if self.model is None or self.processor is None:
            raise RuntimeError("AI model is not loaded.")

        try:
            inputs = self.processor(
                text=labels, images=image, return_tensors="pt", padding=True
            ).to(self.device)

            with torch.no_grad():
                outputs = self.model(**inputs)
            
            logits_per_image = outputs.logits_per_image
            probs = logits_per_image.softmax(dim=1).cpu().numpy().flatten()

            return {label: float(prob) for label, prob in zip(labels, probs)}
        except Exception as e:
            logger.error(f"Error during image classification: {e}")
            # In a real app, you might want more specific error handling
            raise

# Instantiate the model on module load
model_service = AIModel()
