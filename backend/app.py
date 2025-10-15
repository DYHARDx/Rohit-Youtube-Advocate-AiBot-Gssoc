# ==================== FLASK API SERVER CONFIGURATION ====================
from flask import Flask, request, jsonify, render_template, send_file
from vector_database import get_policy_response, simplify_contract, check_content_safety, generate_invoice, ask_rohit
from flask_cors import CORS
from weasyprint import HTML
import io


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
    return render_template("advisor.html")


@app.route("/api/contract/simplify", methods=["POST"])
def simplify():
    """
    📄 Simplify complex contract text into easy-to-understand summary
    POST Data: { "text": "contract content here" }
    Returns: JSON with simplified contract summary
    """
    data = request.json
    text = data.get("text", "")
    
    # 🎯 Input validation to ensure contract text is provided
    if not text:
        return jsonify({"error": "Contract text is required"}), 400
    
    # 🚀 Process contract simplification using NLP pipeline
    summary = simplify_contract(text)
    
    # 🎨 TODO: Add caching mechanism for repeated requests
    # Enhancement idea: Implement Redis cache for frequently requested contracts
    return jsonify({"summary": summary})


@app.route("/api/content/check", methods=["POST"])
def content_check():
    """
    🔍 Analyze content for safety and compliance
    POST Data: { "text": "content to analyze" }
    Returns: JSON with safety report and recommendations
    """
    data = request.json
    text = data.get("text", "")
    
    # 🎯 Validate that content text is provided for analysis
    if not text:
        return jsonify({"error": "Content text is required for analysis"}), 400
    
    # 🛡️ Generate content safety report using policy engine
    report = check_content_safety(text)
    
    # 🎯 Debug logging placeholder
    # print(f"🔍 Content safety check completed for {len(text)} characters")
    # 🎨 DEBUG: Content safety analysis completed successfully
    return jsonify({"report": report})


@app.route("/api/invoice/generate", methods=["POST"])
def invoice():
    """
    🧾 Generate professional invoice text
    POST Data: { "brand": "Brand Name", "service": "Service Description", "amount": 100.0, "include_gst": true }
    Returns: JSON with formatted invoice text
    """
    data = request.json
    try:
        # 📊 Extract and validate invoice parameters
        brand = data["brand"]
        service = data["service"]
        amount = float(data["amount"])
        include_gst = data.get("include_gst", False)
        
        # 🎯 TODO: Add currency validation and formatting
        # Future enhancement: Support multiple currencies and localization
    except (KeyError, ValueError) as e:
        # 🚨 Enhanced error reporting for invalid input parameters
        return jsonify({"error": "Invalid input parameters", "details": str(e)}), 400

    # 🧾 Generate invoice text using template engine
    invoice_text = generate_invoice(brand, service, amount, include_gst)
    
    # 🎨 DEBUG: Invoice generation completed for brand {brand}
    return jsonify({"invoice_text": invoice_text})



@app.route("/api/invoice/download", methods=["POST"])
def download_invoice_pdf():
    """
    📄 Generate and download invoice as PDF using WeasyPrint
    POST Data: { "invoice_text": "formatted invoice text" }
    Returns: PDF file response
    """
    data = request.json
    invoice_text = data.get("invoice_text", "")
    
    # 🎯 Validate that invoice text is provided for PDF generation
    if not invoice_text:
        return jsonify({"error": "No invoice text provided"}), 400

    # 📄 Convert invoice text to PDF format using WeasyPrint
    html_content = f"<pre style='font-family:Courier, monospace'>{invoice_text}</pre>"
    pdf_file = HTML(string=html_content).write_pdf()
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
    """
    data = request.json
    question = data.get("question", "")
    
    # 🎯 Validate that policy question is provided
    if not question:
        return jsonify({"error": "Policy question is required"}), 400
    
    # 🎬 Get policy response from vector database using RAG pipeline
    answer = get_policy_response(question)
    
    # 🎯 TODO: Add response caching for common questions
    # Enhancement: Implement LRU cache for frequently asked policy questions
    return jsonify({"answer": answer})


@app.route("/api/ama/ask", methods=["POST"])
def ama():
    """
    💬 Ask Me Anything - Get responses from Rohit's knowledge base
    POST Data: { "question": "question for Rohit" }
    Returns: JSON with personalized answer
    """
    data = request.json
    question = data.get("question", "")
    
    # 🎯 Validate that question is provided for AMA session
    if not question:
        return jsonify({"error": "Question is required for AMA"}), 400
    
    # 🧠 Get response from Rohit's knowledge base using semantic search
    answer = ask_rohit(question)
    
    # 🎨 DEBUG: AMA response generated successfully
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
    
    return jsonify({
        "status": "healthy",
        "service": "Flask API Server",
        "version": "1.0.0",
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
    return jsonify({"error": "Internal server error", "code": 500}), 500


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
    
    app.run(debug=True)

# 🎯 Future enhancement placeholder
# TODO: Add application factory pattern for better testing
# TODO: Implement proper configuration management
# TODO: Add request/response logging middleware
# TODO: Implement rate limiting for API endpoints
# TODO: Add API versioning support for backward compatibility

# ==================== END OF ENHANCEMENTS ====================