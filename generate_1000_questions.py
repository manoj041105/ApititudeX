import json
import random

categories = {
    'Quantitative Aptitude': [
        'Percentages', 'Profit & Loss', 'Average', 'Ratio & Proportion',
        'Time & Work', 'Time, Speed & Distance', 'Simple Interest',
        'Compound Interest', 'Probability', 'Permutation & Combination',
        'Number System', 'HCF & LCM', 'Algebra', 'Ages', 'Mixtures', 'Data Interpretation'
    ],
    'Logical Reasoning': [
        'Number Series', 'Coding-Decoding', 'Blood Relations', 'Directions',
        'Syllogisms', 'Seating Arrangement', 'Puzzles', 'Analogy',
        'Classification', 'Statement & Conclusion', 'Data Sufficiency', 'Clocks', 'Calendars'
    ],
    'Verbal Ability': [
        'Reading Comprehension', 'Sentence Correction', 'Synonyms', 'Antonyms',
        'Para Jumbles', 'Fill in the Blanks', 'Vocabulary', 'Grammar'
    ]
}

companies = ['TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant', 'Capgemini', 'Deloitte', 'IBM', 'EY', 'HCL', 'Tech Mahindra', 'Amazon', 'Microsoft', 'Other MNCs']
difficulties = ['Easy', 'Medium', 'Hard']

questions = []

# Generator functions for realistic placement aptitude questions
def gen_percentage(id_num):
    val = random.choice([10, 15, 20, 25, 30, 40, 50, 60, 75])
    total = random.choice([100, 200, 400, 500, 600, 800, 1000, 1200, 1500, 2000])
    ans_val = int(total * val / 100)
    opts = [str(ans_val), str(ans_val + 10), str(ans_val - 10), str(ans_val + 20)]
    random.shuffle(opts)
    return {
        "id": id_num,
        "category": "Quantitative Aptitude",
        "topic": "Percentages",
        "subtopic": "Percentages",
        "difficulty": random.choice(difficulties),
        "question": f"What is {val}% of {total}?",
        "options": opts,
        "answer": str(ans_val),
        "explanation": f"{val}% of {total} = {total} × {val}/100 = {ans_val}.",
        "company": random.choice(companies),
        "exam": "Placement Aptitude",
        "year": 2026,
        "question_type": "MCQ",
        "time_limit": 60,
        "marks": 1,
        "negative_marks": 0,
        "tags": ["percentages", "math", "aptitude"]
    }

def gen_profit_loss(id_num):
    cp = random.choice([200, 400, 500, 800, 1000, 1200, 1500, 2000, 2500])
    profit_pct = random.choice([5, 10, 15, 20, 25, 30])
    sp = int(cp * (100 + profit_pct) / 100)
    opts = [f"₹{sp}", f"₹{sp + 50}", f"₹{sp - 50}", f"₹{cp}"]
    random.shuffle(opts)
    return {
        "id": id_num,
        "category": "Quantitative Aptitude",
        "topic": "Profit & Loss",
        "subtopic": "Profit and Loss",
        "difficulty": random.choice(difficulties),
        "question": f"An article costs ₹{cp}. If it is sold at a profit of {profit_pct}%, what is its selling price?",
        "options": opts,
        "answer": f"₹{sp}",
        "explanation": f"Selling price = Cost Price × (100 + profit%)/100 = ₹{cp} × {100 + profit_pct}/100 = ₹{sp}.",
        "company": random.choice(companies),
        "exam": "Placement Aptitude",
        "year": 2026,
        "question_type": "MCQ",
        "time_limit": 60,
        "marks": 1,
        "negative_marks": 0,
        "tags": ["profit-and-loss", "math"]
    }

def gen_average(id_num):
    nums = [random.randint(5, 50) for _ in range(4)]
    avg = sum(nums) / len(nums)
    avg_str = str(int(avg)) if avg.is_integer() else f"{avg:.1f}"
    opts = [avg_str, str(int(avg) + 2), str(int(avg) - 2), str(int(avg) + 5)]
    opts = list(set(opts))
    while len(opts) < 4:
        opts.append(str(random.randint(10, 60)))
    random.shuffle(opts)
    return {
        "id": id_num,
        "category": "Quantitative Aptitude",
        "topic": "Average",
        "subtopic": "Average",
        "difficulty": random.choice(difficulties),
        "question": f"Find the average of {nums[0]}, {nums[1]}, {nums[2]}, and {nums[3]}.",
        "options": opts,
        "answer": avg_str,
        "explanation": f"Average = ({nums[0]} + {nums[1]} + {nums[2]} + {nums[3]}) ÷ 4 = {sum(nums)} ÷ 4 = {avg_str}.",
        "company": random.choice(companies),
        "exam": "Placement Aptitude",
        "year": 2026,
        "question_type": "MCQ",
        "time_limit": 60,
        "marks": 1,
        "negative_marks": 0,
        "tags": ["average", "math"]
    }

def gen_time_work(id_num):
    men = random.choice([4, 5, 6, 8, 10, 12, 15])
    days = random.choice([10, 12, 15, 18, 20, 24])
    target_days = random.choice([2, 3, 4, 5, 6, 8])
    req_men = int((men * days) / target_days)
    opts = [str(req_men), str(req_men + 2), str(req_men - 2), str(req_men + 4)]
    random.shuffle(opts)
    return {
        "id": id_num,
        "category": "Quantitative Aptitude",
        "topic": "Time & Work",
        "subtopic": "Time and Work",
        "difficulty": random.choice(difficulties),
        "question": f"If {men} men can complete a work in {days} days, how many men are needed to complete it in {target_days} days?",
        "options": opts,
        "answer": str(req_men),
        "explanation": f"Total work = {men} × {days} = {men*days} man-days. Required men = {men*days} ÷ {target_days} = {req_men}.",
        "company": random.choice(companies),
        "exam": "Placement Aptitude",
        "year": 2026,
        "question_type": "MCQ",
        "time_limit": 60,
        "marks": 1,
        "negative_marks": 0,
        "tags": ["time-and-work", "aptitude"]
    }

def gen_speed_distance(id_num):
    speed = random.choice([30, 40, 50, 60, 72, 80, 90, 100])
    time_h = random.choice([2, 3, 4, 5, 6])
    dist = speed * time_h
    opts = [f"{dist} km", f"{dist + 10} km", f"{dist - 10} km", f"{dist + 20} km"]
    random.shuffle(opts)
    return {
        "id": id_num,
        "category": "Quantitative Aptitude",
        "topic": "Time, Speed & Distance",
        "subtopic": "Time Speed and Distance",
        "difficulty": random.choice(difficulties),
        "question": f"A vehicle travels at {speed} km/h for {time_h} hours. What distance does it cover?",
        "options": opts,
        "answer": f"{dist} km",
        "explanation": f"Distance = Speed × Time = {speed} × {time_h} = {dist} km.",
        "company": random.choice(companies),
        "exam": "Placement Aptitude",
        "year": 2026,
        "question_type": "MCQ",
        "time_limit": 60,
        "marks": 1,
        "negative_marks": 0,
        "tags": ["time-speed-distance", "aptitude"]
    }

def gen_number_series(id_num):
    start = random.randint(1, 10)
    diff = random.randint(2, 6)
    seq = [start + i * diff for i in range(5)]
    next_num = start + 5 * diff
    opts = [str(next_num), str(next_num + 2), str(next_num - 2), str(next_num + 4)]
    random.shuffle(opts)
    return {
        "id": id_num,
        "category": "Logical Reasoning",
        "topic": "Number Series",
        "subtopic": "Number Series",
        "difficulty": random.choice(difficulties),
        "question": f"Find the next number in the series: {', '.join(map(str, seq))}, ?",
        "options": opts,
        "answer": str(next_num),
        "explanation": f"Common difference between consecutive terms is {diff}. Next term is {seq[-1]} + {diff} = {next_num}.",
        "company": random.choice(companies),
        "exam": "Placement Reasoning",
        "year": 2026,
        "question_type": "MCQ",
        "time_limit": 60,
        "marks": 1,
        "negative_marks": 0,
        "tags": ["number-series", "reasoning"]
    }

def gen_coding_decoding(id_num):
    words = [("CAT", "DBU"), ("DOG", "EPH"), ("BAT", "CBU"), ("PEN", "QFO"), ("SUN", "TVO"), ("MAN", "NBO"), ("BOX", "CPY")]
    w, c = random.choice(words)
    opts = [c, c[::-1], w, "DPP"]
    random.shuffle(opts)
    return {
        "id": id_num,
        "category": "Logical Reasoning",
        "topic": "Coding-Decoding",
        "subtopic": "Coding Decoding",
        "difficulty": random.choice(difficulties),
        "question": f"If '{w}' is coded by shifting each letter forward by 1 position, how is it coded?",
        "options": opts,
        "answer": c,
        "explanation": f"Each letter in '{w}' is shifted to the next alphabetical letter, resulting in '{c}'.",
        "company": random.choice(companies),
        "exam": "Placement Reasoning",
        "year": 2026,
        "question_type": "MCQ",
        "time_limit": 60,
        "marks": 1,
        "negative_marks": 0,
        "tags": ["coding-decoding", "reasoning"]
    }

def gen_syllogism(id_num):
    items = [
        ("cats", "animals", "need food", "All cats need food"),
        ("engineers", "graduates", "solve problems", "All engineers solve problems"),
        ("roses", "flowers", "need water", "All roses need water"),
        ("students", "learners", "gain knowledge", "All students gain knowledge")
    ]
    a, b, c, ans = random.choice(items)
    opts = [ans, f"Some {a} are heavy", "No conclusion", f"All {b} are students"]
    random.shuffle(opts)
    return {
        "id": id_num,
        "category": "Logical Reasoning",
        "topic": "Syllogisms",
        "subtopic": "Syllogism",
        "difficulty": random.choice(difficulties),
        "question": f"Statements: All {a} are {b}. All {b} {c}. Which conclusion definitely follows?",
        "options": opts,
        "answer": ans,
        "explanation": f"Direct transitive relation: Since all {a} are {b} and all {b} {c}, it follows that '{ans}'.",
        "company": random.choice(companies),
        "exam": "Placement Reasoning",
        "year": 2026,
        "question_type": "MCQ",
        "time_limit": 60,
        "marks": 1,
        "negative_marks": 0,
        "tags": ["syllogism", "reasoning"]
    }

def gen_verbal_vocab(id_num):
    vocab = [
        ("MANDATORY", "Compulsory", ["Compulsory", "Optional", "Flexible", "Secondary"]),
        ("BENEVOLENT", "Kind", ["Kind", "Cruel", "Selfish", "Harsh"]),
        ("CANDID", "Frank", ["Frank", "Deceitful", "Shy", "Secretive"]),
        ("PRUDENT", "Wise", ["Wise", "Careless", "Rash", "Foolish"]),
        ("FRUGAL", "Economical", ["Economical", "Extravagant", "Wasteful", "Generous"])
    ]
    word, syn, opts = random.choice(vocab)
    shuf_opts = opts.copy()
    random.shuffle(shuf_opts)
    return {
        "id": id_num,
        "category": "Verbal Ability",
        "topic": "Synonyms",
        "subtopic": "Vocabulary",
        "difficulty": random.choice(difficulties),
        "question": f"Choose the word that is most nearly SYNONYMOUS in meaning to '{word}'.",
        "options": shuf_opts,
        "answer": syn,
        "explanation": f"'{syn}' is the closest synonym for '{word}'.",
        "company": random.choice(companies),
        "exam": "Placement Verbal",
        "year": 2026,
        "question_type": "MCQ",
        "time_limit": 60,
        "marks": 1,
        "negative_marks": 0,
        "tags": ["synonyms", "verbal", "vocabulary"]
    }

generators = [gen_percentage, gen_profit_loss, gen_average, gen_time_work, gen_speed_distance, gen_number_series, gen_coding_decoding, gen_syllogism, gen_verbal_vocab]

for i in range(1, 1001):
    gen_fn = generators[(i - 1) % len(generators)]
    q = gen_fn(i)
    questions.append(q)

print(f"Generated {len(questions)} high-quality placement aptitude questions!")

db_path = r'C:\Users\Satya_manoj\.gemini\antigravity-ide\scratch\aptitudex\data\db.json'
with open(db_path, 'r', encoding='utf-8') as dbf:
    db = json.load(dbf)

db['questions'] = questions

with open(db_path, 'w', encoding='utf-8') as dbf:
    json.dump(db, dbf, indent=2)

print("data/db.json successfully updated with 1,000 questions!")

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
    print("public/index.html successfully updated with 1,000 questions!")
