import json
import re

path = r'C:\Users\Satya_manoj\.gemini\antigravity-ide\brain\08b10b07-45e8-4d41-878a-a0a0df279738\.system_generated\logs\transcript_full.jsonl'

best_questions = []

with open(path, 'r', encoding='utf-8') as f:
    for line in f:
        matches = re.findall(r'\[\s*\{\s*\\?"id\\?":\s*1,.*?\}\s*\]', line)
        for m in matches:
            clean = m.replace('\\"', '"').replace('\\\\', '\\')
            try:
                parsed = json.loads(clean)
                if len(parsed) > len(best_questions):
                    best_questions = parsed
            except Exception as e:
                pass

print(f"Extracted best dataset with {len(best_questions)} questions!")

if best_questions:
    db_path = r'C:\Users\Satya_manoj\.gemini\antigravity-ide\scratch\aptitudex\data\db.json'
    with open(db_path, 'r', encoding='utf-8') as dbf:
        db = json.load(dbf)
    
    db['questions'] = best_questions
    with open(db_path, 'w', encoding='utf-8') as dbf:
        json.dump(db, dbf, indent=2)
    print("data/db.json populated successfully!")

    html_path = r'C:\Users\Satya_manoj\.gemini\antigravity-ide\scratch\aptitudex\public\index.html'
    with open(html_path, 'r', encoding='utf-8') as hf:
        html = hf.read()
    
    s_tag = '<script type="application/json" id="qdata">'
    e_tag = '</script>'
    sp = html.find(s_tag)
    ep = html.find(e_tag, sp)
    if sp != -1 and ep != -1:
        new_html = html[:sp + len(s_tag)] + json.dumps(best_questions) + html[ep:]
        with open(html_path, 'w', encoding='utf-8') as hf:
            hf.write(new_html)
        print("public/index.html updated with complete question dataset!")
