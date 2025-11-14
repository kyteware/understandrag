import os, getpass, faiss, numpy as np

from langchain.chat_models import init_chat_model
from langchain_community.vectorstores import FAISS, VectorStore
from langchain_community.docstore import InMemoryDocstore, document
from langchain_google_genai import GoogleGenerativeAIEmbeddings, GoogleVectorStore

if not os.environ.get("GOOGLE_API_KEY"):
  os.environ["GOOGLE_API_KEY"] = getpass.getpass("Enter API key for Google Gemini: ")

model = init_chat_model("gemini-2.5-flash", model_provider="google_genai")
query_emb = GoogleGenerativeAIEmbeddings(model="gemini-embedding-001", task_type="RETRIEVAL_QUERY")
doc_emb = GoogleGenerativeAIEmbeddings(model="gemini-embedding-001", task_type="RETRIEVAL_DOCUMENT")

# make vector store

questions = [
"""Details about possible tech careers"""
"""What career should I get into?""",
"""Details about possible tech jobs"""
"""Alright — let's talk jobs.

We could approach this from a few angles:

    Directly in your skillset — programming, simulations, graphics, OS-level work.

    Adjacent skills — stuff you could quickly pivot into because you have related knowledge.

    Long-term growth — jobs you might not be qualified for yet but could aim toward.
"""
]

faiss_index = faiss.IndexFlatL2(len(query_emb.embed_query("hi")))
vector_store: VectorStore = FAISS(
  index=faiss_index,
  embedding_function=doc_emb,
  docstore=InMemoryDocstore(),
  index_to_docstore_id={}
)

vector_store.add_documents([document.Document(page_content=q) for q in questions])

res = vector_store.similarity_search_with_score_by_vector(query_emb.embed_query("Details about possible tech careers"))
# res = vector_store.similarity_search_with_score()
res = [(doc.page_content[:15], score) for doc, score in res]
print(f"got {res}")

