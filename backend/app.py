# ==================== FLASK API SERVER CONFIGURATION ====================
from flask import Flask, request, jsonify, render_template, send_file
from flask_cors import CORS
import io
import traceback
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Try to import vector database functions
try:
    from vector_database import (
        handle_policy_query,
        simplify_contract_text,
        analyze_content_safety,
        create_professional_invoice,
        process_legal_assistant_query
    )
    VECTOR_DB_AVAILABLE = True
except ImportError as e:
    logger.error(f"Failed to import vector_database functions: {e}")
    VECTOR_DB_AVAILABLE = False
    handle_policy_query = lambda x: "Service not available"
    simplify_contract_text = lambda x: "Service not available"
    analyze_content_safety = lambda x: "Service not available"
    create_professional_invoice = lambda a, b, c, d: "Service not available"
    process_legal_assistant_query = lambda x: "Service not available"

# Try to import weasyprint for PDF generation (optional dependency)
WEASYPRINT_AVAILABLE = False
HTML = None

# WeasyPrint is an optional dependency, so we handle ImportError gracefully
try:
    from weasyprint import HTML as WeasyHTML  # type: ignore
    WEASYPRINT_AVAILABLE = True
    HTML = WeasyHTML
except ImportError:
    logger.info("WeasyPrint not available - PDF generation will be disabled")

# 🚀 Initialize Flask Application
# ================================
# This section initializes the Flask application with necessary configurations
# Static and template folders are configured for serving frontend assets

# 🚀 Initialize Flask Application
app = Flask(
    __name__,
    static_folder="static",
    template_folder="templates"
)

# Enable CORS for all routes
CORS(app)

# 🎯 TODO: Add configuration management system
# Future enhancement: Move to config.py for better organization
# Suggestion: Consider using environment-specific configuration files

# ==================== ERROR HANDLING UTILITIES ====================

class APIError(Exception):
    """Custom API error class for consistent error handling"""
    def __init__(self, message, status_code=500, payload=None):
        super().__init__()
        self.message = message
        self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['error'] = self.message
        rv['status_code'] = self.status_code
        return rv

# ==================== ERROR HANDLERS ====================

@app.errorhandler(APIError)
def handle_api_error(error):
    """Handle custom API errors"""
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response

@app.errorhandler(404)
def not_found(error):
    """
    🚨 Handle 404 errors with consistent JSON response
    Args:
        error: The error object from Flask
    Returns:
        JSON response with error details and 404 status code
    """
    # 🎨 DEBUG: 404 error occurred - endpoint not found
    return jsonify({"error": "Endpoint not found", "code": 404}), 404

@app.errorhandler(500)
def internal_error(error):
    """
    🚨 Handle 500 errors with user-friendly message
    Args:
        error: The error object from Flask
    Returns:
        JSON response with error details and 500 status code
    """
    # 🎯 TODO: Add error logging and monitoring integration
    # Enhancement: Integrate with Sentry or similar error tracking service
    # 🎨 DEBUG: 500 internal server error occurred
    logger.error(f"Internal server error: {str(error)}")
    logger.error(traceback.format_exc())
    return jsonify({"error": "Internal server error", "code": 500}), 500

# ==================== ROUTE DEFINITIONS ====================

@app.route("/")
def index():
    """
    🏠 Serve the main advisor interface
    Returns: Rendered HTML template for the main page
    """
    # 🎨 DEBUG: Main page accessed - tracking user engagement
    return render_template("advisor.html")

@app.route("/api/contract/simplify", methods=["POST"])
def simplify():
    """
    📄 Simplify complex contract text into easy-to-understand summary
    POST Data: { "text": "contract content here" }
    Returns: JSON with simplified contract summary
    """
    try:
        if not VECTOR_DB_AVAILABLE:
            raise APIError("Contract simplification service is not available", 503)
            
        data = request.get_json()
        
        # 🎯 Input validation to ensure contract text is provided
        if not data or "text" not in data:
            raise APIError("Contract text is required", 400)
        
        text = data.get("text", "")
        if not text.strip():
            raise APIError("Contract text cannot be empty", 400)
        
        # 🚀 Process contract simplification using NLP pipeline
        summary = simplify_contract_text(text)
        
        # 🎨 TODO: Add caching mechanism for repeated requests
        # Enhancement idea: Implement Redis cache for frequently requested contracts
        return jsonify({"summary": summary})
    except APIError:
        raise
    except Exception as e:
        logger.error(f"Contract simplification error: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"error": "An unexpected error occurred while processing your contract", "details": "Please try again later"}), 500

@app.route("/api/content/check", methods=["POST"])
def content_check():
    """
    🔍 Analyze content for safety and compliance
    POST Data: { "text": "content to analyze" }
    Returns: JSON with safety report and recommendations
    """
    try:
        if not VECTOR_DB_AVAILABLE:
            raise APIError("Content safety checking service is not available", 503)
            
        data = request.get_json()
        
        # 🎯 Validate that content text is provided for analysis
        if not data or "text" not in data:
            raise APIError("Content text is required for analysis", 400)
        
        text = data.get("text", "")
        if not text.strip():
            raise APIError("Content text cannot be empty", 400)
        
        # 🛡️ Generate content safety report using policy engine
        report = analyze_content_safety(text)
        
        # 🎯 Debug logging placeholder
        # print(f"🔍 Content safety check completed for {len(text)} characters")
        # 🎨 DEBUG: Content safety analysis completed successfully
        return jsonify({"report": report})
    except APIError:
        raise
    except Exception as e:
        logger.error(f"Content safety check error: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"error": "An unexpected error occurred while checking content safety", "details": "Please try again later"}), 500

@app.route("/api/invoice/generate", methods=["POST"])
def invoice():
    """
    🧾 Generate professional invoice text
    POST Data: { "brand": "Brand Name", "service": "Service Description", "amount": 100.0, "include_gst": true }
    Returns: JSON with formatted invoice text
    """
    try:
        data = request.get_json()
        
        # 📊 Extract and validate invoice parameters
        if not data:
            raise APIError("Request body is required", 400)
            
        required_fields = ["brand", "service", "amount"]
        for field in required_fields:
            if field not in data:
                raise APIError(f"Missing required field: {field}", 400)
        
        brand = data["brand"]
        service = data["service"]
        amount = data["amount"]
        include_gst = data.get("include_gst", False)
        
        # Validate data types
        if not isinstance(brand, str) or not brand.strip():
            raise APIError("Brand name must be a non-empty string", 400)
            
        if not isinstance(service, str) or not service.strip():
            raise APIError("Service description must be a non-empty string", 400)
            
        try:
            amount = float(amount)
            if amount <= 0:
                raise APIError("Amount must be a positive number", 400)
        except (ValueError, TypeError):
            raise APIError("Amount must be a valid number", 400)
            
        if not isinstance(include_gst, bool):
            raise APIError("include_gst must be a boolean value", 400)
        
        # 🎯 TODO: Add currency validation and formatting
        # Future enhancement: Support multiple currencies and localization
    except APIError:
        raise
    except (KeyError, ValueError) as e:
        # 🚨 Enhanced error reporting for invalid input parameters
        logger.error(f"Invalid input parameters: {str(e)}")
        return jsonify({"error": "Invalid input parameters", "details": str(e)}), 400

    try:
        # 🧾 Generate invoice text using template engine
        invoice_text = create_professional_invoice(brand, service, amount, include_gst)
        
        # 🎨 DEBUG: Invoice generation completed for brand {brand}
        return jsonify({"invoice_text": invoice_text})
    except Exception as e:
        logger.error(f"Invoice generation error: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"error": "An unexpected error occurred while generating the invoice", "details": "Please try again later"}), 500

@app.route("/api/invoice/download", methods=["POST"])
def download_invoice_pdf():
    """
    📄 Generate and download invoice as PDF using WeasyPrint
    POST Data: { "invoice_text": "formatted invoice text" }
    Returns: PDF file response
    """
    try:
        if not WEASYPRINT_AVAILABLE or HTML is None:
            raise APIError("PDF generation is not available on this server", 501)
            
        data = request.get_json()
        
        # 🎯 Validate that invoice text is provided for PDF generation
        if not data or "invoice_text" not in data:
            raise APIError("No invoice text provided", 400)
            
        invoice_text = data.get("invoice_text", "")
        if not invoice_text.strip():
            raise APIError("Invoice text cannot be empty", 400)

        # 📄 Convert invoice text to PDF format using WeasyPrint
        html_content = f"<pre style='font-family:Courier, monospace'>{invoice_text}</pre>"
        pdf_file = HTML(string=html_content).write_pdf()
        return send_file(
            io.BytesIO(pdf_file),
            download_name="invoice.pdf",
            mimetype="application/pdf"
        )
    except APIError:
        raise
    except Exception as e:
        logger.error(f"PDF generation error: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"error": "An unexpected error occurred while generating the PDF", "details": "Please try again later"}), 500

@app.route("/api/youtube/policy", methods=["POST"])
def youtube_policy():
    """
    📺 Get YouTube policy guidance and recommendations
    POST Data: { "question": "policy question" }
    Returns: JSON with policy answer and guidance
    """
    try:
        if not VECTOR_DB_AVAILABLE:
            raise APIError("YouTube policy service is not available", 503)
            
        data = request.get_json()
        
        # 🎯 Validate that policy question is provided
        if not data or "question" not in data:
            raise APIError("Policy question is required", 400)
            
        question = data.get("question", "")
        if not question.strip():
            raise APIError("Policy question cannot be empty", 400)
        
        # 🎬 Get policy response from vector database using RAG pipeline
        answer = handle_policy_query(question)
        
        # 🎯 TODO: Add response caching for common questions
        # Enhancement: Implement LRU cache for frequently asked policy questions
        return jsonify({"answer": answer})
    except APIError:
        raise
    except Exception as e:
        logger.error(f"YouTube policy query error: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"error": "An unexpected error occurred while processing your policy question", "details": "Please try again later"}), 500

@app.route("/api/ama/ask", methods=["POST"])
def ama():
    """
    💬 Ask Me Anything - Get responses from Rohit's knowledge base
    POST Data: { "question": "question for Rohit" }
    Returns: JSON with personalized answer
    """
    try:
        if not VECTOR_DB_AVAILABLE:
            raise APIError("AMA service is not available", 503)
            
        data = request.get_json()
        
        # 🎯 Validate that question is provided for AMA session
        if not data or "question" not in data:
            raise APIError("Question is required for AMA", 400)
            
        question = data.get("question", "")
        if not question.strip():
            raise APIError("Question cannot be empty", 400)
        
        # 🧠 Get response from Rohit's knowledge base using semantic search
        answer = process_legal_assistant_query(question)
        
        # 🎨 DEBUG: AMA response generated successfully
        return jsonify({"answer": answer})
    except APIError:
        raise
    except Exception as e:
        logger.error(f"AMA query error: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"error": "An unexpected error occurred while processing your question", "details": "Please try again later"}), 500

@app.route("/api/health", methods=["GET"])
def health_check():
    """
    ❤️ Health check endpoint for monitoring and load balancers
    Returns: JSON with service status and version info
    """
    # 🎯 TODO: Add database connection check
    # 🎯 TODO: Add external service dependency checks
    # Enhancement: Add detailed health metrics for monitoring dashboards
    
    return jsonify({
        "status": "healthy",
        "service": "Flask API Server",
        "version": "1.0.0",
        "vector_db_available": VECTOR_DB_AVAILABLE,
        "pdf_generation_available": WEASYPRINT_AVAILABLE,
        "timestamp": "2024-01-01T00:00:00Z"  # 🎯 TODO: Add dynamic timestamp
    })

@app.route("/api/debug/info", methods=["GET"])
def debug_info():
    """
    🔧 Debug endpoint for development and troubleshooting
    Returns: JSON with system information and configuration
    """
    # 🎯 Note: This endpoint is for development purposes only
    # 🚨 Should be disabled in production environments
    # Security reminder: Ensure this endpoint is not exposed in production
    
    return jsonify({
        "debug": True,
        "endpoints": [
            "/api/contract/simplify",
            "/api/content/check", 
            "/api/invoice/generate",
            "/api/invoice/download",
            "/api/youtube/policy",
            "/api/ama/ask"
        ],
        "vector_db_available": VECTOR_DB_AVAILABLE,
        "pdf_generation_available": WEASYPRINT_AVAILABLE,
        "note": "Development debug endpoint"
    })

# ==================== UTILITY FUNCTIONS ====================
# 🎯 Placeholder for future enhancements and utility functions
def future_enhancement_placeholder():
    """
    🎯 Placeholder function for future enhancements
    This function is intentionally left empty for future implementation
    """
    pass

# ==================== APPLICATION INITIALIZATION ====================

if __name__ == "__main__":
    """
    🚀 Main application entry point
    """
    # 🎯 Development server configuration
    # 🚨 Note: debug=True should be disabled in production
    print("🎯 Starting Flask API Server...")
    print("📡 Server running on http://localhost:5000")
    print("🔧 Debug mode: ENABLED")
    print(f"📦 Vector DB available: {VECTOR_DB_AVAILABLE}")
    print(f"📄 PDF generation available: {WEASYPRINT_AVAILABLE}")
    
    app.run(debug=True)

# 🎯 Future enhancement placeholder
# TODO: Add application factory pattern for better testing
# TODO: Implement proper configuration management
# TODO: Add request/response logging middleware
# TODO: Implement rate limiting for API endpoints
# TODO: Add API versioning support for backward compatibility

# ==================== END OF ENHANCEMENTS ====================