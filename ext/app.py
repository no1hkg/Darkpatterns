import pandas as pd
from bs4 import BeautifulSoup
import requests
import re
from flask import Flask, request, jsonify

app = Flask(__name__)

def load_dataset(file_path):
    dataset = pd.read_csv(file_path, sep='\t')
    return dataset

def detect_dark_patterns(html_content, dark_patterns):
    soup = BeautifulSoup(html_content, 'html.parser')
    page_text = soup.get_text()

    detected_patterns = []
    for _, row in dark_patterns.iterrows():
        if re.search(fr'\b{re.escape(row["text"])}\b', page_text, re.IGNORECASE):
            detected_patterns.append((row["text"], row["Pattern Category"]))

    return detected_patterns

@app.route('/detect_dark_patterns', methods=['POST'])
def detect_dark_patterns_endpoint():
    data = request.json
    webpage_url = data['url']

    response = requests.get(webpage_url)
    html_content = response.content

    detected_patterns = detect_dark_patterns(html_content, dark_patterns_dataset)

    response_data = {'detected_patterns': detected_patterns}
    return jsonify(response_data)

if __name__ == "__main__":
    dataset_file_path = r'C:\Users\budig\Downloads\dataset.tsv'
    
    try:
        dark_patterns_dataset = load_dataset(dataset_file_path)
        app.run(port=5000)  
    except FileNotFoundError:
        print(f"Error: File not found at {dataset_file_path}")
