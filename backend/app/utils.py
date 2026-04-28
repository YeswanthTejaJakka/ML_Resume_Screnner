import tempfile
import os
from pdf2image import convert_from_bytes
from app.ocr_engine import ocr_model

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Converts PDF -> Images -> Text (using Florence-2)
    """
    full_text = ""
    
    with tempfile.TemporaryDirectory() as temp_dir:
        try:
            # Convert PDF to images
            images = convert_from_bytes(file_bytes)
            
            for i, image in enumerate(images):
                # Save temp image
                image_path = os.path.join(temp_dir, f"page_{i}.jpg")
                image.save(image_path, "JPEG")
                
                # Run OCR
                print(f"🔍 Processing Page {i+1} with AI...")
                page_text = ocr_model.extract_text(image_path)
                full_text += page_text + "\n\n"
                
        except Exception as e:
            print(f"PDF Processing Error: {e}")
            return ""

    return full_text.strip()