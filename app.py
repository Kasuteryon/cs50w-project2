import os

from flask import Flask, render_template
from flask_socketio import SocketIO, emit, send


app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

FLASK_APP = os.getenv("FLASK_APP")

@app.route("/")
def index():
    return render_template("index.html")

@socketio.on("message")
def send_message(data):
    selection = data["selection"]
    dateM = data["dateM"]
    # print(selection)
    emit("announce message", {"selection": selection, "dateM": dateM}, broadcast=True)

@app.route("/login")
def login():
    return render_template("login.html")
