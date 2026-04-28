# Use a lightweight Python base image
FROM python:3.9-slim

# Set working directory
WORKDIR /code

# Copy dependencies first (for caching layers)
COPY ./requirements.txt /code/requirements.txt

# Install dependencies (no cache dir to save space)
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the rest of the app
COPY ./app /code/app

# Command to run the app using Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]