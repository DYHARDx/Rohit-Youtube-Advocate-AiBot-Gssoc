from flask import Flask, request, jsonify, render_template
from vector_database import get_policy_response, simplify_contract, check_content_safety, generate_invoice, ask_rohit
from flask_cors import CORS

# 🚀 Initialize Flask Application
app = Flask(
    __name__,
    static_folder="static",
    template_folder="templates"
)
CORS(app)  # Enable Cross-Origin Resource Sharing


@app.route("/")
def index():
    """Serve the main advisor interface"""
    return render_template("advisor.html")


@app.route("/api/contract/simplify", methods=["POST"])
def simplify_contract_endpoint():
    """Simplify complex contract text into understandable summary"""
    request_data = request.json
    contract_text = request_data.get("text", "")
    
    if not contract_text:
        return jsonify({"error": "Contract text content is required"})
    
    simplified_summary = simplify_contract(contract_text)
    return jsonify({"summary": simplified_summary})


@app.route("/api/content/check", methods=["POST"])
def content_safety_check():
    """Analyze content for safety compliance and guidelines"""
    request_data = request.json
    content_text = request_data.get("text", "")
    
    if not content_text:
        return jsonify({"error": "Content text is required for analysis"})
    
    safety_report = check_content_safety(content_text)
    return jsonify({"report": safety_report})


@app.route("/api/invoice/generate", methods=["POST"])
def generate_invoice_endpoint():
    """Generate professional invoice text based on provided details"""
    request_data = request.json
    
    try:
        brand_name = request_data["brand"]
        service_description = request_data["service"]
        invoice_amount = float(request_data["amount"])
        gst_inclusion = request_data.get("include_gst", False)
    except (KeyError, ValueError):
        return jsonify({"error": "Invalid input parameters provided"})

    invoice_content = generate_invoice(brand_name, service_description, invoice_amount, gst_inclusion)
    return jsonify({"invoice_text": invoice_content})


@app.route("/api/youtube/policy", methods=["POST"])
def youtube_policy_query():
    """Handle YouTube policy-related questions and provide answers"""
    request_data = request.json
    policy_question = request_data.get("question", "")
    
    if not policy_question:
        return jsonify({"error": "Policy question is required"})
    
    policy_answer = get_policy_response(policy_question)
    return jsonify({"answer": policy_answer})


@app.route("/api/ama/ask", methods=["POST"])
def ask_me_anything():
    """Process Ask Me Anything questions and generate responses"""
    request_data = request.json
    user_question = request_data.get("question", "")
    
    if not user_question:
        return jsonify({"error": "Question input is required"})
    
    expert_answer = ask_rohit(user_question)
    return jsonify({"answer": expert_answer})


@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint for monitoring application status"""
    return jsonify({
        "status": "operational",
        "service": "Legal Advisor API",
        "version": "1.0.0"
    })


@app.errorhandler(404)
def not_found_error(error):
    """Handle 404 errors with custom response"""
    return jsonify({"error": "Endpoint not found"}), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors with custom response"""
    return jsonify({"error": "Internal server error occurred"}), 500


# 🎯 Application Entry Point
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
