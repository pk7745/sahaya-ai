from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer
import os

model = SentenceTransformer("all-MiniLM-L6-v2")

client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)

collection_name = "knowledge_base"


def search_knowledge(query: str):
    vector = model.encode(query)

    results = client.query_points(
        collection_name=collection_name,
        query=vector.tolist(),
        limit=2
    )

    answers = []
    points = getattr(results, "points", []) or []

    for hit in points:
        payload = hit.payload or {}

        category = payload.get("category", "General")
        problem = payload.get("problem", "Not specified")
        explanation = payload.get("explanation", "No explanation available.")
        solutions = payload.get("solutions") or payload.get("solution") or []

        if isinstance(solutions, str):
            solutions = [solutions]

        response = f"""Category: {category}

Problem:
{problem}

Understanding the Problem:
{explanation}

Possible Solutions:
"""

        if solutions:
            for step in solutions:
                response += f"- {step}\n"
        else:
            response += "- No specific solution found.\n"

        answers.append(response.strip())

    return answers
