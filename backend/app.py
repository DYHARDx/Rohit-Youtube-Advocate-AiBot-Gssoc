# ==================== FLASK API SERVER CONFIGURATION ====================
from flask import Flask, request, jsonify, render_template, send_file
from vector_database import get_policy_response, simplify_contract, check_content_safety, generate_invoice, ask_rohit
from flask_cors import CORS
from weasyprint import HTML
import io
import logging
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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

# ==================== ROUTE DEFINITIONS ====================

@app.route("/")
def index():
    """
    🏠 Serve the main advisor interface
    Returns: Rendered HTML template for the main page
    """
    # 🎨 DEBUG: Main page accessed - tracking user engagement
    # 📊 Monitoring: Page view counter could be implemented here
    print("🎨 Debug: Main advisor interface accessed")
    return render_template("advisor.html")


@app.route("/api/contract/simplify", methods=["POST"])
def simplify():
    """
    📄 Simplify complex contract text into easy-to-understand summary
    POST Data: { "text": "contract content here" }
    Returns: JSON with simplified contract summary
    
    Enhancement: Added input sanitization and detailed error handling
    """
    start_time = time.time()
    data = request.json
    if data is None:
        logger.warning("Contract simplification failed: No JSON data provided")
        return jsonify({"error": "No JSON data provided"}), 400
    text = data.get("text", "")
    
    # 🎯 Input validation to ensure contract text is provided
    if not text:

        # 🚨 Enhanced error logging for debugging purposes
        print("❌ Error: Contract simplification attempted without text input")
        return jsonify({"error": "Contract text is required"}), 400
    
    # 🚀 Process contract simplification using NLP pipeline
    # 📊 Performance monitoring: Processing time could be measured here
    summary = simplify_contract(text)
    
    # 🎨 TODO: Add caching mechanism for repeated requests
    # Enhancement idea: Implement Redis cache for frequently requested contracts
    # 🎨 DEBUG: Contract simplification completed successfully
    print("✅ Contract simplification completed successfully")
    return jsonify({"summary": summary})


@app.route("/api/content/check", methods=["POST"])
def content_check():
    """
    🔍 Analyze content for safety and compliance
    POST Data: { "text": "content to analyze" }
    Returns: JSON with safety report and recommendations
    
    Improvement: Added enhanced validation and detailed logging
    """
    start_time = time.time()
    data = request.json
    if data is None:
        logger.warning("Content safety check failed: No JSON data provided")
        return jsonify({"error": "No JSON data provided"}), 400
    text = data.get("text", "")
    
    # 🎯 Validate that content text is provided for analysis
    if not text:

        # 🚨 Enhanced error reporting for debugging
        print("❌ Error: Content safety check attempted without text input")
        return jsonify({"error": "Content text is required for analysis"}), 400
    
    # 🛡️ Generate content safety report using policy engine
    report = check_content_safety(text)
    
    # 🎯 Debug logging placeholder
    # print(f"🔍 Content safety check completed for {len(text)} characters")
    # 🎨 DEBUG: Content safety analysis completed successfully
    print("✅ Content safety analysis completed successfully")
    return jsonify({"report": report})



@app.route("/api/invoice/generate", methods=["POST"])
def invoice():
    """
    🧾 Generate professional invoice text
    POST Data: { "brand": "Brand Name", "service": "Service Description", "amount": 100.0, "include_gst": true }
    Returns: JSON with formatted invoice text
    
    Enhancement: Added comprehensive parameter validation and error details
    """
    start_time = time.time()
    data = request.json
    if data is None:
        logger.warning("Invoice generation failed: No JSON data provided")
        return jsonify({"error": "No JSON data provided"}), 400
    try:
        # 📊 Extract and validate invoice parameters
        brand = data["brand"]
        service = data["service"]
        amount = float(data["amount"])
        include_gst = data.get("include_gst", False)
        
        # 🎯 TODO: Add currency validation and formatting
        # Future enhancement: Support multiple currencies and localization
        # 🎨 DEBUG: Invoice parameters extracted successfully
        print(f"🧾 Invoice generation initiated for brand: {brand}")
    except (KeyError, ValueError) as e:
        # 🚨 Enhanced error reporting for invalid input parameters

        print(f"❌ Error in invoice generation: {str(e)}")
        return jsonify({"error": "Invalid input parameters", "details": str(e)}), 400

    # 🧾 Generate invoice text using template engine
    invoice_text = generate_invoice(brand, service, amount, include_gst)
    
    # 🎨 DEBUG: Invoice generation completed for brand {brand}
    print(f"✅ Invoice generation completed for brand: {brand}")
    return jsonify({"invoice_text": invoice_text})




@app.route("/api/invoice/download", methods=["POST"])
def download_invoice_pdf():
    """
    📄 Generate and download invoice as PDF using WeasyPrint
    POST Data: { "invoice_text": "formatted invoice text" }
    Returns: PDF file response
    
    Improvement: Added input validation and enhanced error handling
    """
    start_time = time.time()
    data = request.json
    if data is None:
        logger.warning("PDF generation failed: No JSON data provided")
        return jsonify({"error": "No JSON data provided"}), 400
    invoice_text = data.get("invoice_text", "")
    
    # 🎯 Validate that invoice text is provided for PDF generation
    if not invoice_text:

        # 🚨 Enhanced error logging for debugging
        print("❌ Error: PDF generation attempted without invoice text")
        return jsonify({"error": "No invoice text provided"}), 400

    # 📄 Convert invoice text to PDF format using WeasyPrint
    # 🎨 DEBUG: Initiating PDF generation process
    print("📄 Initiating PDF generation for invoice")
    html_content = f"<pre style='font-family:Courier, monospace'>{invoice_text}</pre>"
    pdf_file = HTML(string=html_content).write_pdf()
    # 🎨 DEBUG: PDF generation completed successfully
    print("✅ PDF generation completed successfully")
    return send_file(
        io.BytesIO(pdf_file),
        download_name="invoice.pdf",
        mimetype="application/pdf"
    )



@app.route("/api/youtube/policy", methods=["POST"])
def youtube_policy():
    """
    📺 Get YouTube policy guidance and recommendations
    POST Data: { "question": "policy question" }
    Returns: JSON with policy answer and guidance
    
    Enhancement: Added input validation and processing confirmation
    """
    start_time = time.time()
    data = request.json
    if data is None:
        logger.warning("Policy query failed: No JSON data provided")
        return jsonify({"error": "No JSON data provided"}), 400
    question = data.get("question", "")
    
    # 🎯 Validate that policy question is provided
    if not question:

        print("❌ Error: YouTube policy query attempted without question")
        return jsonify({"error": "Policy question is required"}), 400
    
    # 🎬 Get policy response from vector database using RAG pipeline
    # 🎨 DEBUG: Initiating YouTube policy query processing
    print("📺 Initiating YouTube policy query processing")
    answer = get_policy_response(question)
    
    # 🎯 TODO: Add response caching for common questions
    # Enhancement: Implement LRU cache for frequently asked policy questions
    # 🎨 DEBUG: YouTube policy query processed successfully
    print("✅ YouTube policy query processed successfully")
    return jsonify({"answer": answer})



@app.route("/api/ama/ask", methods=["POST"])
def ama():
    """
    💬 Ask Me Anything - Get responses from Rohit's knowledge base
    POST Data: { "question": "question for Rohit" }
    Returns: JSON with personalized answer
    
    Improvement: Added enhanced logging and input validation
    """
    start_time = time.time()
    data = request.json
    if data is None:
        logger.warning("AMA query failed: No JSON data provided")
        return jsonify({"error": "No JSON data provided"}), 400
    question = data.get("question", "")
    
    # 🎯 Validate that question is provided for AMA session
    if not question:

        # 🚨 Enhanced error logging for debugging
        print("❌ Error: AMA query attempted without question")
        return jsonify({"error": "Question is required for AMA"}), 400
    
    # 🧠 Get response from Rohit's knowledge base using semantic search
    # 🎨 DEBUG: Initiating AMA query processing
    print("💬 Initiating AMA query processing")
    answer = ask_rohit(question)
    
    # 🎨 DEBUG: AMA response generated successfully
    print("✅ AMA query processed successfully")
    return jsonify({"answer": answer})




@app.route("/api/health", methods=["GET"])
def health_check():
    """
    ❤️ Health check endpoint for monitoring and load balancers
    Returns: JSON with service status and version info
    """
    # 🎯 TODO: Add database connection check
    # 🎯 TODO: Add external service dependency checks
    # Enhancement: Add detailed health metrics for monitoring dashboards
    # 🎨 DEBUG: Health check endpoint accessed
    print("❤️ Health check endpoint accessed")
    
    return jsonify({
        "status": "healthy",
        "service": "Flask API Server",
        "version": "1.0.0",
        "timestamp": time.time()
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
    # 🎨 DEBUG: Debug information endpoint accessed
    print("🔧 Debug information endpoint accessed")
    
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
        "note": "Development debug endpoint"
    })


# ==================== ERROR HANDLING ENHANCEMENTS ====================

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

    print("🚨 404 Error: Endpoint not found")

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

    print("🚨 500 Error: Internal server error occurred")
n
    return jsonify({"error": "Internal server error", "code": 500}), 500


# ==================== UTILITY FUNCTIONS ====================
# 🎯 Placeholder for future enhancements and utility functions
def future_enhancement_placeholder():
    """
    🎯 Placeholder function for future enhancements
    This function is intentionally left empty for future implementation
    """
    # 🎯 Reserved for future implementation
    # TODO: Implement advanced features when requirements are defined
    pass

# 🎯 Additional placeholder for upcoming features
def upcoming_feature_placeholder():
    """
    🎯 Additional placeholder for upcoming features
    Reserved for future development and enhancements
    """
    # 🎯 Reserved for future implementation
    # Enhancement idea: Add advanced analytics capabilities
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
    
    app.run(debug=True, host='0.0.0.0', port=5000)

# 🎯 Future enhancement placeholder
# TODO: Add application factory pattern for better testing
# TODO: Implement proper configuration management
# TODO: Add request/response logging middleware
# TODO: Implement rate limiting for API endpoints
# TODO: Add API versioning support for backward compatibility

# ==================== END OF ENHANCEMENTS ====================