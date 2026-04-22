from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct
from sentence_transformers import SentenceTransformer
import os

model = SentenceTransformer("all-MiniLM-L6-v2")

client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)

collection_name = "knowledge_base"

client.recreate_collection(
    collection_name=collection_name,
    vectors_config=VectorParams(size=384, distance=Distance.COSINE),
)

documents = [
    # ---------------- HEALTHCARE ----------------
    "Category: Healthcare | Problem: People cannot afford private hospital treatment | Explanation: Many low income families struggle to pay expensive hospital bills and therefore delay medical treatment which can worsen health conditions. | Solution: Government hospitals provide free or low cost consultations, medicines and treatments. Citizens can visit the outpatient department of a nearby government hospital and register with identity proof to receive treatment.",
    "Category: Healthcare | Problem: People do not know how to get emergency medical help quickly | Explanation: During accidents or medical emergencies many citizens panic and do not know which service to contact immediately. | Solution: Citizens can dial emergency ambulance number 108 which provides quick ambulance service and transports patients to the nearest hospital.",
    "Category: Healthcare | Problem: Families cannot afford expensive medical procedures | Explanation: Serious illnesses sometimes require costly treatments that low income families cannot afford. | Solution: Government health insurance schemes help eligible families receive free or subsidized treatments in empaneled hospitals.",
    "Category: Healthcare | Problem: Lack of awareness about vaccinations | Explanation: Some communities do not understand the importance of vaccinations which leads to preventable diseases spreading. | Solution: Citizens can visit nearby Primary Health Centers where government vaccination programs provide free vaccines for children and adults.",
    "Category: Healthcare | Problem: Pregnant women may not receive proper medical checkups | Explanation: Lack of regular prenatal care can lead to health risks for both mother and baby. | Solution: Government hospitals provide free maternal healthcare services including regular checkups, nutritional guidance and safe delivery services.",

    # ---------------- EDUCATION ----------------
    "Category: Education | Problem: Students cannot afford school or college fees | Explanation: Many talented students discontinue education because their families cannot pay tuition and educational expenses. | Solution: Government scholarship programs allow eligible students to apply online and receive financial assistance for their education.",
    "Category: Education | Problem: Students lack access to quality education resources | Explanation: Students in rural or low income areas may not have access to books, teachers or digital learning resources. | Solution: Government schools and digital education platforms provide free textbooks, study materials and online learning resources.",
    "Category: Education | Problem: Students do not know how to choose a career path | Explanation: Without proper career guidance students may select courses that do not match their interests or skills. | Solution: Career counseling programs and skill development centers guide students toward suitable career opportunities.",
    "Category: Education | Problem: Lack of practical skills for employment | Explanation: Many graduates struggle to find jobs because they lack practical industry skills. | Solution: Government skill development programs offer training in technology, business, and vocational trades to improve employability.",
    "Category: Education | Problem: Students in remote areas cannot access good teachers | Explanation: Rural education systems often suffer from shortage of qualified teachers. | Solution: Digital learning platforms and government online education initiatives provide access to lectures and study materials.",

    # ---------------- FINANCE ----------------
    "Category: Finance | Problem: People do not know how to open a bank account | Explanation: Many citizens especially in rural areas are unfamiliar with banking procedures and required documents. | Solution: Citizens can open a basic savings bank account by visiting a nearby bank with identity proof such as Aadhaar card and PAN card.",
    "Category: Finance | Problem: People struggle to manage their money effectively | Explanation: Lack of financial knowledge leads to poor budgeting, unnecessary debt and financial instability. | Solution: Financial literacy programs educate citizens about saving money, budgeting and responsible spending.",
    "Category: Finance | Problem: Small business owners lack funds to start businesses | Explanation: Entrepreneurs often cannot access capital required to start or expand small businesses. | Solution: Government supported business loan programs help entrepreneurs obtain low interest loans.",
    "Category: Finance | Problem: Elderly citizens face financial insecurity after retirement | Explanation: Without steady income many elderly individuals struggle to cover daily expenses. | Solution: Government pension schemes provide regular financial support to eligible senior citizens.",
    "Category: Finance | Problem: Farmers face financial risk due to crop failures | Explanation: Natural disasters or poor harvests can cause severe financial loss to farmers. | Solution: Agricultural financial support programs and crop insurance schemes help farmers recover from losses.",

    # ---------------- PUBLIC SERVICES ----------------
    "Category: Public Services | Problem: Citizens do not know how to obtain identity documents | Explanation: Identity documents are required for many services but people may not know the application process. | Solution: Citizens can apply for Aadhaar cards at authorized enrollment centers where biometric verification is conducted.",
    "Category: Public Services | Problem: People struggle to obtain official certificates | Explanation: Certificates such as income certificate or caste certificate are often required for education and government benefits. | Solution: Public service centers allow citizens to apply for and receive official certificates efficiently.",
    "Category: Public Services | Problem: Citizens do not know where to report civic issues | Explanation: Problems such as damaged roads, sanitation issues or water supply failures may go unreported. | Solution: Public grievance portals allow citizens to submit complaints which are forwarded to the responsible government department.",
    "Category: Public Services | Problem: Citizens are unaware of voting registration processes | Explanation: Some eligible citizens miss elections because they do not know how to obtain voter identification. | Solution: Citizens can apply for voter ID cards through election commission registration services.",
    "Category: Public Services | Problem: Low income families struggle to afford essential food supplies | Explanation: Rising food prices can make it difficult for poor families to buy sufficient food. | Solution: Public distribution systems provide subsidized food grains to eligible families through ration cards."
]

structured_docs = []

for doc in documents:
    parts = doc.split("|")
    data = {}

    for p in parts:
        key, value = p.split(":", 1)
        data[key.strip().lower()] = value.strip()

    structured_docs.append({
        "category": data.get("category"),
        "problem": data.get("problem"),
        "explanation": data.get("explanation"),
        "solution": data.get("solution")
    })

vectors = model.encode([
    f"{doc['problem']} {doc['explanation']}"
    for doc in structured_docs
])

points = []

for i, vector in enumerate(vectors):
    points.append(
        PointStruct(
            id=i,
            vector=vector.tolist(),
            payload={
                "category": structured_docs[i]["category"],
                "problem": structured_docs[i]["problem"],
                "explanation": structured_docs[i]["explanation"],
                "solution": structured_docs[i]["solution"]
            }
        )
    )

client.upsert(
    collection_name=collection_name,
    points=points
)

print("✅ Knowledge stored successfully in Qdrant")
