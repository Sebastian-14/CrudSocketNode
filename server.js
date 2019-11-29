const express = require('express'),
      app = express(),
      http = require('http').Server(app),
      port = process.env.PORT ||3000,
      io = require('socket.io')(http),
      user = require('./models/user')


io.on('connection', function (socket) {
  console.log('Usuario conectado!')
  user.show(function (data) {
    socket.emit('listar', data)
  })
  socket.on('crear', function (data) {
    user.create(data, function (rpta) {
      io.emit('nuevo', rpta)
    })
    console.log(data)
  })
  socket.on('actualizar', function (data) {
    user.update(data, function (rpta) {
      io.emit('nuevo', rpta)
    })
  })
  socket.on('eliminar', function (data) {
    user.delete(data, function (rpta) {
      io.emit('borrado', rpta)
    })
  })
  socket.on('disconnect', function () {
    console.log('Usuario desconectado!')
  })
})

app.set('view engine', 'pug')

app.use('/static', express.static('public'))

app.get('/', function (req, res) {
  res.render('main')
})

http.listen(port, function() {
  console.log('Servidor iniciado en :' + port)
})

