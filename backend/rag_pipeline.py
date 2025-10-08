# ==================== ENVIRONMENT CONFIGURATION ====================
import os
from dotenv import load_dotenv
from langchain_community.vectorstores import FAISS
from langchain_ollama import OllamaEmbeddings
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate

# 🚀 Load environment variables (make sure .env file exists)
load_dotenv()

# 🎯 TODO: Add environment variable validation
# 🎯 TODO: Implement configuration management system

# ==================== CONSTANTS & CONFIGURATION ====================
# Constants
FAISS_DB_PATH = "vectorstore/db_faiss"
OLLAMA_MODEL_NAME = "deepseek-r1:1.5b"
GROQ_MODEL = "deepseek-r1-distill-llama-70b"  # or "deepseek-coder:6.7b-instruct"
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# 🎯 Model configuration constants
MODEL_CONFIG = {
    "temperature": 0.2,
    "max_tokens": 2048,
    "timeout": 30
}

# 🎯 Debug configuration
DEBUG_MODE = True

# ==================== VECTOR DATABASE OPERATIONS ====================
# Step 1: Load FAISS Vector DB
def load_faiss_db():
    """
    📚 Load the FAISS vector database with Ollama embeddings
    Returns: FAISS vector store instance
    Raises: Exception if database loading fails
    """
    # 🎯 Initialize embeddings model
    embeddings = OllamaEmbeddings(model=OLLAMA_MODEL_NAME)
    
    # 🚀 Debug logging
    if DEBUG_MODE:
        print("🔧 Loading FAISS database from:", FAISS_DB_PATH)
    
    return FAISS.load_local(
        FAISS_DB_PATH,
        embeddings=embeddings,
        allow_dangerous_deserialization=True
    )

# ==================== LLM SETUP & CONFIGURATION ====================
# Step 2: Setup LLM with Groq
def setup_llm():
    """
    🧠 Initialize and configure the Groq language model
    Returns: Configured ChatGroq instance
    Raises: Exception if API key is missing or invalid
    """
    # 🎯 API key validation placeholder
    if not GROQ_API_KEY:
        print("⚠️  GROQ_API_KEY not found in environment variables")
        # 🎯 TODO: Add proper error handling
    
    # 🚀 Initialize Groq LLM with configuration
    llm = ChatGroq(
        api_key=GROQ_API_KEY,
        model_name=GROQ_MODEL,
        temperature=MODEL_CONFIG["temperature"]
        # 🎯 TODO: Add additional model parameters
    )
    
    if DEBUG_MODE:
        print("🔧 LLM configured with model:", GROQ_MODEL)
    
    return llm

# ==================== CONTEXT PROCESSING ====================
# Step 3: Get context from retrieved documents
def get_context(docs):
    """
    📄 Process and concatenate document contents for context
    Args:
        docs: List of retrieved documents
    Returns: Concatenated context string
    """
    # 🎯 TODO: Add document filtering based on relevance scores
    # 🎯 TODO: Implement context length optimization
    
    context = "\n\n".join([doc.page_content for doc in docs])
    
    if DEBUG_MODE:
        print(f"📊 Retrieved {len(docs)} documents for context")
        print(f"📝 Context length: {len(context)} characters")
    
    return context

# ==================== PROMPT TEMPLATE SYSTEM ====================
# Step 4: Use RAG prompt template
PROMPT_TEMPLATE = """
You are a legal AI assistant designed to help content creators understand contracts by simplifying complex legal language into clear, plain English.
Use only the information provided in the contract text. Do not make assumptions or generate legal advice beyond the context.
Always respond in a **formal, assertive tone** and ensure **full legal clarity** while simplifying. 
Your goal is to make the terms transparent and easily understandable for a non-lawyer creator.

**Structure your response in this format:**
Summary:
- Give a high-level explanation of what the contract or clause is about.

Key Terms Explained:
- Bullet out and explain any important terms, rights, obligations, timelines, fees, ownership clauses, or penalties.
- Flag anything that may require special attention (e.g., exclusivity, indemnity, automatic renewals).

Plain English Version:
- Rewrite the entire clause/section in simple, everyday language while preserving all its meaning.

---

Example 1:

Contract Text:
"The Creator hereby grants the Platform an irrevocable, worldwide, royalty-free license to use, reproduce, modify, and distribute their content across any media now known or later developed."

Answer:
Summary:
This clause talks about how the platform can use the creator's content.

Key Terms Explained:
- "Irrevocable": Cannot be withdrawn once granted.
- "Royalty-free": You won't get paid each time your content is used.
- "Worldwide": Applies globally.
- "Any media": Includes all current and future formats (e.g., YouTube, podcasts, VR, etc.).

Plain English Version:
Once you upload content to the platform, they can use it anywhere, however they like, without paying you—and you can't take back those rights.

---

Now simplify the following contract in the same format:

Question: {question}
Context: {context}

Answer:
"""

# 🎯 TODO: Add multiple prompt templates for different use cases
# 🎯 TODO: Implement prompt versioning system

# ==================== RAG PIPELINE EXECUTION ====================
def ask_question(llm, vector_db, query):
    """
    ❓ Execute the RAG pipeline to answer legal questions
    Args:
        llm: Initialized language model
        vector_db: FAISS vector database
        query: User question string
    Returns: AI-generated response
    """
    # 🔍 Retrieve relevant documents
    docs = vector_db.similarity_search(query)
    
    # 📄 Process context from documents
    context = get_context(docs)
    
    # 🎯 Create prompt template
    prompt = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    
    # 🔗 Build processing chain
    chain = prompt | llm
    
    if DEBUG_MODE:
        print("🔧 Executing RAG pipeline...")
        print(f"📝 Query: {query}")
    
    # 🚀 Invoke the chain
    return chain.invoke({"question": query, "context": context})

# ==================== MAIN EXECUTION BLOCK ====================
# 🔁 Run the pipeline
if __name__ == "__main__":
    # 🎯 TODO: Add command-line argument parsing
    # 🎯 TODO: Implement interactive mode
    
    query = input("Ask your legal question: ")
    
    if DEBUG_MODE:
        print("\n" + "="*50)
        print("🚀 Starting RAG Pipeline Execution")
        print("="*50)

    print("[+] Loading FAISS vector database...")
    db = load_faiss_db()

    print("[+] Setting up Groq LLM...")
    llm = setup_llm()

    print("[+] Answering your question...\n")
    response = ask_question(llm, db, query)
    
    if DEBUG_MODE:
        print("\n" + "="*50)
        print("✅ Pipeline Execution Complete")
        print("="*50)
    
    print("💡 AI Answer:\n", response)

# 🎯 Future enhancement placeholders
# TODO: Add response caching mechanism
# TODO: Implement conversation history
# TODO: Add response quality metrics
# TODO: Create batch processing mode
# TODO: Add API endpoint wrapper

# ==================== END OF ENHANCEMENTS ====================
