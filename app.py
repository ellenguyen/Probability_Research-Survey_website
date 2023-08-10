# import libraries to redirect to different page layouts
from flask import Flask, render_template, request, redirect, url_for, session, jsonify

# install pip install Flask psycopg2-binary
import psycopg2

# install pip install pyyaml
import yaml
import random
import os

app = Flask(__name__)

app.secret_key = "f27ea7e7486e5286a72cc9699c59b303"
conn = psycopg2.connect("postgresql://postgres:Play279265!!@db.jpippqfaehsfnslrdria.supabase.co:5432/postgres")


MAX_LOTTERY = 25
DEBUG = False

# more classes added upon instructions
classes = [
    "CIS 1001",
    "STAT 1001",
    "MATH 1001",
    "NEITHER"
]

@app.route('/', methods=['GET', 'POST'])
def welcome():
    if request.method == 'GET':
        return render_template('welcome.html')  # Render the welcome pag
    
    if request.method == 'POST':
        return redirect('/info')

@app.route("/info", methods=['GET', 'POST'])
def index():
    if DEBUG:
        session.clear()

    if request.method == "GET": 
        
        return render_template("index.html",classes=classes)

    elif request.method == "POST":
        # determine if the user should be shown lottery visualization for this survey session
        visualization = random.random() < 0.5

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

        return redirect('/instruction')

    
@app.route('/instruction', methods=['GET', 'POST'])
def instruction():
    # Check if the user has provided user_info, otherwise redirect them to the index page
    if request.method == "GET":
        return render_template('instruction.html')
    
    elif request.method == "POST":
        return redirect(url_for('lottery'))

LOTTERIES = 25
available_lotteries = list(range(1, MAX_LOTTERY+1))

@app.route('/lottery', methods=['GET'])
@app.route('/lottery/', methods=['GET'])
@app.route('/lottery/<lottery_num>', methods=['GET', 'POST'])
def lottery(lottery_num=1):
    #Generate a list of all available lotteries
    global LOTTERIES
    
    #print(available_lotteries)

    #print(MAX_LOTTERY)
    #index so i can remove
    if(len(available_lotteries) != 0):
        rand = random.randint(0, LOTTERIES-1)
        lottery_num = available_lotteries.pop(rand)
        #print("randon", rand)
        LOTTERIES -= 1

    
    
    #print("lottery_num", lottery_num)
    lottery_num = str(lottery_num)

    session['lottery_num'] = lottery_num


    if request.method == "GET":
        if 'user_info' not in session or int(lottery_num) > MAX_LOTTERY:
            return redirect(url_for('index'))

        return render_template("/lotteries.html", lottery_num=lottery_num, lottery_image=f'Lottery_{f"{lottery_num:0>2}"}.jpg', visualization=session['user_info']['visualization'])
    

#get user choices from javasript to flask
@app.route("/user-choice", methods=['POST'])
def user_choice():
    data = request.get_json()
    cur = conn.cursor()

    choices_one = data.get('choices_one')
    choices_two = data.get('choices_two')

    lower_bound = data.get('lower_bound')
    upper_bound = data.get('upper_bound')

    # lottery_num will be stored in the session as shown in the previous answer
    lottery_num = session.get('lottery_num')
    #print("this is the cur loltterry num", lottery_num)

    ce = [lower_bound, upper_bound]
    user_id = session.get('user_id')

    # print(choices_one)
    # print(choices_two)
    # print(ce)
    # Retrieve the current value of lottery_num from the session and add one

    #session['lottery_num'] = lottery_num

    insert_query = '''INSERT INTO lottery_response (user_id, lottery_num, first_round_response, second_round_response, ce)
                VALUES (%s, %s, %s, %s, %s)'''
    data = (user_id, lottery_num, choices_one, choices_two, ce)

    cur.execute(insert_query,data)
    # Commit the changes to the database
    conn.commit()
    cur.close()

    return jsonify(success=True)

    
@app.route('/success', methods=['GET'])
def success():

    success_message = 'Your participation in the survey means a lot to us. Thank you for taking the time to provide your feedback!'
    return render_template('/success.html', message=success_message)

# keep running
if __name__ == '__main__':
    app.run(debug=True)