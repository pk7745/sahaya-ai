from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer
import os

model = SentenceTransformer("all-MiniLM-L6-v2")

client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)

collection_name = "knowledge_base"


def search_knowledge(query):

    vector = model.encode(query)

    results = client.query_points(
        collection_name=collection_name,
        query=vector.tolist(),
        limit=2
    )

    answers = []

    for hit in results.points:

        category = hit.payload["category"]
        problem = hit.payload["problem"]
        explanation = hit.payload["explanation"]

        solutions = hit.payload.get("solutions") or hit.payload.get("solution")

        response = f"""
Category: {category}

Understanding the Problem:
{explanation}

Possible Solutions:
"""

        if isinstance(solutions, str):
            solutions = [solutions]

        for step in solutions:
            response += f"- {step}\n"

        answers.append(response)

    return answers
