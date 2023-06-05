from flask import Flask

app = Flask(__name__)

@app.route("/")
def hell():
    return "hello"



if __name__ == '__main__':
    #so that it keep refresing
    app.run(debug=True)