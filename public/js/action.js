var socket = io();
var ms = 0;

function action(obj) { 
    mode = document.getElementById('mode').checked;
    console.log(mode);
    socket.emit('gpio', obj.id, mode, obj.checked); 
    socket.on('gpio', function (msg) {
        console.log(msg);
        document.getElementById('saida').innerHTML = msg;
    });    
}

socket.on('pong', function(ms) {
    document.getElementById('latencia').innerHTML = ms;
});
socket.on('contador', function (data) {
    //console.log(data);
    document.getElementById('contador').innerHTML = data;
});

