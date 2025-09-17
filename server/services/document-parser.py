import sys
import json
import PyMuPDF  # fitz
import docx
import os
from pathlib import Path

def extract_text_from_pdf(file_path):
    """Extract text from PDF file using PyMuPDF."""
    try:
        doc = PyMuPDF.open(file_path)
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return text.strip()
    except Exception as e:
        raise Exception(f"Error extracting PDF text: {str(e)}")

def extract_text_from_docx(file_path):
    """Extract text from DOCX file."""
    try:
        doc = docx.Document(file_path)
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text.strip()
    except Exception as e:
        raise Exception(f"Error extracting DOCX text: {str(e)}")

def extract_text_from_doc(file_path):
    """Extract text from DOC file (basic support)."""
    try:
        # For .doc files, we'll need python-docx2txt or antiword
        # For now, return a placeholder
        return "DOC file format not fully supported yet. Please convert to PDF or DOCX."
    except Exception as e:
        raise Exception(f"Error extracting DOC text: {str(e)}")

def parse_document(file_path):
    """Parse document and extract text based on file extension."""
    if not os.path.exists(file_path):
        raise Exception(f"File not found: {file_path}")
    
    file_extension = Path(file_path).suffix.lower()
    
    if file_extension == '.pdf':
        return extract_text_from_pdf(file_path)
    elif file_extension == '.docx':
        return extract_text_from_docx(file_path)
    elif file_extension == '.doc':
        return extract_text_from_doc(file_path)
    else:
        raise Exception(f"Unsupported file format: {file_extension}")

def main():
    """Main function to handle command line usage."""
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Usage: python document-parser.py <file_path>"}))
        sys.exit(1)
    
    file_path = sys.argv[1]
    
    try:
        extracted_text = parse_document(file_path)
        print(json.dumps({"text": extracted_text, "success": True}))
    except Exception as e:
        print(json.dumps({"error": str(e), "success": False}))
        sys.exit(1)

if __name__ == "__main__":
    main()
