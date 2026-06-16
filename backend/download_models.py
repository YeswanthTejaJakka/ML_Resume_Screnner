from sentence_transformers import SentenceTransformer
from transformers import AutoProcessor, AutoModelForCausalLM
import torch

# Models to download
SENTENCE_MODEL = 'all-MiniLM-L6-v2'
FLORENCE_MODEL = 'microsoft/Florence-2-base'

def download():
    print(f"Downloading {SENTENCE_MODEL}...")
    SentenceTransformer(SENTENCE_MODEL)
    
    print(f"Downloading {FLORENCE_MODEL}...")
    AutoProcessor.from_pretrained(FLORENCE_MODEL, trust_remote_code=True)
    AutoModelForCausalLM.from_pretrained(FLORENCE_MODEL, trust_remote_code=True)

if __name__ == "__main__":
    download()
