var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http, {
  pingInterval: 500
});
//var rpio = require('rpio');
var contador = 0;

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
  app.use(express.static(path.join(__dirname, 'public')));
});

io.on('connection', function (socket) {
  contador++; //adiciona usuarios
  //console.log(contador);
  io.emit('contador', contador);

  socket.on('gpio', function (pin, mode, state) { // 10 1 1
    state = +state;
    function write(pin, state) {
      if (state) {
        state = rpio.HIGH;
      }
      else {
        state = rpio.LOW;
      }
      rpio.open(pin, rpio.OUTPUT, state);
      return ("saida "+pin+" "+state);
    }
    function read(pin) {
      rpio.open(pin, rpio.INPUT);
      return("ler "+pin);
      return (rpio.read(pin));
    }
    //console.log(pin)
    //console.log(mode);
    //console.log(state)
    switch (mode) {
      case true:
        io.emit('gpio', write(pin, state));
        break;
      case false: 
        io.emit('gpio', read(pin));
        break;
      default:
        io.emit('gpio', "error");
        break;
    }
  });

  socket.on('disconnect', function () {
    contador--; //diminui usuarios
    //console.log(contador);
    io.emit('contador', contador);
  });
});

http.listen(3001, function () {
  console.log('Rodando em localhost:3001');
});