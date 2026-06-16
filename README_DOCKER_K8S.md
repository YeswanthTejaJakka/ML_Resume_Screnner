# Docker & Kubernetes Integration

This project has been updated with Docker and Kubernetes configurations for seamless deployment.

## Files Added/Modified

- `backend/Dockerfile`: Optimized image with model pre-downloading to prevent runtime crashes.
- `backend/download_models.py`: Script to cache AI models during image build.
- `frontend/Dockerfile`: Multi-stage build for React/Vite with Nginx.
- `docker-compose.yml`: For local development and testing.
- `k8s/`: Kubernetes manifests for deployment.
  - `backend.yaml`: Backend Deployment and ClusterIP Service.
  - `frontend.yaml`: Frontend Deployment and LoadBalancer Service.
  - `secrets.yaml`: Template for `GEMINI_API_KEY`.

## Local Development (Docker Compose)

1. Create a `.env` file in the `backend/` directory:
   ```env
   GEMINI_API_KEY=your_actual_key_here
   ```
2. Run the application:
   ```bash
   docker-compose up --build
   ```
3. Access the application:
   - Frontend: `http://localhost`
   - Backend API: `http://localhost:8000`

## Kubernetes Deployment

1. **Prepare Secrets**:
   - Encode your Gemini API Key in base64:
     ```bash
     echo -n "YOUR_API_KEY" | base64
     ```
   - Update `k8s/secrets.yaml` with the base64 string.
   - Apply the secret:
     ```bash
     kubectl apply -f k8s/secrets.yaml
     ```

2. **Build and Push Images**:
   - Build the images (replace `your-repo` with your Docker Hub username or registry):
     ```bash
     docker build -t your-repo/resume-backend:latest ./backend
     docker build -t your-repo/resume-frontend:latest ./frontend
     ```
   - Push them:
     ```bash
     docker push your-repo/resume-backend:latest
     docker push your-repo/resume-frontend:latest
     ```
   - Update the image names in `k8s/backend.yaml` and `k8s/frontend.yaml` if necessary.

3. **Deploy to Kubernetes**:
   ```bash
   kubectl apply -f k8s/backend.yaml
   kubectl apply -f k8s/frontend.yaml
   ```

4. **Access the App**:
   - The frontend service is type `LoadBalancer`. Get the external IP:
     ```bash
     kubectl get services frontend-service
     ```

## Backend Stability
The backend is now more stable because:
1. **Model Pre-downloading**: Models are downloaded during the `docker build` phase. This avoids "Out of Memory" or "Timeout" errors during the first request and allows the container to start without internet access if needed (though Gemini API still requires it).
2. **Resource Limits**: K8s manifests include memory requests (1Gi) and limits (2Gi) specifically tuned for Florence-2 and Sentence-Transformers.
3. **Health Probes**: Liveness and Readiness probes ensure Kubernetes only sends traffic to the pod when the AI models are fully loaded and the API is ready.
