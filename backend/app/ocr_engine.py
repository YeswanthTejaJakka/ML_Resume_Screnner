import torch
from transformers import AutoProcessor, AutoModelForCausalLM

from transformers import dynamic_module_utils
dynamic_module_utils.check_imports = lambda filename: []

from PIL import Image
import io
import os

# We use Microsoft's Florence-2 (Base)
MODEL_NAME = 'microsoft/Florence-2-base'

class OCRModel:
    def __init__(self):
        print(f"⏳ Loading Florence-2 Model ({MODEL_NAME})...")
        
        # Detect Hardware
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        dtype = torch.float16 if self.device == "cuda" else torch.float32

        self.processor = AutoProcessor.from_pretrained(
            MODEL_NAME, 
            trust_remote_code=True
        )
        
        # We use attn_implementation="sdpa" to ensure it uses 
        # standard PyTorch attention (compatible with Windows)
        self.model = AutoModelForCausalLM.from_pretrained(
            MODEL_NAME, 
            trust_remote_code=True,
            torch_dtype=dtype,
            attn_implementation="sdpa" 
        ).to(self.device)

        print(f"✅ OCR Engine Loaded on {self.device.upper()}")

    def extract_text(self, image_path: str) -> str:
        """
        Extracts detailed text from an image using Florence-2.
        """
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
            print(f"OCR Error: {e}")
            return ""

# Create Singleton
ocr_model = OCRModel()