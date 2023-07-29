from flask import Flask, render_template, request, redirect, url_for, session
from flask_session import Session
import random
import os
import dotenv
dotenv.load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("APP-SECRET-KEY")
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

MAX_LOTTERY = 25
DEBUG = False

# more classes added upon instructions
classes = [
    "CIS 1001",
    "STAT 1001",
    "MATH 1001",
]

@app.route("/", methods=['GET', 'POST'])
def index():
    if DEBUG:
        session.clear()
    if request.method == "GET": 
        return render_template("index.html",classes=classes)

    elif request.method == "POST":
        # determine if the user should be shown lottery visualization for this survey session
        visualization = random.random() < 0.5

        session['user_info'] = {
            'first_name': request.form['first_name'],
            'last_name': request.form['last_name'],
            'student_id': request.form['student_id'],
            'class': request.form['class'],
            'instructor': request.form['instructor'],
            'major': request.form['major'],
            'university_year': request.form['university_year'],
            'taken_statistics': request.form['statistics'],
            'visualization': visualization,
        }
        session['lottery_choices'] = [None] * MAX_LOTTERY

        if DEBUG:   
            print(session['user_info'])

        return redirect('/lottery')
    
@app.route('/lottery', methods=['GET'])
@app.route('/lottery/', methods=['GET'])
@app.route('/lottery/<lottery_num>', methods=['GET', 'POST'])
def lottery(lottery_num=1):
    lottery_num = int(lottery_num)

    if request.method == "GET":
        if 'user_info' not in session or lottery_num > MAX_LOTTERY:
            return redirect(url_for('index'))
        
        return render_template("/lotteries.html", lottery_num=lottery_num, lottery_image=f'Lottery_{f"{lottery_num:0>2}"}.jpg', visualization=session['user_info']['visualization'])
    
    elif request.method == "POST":
        choices = request.get_json(silent=True)
        session['lottery_choices'][lottery_num - 1] = choices # save user lottery choices for the lottery they completed

        if DEBUG:
            print(choices)
        
        if lottery_num == MAX_LOTTERY:
            return redirect('/submit') # TODO: redirect to database submission which will then redirect to error or success
        
        return redirect(f'/lottery/{lottery_num + 1}')
    
@app.route('/submit', methods=['GET'])
def submit():
    if DEBUG:
        print(session['lottery_choices'])
    return render_template('/success.html')

if __name__ == '__main__':
    #so that it keep refresing
    app.run(debug=True)