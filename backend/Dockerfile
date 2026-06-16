#backend is running in 8000 port
# Use a lightweight Python base image
FROM python:3.9-slim

# Set working directory
WORKDIR /code

# Install system dependencies (e.g. poppler-utils for pdf2image)
RUN apt-get update && apt-get install -y --no-install-recommends \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# Copy dependencies first (for caching layers)
COPY ./requirements.txt /code/requirements.txt

# Install dependencies (no cache dir to save space)
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Pre-download models to avoid runtime crashes/delays
COPY ./download_models.py /code/download_models.py
RUN python /code/download_models.py

# Suppress HuggingFace symlink warnings
ENV HF_HUB_DISABLE_SYMLINKS_WARNING=1

# Copy the rest of the app
COPY ./app /code/app

# Command to run the app using Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
