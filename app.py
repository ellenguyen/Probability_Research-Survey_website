# import libraries to redirect to different page layouts
from flask import Flask, render_template, request, redirect, url_for

#install pip install Flask psycopg2-binary
import psycopg2
#install pip install pyyaml
import yaml

# library to randomly redirect users
import random

app = Flask(__name__)

# more classes added upon instructions
classes = [
        "CIS 1001",
        "STAT 1001",
        "MATH 1001",
    ]
#connect DATABSE
db = yaml.safe_load(open('db.yaml'))
conn = psycopg2.connect(
        host= db['postgres_host'],
        database= db["postgres_db"],
        user= db["postgres_user"],
        password= db['postgres_password'])



@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "GET": 
        return render_template("index.html",classes=classes)

    elif request.method == "POST":
        #asking the request from the user 
        first_name = request.form['first_name']
        last_name = request.form['last_name']
        student_id = request.form['student_id']
        class_taking = request.form['class']
        instructor = request.form['instructor']
        major = request.form['major']
        university_year = request.form['university_year']
        statistics = request.form['statistics']

        #creating a cursor to use DATABASE operations
        cur = conn.cursor()
        #insert the data into the database

        cur.execute('''INSERT INTO ['table_name'] (first_name, last_name,student_id,class_taking, instructor, major, university_year, statistics) VALUES(%s, %s)''', (first_name, last_name,student_id,class_taking, instructor, major, university_year, statistics))
        # conn.commit()
        # cur.close()
        # conn.close()


        # generate a random number between 0 and 1
        random_number = random.random()

        if random_number < 0.9:
            # run plain_text
            return render_template("/plain_text/plain_text.html",classes=classes)
        else:
            # run visualization
            return render_template("/visualization/visualization.html",classes=classes)

@app.route("/plain_text")
def plain_text():
    return render_template("plain_text.html")

@app.route("/visualization")
def visualization():
    return render_template("visualization.html")

if __name__ == '__main__':
    #so that it keep refresing
    app.run(debug=True)