import json
import re

transcript_path = r'C:\Users\Satya_manoj\.gemini\antigravity-ide\brain\08b10b07-45e8-4d41-878a-a0a0df279738\.system_generated\logs\transcript_full.jsonl'
db_path = r'C:\Users\Satya_manoj\.gemini\antigravity-ide\scratch\aptitudex\data\db.json'
html_path = r'C:\Users\Satya_manoj\.gemini\antigravity-ide\scratch\aptitudex\public\index.html'

with open(transcript_path, 'r', encoding='utf-8') as f:
    text = f.read()

match = re.search(r'<script type="application/json" id="qdata">(.*?)</script>', text, re.DOTALL)
if match:
    raw_json = match.group(1)
    questions = json.loads(raw_json)
    print(f"Extracted {len(questions)} questions!")
    
    with open(db_path, 'r', encoding='utf-8') as dbf:
        db = json.load(dbf)
    
    db['questions'] = questions
    
    with open(db_path, 'w', encoding='utf-8') as dbf:
        json.dump(db, dbf, indent=2)
    print("Database data/db.json successfully updated with 1000 questions!")

    # Also update index.html script block with full question dataset
    with open(html_path, 'r', encoding='utf-8') as hf:
        html_text = hf.read()
    
    new_html = re.sub(
        r'<script type="application/json" id="qdata">.*?</script>',
        f'<script type="application/json" id="qdata">{json.dumps(questions)}</script>',
        html_text,
        flags=re.DOTALL
    )
    with open(html_path, 'w', encoding='utf-8') as hf:
        hf.write(new_html)
    print("public/index.html updated with 1000 questions!")
