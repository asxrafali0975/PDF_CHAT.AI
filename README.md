# 📚 PDF CHAT AI

An AI-powered PDF chatbot that allows users to upload multiple PDF documents and ask questions in natural language. The application retrieves relevant information from uploaded documents and generates context-aware answers using Gemini.

---

# 🚀 Features

- Upload multiple PDFs at once
- Extracts and processes text from documents
- Semantic search using vector embeddings
- Context-aware question answering
- Multi-document support
- Fast retrieval using FAISS
- Responsive React frontend
- FastAPI backend

---

# 🛠 Tech Stack

## Frontend

- React.js
- Tailwind CSS
- Axios

## Backend

- FastAPI
- FAISS
- Sentence Transformers
- Google Gemini API
- PyPDF

---

# 📸 Screenshots

<img width="1459" height="962" alt="PDF Chat AI Screenshot" src="https://github.com/user-attachments/assets/39229423-df35-44bb-a438-de71b1c085f2" />

---

# ⚙️ How It Works

```text
PDF Upload
     ↓
Text Extraction
     ↓
Chunking
     ↓
Embeddings Generation
     ↓
FAISS Vector Database
     ↓
User Question
     ↓
Semantic Search
     ↓
Relevant Context Retrieval
     ↓
Gemini API
     ↓
Answer Generation
```

---

# 🏗️ Project Architecture

```text
PDF-CHAT-AI
│
├── FRONTEND
│   ├── src
│   ├── Components
│   └── Configs
│
├── BACKEND
│   ├── main.py
│   ├── requirements.txt
│   └── .env
│
└── README.md
```

---

# 🏃 How To Run Locally

## Backend

```bash
cd BACKEND

pip install -r requirements.txt

uvicorn main:app --reload
```

## Frontend

```bash
cd FRONTEND

npm install

npm run dev
```

---

# 🔐 Environment Variables

Create a `.env` file inside the backend folder:

```env
api_key=YOUR_GEMINI_API_KEY
```

---



# 👨‍💻 Author

**Ashraf Ali**

Python Developer | FastAPI | React.js | AI Applications
