
var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

function sendMessage(){
    var task =  document.querySelector('#task');
    
    let hoy = new Date();
    //let fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear() + '-'+ hoy.getHours() + ':' + hoy.getMinutes();
    let fecha = hoy.getHours() + ':' + hoy.getMinutes();
    //console.log(fecha.toString());
    var user = localStorage.getItem('actualUser');
    
    let dict;

    if (task.value.endsWith(".jpg") || task.value.endsWith(".jpeg") || task.value.endsWith(".png") || task.value.endsWith(".gif")){
        dict =  {'user':user,'selection': task.value, 'dateM': fecha.toString(), 'roomM': localStorage.getItem('room'), 'isImg': 1};
    }else if (task.value.startsWith("*") && task.value.endsWith("*")){
        dict =  {'user':user,'selection': task.value, 'dateM': fecha.toString(), 'roomM': localStorage.getItem('room'), 'isImg': 2};
    }else{
        dict =  {'user':user,'selection': task.value, 'dateM': fecha.toString(), 'roomM': localStorage.getItem('room'), 'isImg': 0};
    }

    if (task.value) {
        socket.emit("announce message", dict);
        task.value = '';
    }

    
    return false;
    
}
let i = 0

socket.on('announce message', data => {

    if (data.roomM === localStorage.getItem('room')){
        printMessages(data);
        i = i + 1
        console.log(i)
    }
}); 



function printMessages(data){
    const li = document.createElement('div');
    const row = document.createElement('div');
    const colOwn = document.createElement('div');
    const colOther = document.createElement('div');

    li.classList.add('card');
    const hora = document.createElement('div');
    hora.classList.add('card-header')
    const cuerpo = document.createElement('div');
    cuerpo.classList.add('card-body');
    const user = document.createElement('h5');
    user.classList.add('card-title');
    const message = document.createElement('p');
    message.classList.add('card-text');

    cuerpo.append(user, message);
    li.append(hora, cuerpo);

    hora.innerHTML = `Hora: ${data.dateM}`;
    user.innerHTML = `Por: ${data.user}`;

    if (data.isImg === 1){
        message.innerHTML = `<img class="card-img-top" src="${data.selection}"></img>`
    }else if (data.isImg === 2){
        const men = data.selection.slice(1, -1);
        message.innerHTML = `<h1>${men}</h1>`
    }else{
       message.innerHTML = `${data.selection}`; 
    }
    

    row.classList.add('row');
    colOwn.classList.add('col-lg-6');
    colOwn.classList.add('col-md-6');
    colOwn.classList.add('col-sm-12');
    colOther.classList.add('col-lg-6');
    colOther.classList.add('col-md-6');
    colOther.classList.add('col-sm-12');

    if (data.user == localStorage.getItem('actualUser')){
        document.querySelector('#tasks').append(row);
        li.classList.add('bg-success');
        li.classList.add('text-white');
        row.append(colOther);
        row.append(colOwn);
        colOwn.append(li);
    }else{
        document.querySelector('#tasks').append(row);
        li.classList.add('bg-secondary');
        li.classList.add('text-white');
        row.append(colOther);
        row.append(colOwn);
        colOther.append(li);
    }
    window.scrollTo(0, document.body.scrollHeight);
}

function joinRoom(data){
    socket.emit("leave", {'username': localStorage.getItem('actualUser'), 'room':localStorage.getItem('room')})
    socket.emit("join", {'username': localStorage.getItem('actualUser'), 'room':data})
    localStorage.setItem("room", data);
    
    channelSpan = document.getElementById('channelSpan');
    channelSpan.innerHTML = data + ` <i class='bx bx-home bx-tada' ></i>`;

    printSaved();

    
    //socket.emit('messages', data);
}

function actualUser(){
    actualUser = document.getElementById('loguser').value;
    localStorage.setItem('actualUser', actualUser);
    localStorage.setItem('room', 'General');

}

window.addEventListener('DOMContentLoaded', (event) => {
    if (localStorage.getItem('actualUser') === null){
        window.location.replace("/login");
    }

    joinRoom(localStorage.getItem('room'));
    
    userSpan = document.getElementById('userSpan');
    channelSpan = document.getElementById('channelSpan');

    userSpan.innerHTML = 'Soy ' + localStorage.getItem('actualUser');
    channelSpan.innerHTML = localStorage.getItem('room') + ` <i class='bx bx-home bx-tada' ></i>`;

});

function logOut(){
    localStorage.removeItem('actualUser');
}

function addChannel(value){
    //console.log("HOLA");
    channels = document.getElementById('nav-chan');

    if (value){
        
        li = document.createElement('li');
        a = document.createElement('a');
        i = document.createElement('i');
        span1 = document.createElement('span');
        span2 = document.createElement('span');

            //<i class='bx bx-group'></i>
        i.classList.add('bx');
        i.classList.add('bx-group');

        span1.classList.add('links_name');
        span1.innerHTML = value;

        a.classList.add('user-made');
        a.append(i, span1);

        span2.classList.add('tooltip');
        span2.innerHTML = value;

        li.append(a, span2);


        a.addEventListener('click', () => {
            joinRoom(value);
        });

        channels.append(li);
        
    }

}
socket.on("announce channel", data => {
    addChannel(data.name);
});

let canalesListados;
function cargarCanal(data){
    canalesListados = data;
}
//document.getElementById('newChannel').addEventListener('click', addChannel);
function canalExiste(nuevoCanal){

    let li = Object.keys(canalesListados["channels"]);
    var ban;
    for (let i = 0; i < li.length; i++){
        console.log(li[i]);

        if (nuevoCanal === li[i]){
            ban = true;
            break;
        }else{
            ban = false;
        }
    }

    console.log(ban);
    return ban;
}


function newCanal(){
    let nuevoCanal = document.getElementById('channel');

    if (!nuevoCanal.value){
        return false;
    }
    //console.log(canalExiste(nuevoCanal.value));
    if (canalExiste(nuevoCanal.value)){
        nuevoCanal.value = "";
        Swal.fire({
            position: 'center',
            icon: 'error',
            text: "Canal Existente",
            showConfirmButton: true,
            //timer: 5000,
            backdrop: `
            url("../static/images/nyan-cat.gif")
            left top
            no-repeat`
        });

        return false;
    }

    let nuevo = nuevoCanal.value;
    nuevoCanal.value = "";

    let form = new FormData();
    // Objeto tequest
    let request = new XMLHttpRequest();

    request.open("POST", "/");

    // Primer parametro el que recibe python, el segundo guardado en js
    form.append('channel', nuevo);

    request.send(form);
    
    request.onreadystatechange = function(){
        if (request.readyState == 4){
            // Cuando el servidor responde
            let codigoRespuesta = request.status;

            if (codigoRespuesta == 200){
                let info = request.responseText;
                //addChannel(nuevo);
                socket.emit("announce channel", {'name': nuevo});
                //addChannel(nuevo)
                

                return false;
            }else{
                let info = request.responseText;
                alert(info)
                return false;
            }
        }
    }

    

}

function printSaved(){
    // Objeto tequest
    let request = new XMLHttpRequest();

    request.open("POST", "/printMessages");

    // Primer parametro el que recibe python, el segundo guardado en js
    request.onload = () => {
        let data = JSON.parse(request.responseText);
        let lista = data["channels"][localStorage.getItem("room")];

        cargarCanal(data);

        let ul = document.getElementById("tasks");
        while(ul.firstChild) ul.removeChild(ul.firstChild);


        for (let i = 0; i < lista.length; i++){
            printMessages(lista[i])
        }
        
    }

    request.send();
    
}