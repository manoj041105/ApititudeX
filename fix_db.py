import json

path = r'C:\Users\Satya_manoj\.gemini\antigravity-ide\brain\08b10b07-45e8-4d41-878a-a0a0df279738\.system_generated\logs\transcript_full.jsonl'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

line = lines[62]
start_marker = 'id=\\"qdata\\">'
end_marker = '</script>'

s_idx = line.find(start_marker) + len(start_marker)
e_idx = line.find(end_marker, s_idx)

json_str = line[s_idx:e_idx]
json_str = json_str.replace('\\"', '"').replace('\\\\', '\\')

questions = json.loads(json_str)
print(f"Extracted {len(questions)} questions from transcript!")

# Save to data/db.json
db_path = r'C:\Users\Satya_manoj\.gemini\antigravity-ide\scratch\aptitudex\data\db.json'
with open(db_path, 'r', encoding='utf-8') as dbf:
    db = json.load(dbf)

db['questions'] = questions

with open(db_path, 'w', encoding='utf-8') as dbf:
    json.dump(db, dbf, indent=2)

print(f"data/db.json saved with {len(questions)} questions!")

# Update public/index.html qdata script tag
html_path = r'C:\Users\Satya_manoj\.gemini\antigravity-ide\scratch\aptitudex\public\index.html'
with open(html_path, 'r', encoding='utf-8') as hf:
    html_content = hf.read()

prefix = '<script type="application/json" id="qdata">'
suffix = '</script>'
start_pos = html_content.find(prefix)
end_pos = html_content.find(suffix, start_pos)

if start_pos != -1 and end_pos != -1:
    updated_html = html_content[:start_pos + len(prefix)] + json.dumps(questions) + html_content[end_pos:]
    with open(html_path, 'w', encoding='utf-8') as hf:
        hf.write(updated_html)
    print("public/index.html successfully updated with all 1000 questions!")
