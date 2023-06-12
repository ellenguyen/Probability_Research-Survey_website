from flask import Flask, render_template ,request 

app = Flask(__name__)

@app.route("/")
def hello():
    return render_template("index.html")



if __name__ == '__main__':
    #so that it keep refresing
    app.run(debug=True)