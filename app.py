from flask import Flask, render_template ,request 

app = Flask(__name__)

#universities
classes = [
        "CIS 1001",
        "STAT 1001",
        "MATH 1001",
    ]



@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "GET": 
        return render_template("index.html",classes=classes)

    elif request.method == "POST":
        return render_template("success.html")
    
# #new route
# @app.route("/firstQuestion")

    

if __name__ == '__main__':
    #so that it keep refresing
    app.run(debug=True)