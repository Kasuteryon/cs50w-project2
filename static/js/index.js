var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

function sendMessage(){
    var task =  document.querySelector('#task');
    
    let hoy = new Date();
    var fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear() + '-'+ hoy.getHours() + ':' + hoy.getMinutes();
    console.log(fecha.toString());
    
    if (task.value) {
        socket.emit("message", {'selection': task.value, 'dateM': fecha.toString()});
        task.value = '';
      }
    return false;
    
}

socket.on('announce message', data => {
    const li = document.createElement('li');
    li.innerHTML = `Mensaje: ${data.selection} Hora: ${data.dateM}`;
    document.querySelector('#tasks').append(li);
    
}); 



