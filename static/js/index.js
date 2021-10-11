var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

function sendMessage(){
    var task =  document.querySelector('#task');
    
    let hoy = new Date();
    //let fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear() + '-'+ hoy.getHours() + ':' + hoy.getMinutes();
    let fecha = hoy.getHours() + ':' + hoy.getMinutes();
    console.log(fecha.toString());
    var user = localStorage.getItem('actualUser');
    
    if (task.value) {
        socket.emit("message", {'user':user,'selection': task.value, 'dateM': fecha.toString()});
        task.value = '';
      }
    return false;
    
}

socket.on('announce message', data => {
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
    colOwn.classList.add('col-6');
    colOther.classList.add('col-6');

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
}); 

function actualUser(){
    actualUser = document.getElementById('logemail').value;

    localStorage.setItem('actualUser', actualUser);

}



