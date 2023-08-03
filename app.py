# required libraries
from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_session import Session
from db import conn
import psycopg2
import yaml
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

        # randomly shuffled list from 1 to 25 for lottery page order
        session['lottery_order'] = list(range(1, MAX_LOTTERY + 1))
        random.shuffle(session['lottery_order'])

        session['lottery_num'] = 1

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
        session['lotteries_choices'] = [None] * MAX_LOTTERY

        cur = conn.cursor()

        insert_query = """
                        INSERT INTO user_info (first_name, last_name, student_id, class, instructor, major, university_year, taken_statistics, visualization)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING user_id
                    """
        user_info = session['user_info']

        data = (
            user_info['first_name'],
            user_info['last_name'],
            user_info['student_id'],
            user_info['class'],
            user_info['instructor'],
            user_info['major'],
            user_info['university_year'],
            user_info['taken_statistics'],
            user_info['visualization'],
        )       
        
        cur.execute(insert_query,data)

        user_id = cur.fetchone()[0]
        # Save the user_id in the session for future use
        session['user_id'] = user_id

        conn.commit()
        cur.close()

        if DEBUG:   
            print(session['user_info'])
        print(session["lottery_order"])
        return redirect(f'/lottery/{session["lottery_order"].pop()}')
    
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
        session['lotteries_choices'][lottery_num - 1] = choices # save user lottery choices for the lottery they completed

        if DEBUG:
            print(choices)
            print(session["lottery_order"])
        
        if not session["lottery_order"]: # if no more lotteries to complete 
            return redirect('/success')
        
        return redirect(f'/lottery/{session["lottery_order"].pop()}')
    
@app.route('/success', methods=['GET'])
def success():
    lotteries = session['lotteries_choices']

    if DEBUG:
        print(lotteries)

    incomplete_lotteries = []
    for i, lottery in enumerate(lotteries):
        if DEBUG:
            print(i, lottery)
        if lottery is None:
            incomplete_lotteries.append(i + 1)

    if incomplete_lotteries:
        return render_template('/success.html', message=f"Please complete lotteries {str(incomplete_lotteries)[1:-1]}")

    success_message = 'Your participation in the survey means a lot to us. Thank you for taking the time to provide your feedback!'
    return render_template('/success.html', message=success_message)

# keep running
if __name__ == '__main__':
    app.run(debug=True)