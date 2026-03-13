# nlp_chatbot_api.py
"""
FastAPI backend for Aurova chatbot — journaling, mood, feelings, stress, mental health Q&A
Inspired by medical_rag_groq.py and MedAssistant repo structure
"""

import os
from typing import List
from fastapi import FastAPI, Request
from pydantic import BaseModel
import spacy
from sentence_transformers import SentenceTransformer
import numpy as np

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Aurova NLP Chatbot API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Optional: Groq client
try:
    from groq import Groq
except ImportError:
    Groq = None

 # -------------------------
 # CONFIG
 # -------------------------
EMBEDDER_MODEL = "all-MiniLM-L6-v2"
GROQ_MODEL = os.getenv("GROQ_MODEL") or "openai/gpt-oss-120b"
GROQ_API_KEY = os.getenv("GROQ_API_KEY") or ""

# Example: Load your own dataset (journals, mood entries, etc.)
DATA_FILE = "data/journal_entries.csv"

# -------------------------
# LOAD MODELS & DATA
# -------------------------
nlp = spacy.load("en_core_web_sm")
embedder = SentenceTransformer(EMBEDDER_MODEL)

# Load corpus (replace with your own data)
import pandas as pd
if os.path.exists(DATA_FILE):
    df = pd.read_csv(DATA_FILE).fillna("")
    corpus = df["entry_text"].astype(str).tolist()
    corpus_embeddings = embedder.encode(corpus, convert_to_numpy=True, normalize_embeddings=True)
else:
    corpus = []
    corpus_embeddings = np.zeros((1, embedder.get_sentence_embedding_dimension()))

# -------------------------
# NER + Query helpers
# -------------------------
def run_ner(text):
    doc = nlp(text)
    ents = [(ent.text.strip(), ent.label_) for ent in doc.ents]
    if not ents:
        for chunk in doc.noun_chunks:
            ents.append((chunk.text.strip(), "NOUN_CHUNK"))
        ents = list(dict.fromkeys(ents))
    return ents

def extract_query_entities(text):
    tokens = [text]
    ents = run_ner(text)
    tokens += [e for e, lbl in ents]
    doc = nlp(text)
    for tok in doc:
        if tok.pos_ in {"NOUN", "PROPN", "ADJ"} and len(tok.text) > 2:
            tokens.append(tok.text)
    # dedupe
    seen = set(); out = []
    for t in tokens:
        t = t.strip()
        if t and t not in seen:
            out.append(t)
            seen.add(t)
    return out

# -------------------------
# Semantic retrieval
# -------------------------
def semantic_retrieve(text, top_k=5):
    if not corpus:
        return []
    qv = embedder.encode([text], convert_to_numpy=True, normalize_embeddings=True)
    sims = np.dot(corpus_embeddings, qv.T).flatten()
    k = min(top_k, len(corpus))
    indices = sims.argsort()[-k:][::-1].tolist()
    return [corpus[i] for i in indices]

# -------------------------
# Groq answer generation
# -------------------------
def generate_with_groq(question, context, model_name=GROQ_MODEL, temperature=0.2, max_tokens=300):
    if Groq is None:
        return "Groq SDK not installed."
    api_key = GROQ_API_KEY
    if not api_key:
        return "Groq API key not set."
    client = Groq(api_key=api_key)
    prompt = f"""
You are a helpful mental health assistant. Use ONLY the context below to answer factually and empathetically. If context is insufficient, say so gently.
Context:
{context}

Question:
{question}

Answer:"""
    resp = client.chat.completions.create(
        model=model_name,
        messages=[{"role": "system", "content": "You are a helpful mental health assistant."}, {"role": "user", "content": prompt}],
        temperature=temperature,
        max_tokens=max_tokens
    )
    return resp.choices[0].message.content.strip()

# -------------------------
# FastAPI schema
# -------------------------
class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    answer: str
    context: List[str]
    entities: List[str]

@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(req: ChatRequest):
    # Extract entities
    entities = extract_query_entities(req.question)
    # Retrieve context
    context_docs = semantic_retrieve(req.question, top_k=5)
    context = "\n".join(context_docs)
    # Generate answer
    answer = generate_with_groq(req.question, context)
    return ChatResponse(answer=answer, context=context_docs, entities=entities)

@app.get("/health")
def health():
    return {"status": "healthy", "model": "Aurova NLP Chatbot API"}

# To run: uvicorn nlp_chatbot_api:app --reload
