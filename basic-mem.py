import os, getpass, faiss

from langchain.chat_models import init_chat_model
from pydantic import BaseModel, Field
from langchain_community.vectorstores import FAISS, VectorStore
from langchain_community.docstore import InMemoryDocstore, document
from langchain_google_genai import GoogleGenerativeAIEmbeddings

# llm workflow

# 1: user question
# 2.1: llm asks questions that could be helpful
# 2.2: llm notes things it learned from user and writes them in question -> answer format
#   -> saves to vector db
# 3: llm asked user question <- provided information from questions

STORING_PROMPT = """You are a concise but effective utility for saving user information that might be needed later.
The user input may or may not have information that could be useful later. We will save that information (if it is present) in question/answer form for future recollection.
For example, if the user said: My eyes are blue and my hair is brown, your response would look something like:
{
    "qas": [
        {
            "question": "What color are the user's eyes?",
            "answer": "Blue"
        },
        {
            "question": What color is the user's hair?",
            "answer": "Brown"
        }
    ]
}"""

RETRIEVING_PROMPT = """Another assistant will need to provide a response to the following prompt. Available is a store of information provided for you to help them. 
If you deem that some extra information could be helpful for them in responding to the prompt, including but not limited to details and facts about the user, you may provide a list of questions.
An empty list is perfectly acceptable if no information is needed.
For example, if the prompt was: What color of shirt would go well with my eyes?, your response might be:
{
    "questions": [
        "What color are the user's eyes?"
    ]
}
If the prompt was: What's two plus two?, your response would probably be:
{
    "questions": []
}"""

MEMORY_PROMPT = """The following pieces of information may or may not be helpful in responding to the following user prompt:

{}"""

class QuestionAnswer(BaseModel):
  question: str = Field(..., description="A question that might be asked later")
  answer: str = Field(..., description="The answer that might be useful in the future")

class StoreResult(BaseModel):
  qas: list[QuestionAnswer] = Field(..., description="Where the questions and answers go")

class RetrieveResult(BaseModel):
  questions: list[str] = Field(..., description="Where the (possibly empty) list of questions goes")

if not os.environ.get("GOOGLE_API_KEY"):
  os.environ["GOOGLE_API_KEY"] = getpass.getpass("Enter API key for Google Gemini: ")

model = init_chat_model("gemini-2.5-flash", model_provider="google_genai")
storing_model = model.with_structured_output(StoreResult)
retrieving_model = model.with_structured_output(RetrieveResult)
emb = GoogleGenerativeAIEmbeddings(model="gemini-embedding-001")

faiss_index = faiss.IndexFlatL2(len(emb.embed_query("hi")))
vector_store: VectorStore = FAISS(
  index=faiss_index,
  embedding_function=emb,
  docstore=InMemoryDocstore(),
  index_to_docstore_id={}
)

while True:
  user_prompt = input("prompt: ")

  to_store: StoreResult = storing_model.invoke(
    [("system", STORING_PROMPT), ("user", user_prompt)]
  )

  if len(to_store.qas) > 0:
    docs = [document.Document(qa.question, metadata={"answer": qa.answer}) for qa in to_store.qas]
    vector_store.add_documents(docs)

    print(f"STORED QAS: {to_store.qas}")

  to_retrieve: RetrieveResult = retrieving_model.invoke(
    [("system", RETRIEVING_PROMPT), ("user", user_prompt)]
  )

  relevant_qas = {}

  for q in to_retrieve.questions:
    print(f"LLM QUESTION: {q}")
    res = vector_store.similarity_search_with_score(q, 3)
    qas = dict([(doc[0].page_content, doc[0].metadata["answer"]) for doc in res])
    print(f"RELEVANT QAS: {qas}")
    relevant_qas.update(qas)

  readable_qas = "\n\n".join([(qa[0] + "\n" + qa[1]) for qa in relevant_qas.items()])
  system_prompt = MEMORY_PROMPT.format(readable_qas)

  print(f"LLM SYSTEM PROMPT: {system_prompt}")

  response = model.invoke([("system", system_prompt), ("user", user_prompt)])

  print(f"RESPONSE: {response}")
