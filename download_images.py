import json
import requests
import shutil
import time

questions = []
with open('questions.json') as json_file:
    questions = json.load(json_file)

cookies = {
    "MoodleSession": "jt1o0v0917i0ccsp5c0pk227k2",
    "cc_necessary": "yes",
    "ORIGIN": "KVM0140&KVM0140-1.KVM0140-1"
}

for q in questions:
    if q['image']:
        fileName = q['image'].split("/")[-1]
        r = requests.get(q['image'], cookies=cookies, stream=True)
        if r.status_code == 200:
            with open(f"images/{fileName}", 'wb') as f:
                r.raw.decode_content = True
                shutil.copyfileobj(r.raw, f) 
        time.sleep(1)       


