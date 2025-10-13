from langchain_groq import ChatGroq
from langchain_ollama import OllamaEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_text_splitters import RecursiveCharacterTextSplitter
from dotenv import load_dotenv
import os

# Load environment configuration
load_dotenv()

# Application Configuration Constants
FAISS_VECTOR_STORE_PATH = "vectorstore/db_faiss"
OLLAMA_EMBEDDINGS_MODEL = "deepseek-r1:1.5b"
GROQ_LLM_MODEL_NAME = "deepseek-r1-distill-llama-70b"

# Initialize LLM with enhanced configuration
llm_model = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model=GROQ_LLM_MODEL_NAME,
    temperature=0.2
)

# Load FAISS Vector Database
def load_faiss_database():
    """Initialize and load FAISS vector store with embeddings"""
    embedding_engine = OllamaEmbeddings(model=OLLAMA_EMBEDDINGS_MODEL)
    return FAISS.load_local(
        FAISS_VECTOR_STORE_PATH, 
        embeddings=embedding_engine, 
        allow_dangerous_deserialization=True
    )

# Initialize database connection
vector_database = load_faiss_database()

# Utility function to create prompt chains
def create_prompt_chain(prompt_template):
    """Create a processing chain from template to output"""
    prompt_structure = ChatPromptTemplate.from_template(prompt_template)
    return prompt_structure | llm_model | StrOutputParser()

# Function: Contract Simplification Service
def simplify_contract_text(contract_content):
    """Simplify legal contract text for content creators"""
    contract_template = """
    Analyze and simplify the following contract text for content creators. 
    Provide clear, accurate, and concise explanations:

    Contract Content:
    {text}

    Simplified Analysis:
    """
    processing_chain = create_prompt_chain(contract_template)
    return processing_chain.invoke({"text": contract_content})

# Function: Content Safety Analysis
def analyze_content_safety(content_text):
    """Analyze content for YouTube policy compliance and safety"""
    safety_template = """
    Evaluate the following content for potential YouTube policy violations including:
    - Hate speech or harassment
    - Misinformation or false claims
    - Copyright infringement risks
    - Inappropriate or explicit material
    - Other community guideline violations

    Content to Analyze:
    {text}

    Safety Assessment:
    """
    analysis_chain = create_prompt_chain(safety_template)
    return analysis_chain.invoke({"text": content_text})

# Function: Professional Invoice Generation
def create_professional_invoice(brand_name, service_description, amount_value, include_gst_tax):
    """Generate formatted invoice with optional GST calculation"""
    gst_note = " (including 18% GST)" if include_gst_tax else ""
    total_amount = round(amount_value * 1.18, 2) if include_gst_tax else amount_value

    invoice_template = f"""
    PROFESSIONAL INVOICE
    --------------------
    Client/Brand: {brand_name}
    Service Provided: {service_description}
    Total Amount: ₹{total_amount:.2f}{gst_note}
    
    Payment Terms: Due upon receipt
    Thank you for your business collaboration!
    """
    return invoice_template

# Function: YouTube Policy Query Handler (RAG)
def handle_policy_query(user_question):
    """Process YouTube policy questions using RAG pipeline"""
    relevant_docs = vector_database.similarity_search(user_question)
    context_data = "\n\n".join([doc.page_content for doc in relevant_docs])

    policy_template = """
    You are a YouTube policy expert. Use the provided context to answer the user's question accurately.
    Base your response strictly on the available information without speculation.

    User Question: {question}
    Policy Context:
    {context}

    Expert Response:
    """
    policy_chain = create_prompt_chain(policy_template)
    return policy_chain.invoke({"question": user_question, "context": context_data})

# Function: Legal Assistant Query Handler (RAG)
def process_legal_assistant_query(user_query):
    """Handle general legal questions for content creators using RAG"""
    retrieved_documents = vector_database.similarity_search(user_query)
    document_context = "\n\n".join([doc.page_content for doc in retrieved_documents])

    assistant_template = """
    You are Rohit Advocate, a legal AI assistant specializing in YouTube and content creator legal matters.
    Provide helpful, accurate responses based on the available legal context.

    Creator Question: {question}
    Legal Context:
    {context}

    Assistant Response:
    """
    assistant_chain = create_prompt_chain(assistant_template)
    return assistant_chain.invoke({"question": user_query, "context": document_context})

# Additional utility function for enhanced logging
def log_processing_status(function_name, status="completed"):
    """Log processing status for monitoring purposes"""
    print(f"[📊] {function_name} execution {status}")
    return True
