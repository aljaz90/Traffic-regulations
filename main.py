import requests
import json
from bs4 import BeautifulSoup
import time
from os import path
import sys

class CPPKiller:
    def __init__(self, moodleSession, origin, sessKey):
        if path.exists("questions.json"):
            with open('questions.json') as json_file:
                self.questions = json.load(json_file)
        else:
            self.questions = []
        self.moodleSession = moodleSession
        self.origin = origin
        self.sessKey = sessKey
        self.round = 0

    def extractQuestions(self):
        while True:
            self.round += 1 
            print(f"# STARTING ROUND {self.round}")
            data = self.startTest()
            self.processQuestions(data)
            print(f"# FINISHED ROUND {self.round}, total questions: {len(self.questions)}")
            time.sleep(45)
            for i in range(5):                
                print(f"# Starting in {5-i}")
                time.sleep(1)


    def startTest(self):
        # Start Attemp
        cookies = {
            "MoodleSession": self.moodleSession,
            "cc_necessary": "yes",
            "ORIGIN": self.origin
        }

        payload = {
            "cmid": 3,
            "sesskey": self.sessKey
        }

        req = requests.post("http://teorija-priprava.gov.si/moodle/mod/quiz/startattempt.php", cookies=cookies, data=payload)

        soup = BeautifulSoup(req.content, 'html.parser')
        endTestLink = soup.find(class_="endtestlink")['href']

        attemptId = endTestLink[endTestLink.index("=")+1:]

        # Finish Attemp
        cookies = {
            "MoodleSession": self.moodleSession,
            "cc_necessary": "yes",
            "ORIGIN": self.origin
        }

        payload = {
            "attempt": attemptId,
            "sesskey": self.sessKey,
            "finishattempt": 1,
            "timeup": 0,
            "slots": "",    
        }

        req = requests.post("http://teorija-priprava.gov.si/moodle/mod/quiz/processattempt.php", cookies=cookies, data=payload)
        return req.content

    def processQuestions(self, content):
        soup = BeautifulSoup(content, 'html.parser')
        nextLinkElement = soup.find(class_="arrow_link")
        nextLink = nextLinkElement['href']

        self.getQuestionAndAnswer(soup)

        for i in range(14):
            cookies = {
                "MoodleSession": self.moodleSession,
                "cc_necessary": "yes",
                "ORIGIN": self.origin
            }
            time.sleep(1)
            content = requests.get(nextLink, cookies=cookies).content
            soup = BeautifulSoup(content, 'html.parser')
            self.getQuestionAndAnswer(soup)
            nextLinkElement = soup.find(class_="arrow_link")
            if nextLinkElement:
                nextLink = nextLinkElement['href']

    def getQuestionAndAnswer(self, soup):
        questionContainer = soup.find(class_="qtext")
        children = questionContainer.findChildren("p" , recursive=False)
        if len(children) < 1:
            text = questionContainer.getText()
        else:
            text = children[0].getText()
        image = None
        points = soup.find(class_="grade").getText().replace("Ocenjen s/z ", "")
        correctAnswers = soup.find(class_="rightanswer").getText().replace("Pravilen odgovor je: ", "")

        if len(children) > 1:
            [imageElement] = children[1].findChildren("img" , recursive=False)
            image = imageElement['src'] 

        options = []
        optionElements = soup.find(class_="answer").findChildren("div" , recursive=False)
        for optionEl in optionElements:
            optionText = optionEl.findChildren("label" , recursive=False)[0].getText()
            option = {
                "isCorrect": optionText in correctAnswers,
                "option": optionText
            }
            options.append(option)

        data = {
            "id": len(self.questions),
            "question": text,
            "image": image if image else "",
            "points": points,
            "options": options
        }
        if not self.questionExists(data):
            self.questions.append(data)

    def getFileName(self, path):
        return path.split("/")[-1]
    
    def questionExists(self, question):
        for q in self.questions:
            if q['question'] == question['question'] and self.getFileName(q['image']) == self.getFileName(question['image']) and len(q['options']) == len(question['options']) and q['points'] == question['points']:
                questionMatch = True
                for i, opt1 in enumerate(q['options']):
                    optionMatch = False
                    for j, opt2 in enumerate(question['options']):
                        if opt1 == opt2:
                            optionMatch = True
                            break
                        
                    if not optionMatch:
                        questionMatch = False

                return questionMatch
        return False

cpp = CPPKiller("jt1o0v0917i0ccsp5c0pk227k2", "KVM0140&KVM0140-1.KVM0140-1", "I8mXTVhpLq")
try:
    cpp.extractQuestions()
except (KeyboardInterrupt, SystemExit):
    print("# Saving data")
    with open('questions.json', 'w') as outfile:
        json.dump(cpp.questions, outfile, indent=4)
    print("# Bye!")
    sys.exit(1)
except:
    print("# Saving data")
    with open('questions.json', 'w') as outfile:
        json.dump(cpp.questions, outfile, indent=4)
    print("Unexpected error:", sys.exc_info()[0])