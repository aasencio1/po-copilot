# 🧠 Po-Copilot Integration

Integración entre el backend principal (NestJS) y el microservicio NLU (FastAPI).

## 🚀 Requisitos
- Node.js ≥ 18
- Python ≥ 3.10
- FastAPI y Uvicorn instalados (`pip install fastapi uvicorn`)

## ⚙️ Variables de entorno
Crea un archivo `.env` en `apps/api`:
```bash
NODE_ENV=development
PORT=3000
NLU_URL=http://127.0.0.1:8001


FastAPI
Desde powershell o consola Linux

cd services/nlu
.\start-fastapi.ps1

NestJS
cd apps/api
npm run start:dev


🧪 Pruebas rápidas

Health Check
curl http://127.0.0.1:8001/health

Endpoint generate
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{"productName":"Po-Copilot","domain":"SaaS","persona":"Product Owner","notes":[{"id":"n1","speaker":"user","language":"en","text":"Hello"}]}'
