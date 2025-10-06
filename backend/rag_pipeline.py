import os
from dotenv import load_dotenv
from langchain_community.vectorstores import FAISS
from langchain_ollama import OllamaEmbeddings
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate

# Load environment configuration variables
load_dotenv()

# Application Constants and Configuration
FAISS_VECTOR_DB_PATH = "vectorstore/db_faiss"
OLLAMA_EMBEDDING_MODEL = "deepseek-r1:1.5b"
GROQ_LLM_MODEL = "deepseek-r1-distill-llama-70b"  # Alternative: "deepseek-coder:6.7b-instruct"
GROQ_API_KEY_VALUE = os.getenv("GROQ_API_KEY")

# Step 1: Initialize and Load FAISS Vector Database
def initialize_vector_database():
    """Initialize embeddings and load FAISS vector store from local directory"""
    embedding_model = OllamaEmbeddings(model=OLLAMA_EMBEDDING_MODEL)
    return FAISS.load_local(
        FAISS_VECTOR_DB_PATH,
        embeddings=embedding_model,
        allow_dangerous_deserialization=True
    )

# Step 2: Configure and Setup LLM with Groq
def configure_llm_model():
    """Configure and return the Groq LLM instance with specified parameters"""
    return ChatGroq(
        api_key=GROQ_API_KEY_VALUE,
        model_name=GROQ_LLM_MODEL,
        temperature=0.2
    )

# Step 3: Extract context from retrieved documents
def extract_document_context(retrieved_docs):
    """Combine page content from multiple documents into single context string"""
    return "\n\n".join([doc.page_content for doc in retrieved_docs])


# Enhanced RAG prompt template with improved formatting
LEGAL_ASSISTANT_PROMPT = """
You are a specialized legal AI assistant designed to help content creators understand complex contracts by translating legal jargon into clear, plain English.
Use only the information provided in the contract text. Do not make assumptions or generate legal advice beyond the given context.
Always respond in a **professional, assertive tone** and ensure **complete legal clarity** while simplifying complex terms. 
Your primary objective is to make contractual terms transparent and easily understandable for creators without legal backgrounds.

**Required Response Format:**
Contract Summary:
- Provide a high-level overview explaining the contract's purpose and main focus areas.

Key Legal Terms Explained:
- Break down important terms, rights, obligations, timelines, financial clauses, ownership details, or penalties.
- Highlight any sections requiring special attention (exclusivity clauses, indemnity provisions, automatic renewal terms).

Simplified Plain English Version:
- Rewrite the entire clause or section using simple, everyday language while preserving all legal meaning and intent.

---

Example Demonstration 1:

Original Contract Text:
"The Creator hereby grants the Platform an irrevocable, worldwide, royalty-free license to use, reproduce, modify, and distribute their content across any media now known or later developed."

Assistant Response:
Contract Summary:
This section outlines how the platform can utilize the creator's uploaded content.

Key Legal Terms Explained:
- "Irrevocable": Rights cannot be revoked once granted.
- "Royalty-free": No ongoing payments for content usage.
- "Worldwide": Global application of rights.
- "Any media": Includes all current and future distribution channels.

Simplified Plain English Version:
Once you upload content, the platform can use it anywhere in the world, in any format (including future technologies), without paying you additional fees—and you cannot revoke these permissions.

---

Now process the following contract text using the same structured approach:

User Question: {question}
Retrieved Context: {context}

Assistant Response:
"""


def process_legal_query(llm_instance, vector_database, user_query):
    """Process user query using RAG pipeline and return AI response"""
    retrieved_documents = vector_database.similarity_search(user_query)
    document_context = extract_document_context(retrieved_documents)
    prompt_template = ChatPromptTemplate.from_template(LEGAL_ASSISTANT_PROMPT)
    rag_chain = prompt_template | llm_instance
    return rag_chain.invoke({"question": user_query, "context": document_context})


# 🚀 Main execution pipeline
if __name__ == "__main__":
    user_question = input("Enter your legal contract question: ")

    print("[🔧] Initializing FAISS vector database...")
    vector_db = initialize_vector_database()

    print("[⚙️] Configuring Groq LLM model...")
    groq_llm = configure_llm_model()

    print("[💭] Processing your legal query...\n")
    ai_response = process_legal_query(groq_llm, vector_db, user_question)
    print("💡 Legal Assistant Response:\n", ai_response)
    
    # Additional logging for debugging purposes
    print(f"\n[📊] Query processing completed for: '{user_question[:50]}...'")
