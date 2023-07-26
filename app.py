# import libraries to redirect to different page layouts
from flask import Flask, render_template, request, redirect, url_for, session

# install pip install Flask psycopg2-binary
import psycopg2

# install pip install pyyaml
import yaml

# library to randomly redirect users
import random

import os

import dotenv
dotenv.load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("APP-SECRET-KEY")

MAX_LOTTERY = 25

# more classes added upon instructions
classes = [
    "CIS 1001",
    "STAT 1001",
    "MATH 1001",
]


@app.route("/", methods=["GET"])
def index():
    if request.method == "GET": 
        return render_template("index.html",classes=classes)

    elif request.method == "POST":
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
            'visualization': visualization
        }

        print(session['user_info'])

@app.route('/user_info', methods=['POST'])
def user_info():
    # first_name = request.form['first_name']
    # last_name = request.form['last_name']
    # student_id = request.form['student_id']
    # class_taking = request.form['class']
    # instructor = request.form['instructor']
    # major = request.form['major']
    # university_year = request.form['university_year']
    # statistics = request.form['statistics']

    # # creating a cursor to use DATABASE operations
    # cur = conn.cursor()
    # # insert the data into the database
    # cur.execute('''INSERT INTO ['table_name'] (first_name, last_name,student_id,class_taking, instructor, major, university_year, statistics) VALUES(%s, %s)''', (first_name, last_name,student_id,class_taking, instructor, major, university_year, statistics))
    # conn.commit()
    # cur.close()
    # conn.close()

        return redirect('/lottery')
    
@app.route('/lottery', methods=['GET', 'POST'])
@app.route('/lottery/', methods=['GET', 'POST'])
@app.route('/lottery/<lottery_num>', methods=['GET', 'POST'])
def lottery(lottery_num=1):
    if 'user_info' not in session or int(lottery_num) > MAX_LOTTERY:
        return redirect(url_for('index'))
    print(session['user_info'])
    return render_template("/lotteries.html", lottery_num=lottery_num, lottery_image=f'Lottery_{f"{lottery_num:0>2}"}.jpg', visualization=session['user_info']['visualization'])

@app.route("/success")
def success():
    return render_template("success.html")

# determine if the user should be shown lottery visualization for this survey session
def set_visualization_session():
    session['visualization'] = random.random() < 0.5

if __name__ == '__main__':
    #so that it keep refresing
    app.run(debug=True)