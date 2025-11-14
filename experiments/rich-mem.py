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

HISTORY_LENGTH = 3

SYSTEM_PROMPT = """You are a helpful assistant especially useful for your memory capabilities. If the
conversation goes far enough back, we will start to clear old messages. However, we will scan old messages
in your long term memory and if we find ones that might be useful, we will provide them to you as extra
context for your response.

Act as though you are a vanilla chat bot that isn't associated with any brand, just exists (wasn't created
by google or anything). Answer questions consisely, include all information the user asks for and obviously
wants, but no more."""

LTM_SNIPPETS_INTRODUCTION = """Included to assist in your response are some snippets from far back 
in your conversation that have been deemd to possibly useful for your response. They may be vital to
your accuracy or completely useless, you will need to decide that for yourself.

{}

END OF SNIPPETS
"""

if not os.environ.get("GOOGLE_API_KEY"):
  os.environ["GOOGLE_API_KEY"] = getpass.getpass("Enter API key for Google Gemini: ")

llm = init_chat_model("gemini-2.5-flash", model_provider="google_genai")
emb_doc = GoogleGenerativeAIEmbeddings(model="gemini-embedding-001", task_type="RETRIEVAL_DOCUMENT")
emb_query = GoogleGenerativeAIEmbeddings(model="gemini-embedding-001", task_type="RETRIEVAL_QUERY")

faiss_index = faiss.IndexFlatL2(len(emb_doc.embed_query("hi")))
ltm_snippets_vs: VectorStore = FAISS(
  index=faiss_index,
  embedding_function=emb_doc,
  docstore=InMemoryDocstore(),
  index_to_docstore_id={}
)

system_prompt = ("system", SYSTEM_PROMPT)
conversation = []

def readable_msg(msg):
  return f"{msg[0]} said: {msg[1]}"

def compress_to_ltm():
  usr_msg = document.Document(readable_msg(conversation.pop(0)))
  bot_msg = document.Document(readable_msg(conversation.pop(0)))

  ltm_snippets_vs.add_documents([usr_msg, bot_msg])

def retrieve_snippets(user_prompt):
  query_vector = emb_query.embed_query(user_prompt)
  return ltm_snippets_vs.similarity_search_by_vector(query_vector, k=5)

while True:
  if len(conversation) > HISTORY_LENGTH:
    compress_to_ltm()

  user_prompt = input("prompt: ")
  conversation.append(("user", user_prompt))

  # retrieve applicable long term memory snippets

  ltm_snippets = retrieve_snippets(user_prompt)
  ltm_msg = (
    "system", 
    LTM_SNIPPETS_INTRODUCTION.format("\n\n".join(
      list(map(lambda d: d.page_content, ltm_snippets))
    ))
  )

  # generate response

  response = llm.invoke([system_prompt] + conversation + [ltm_msg])

  print(f"RESPONSE: {response}")

  conversation.append(("assistant", response.content))
  
