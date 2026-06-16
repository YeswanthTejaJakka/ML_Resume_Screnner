import tempfile
import os
import fitz  # PyMuPDF
from pdf2image import convert_from_bytes
from app.ocr_engine import ocr_model

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Hybrid Extraction:
    1. Try PyMuPDF (Instant for digital PDFs)
    2. Fallback to Florence-2 OCR (Only for scanned/images)
    """
    full_text = ""
    
    # --- PHASE 1: PyMuPDF (Instant Digital Extraction) ---
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        for page in doc:
            full_text += page.get_text()
        doc.close()
    except Exception as e:
        print(f"PyMuPDF Error: {e}")

    # --- PHASE 2: Check if extraction was successful ---
    # If we got substantial text, return it immediately (Instant!)
    if len(full_text.strip()) > 100:
        print("✅ Digital text extracted instantly via PyMuPDF.")
        return full_text.strip()

    # --- PHASE 3: Fallback to Florence-2 OCR (Scanned PDF) ---
    print("⚠️ PDF appears to be an image. Falling back to Florence-2 OCR...")
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
