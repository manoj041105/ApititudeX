import json

path = r'C:\Users\Satya_manoj\.gemini\antigravity-ide\brain\08b10b07-45e8-4d41-878a-a0a0df279738\.system_generated\logs\transcript_full.jsonl'

with open(path, 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if 'qdata' in line and '[{"id":1' in line.replace('\\"', '"'):
            s = line.replace('\\"', '"').find('[{"id":1')
            e = line.replace('\\"', '"').find(']</script>', s)
            if s != -1 and e != -1:
                raw_json = line.replace('\\"', '"')[s:e+1]
                try:
                    questions = json.loads(raw_json)
                    print(f"Line {i}: Successfully extracted {len(questions)} questions!")
                    
                    db_path = r'C:\Users\Satya_manoj\.gemini\antigravity-ide\scratch\aptitudex\data\db.json'
                    with open(db_path, 'r', encoding='utf-8') as dbf:
                        db = json.load(dbf)
                    db['questions'] = questions
                    with open(db_path, 'w', encoding='utf-8') as dbf:
                        json.dump(db, dbf, indent=2)
                    print(f"data/db.json updated with {len(questions)} questions!")
                    
                    html_path = r'C:\Users\Satya_manoj\.gemini\antigravity-ide\scratch\aptitudex\public\index.html'
                    with open(html_path, 'r', encoding='utf-8') as hf:
                        html_text = hf.read()
                    
                    s_tag = '<script type="application/json" id="qdata">'
                    e_tag = '</script>'
                    sp = html_text.find(s_tag)
                    ep = html_text.find(e_tag, sp)
                    if sp != -1 and ep != -1:
                        new_html = html_text[:sp + len(s_tag)] + json.dumps(questions) + html_text[ep:]
                        with open(html_path, 'w', encoding='utf-8') as hf:
                            hf.write(new_html)
                        print(f"public/index.html updated with {len(questions)} questions!")
                    break
                except Exception as err:
                    print(f"Error on line {i}:", err)
