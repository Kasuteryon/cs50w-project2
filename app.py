import os

from flask import Flask, render_template, request
from flask_session import Session
from flask_socketio import SocketIO, emit, send, join_room, leave_room
from werkzeug.utils import redirect


app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

socketio = SocketIO(app, manage_session=False)

FLASK_APP = os.getenv("FLASK_APP")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == 'POST':
        request.form.get("userlog")
        return redirect("/");

    return render_template("login.html")

@socketio.on("message")
def send_message(data):
    selection = data["selection"]
    dateM = data["dateM"]
    user = data["user"]
    # print(selection)
    emit("announce message", {"user":user,"selection": selection, "dateM": dateM}, broadcast=True)

@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    send(username + ' has entered the room.', to=room)

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    send(username + ' has left the room.', to=room)

