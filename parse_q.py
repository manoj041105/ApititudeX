import json
import re

path = r'C:\Users\Satya_manoj\.gemini\antigravity-ide\brain\08b10b07-45e8-4d41-878a-a0a0df279738\.system_generated\logs\transcript_full.jsonl'

with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

target_line = lines[97]

start_idx = target_line.find('[{"id":1')
if start_idx == -1:
    start_idx = target_line.find('[{\\"id\\":1')

end_idx = target_line.find(']</script>', start_idx)
if end_idx == -1:
    end_idx = target_line.find(']\\n</script>', start_idx)

print(f"start_idx: {start_idx}, end_idx: {end_idx}")

if start_idx != -1 and end_idx != -1:
    json_str = target_line[start_idx:end_idx+1]
    # Replace unescaped quotes if needed
    questions = json.loads(json_str)
    print(f"Successfully loaded {len(questions)} questions!")
    
    db_path = r'C:\Users\Satya_manoj\.gemini\antigravity-ide\scratch\aptitudex\data\db.json'
    with open(db_path, 'r', encoding='utf-8') as dbf:
        db = json.load(dbf)
    
    db['questions'] = questions
    with open(db_path, 'w', encoding='utf-8') as dbf:
        json.dump(db, dbf, indent=2)
    
    print("db.json updated!")
else:
    # Let's search using regex
    match = re.search(r'\[\{.*?"id":1000.*?\}\]', target_line)
    if match:
        questions = json.loads(match.group(0))
        print(f"Regex found {len(questions)} questions!")
        db_path = r'C:\Users\Satya_manoj\.gemini\antigravity-ide\scratch\aptitudex\data\db.json'
        with open(db_path, 'r', encoding='utf-8') as dbf:
            db = json.load(dbf)
        db['questions'] = questions
        with open(db_path, 'w', encoding='utf-8') as dbf:
            json.dump(db, dbf, indent=2)
        print("db.json updated via regex!")
