from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from deep_translator import GoogleTranslator
import os
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

collection_name = "knowledge_base"

model = None
qdrant_client_instance = None
openrouter_client_instance = None


def get_model():
    global model
    if model is None:
        print("Loading SentenceTransformer model...")
        from sentence_transformers import SentenceTransformer
        model = SentenceTransformer("all-MiniLM-L6-v2")
        print("SentenceTransformer model loaded successfully.")
    return model


def get_qdrant_client():
    global qdrant_client_instance
    if qdrant_client_instance is None:
        from qdrant_client import QdrantClient

        qdrant_url = os.getenv("QDRANT_URL")
        qdrant_api_key = os.getenv("QDRANT_API_KEY")

        if not qdrant_url or not qdrant_api_key:
            raise ValueError("Qdrant environment variables are missing.")

        print("Connecting to Qdrant...")
        qdrant_client_instance = QdrantClient(
            url=qdrant_url,
            api_key=qdrant_api_key
        )
        print("Connected to Qdrant successfully.")
    return qdrant_client_instance


def get_openrouter_client():
    global openrouter_client_instance
    if openrouter_client_instance is None:
        from openai import OpenAI

        openrouter_api_key = os.getenv("OPENROUTER_API_KEY")
        if not openrouter_api_key:
            raise ValueError("OPENROUTER_API_KEY is missing.")

        print("Initializing OpenRouter client...")
        openrouter_client_instance = OpenAI(
            api_key=openrouter_api_key,
            base_url="https://openrouter.ai/api/v1"
        )
        print("OpenRouter client initialized successfully.")
    return openrouter_client_instance


# ---------------- NEW FEATURE: SCHEME DETECTOR ----------------

def detect_scheme(user_query):
    q = user_query.lower()

    if "farmer" in q:
        return "You may be eligible for PM-KISAN scheme (financial support for farmers)."
    elif "student" in q:
        return "You may be eligible for National Scholarship Portal (NSP) schemes."
    elif "pregnant" in q:
        return "You may be eligible for Pradhan Mantri Matru Vandana Yojana."
    elif "job" in q or "unemployed" in q:
        return "You may benefit from Skill India or PMKVY skill development schemes."
    elif "old" in q or "senior" in q:
        return "You may be eligible for old-age pension schemes."

    return ""


# ---------------- NEW FEATURE: ELIGIBILITY QUESTIONS ----------------

def eligibility_question(user_query):
    q = user_query.lower()

    if "help" in q or "scheme" in q:
        return "To help you better, please tell me: Are you a student, farmer, unemployed, or senior citizen?"

    return ""


# ---------------- NEW FEATURE: SIMPLE LOCATION HELP ----------------

def location_help(user_query):
    q = user_query.lower()

    if "hospital" in q:
        return "Nearby help suggestion: You can visit the nearest government hospital in your city or district headquarters. For emergencies, call 108 ambulance."
    elif "bank" in q:
        return "Nearby help suggestion: You can visit the nearest nationalized bank branch such as SBI, Canara Bank, or Bank of Baroda."
    elif "police" in q:
        return "Nearby help suggestion: You can visit the nearest police station or call emergency police helpline 112."
    elif "ration" in q or "public service" in q or "service center" in q:
        return "Nearby help suggestion: You can visit the nearest ration office, Seva Sindhu center, MeeSeva center, or common service center in your area."

    return ""


# ---------------- NEW FEATURE: SMART ELIGIBILITY CHECKER ----------------

def extract_user_details(user_query):
    q = user_query.lower()

    details = {
        "occupation": "",
        "income": "",
        "age_group": ""
    }

    if "farmer" in q:
        details["occupation"] = "farmer"
    elif "student" in q:
        details["occupation"] = "student"
    elif "unemployed" in q or "jobless" in q:
        details["occupation"] = "unemployed"
    elif "senior citizen" in q or "old age" in q or "elderly" in q:
        details["occupation"] = "senior citizen"
    elif "pregnant" in q:
        details["occupation"] = "pregnant woman"

    if "low income" in q or "poor" in q or "below poverty" in q:
        details["income"] = "low"
    elif "middle income" in q:
        details["income"] = "middle"
    elif "high income" in q:
        details["income"] = "high"

    if "child" in q:
        details["age_group"] = "child"
    elif "student" in q or "young" in q:
        details["age_group"] = "young"
    elif "senior citizen" in q or "old age" in q or "elderly" in q:
        details["age_group"] = "senior"

    return details


def smart_eligibility_flow(user_query):
    details = extract_user_details(user_query)

    missing_questions = []

    if details["occupation"] == "":
        missing_questions.append("What is your occupation? For example: student, farmer, unemployed, senior citizen.")
    if details["income"] == "":
        missing_questions.append("What is your income category? For example: low income, middle income, or high income.")

    if missing_questions:
        return {
            "needs_more_info": True,
            "questions": " ".join(missing_questions),
            "matched_scheme": ""
        }

    matched_scheme = ""

    if details["occupation"] == "farmer" and details["income"] == "low":
        matched_scheme = "You may be eligible for PM-KISAN and crop-related support schemes."
    elif details["occupation"] == "student" and details["income"] == "low":
        matched_scheme = "You may be eligible for National Scholarship Portal schemes and state scholarship programs."
    elif details["occupation"] == "unemployed" and details["income"] == "low":
        matched_scheme = "You may benefit from Skill India, PMKVY, and employment support schemes."
    elif details["occupation"] == "senior citizen" and details["income"] == "low":
        matched_scheme = "You may be eligible for old-age pension and senior citizen welfare schemes."
    elif details["occupation"] == "pregnant woman" and details["income"] == "low":
        matched_scheme = "You may be eligible for Pradhan Mantri Matru Vandana Yojana and maternal healthcare support."

    return {
        "needs_more_info": False,
        "questions": "",
        "matched_scheme": matched_scheme
    }


# ---------------- NEW FEATURE: REWARD SYSTEM ----------------

user_rewards = {
    "points": 0,
    "badges": []
}


def update_rewards(user_query, smart_eligibility, scheme_info):
    user_rewards["points"] += 5

    if scheme_info:
        user_rewards["points"] += 10
        if "Scheme Explorer" not in user_rewards["badges"]:
            user_rewards["badges"].append("Scheme Explorer")

    if not smart_eligibility["needs_more_info"] and smart_eligibility["matched_scheme"]:
        user_rewards["points"] += 15
        if "Eligibility Verified" not in user_rewards["badges"]:
            user_rewards["badges"].append("Eligibility Verified")

    reward_message = f"""
Reward Update:
- Total Points: {user_rewards["points"]}
- Badges Earned: {", ".join(user_rewards["badges"]) if user_rewards["badges"] else "None"}
"""
    return reward_message


# ---------------- NEW FEATURE: NOMINATIM MAP SEARCH ----------------

def get_nearby_places(user_query):
    try:
        url = "https://nominatim.openstreetmap.org/search"
        params = {
            "q": user_query,
            "format": "json",
            "limit": 3
        }
        headers = {
            "User-Agent": "Sahaya-AI-App"
        }

        response = requests.get(url, params=params, headers=headers, timeout=10)
        response.raise_for_status()
        data = response.json()

        results = []

        for place in data:
            name = place.get("display_name", "")
            lat = place.get("lat", "")
            lon = place.get("lon", "")

            if lat and lon:
                maps_link = f"https://www.google.com/maps?q={lat},{lon}"
                results.append(f"{name}\nMaps: {maps_link}")

        return "\n\n".join(results)

    except Exception as e:
        print(f"Nearby places lookup failed: {e}")
        return ""


class Query(BaseModel):
    query: str


@app.get("/")
def root():
    return {"status": "ok", "message": "Sahaya AI backend is running"}


@app.post("/ask-test")
def ask_test(query: Query):
    return {"response": f"Test working: {query.query}"}


@app.post("/ask")
def ask_question(query: Query):
    try:
        print("Step 1: /ask request received")

        original_query = query.query.strip()

        if not original_query:
            print("Step 1.1: empty query")
            return {"response": "Please enter a question."}

        print(f"Step 2: original query: {original_query}")

        try:
            translated_query = GoogleTranslator(source="auto", target="en").translate(original_query)
            print(f"Step 3: translated query: {translated_query}")
        except Exception as e:
            print(f"Step 3 failed: translation error: {e}")
            translated_query = original_query

        print("Step 4: encoding query")
        vector = get_model().encode(translated_query)
        print("Step 4 complete: encoding done")

        print("Step 5: querying Qdrant")
        results = get_qdrant_client().query_points(
            collection_name=collection_name,
            query=vector.tolist(),
            limit=2
        )
        print("Step 5 complete: Qdrant query done")

        context = ""

        if hasattr(results, "points") and results.points:
            print(f"Step 6: {len(results.points)} Qdrant points found")
            for hit in results.points:
                payload = hit.payload or {}

                category = payload.get("category", "")
                problem = payload.get("problem", "")
                explanation = payload.get("explanation", "")
                solution = payload.get("solutions") or payload.get("solution", "")

                context += f"""
Category: {category}
Problem: {problem}
Explanation: {explanation}
Solution: {solution}
"""
        else:
            print("Step 6: no Qdrant points found")
            context = "No matching knowledge found in the database."

        scheme_info = detect_scheme(original_query)
        eligibility = eligibility_question(original_query)
        location_info = location_help(original_query)
        smart_eligibility = smart_eligibility_flow(original_query)
        reward_info = update_rewards(original_query, smart_eligibility, scheme_info)

        print("Step 7: extra feature processing complete")

        maps_result = ""
        if any(word in original_query.lower() for word in ["hospital", "bank", "police", "ration", "near", "nearby", "location", "place"]):
            print("Step 8: fetching nearby places")
            maps_result = get_nearby_places(original_query)
            print("Step 8 complete: nearby places processed")

        prompt = f"""
You are Sahaya AI, a multilingual government help assistant.

User question:
{original_query}

Helpful government information:
{context}

Relevant government schemes (IMPORTANT - must include if available):
{scheme_info}

Nearby location help (IMPORTANT - include if relevant):
{location_info}

Real nearby places (IMPORTANT - include if available):
{maps_result}

If more details are needed:
{eligibility}

Smart eligibility follow-up:
{smart_eligibility["questions"]}

Best matched scheme based on available details:
{smart_eligibility["matched_scheme"]}

User rewards (IMPORTANT - include if available):
{reward_info}

Instructions:
- If the user query is unclear, ONLY ask follow-up questions.
- If schemes are available, ALWAYS mention them clearly.
- If location help is available, ALWAYS include it.
- If real nearby places are available, include them clearly.
- If important eligibility details are missing, ask only those missing questions.
- If the user already provided details, do not ask again.
- If a scheme is matched, mention it clearly.
- Only give detailed solutions when user provides clear context.
- Keep answers simple and direct.
- Do not ask confirmation if user already provided information.

Explain clearly so common citizens can understand easily.
Provide step-by-step guidance when relevant.
"""

        print("Step 9: calling OpenRouter")
        response = get_openrouter_client().chat.completions.create(
            model="openrouter/auto",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        print("Step 9 complete: OpenRouter response received")

        answer = response.choices[0].message.content if response.choices else ""

        if not answer:
            print("Step 10: empty answer from OpenRouter")
            return {"response": "I could not generate a response right now. Please try again."}

        print("Step 10 complete: returning final response")
        return {"response": answer}

    except Exception as e:
        print(f"ERROR in /ask: {e}")
        return {"response": f"Backend error: {str(e)}"}
