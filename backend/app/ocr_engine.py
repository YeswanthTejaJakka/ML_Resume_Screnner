import torch
from transformers import AutoProcessor, AutoModelForCausalLM
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from transformers import dynamic_module_utils
dynamic_module_utils.check_imports = lambda filename: []

from PIL import Image
import io
import os

# We use Microsoft's Florence-2 (Base)
MODEL_NAME = 'microsoft/Florence-2-base'

class OCRModel:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = None
        self.processor = None
        
        try:
            logger.info(f"⏳ Loading Florence-2 Model ({MODEL_NAME}) on {self.device.upper()}...")
            
            dtype = torch.float16 if self.device == "cuda" else torch.float32

            self.processor = AutoProcessor.from_pretrained(
                MODEL_NAME, 
                trust_remote_code=True
            )
            
            self.model = AutoModelForCausalLM.from_pretrained(
                MODEL_NAME, 
                trust_remote_code=True,
                torch_dtype=dtype
            ).to(self.device)

            logger.info(f"✅ OCR Engine Loaded Successfully.")
        except Exception as e:
            logger.error(f"❌ Failed to load Florence-2 model: {e}")

    def extract_text(self, image_path: str) -> str:
        if not self.model or not self.processor:
            logger.error("OCR Model or Processor not initialized.")
            return "OCR Engine unavailable."
        
        try:
            image = Image.open(image_path)
            if image.mode != "RGB":
                image = image.convert("RGB")

            # Task Prompt: <OCR> extracts all text.
            prompt = "<OCR>"

            inputs = self.processor(text=prompt, images=image, return_tensors="pt").to(self.device, self.model.dtype)

            generated_ids = self.model.generate(
                input_ids=inputs["input_ids"],
                pixel_values=inputs["pixel_values"],
                max_new_tokens=1024,
                num_beams=3,
                do_sample=False
            )

            generated_text = self.processor.batch_decode(generated_ids, skip_special_tokens=False)[0]

            parsed_answer = self.processor.post_process_generation(
                generated_text, 
                task=prompt, 
                image_size=(image.width, image.height)
            )

            return parsed_answer.get(prompt, "")

        except Exception as e:
            logger.error(f"OCR Runtime Error: {e}")
            return ""

# Create Singleton
ocr_model = OCRModel()