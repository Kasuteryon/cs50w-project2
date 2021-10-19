import os

from flask import Flask, render_template, request
from flask_session import Session
from flask_socketio import SocketIO, emit, send, join_room, leave_room
from werkzeug.utils import redirect
import json

users = []

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

socketio = SocketIO(app, cors_allowed_origins="*")

FLASK_APP = os.getenv("FLASK_APP")

@app.route("/")
def index():

    li = []
    with open('./users.json', "r") as file:
            data = json.load(file)

    for channel in data['channels']:
        li.append(channel)
    

    return render_template("index.html", li=li)

@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == 'POST':
        user = request.form.get("loguser")
        pas = request.form.get("logpass")

        with open('./users.json', "r") as file:
            data = json.load(file)

        for userF in data['users']:
            if userF["username"] == user and userF["password"] == pas:
                return redirect("/")
              

    return render_template("login.html")

@app.route("/register", methods=["GET", "POST"])
def register():

    if request.method == 'POST':
        user = request.form.get("loguser2")
        pas = request.form.get("logpass2")

        with open('./users.json', "r") as file:
            data = json.load(file)

        users = []
        for userF in data['users']:
            users.append(userF['username'])

        if user in users:
            return "Usuario no Disponible", 403
        else:
            newUser = {
                "username": user,
                "password": pas
            }

            data['users'].append(newUser)

            with open('./users.json', "w") as file:
                json.dump(data, file)

        return redirect("/login")

    return render_template("login.html")

@socketio.on("message")
def send_message(data):
    selection = data["selection"]
    dateM = data["dateM"]
    user = data["user"]
    roomM = data["roomM"]
    # print(selection)
    emit("announce message", {"user":user,"selection": selection, "dateM": dateM}, room=roomM)

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

