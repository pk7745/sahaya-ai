# Sahaya AI

An AI-powered multilingual government assistance platform designed to help users access government services through natural language conversations. Sahaya AI combines modern AI technologies with a FastAPI backend to deliver intelligent, context-aware responses.

---

## Overview

Sahaya AI enables users to ask questions in natural language and receive relevant information through AI-powered retrieval and response generation.

The project focuses on improving accessibility by supporting multilingual interactions and intelligent information retrieval.

---

## Features

- AI-powered conversational assistant
- Multilingual support
- FastAPI backend
- Intelligent knowledge retrieval using Qdrant
- Voice interaction using Vapi
- REST API architecture
- Scalable backend design

---

## Tech Stack

Backend
- Python
- FastAPI

AI & Machine Learning
- Sentence Transformers
- Qdrant Vector Database

Voice AI
- Vapi

Other Tools
- Git
- GitHub

---

## Project Architecture

User

↓

Voice / Text Input

↓

FastAPI Backend

↓

Embedding Generation

↓

Qdrant Vector Database

↓

Relevant Knowledge Retrieval

↓

AI Response

↓

Voice / Text Output

---

## Installation

Clone the repository

```bash
git clone https://github.com/pk7745/sahaya-ai.git
```

Navigate to the project

```bash
cd sahaya-ai
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run the application

```bash
uvicorn app:app --reload
```

---

## Future Improvements

- Authentication
- Government Scheme Recommendation
- OCR Document Support
- Mobile Application
- Advanced RAG Pipeline
- Cloud Deployment

---

## Author

Pavan Kumar

GitHub

https://github.com/pk7745
