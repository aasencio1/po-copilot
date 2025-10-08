from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional, Literal

class RawNote(BaseModel):
    id: str
    speaker: Literal["client","po","user","dev"]
    language: Literal["es","en"]
    text: str
    timestamp: Optional[str] = None

class AnalyzeRequest(BaseModel):
    language: Literal["es","en"]
    industry: str
    project: str
    notes: List[RawNote]
    documents: Optional[List[dict]] = None

app = FastAPI()

@app.get("/health")
def health():
    return {"ok": True, "service": "po-copilot-nlu"}

@app.post("/analyze")
def analyze(req: AnalyzeRequest):
    # Versión mínima para Día 1: detecta dominio por palabras clave
    full = " ".join([n.text for n in req.notes]).lower()
    domains = []
    if any(k in full for k in ["endpoint","openapi","api","cola","evento"]): domains.append("API")
    if any(k in full for k in ["dbt","airflow","dataset","tabla","métrica","pipeline"]): domains.append("DATA")
    if any(k in full for k in ["intent","slot","prompt","chatbot","fallback"]): domains.append("CHATBOT")
    if any(k in full for k in ["ci/cd","iac","observabilidad","latencia","slo"]): domains.append("DEVOPS")
    if any(k in full for k in ["pantalla","formulario","botón","figma","ui","ux"]): domains.append("UI")
    if not domains:
        domains = ["API"]  # Por defecto

    musts = []
    if any(k in full for k in ["debe","obligatorio","seguro","latencia","must"]):
        musts.append("obligatorio/seguridad/latencia")

    return {
        "domains": domains,
        "stakeholders": [],
        "swot": { "strengths": [], "weaknesses": [], "opportunities": [], "threats": [] },
        "entities": {
            "slo": [{"type":"latency_p95","value_ms":300}] if "latencia" in full else [],
            "compliance": ["PCI-DSS"] if "pci" in full else [],
            "musts": musts
        },
        "signals": {
            "kano_basic": ["funcionalidad básica"] if "básico" in full or "lo básico" in full else [],
            "moscow_must": ["seguridad"] if "seguro" in full else []
        }
    }

@app.post("/generate")
def generate():
     return {"entre": True, "service": "po-copilot-nlu"}

#Test
