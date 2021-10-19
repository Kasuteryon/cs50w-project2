var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

function sendMessage(){
    var task =  document.querySelector('#task');
    
    let hoy = new Date();
    //let fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear() + '-'+ hoy.getHours() + ':' + hoy.getMinutes();
    let fecha = hoy.getHours() + ':' + hoy.getMinutes();
    //console.log(fecha.toString());
    var user = localStorage.getItem('actualUser');
    
    let dict =  {'user':user,'selection': task.value, 'dateM': fecha.toString(), 'roomM': localStorage.getItem('room')};
    
    
    if (task.value) {
        socket.emit("message", dict);
        task.value = '';
    }

    
    return false;
    
}

socket.on('announce message', data => {
    printMessages(data);
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
    message.innerHTML = `${data.selection}`;

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
    localStorage.setItem("room", data);
    socket.emit("join", {'username': localStorage.getItem('actualUser'), 'room':data})
}

function actualUser(){
    actualUser = document.getElementById('loguser').value;
    localStorage.setItem('actualUser', actualUser);
    localStorage.setItem('room', 'general');
    /* Form
    let form = new FormData();

    form.append('user', usuario);
    // Objeto tequest
    let request = new XMLHttpRequest();

    request.open("POST", "/login");

    // Enviar datos
    request.send(form);

    // ---------------
    request.onreadystatechange = function(){
        if (request.readyState == 4){
            // Cuando el servidor responde
            let codigoRespuesta = request.status;
            if (codigoRespuesta == 200){
                let info = request.responseText;
                alert(info);

                localStorage.setItem('actualUser', actualUser);
                localStorage.setItem('room', 'general');

                window.location = "/";
            }else{
                let info = request.responseText;
                alert(info);
                return false;
            }
        }
    }*/
    

}

window.addEventListener('DOMContentLoaded', (event) => {
    if (localStorage.getItem('actualUser') === null){
        window.location.replace("/login");
    }
    joinRoom(localStorage.getItem('room'));
    userSpan = document.getElementById('userSpan');
    userSpan.innerHTML = 'Soy ' + localStorage.getItem('actualUser')
});

function logOut(){
    localStorage.removeItem('actualUser');
}

function addChannel(){
    //console.log("HOLA");
    channels = document.getElementById('nav-list');
    input = document.getElementById('channel');

    if (input.value){
        li = document.createElement('li');
        a = document.createElement('a');
        i = document.createElement('i');
        span1 = document.createElement('span');
        span2 = document.createElement('span');

        //<i class='bx bx-group'></i>
        i.classList.add('bx');
        i.classList.add('bx-group');

        span1.classList.add('links_name');
        span1.innerHTML = input.value;

        a.append(i, span1);

        span2.classList.add('tooltip');
        span2.innerHTML = input.value;

        li.append(a, span2);

        channels.append(li);

        input.value = "";
    }

}

document.getElementById('newChannel').addEventListener('click', addChannel);
