from flask import Flask, render_template ,request 

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "GET":
        return render_template("index.html")
    elif request.method == "POST":
        return render_template("success.html")

    

if __name__ == '__main__':
    #so that it keep refresing
    app.run(debug=True)