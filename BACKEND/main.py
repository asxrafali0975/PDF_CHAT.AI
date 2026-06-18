from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from sentence_transformers import SentenceTransformer
from pypdf import PdfReader
from google import genai
import faiss
import numpy as np
import io , os
from google.genai.errors import ClientError
from dotenv import load_dotenv

load_dotenv()


app = FastAPI()

# loading embedding model once at startup
model = SentenceTransformer("all-MiniLM-L6-v2")

# global variables so data stays available after upload
faiss_index = None
stored_chunks = []

api_key = os.environ.get("api_key")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# question coming from frontend
class Questions(BaseModel):
    data: str


client = genai.Client(api_key=api_key)


@app.get("/")
def root():
    return {"message": "server is working"}


# route for uploading pdfs and storing them in FAISS
@app.post("/upload")
async def upload_pdfs(files: List[UploadFile] = File(...)):
    try:

        global stored_chunks
        global faiss_index

        print("route hit")

        all_texts = ""

        # extracting text from all uploaded pdfs
        for file in files:

            pdf_bytes = await file.read()

            reader = PdfReader(io.BytesIO(pdf_bytes))

            for page in reader.pages:

                page_text = page.extract_text()

                if page_text:
                    all_texts += page_text + "\n"

        # if pdf has no readable text
        if not all_texts.strip():
            raise HTTPException(
                status_code=400,
                detail="No readable text found in PDFs"
            )

        # creating chunks of size 300 characters
        chunk_size = 300

        chunks = [
            all_texts[i:i + chunk_size]
            for i in range(0, len(all_texts), chunk_size)
        ]

        # saving chunks globally
        stored_chunks = chunks

        # converting chunks into embeddings
        embeddings = model.encode(chunks)

        # getting embedding dimension (384)
        dimensions = embeddings.shape[1]

        # creating empty faiss vector db
        faiss_index = faiss.IndexFlatL2(dimensions)

        # storing all embeddings inside faiss
        faiss_index.add(np.array(embeddings))

        print(embeddings.shape[1])

        return {
            "success": "Pdf's uploaded succesfully..."
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# route for asking questions from uploaded pdfs
@app.post("/quesUpload")
async def ques_ans(ques: Questions):
    try:

        global faiss_index
        global stored_chunks

        # user trying to ask question before uploading pdf
        if faiss_index is None:
            return {
                "answer": "Upload PDF first"
            }

        # converting user query into embedding
        query_embedding = model.encode(
            [ques.data]
        )

        # searching top matching chunks from faiss
        distances, indices = faiss_index.search(
            np.array(query_embedding),
            k=min(10, len(stored_chunks))
        )

        retrieved_chunks = []

        # collecting matched chunks
        for idx in indices[0]:
            retrieved_chunks.append(
                stored_chunks[idx]
            )

        # combining all retrieved chunks into context
        context = "\n\n".join(
            retrieved_chunks
        )

        # sending retrieved context + question to gemini
        prompt = f"""
Answer only from the context and you can like exxagerate a bit answer in 100-150 words simple english dont exagerate things , give exact raw truth no sugar coating.
you can answer any other related topic as well related to pdfs 

Context:
{context}

Question:
{ques.data}

If answer is not present,
say "Information not found in document".
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        # return response to frontend

        return {
            "data": response.text
        }

    # gemini quota exceeded
    except ClientError:

        raise HTTPException(
            status_code=429,
            detail="Gemini quota exceeded. Try again later."
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
