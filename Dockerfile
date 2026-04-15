# ---------- FRONTEND ----------
FROM node:20 AS frontend

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend .
RUN npm run build

# ---------- BACKEND ----------
FROM python:3.11

WORKDIR /app

# Install backend deps
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend
COPY backend .

# Copy frontend build + node_modules
COPY --from=frontend /app/frontend ./

# Install Node in final image
RUN apt-get update && apt-get install -y nodejs npm

EXPOSE 8080

# Run BOTH frontend + backend
CMD sh -c "uvicorn main:app --host 0.0.0.0 --port 8000 & npm run start -- --port 8080"