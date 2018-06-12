const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname , '../public')

const port = process.env.PORT || 3000;

var app = express();

//Tạo máy chủ bằng cách sử dụng http
var server = http.createServer(app);

var io = socketIO(server);

app.use(express.static(publicPath));

//Mọi event của client cần được xử lý để bên trong 'connection'
 io.on ('connection', (socket) => {
 	console.log('New user connected');

 	//Lắng nghe sự kiện của cleint, đối số thứ 2 là đối tượng
 	//để làm đối số của emit máy khách, là đối số thứ nhất của callback 
 	//
 	socket.emit('newMessage',{
 		from: 'thanh',
 		text: 'nguyeenx trong thanh',
 		createAt: 314234
 	});

     socket.on('createMessage', (message) => {
     	console.log('createMessage', message);
     });

 	socket.on('disconnect', () => {
 		console.log('User was disconnected');
 	});
 });


server.listen(port, () => {
	console.log(`App starting at port ${port}`);
});