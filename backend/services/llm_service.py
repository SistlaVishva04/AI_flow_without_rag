import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def call_llm(query, document_text):
    model = genai.GenerativeModel("gemini-2.5-flash")

    prompt = f"""
Answer ONLY using the below document.

Document:
{document_text}

Question:
{query}
"""

    response = model.generate_content(prompt)
    return response.text
