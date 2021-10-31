import os

from flask import Flask, render_template, request, session, jsonify
from flask_session import Session
from flask_socketio import SocketIO, emit, send, join_room, leave_room
from werkzeug.utils import redirect
import json

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

socketio = SocketIO(app, cors_allowed_origins="*")

FLASK_APP = os.getenv("FLASK_APP")

users = []
messages = {"General":[]}
with open('./users.json', "r") as file:
            data = json.load(file)

for channel in data['channels']:
    messages[channel['name']] = []

@app.route("/", methods=["GET", "POST"])
def index():

    if request.method == "GET":
        li = []
        with open('./users.json', "r") as file:
            data = json.load(file)

        for channel in data['channels']:
            li.append(channel)
        
        print("------------------")
        print(messages)

        return render_template("index.html", li=li) 
    else:
        canal = request.form.get("channel")
        
        with open('./users.json', "r") as file:
            data = json.load(file)

        names = []

        for chan in data['channels']:
            names.append(chan['name'])
            
        if canal in names:
            return "Nombre de canal usado", 403

        else:
            #session["actualChannel"] = canal
            newChannel = {
                "name": canal,
                "createdBy": session.get("user_id")
            }

            data['channels'].append(newChannel)

            with open('./users.json', "w") as file:
                json.dump(data, file)

    return render_template("index.html")

@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == 'POST':
        user = request.form.get("loguser")
        pas = request.form.get("logpass")

        with open('./users.json', "r") as file:
            data = json.load(file)

        for userF in data['users']:
            if userF["username"] == user and userF["password"] == pas:
                session["user_id"] = user
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

@socketio.on("announce message")
def send_message(data):
    selection = data["selection"]
    dateM = data["dateM"]
    user = data["user"]
    roomM = data["roomM"]
    isImg = data["isImg"]
    dicto = {"user":user,"selection": selection, "dateM": dateM, "roomM":roomM, "isImg": isImg}
    # print(selection)
    
    if len(messages[data["roomM"]]) >= 100:
        messages[data["roomM"]].pop(0)
        messages[data["roomM"]].append(dicto)
    else:
        messages[data["roomM"]].append(dicto)

    emit("announce message", dicto, room=roomM)

@app.route("/printMessages", methods = ["GET", "POST"])
def printMessages():

    return jsonify({
        "channels": messages
    })

@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']
    dicto = {"username": username, "room": room}
    join_room(room)
    #emit(dicto, to=room)

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    send(username + ' has left the room.', to=room)

